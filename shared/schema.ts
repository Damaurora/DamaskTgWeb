import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Пользователи (для административного доступа)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Категории товаров
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Продукты
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(), // Краткое описание
  fullDescription: text("full_description"), // Полное описание для карточки товара
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull(),
  // Наличие в магазинах
  availabilityGagarina: boolean("availability_gagarina").default(true).notNull(),
  availabilityPobedy: boolean("availability_pobedy").default(true).notNull(),
  // Ожидается ли поставка, если нет в наличии
  expectedGagarina: boolean("expected_gagarina").default(false).notNull(),
  expectedPobedy: boolean("expected_pobedy").default(false).notNull(),
  // Ожидаемая дата поставки
  expectedDelivery: text("expected_delivery"),
  // Метки товара
  isNew: boolean("is_new").default(false).notNull(),
  isTop: boolean("is_top").default(false).notNull(),
  isRecommended: boolean("is_recommended").default(false).notNull(),
  features: jsonb("features"),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

// Локации магазинов
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  hours: text("hours").notNull(),
  phone: text("phone").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

// Новости и акции
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
});

// Экспорт типов
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
