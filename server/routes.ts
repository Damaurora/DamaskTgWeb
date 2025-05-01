import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertProductSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
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
  
  app.get("/api/categories/:slug", async (req, res) => {
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
  
  app.post("/api/products", async (req, res) => {
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
  
  app.put("/api/products/:id", async (req, res) => {
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
  
  app.delete("/api/products/:id", async (req, res) => {
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
  
  // News
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении новостей" });
    }
  });

  return httpServer;
}
