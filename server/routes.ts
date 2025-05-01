import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertProductSchema, insertCategorySchema, insertNewsSchema, insertLocationSchema } from "@shared/schema";
import { setupAuth } from "./auth";

// Middleware для проверки авторизации
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Необходима авторизация" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Настройка аутентификации
  setupAuth(app);
  
  // API routes
  
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении категорий" });
    }
  });
  
  app.get("/api/category-by-id/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Неверный ID категории" });
      }
      
      const category = await storage.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({ message: "Категория не найдена" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении категории" });
    }
  });
  
  app.get("/api/category-by-slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Категория не найдена" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении категории" });
    }
  });
  
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, search } = req.query;
      
      if (categoryId && typeof categoryId === 'string') {
        const products = await storage.getProductsByCategory(parseInt(categoryId));
        return res.json(products);
      }
      
      if (search && typeof search === 'string') {
        const products = await storage.searchProducts(search);
        return res.json(products);
      }
      
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении товаров" });
    }
  });
  
  app.get("/api/products/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const product = await storage.getProductBySlug(slug);
      
      if (!product) {
        return res.status(404).json({ message: "Товар не найден" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении товара" });
    }
  });
  
  // Admin protected routes
  app.post("/api/products", isAuthenticated, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные товара", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при создании товара" });
    }
  });
  
  app.put("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(parseInt(id), productData);
      
      if (!product) {
        return res.status(404).json({ message: "Товар не найден" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные товара", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при обновлении товара" });
    }
  });
  
  app.delete("/api/products/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProduct(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Товар не найден" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении товара" });
    }
  });
  
  // Locations
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getAllLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении локаций" });
    }
  });
  
  app.get("/api/locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Неверный ID локации" });
      }
      
      const location = await storage.getLocationById(id);
      
      if (!location) {
        return res.status(404).json({ message: "Локация не найдена" });
      }
      
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении локации" });
    }
  });

  app.post("/api/locations", isAuthenticated, async (req, res) => {
    try {
      const locationData = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(locationData);
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные локации", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при создании локации" });
    }
  });
  
  app.put("/api/locations/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const locationData = insertLocationSchema.partial().parse(req.body);
      const location = await storage.updateLocation(parseInt(id), locationData);
      
      if (!location) {
        return res.status(404).json({ message: "Локация не найдена" });
      }
      
      res.json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные локации", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при обновлении локации" });
    }
  });
  
  app.delete("/api/locations/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteLocation(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Локация не найдена" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении локации" });
    }
  });
  
  // News
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении новостей" });
    }
  });
  
  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Неверный ID новости" });
      }
      
      const newsItem = await storage.getNewsById(id);
      
      if (!newsItem) {
        return res.status(404).json({ message: "Новость не найдена" });
      }
      
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении новости" });
    }
  });

  app.post("/api/news", isAuthenticated, async (req, res) => {
    try {
      const newsData = insertNewsSchema.parse(req.body);
      const newsItem = await storage.createNews(newsData);
      res.status(201).json(newsItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные новости", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при создании новости" });
    }
  });
  
  app.put("/api/news/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const newsData = insertNewsSchema.partial().parse(req.body);
      const newsItem = await storage.updateNews(parseInt(id), newsData);
      
      if (!newsItem) {
        return res.status(404).json({ message: "Новость не найдена" });
      }
      
      res.json(newsItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные новости", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при обновлении новости" });
    }
  });
  
  app.delete("/api/news/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteNews(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Новость не найдена" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении новости" });
    }
  });
  
  // Категории (для админ-панели)
  app.post("/api/categories", isAuthenticated, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные категории", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при создании категории" });
    }
  });
  
  app.put("/api/categories/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(parseInt(id), categoryData);
      
      if (!category) {
        return res.status(404).json({ message: "Категория не найдена" });
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные категории", errors: error.errors });
      }
      res.status(500).json({ message: "Ошибка при обновлении категории" });
    }
  });
  
  app.delete("/api/categories/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCategory(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Категория не найдена" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении категории" });
    }
  });
  
  // Контактная информация
  app.get("/api/contact-info", async (req, res) => {
    try {
      const contactInfo = await storage.getContactInfo();
      res.json(contactInfo);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении контактной информации" });
    }
  });
  
  app.put("/api/contact-info", isAuthenticated, async (req, res) => {
    try {
      const contactInfo = await storage.updateContactInfo(req.body);
      res.json(contactInfo);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при обновлении контактной информации" });
    }
  });

  return httpServer;
}
