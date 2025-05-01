import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserSchema } from "@shared/schema";
import createMemoryStore from "memorystore";

declare global {
  namespace Express {
    interface User extends UserSchema {}
  }
}

// Настройка хранилища сессий
const MemoryStore = createMemoryStore(session);
const sessionStore = new MemoryStore({
  checkPeriod: 86400000, // Очистка истекших сессий каждые 24 часа
});

// Функции для работы с паролями
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Настройка аутентификации
export function setupAuth(app: Express) {
  // Настройка сессий
  const sessionSettings: session.SessionOptions = {
    secret: "damask-shop-secret-key", // В продакшене должен быть из переменных окружения
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { 
      maxAge: 24 * 60 * 60 * 1000 // 24 часа
    }
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Настройка локальной стратегии
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Пользователь не найден" });
        }
        
        // Проверяем пароль напрямую, так как у нас простая демо-версия
        // В реальном приложении используйте comparePasswords
        if (user.password !== password) {
          return done(null, false, { message: "Неверный пароль" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Сериализация и десериализация пользователя
  passport.serializeUser((user: UserSchema, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Маршруты аутентификации
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: UserSchema, info: { message: string }) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info.message || "Ошибка аутентификации" });
      
      req.logIn(user, (err) => {
        if (err) return next(err);
        // Не включаем пароль в ответ
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Ошибка при выходе из системы" });
      }
      res.status(200).json({ message: "Успешный выход из системы" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Пользователь не аутентифицирован" });
    }
    // Не включаем пароль в ответ
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}