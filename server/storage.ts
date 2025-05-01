import { categories, products, locations, news } from "@shared/schema";
import type { Category, InsertCategory, Product, InsertProduct, Location, InsertLocation, News, InsertNews } from "@shared/schema";

export interface IStorage {
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Locations
  getAllLocations(): Promise<Location[]>;
  
  // News
  getAllNews(): Promise<News[]>;
}

// In-memory database implementation
export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private locations: Map<number, Location>;
  private newsItems: Map<number, News>;
  
  private categoryId: number = 1;
  private productId: number = 1;
  private locationId: number = 1;
  private newsId: number = 1;
  
  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.locations = new Map();
    this.newsItems = new Map();
    
    // Initialize with default data
    this.initializeData();
  }
  
  private initializeData() {
    // Add categories
    const categoryData: InsertCategory[] = [
      { name: "Поды", slug: "pods", icon: "crown" },
      { name: "Под-моды", slug: "pod-mods", icon: "flashlight" },
      { name: "Табак", slug: "tobacco", icon: "leaf" },
      { name: "Одноразки", slug: "disposables", icon: "battery-2-charge" },
      { name: "Жидкости", slug: "e-liquids", icon: "drop" },
      { name: "Кальяны", slug: "hookahs", icon: "box-3" },
      { name: "Снюс", slug: "chewing-tobacco", icon: "paint" },
      { name: "Вапорайзеры", slug: "vaporizers", icon: "cloud" },
      { name: "Аксессуары", slug: "accessories", icon: "tools" }
    ];
    
    categoryData.forEach(cat => {
      const category: Category = { ...cat, id: this.categoryId++ };
      this.categories.set(category.id, category);
    });
    
    // Add locations
    const locationData: InsertLocation[] = [
      {
        name: "Гагарина",
        address: "ул. Гагарина, 32",
        hours: "Пн-Пт: 10:00 - 20:00\nСб-Вс: 10:00 - 18:00",
        phone: "+78001234567",
        imageUrl: "https://images.unsplash.com/photo-1621784563330-caee0b138a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Победы",
        address: "ул. Победы, 7",
        hours: "Пн-Пт: 10:00 - 20:00\nСб-Вс: 10:00 - 18:00",
        phone: "+78001234568",
        imageUrl: "https://images.unsplash.com/photo-1622877189159-37dbbd53daf8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    ];
    
    locationData.forEach(loc => {
      const location: Location = { ...loc, id: this.locationId++ };
      this.locations.set(location.id, location);
    });
    
    // Add news
    const newsData: InsertNews[] = [
      {
        title: "Новая коллекция подов уже в магазине!",
        content: "Встречайте эксклюзивную коллекцию подов с уникальным дизайном.",
        date: "20 ноября 2023",
        imageUrl: "https://images.unsplash.com/photo-1606271591734-5f0e201fb11e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Скидки на премиальные жидкости",
        content: "Специальные предложения на линейку премиальных жидкостей.",
        date: "15 ноября 2023",
        imageUrl: "https://images.unsplash.com/photo-1587914839172-657bb0a73325?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      },
      {
        title: "Открытие нового магазина",
        content: "Приглашаем вас на открытие нового магазина на ул. Победы, 7.",
        date: "10 ноября 2023",
        imageUrl: "https://images.unsplash.com/photo-1599658426033-7e5a66c4051e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      }
    ];
    
    newsData.forEach(item => {
      const newsItem: News = { ...item, id: this.newsId++ };
      this.newsItems.set(newsItem.id, newsItem);
    });
    
    // Add products
    const podCategoryId = Array.from(this.categories.values()).find(c => c.slug === "pods")?.id || 1;
    const liquidCategoryId = Array.from(this.categories.values()).find(c => c.slug === "e-liquids")?.id || 5;
    
    const productData: InsertProduct[] = [
      {
        name: "SMOK Nord 4",
        slug: "smok-nord-4",
        description: "Компактный под-система",
        imageUrl: "https://images.unsplash.com/photo-1644162066429-c919e1853483?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: podCategoryId,
        availability: true,
        features: { power: "80W", capacity: "4.5ml" }
      },
      {
        name: "VooPoo Drag S",
        slug: "voopoo-drag-s",
        description: "Мощная под-система",
        imageUrl: "https://images.unsplash.com/photo-1557506150-0eda38c07203?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: podCategoryId,
        availability: true,
        features: { power: "60W", capacity: "4.5ml" }
      },
      {
        name: "Caliburn G",
        slug: "caliburn-g",
        description: "Сверхкомпактный под",
        imageUrl: "https://images.unsplash.com/photo-1563488225051-a3ec1238337e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: podCategoryId,
        availability: true,
        features: { power: "15W", capacity: "2ml" }
      },
      {
        name: "GeekVape Aegis",
        slug: "geekvape-aegis",
        description: "Защищенный под",
        imageUrl: "https://images.unsplash.com/photo-1616711906333-23cf81d0fb4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: podCategoryId,
        availability: true,
        features: { power: "100W", capacity: "5ml" }
      },
      {
        name: "Nasty Juice",
        slug: "nasty-juice",
        description: "Фруктовый микс",
        imageUrl: "https://images.unsplash.com/photo-1595163925099-e73fbcfd4516?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: liquidCategoryId,
        availability: true,
        features: { nicotine: "3mg", volume: "60ml" }
      },
      {
        name: "Jam Monster",
        slug: "jam-monster",
        description: "Ягодный джем",
        imageUrl: "https://images.unsplash.com/photo-1616511132520-393748862126?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: liquidCategoryId,
        availability: true,
        features: { nicotine: "6mg", volume: "100ml" }
      },
      {
        name: "Vapetasia",
        slug: "vapetasia",
        description: "Десертный вкус",
        imageUrl: "https://images.unsplash.com/photo-1616049872849-7f3ff7acf2df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: liquidCategoryId,
        availability: true,
        features: { nicotine: "0mg", volume: "120ml" }
      },
      {
        name: "Naked 100",
        slug: "naked-100",
        description: "Тропический микс",
        imageUrl: "https://images.unsplash.com/photo-1617751594683-8ba22b045118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: liquidCategoryId,
        availability: true,
        features: { nicotine: "3mg", volume: "60ml" }
      }
    ];
    
    productData.forEach(prod => {
      const product: Product = { ...prod, id: this.productId++ };
      this.products.set(product.id, product);
    });
  }
  
  // Categories
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }
  
  // Products
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(prod => prod.categoryId === categoryId);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(prod => prod.slug === slug);
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    query = query.toLowerCase();
    return Array.from(this.products.values()).filter(prod => 
      prod.name.toLowerCase().includes(query) || 
      prod.description.toLowerCase().includes(query)
    );
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = { ...product, id: this.productId++ };
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Locations
  async getAllLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }
  
  // News
  async getAllNews(): Promise<News[]> {
    return Array.from(this.newsItems.values());
  }
}

export const storage = new MemStorage();
