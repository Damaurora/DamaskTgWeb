import { categories, products, locations, news, users } from "@shared/schema";
import type { 
  Category, InsertCategory, 
  Product, InsertProduct, 
  Location, InsertLocation, 
  News, InsertNews,
  User, InsertUser
} from "@shared/schema";

// Интерфейс для контактной информации
export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  logoSvg: string;
}

export interface IStorage {
  // Users (Admin)
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>; 
  verifyUser(username: string, password: string): Promise<User | undefined>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductById(id: number): Promise<Product | undefined>; 
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Locations
  getAllLocations(): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: number, location: Partial<InsertLocation>): Promise<Location | undefined>;
  deleteLocation(id: number): Promise<boolean>;
  
  // News
  getAllNews(): Promise<News[]>;
  getNewsById(id: number): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, news: Partial<InsertNews>): Promise<News | undefined>;
  deleteNews(id: number): Promise<boolean>;
  
  // Contact Info
  getContactInfo(): Promise<ContactInfo>;
  updateContactInfo(contactInfo: Partial<ContactInfo>): Promise<ContactInfo>;
}

// In-memory database implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private locations: Map<number, Location>;
  private newsItems: Map<number, News>;
  private contactInfo: ContactInfo;
  
  private userId: number = 1;
  private categoryId: number = 1;
  private productId: number = 1;
  private locationId: number = 1;
  private newsId: number = 1;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.locations = new Map();
    this.newsItems = new Map();
    
    // Контактная информация по умолчанию
    this.contactInfo = {
      address: "ул. Центральная, 10, Москва",
      phone: "+7 (800) 123-45-67",
      email: "info@damask-shop.ru",
      workingHours: "Пн-Пт: 10:00 - 20:00, Сб-Вс: 10:00 - 18:00",
      logoSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 100 40" fill="none"><path d="M20.5 8H32C35.866 8 39 11.134 39 15V25C39 28.866 35.866 32 32 32H20.5C16.634 32 13.5 28.866 13.5 25V15C13.5 11.134 16.634 8 20.5 8Z" fill="#FF6B00"/><path d="M48 12H61C63.761 12 66 14.239 66 17V23C66 25.761 63.761 28 61 28H48C45.239 28 43 25.761 43 23V17C43 14.239 45.239 12 48 12Z" fill="#FF6B00"/><path d="M76 16H84C85.657 16 87 17.343 87 19V21C87 22.657 85.657 24 84 24H76C74.343 24 73 22.657 73 21V19C73 17.343 74.343 16 76 16Z" fill="#FF6B00"/></svg>'
    };
    
    // Initialize with default data
    this.initializeData();
  }
  
  private initializeData() {
    // Добавляем администратора
    const adminUser: User = {
      id: this.userId++,
      username: "admin",
      password: "321" // В реальном приложении пароль должен быть хэширован
    };
    this.users.set(adminUser.id, adminUser);
    
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
    const podModsCategoryId = Array.from(this.categories.values()).find(c => c.slug === "pod-mods")?.id || 2;
    const disposablesCategoryId = Array.from(this.categories.values()).find(c => c.slug === "disposables")?.id || 3;
    const tobaccoCategoryId = Array.from(this.categories.values()).find(c => c.slug === "tobacco")?.id || 4;
    const liquidCategoryId = Array.from(this.categories.values()).find(c => c.slug === "e-liquids")?.id || 5;
    const hookahsCategoryId = Array.from(this.categories.values()).find(c => c.slug === "hookahs")?.id || 6;
    const chewingTobaccoCategoryId = Array.from(this.categories.values()).find(c => c.slug === "chewing-tobacco")?.id || 7;
    const vaporizersCategoryId = Array.from(this.categories.values()).find(c => c.slug === "vaporizers")?.id || 8;
    const accessoriesCategoryId = Array.from(this.categories.values()).find(c => c.slug === "accessories")?.id || 9;
    
    const productData: InsertProduct[] = [
      {
        name: "SMOK Nord 4",
        slug: "smok-nord-4",
        description: "Компактный под-система",
        imageUrl: "https://images.unsplash.com/photo-1644162066429-c919e1853483?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: podCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { power: "80W", capacity: "4.5ml" }
      },
      {
        name: "VooPoo Drag S",
        slug: "voopoo-drag-s",
        description: "Мощная под-система",
        imageUrl: "https://images.unsplash.com/photo-1557506150-0eda38c07203?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: podCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: false,
        features: { power: "60W", capacity: "4.5ml" }
      },
      {
        name: "Caliburn G",
        slug: "caliburn-g",
        description: "Сверхкомпактный под",
        imageUrl: "https://images.unsplash.com/photo-1563488225051-a3ec1238337e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: podCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { power: "15W", capacity: "2ml" }
      },
      {
        name: "GeekVape Aegis",
        slug: "geekvape-aegis",
        description: "Защищенный под",
        imageUrl: "https://images.unsplash.com/photo-1616711906333-23cf81d0fb4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: podCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { power: "100W", capacity: "5ml" }
      },
      {
        name: "Nasty Juice",
        slug: "nasty-juice",
        description: "Фруктовый микс",
        imageUrl: "https://images.unsplash.com/photo-1595163925099-e73fbcfd4516?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: liquidCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { nicotine: "3mg", volume: "60ml" }
      },
      {
        name: "Jam Monster",
        slug: "jam-monster",
        description: "Ягодный джем",
        imageUrl: "https://images.unsplash.com/photo-1616511132520-393748862126?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: liquidCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { nicotine: "6mg", volume: "100ml" }
      },
      {
        name: "Vapetasia",
        slug: "vapetasia",
        description: "Десертный вкус",
        imageUrl: "https://images.unsplash.com/photo-1616049872849-7f3ff7acf2df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: liquidCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { nicotine: "0mg", volume: "120ml" }
      },
      {
        name: "Naked 100",
        slug: "naked-100",
        description: "Тропический микс",
        imageUrl: "https://images.unsplash.com/photo-1617751594683-8ba22b045118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: liquidCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { nicotine: "3mg", volume: "60ml" }
      },
      // Под-моды
      {
        name: "Lost Vape Ursa",
        slug: "lost-vape-ursa",
        description: "Премиальный под-мод",
        imageUrl: "https://images.unsplash.com/photo-1571126722798-ea9a57a0c463?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: podModsCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { power: "100W", capacity: "6ml", battery: "Сменный 18650" }
      },
      {
        name: "VooPoo Drag X",
        slug: "voopoo-drag-x",
        description: "Стильный под-мод с кожаной вставкой",
        imageUrl: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: podModsCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { power: "80W", capacity: "4.5ml", battery: "Сменный 18650" }
      },
      {
        name: "Vaporesso Target PM80",
        slug: "vaporesso-target-pm80",
        description: "Компактный под-мод с мощным аккумулятором",
        imageUrl: "https://images.unsplash.com/photo-1603822448595-3aafe10b38e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: podModsCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { power: "80W", capacity: "4ml", battery: "Встроенный 2000mAh" }
      },
      // Одноразки
      {
        name: "Elf Bar 1500",
        slug: "elf-bar-1500",
        description: "Популярная одноразовая электронная сигарета",
        imageUrl: "https://images.unsplash.com/photo-1567617182847-0877b1252496?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: disposablesCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { puffs: "1500", nicotine: "20mg", battery: "850mAh" }
      },
      {
        name: "HQD King",
        slug: "hqd-king",
        description: "Одноразка премиум-класса",
        imageUrl: "https://images.unsplash.com/photo-1603822252476-f74e97fcad85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: disposablesCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { puffs: "2000", nicotine: "50mg", battery: "1100mAh" }
      },
      {
        name: "Puff Bar Plus",
        slug: "puff-bar-plus",
        description: "Компактная одноразовая электронная сигарета",
        imageUrl: "https://images.unsplash.com/photo-1605989991670-18ad2fa41021?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: disposablesCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { puffs: "800", nicotine: "20mg", battery: "550mAh" }
      },
      // Табак
      {
        name: "Darkside Core",
        slug: "darkside-core",
        description: "Крепкий табак для кальяна",
        imageUrl: "https://images.unsplash.com/photo-1527099908998-5b73a5fe2a0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: tobaccoCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { weight: "100g", strength: "Средняя", flavor: "Различные вкусы" }
      },
      {
        name: "Fumari",
        slug: "fumari",
        description: "Премиальный табак для кальяна из США",
        imageUrl: "https://images.unsplash.com/photo-1581800757336-38659b6e3f52?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: tobaccoCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { weight: "100g", strength: "Лёгкая", flavor: "Сочные фрукты" }
      },
      {
        name: "Element Air",
        slug: "element-air",
        description: "Табак средней крепости для длительных сессий",
        imageUrl: "https://images.unsplash.com/photo-1516013983599-41d612346f5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: tobaccoCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { weight: "200g", strength: "Средняя", flavor: "Освежающие вкусы" }
      },
      // Кальяны
      {
        name: "Alpha Hookah Model S",
        slug: "alpha-hookah-model-s",
        description: "Современный минималистичный кальян",
        imageUrl: "https://images.unsplash.com/photo-1588652737663-368bf25b4d86?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: hookahsCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { height: "62cm", material: "Нержавеющая сталь", hoses: "1" }
      },
      {
        name: "Karma Hookah 3.0",
        slug: "karma-hookah-3",
        description: "Премиальный кальян для ценителей",
        imageUrl: "https://images.unsplash.com/photo-1617047520098-8acf81db249e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: hookahsCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { height: "70cm", material: "Авиационный алюминий", hoses: "2" }
      },
      {
        name: "Nube Hookah Junior",
        slug: "nube-hookah-junior",
        description: "Компактный кальян для домашнего использования",
        imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: hookahsCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { height: "45cm", material: "Нержавеющая сталь", hoses: "1" }
      },
      // Жевательный табак
      {
        name: "Siberia White",
        slug: "siberia-white",
        description: "Очень крепкий жевательный табак",
        imageUrl: "https://images.unsplash.com/photo-1579208030877-39f6f5588036?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: chewingTobaccoCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { nicotine: "43mg/g", weight: "20g", flavor: "Мята" }
      },
      {
        name: "LYFT Ice Cool",
        slug: "lyft-ice-cool",
        description: "Безтабачные никотиновые паучи",
        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: chewingTobaccoCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { nicotine: "16mg/g", weight: "16.8g", flavor: "Мята" }
      },
      {
        name: "Thunder X",
        slug: "thunder-x",
        description: "Крепкий снюс для опытных пользователей",
        imageUrl: "https://images.unsplash.com/photo-1584727638096-042c644eda6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: chewingTobaccoCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { nicotine: "45mg/g", weight: "19g", flavor: "Классический" }
      },
      // Вапорайзеры
      {
        name: "PAX 3",
        slug: "pax-3",
        description: "Премиальный вапорайзер для сухих смесей",
        imageUrl: "https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: vaporizersCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { battery: "3500mAh", heatup: "15 секунд", temp: "4 режима" }
      },
      {
        name: "Volcano Hybrid",
        slug: "volcano-hybrid",
        description: "Настольный вапорайзер высшего класса",
        imageUrl: "https://images.unsplash.com/photo-1579536568227-e9175a1d64a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: vaporizersCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { power: "120W", heatup: "1-2 минуты", temp: "40-230°C" }
      },
      {
        name: "DynaVap M",
        slug: "dynavap-m",
        description: "Компактный аналоговый вапорайзер без электроники",
        imageUrl: "https://images.unsplash.com/photo-1557687790-902ede7ab58c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: vaporizersCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { material: "Нержавеющая сталь", heating: "Внешний источник", chamber: "0.1g" }
      },
      // Аксессуары
      {
        name: "Coil Master V3",
        slug: "coil-master-v3",
        description: "Набор для намотки спиралей",
        imageUrl: "https://images.unsplash.com/photo-1612225259857-886f3ad0ffe4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: accessoriesCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { tools: "10 инструментов", case: "Жесткий кейс", materials: "Нержавеющая сталь" }
      },
      {
        name: "Калауд Lotus 2",
        slug: "kaloud-lotus-2",
        description: "Калауд для кальяна премиум-класса",
        imageUrl: "https://images.unsplash.com/photo-1598797368396-5293e56c4d25?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: accessoriesCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { material: "Алюминий", compatibility: "Универсальный", weight: "150g" }
      },
      {
        name: "Battery Case 18650",
        slug: "battery-case-18650",
        description: "Защитный кейс для аккумуляторов",
        imageUrl: "https://images.unsplash.com/photo-1599719500956-d158a3abd0d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: accessoriesCategoryId,
        availabilityGagarina: true,
        availabilityPobedy: true,
        features: { capacity: "4 аккумулятора", material: "Силикон", size: "Компактный" }
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
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  // Products
  // Users methods
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }
  
  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async verifyUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return undefined;
  }
  
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
    // Обеспечиваем дефолтные значения для не указанных полей
    const newProduct: Product = { 
      ...product, 
      id: this.productId++,
      fullDescription: product.fullDescription || null,
      availabilityGagarina: product.availabilityGagarina ?? false,
      availabilityPobedy: product.availabilityPobedy ?? false,
      expectedGagarina: product.expectedGagarina ?? false,
      expectedPobedy: product.expectedPobedy ?? false,
      isNew: product.isNew ?? false,
      isTop: product.isTop ?? false,
      isRecommended: product.isRecommended ?? false,
      expectedDelivery: product.expectedDelivery || null,
      features: product.features || {}
    };
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
  
  async getLocationById(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }
  
  async createLocation(location: InsertLocation): Promise<Location> {
    const newLocation: Location = { ...location, id: this.locationId++ };
    this.locations.set(newLocation.id, newLocation);
    return newLocation;
  }
  
  async updateLocation(id: number, location: Partial<InsertLocation>): Promise<Location | undefined> {
    const existingLocation = this.locations.get(id);
    if (!existingLocation) return undefined;
    
    const updatedLocation = { ...existingLocation, ...location };
    this.locations.set(id, updatedLocation);
    return updatedLocation;
  }
  
  async deleteLocation(id: number): Promise<boolean> {
    return this.locations.delete(id);
  }
  
  // News
  async getAllNews(): Promise<News[]> {
    return Array.from(this.newsItems.values());
  }
  
  async getNewsById(id: number): Promise<News | undefined> {
    return this.newsItems.get(id);
  }
  
  async createNews(news: InsertNews): Promise<News> {
    const newNews: News = { ...news, id: this.newsId++ };
    this.newsItems.set(newNews.id, newNews);
    return newNews;
  }
  
  async updateNews(id: number, news: Partial<InsertNews>): Promise<News | undefined> {
    const existingNews = this.newsItems.get(id);
    if (!existingNews) return undefined;
    
    const updatedNews = { ...existingNews, ...news };
    this.newsItems.set(id, updatedNews);
    return updatedNews;
  }
  
  async deleteNews(id: number): Promise<boolean> {
    return this.newsItems.delete(id);
  }
  
  // Categories
  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = { ...category, id: this.categoryId++ };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) return undefined;
    
    const updatedCategory = { ...existingCategory, ...category };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Product by ID
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  // Contact Info
  // Функциональность перенесена в соответствующие места, оставлено для избежания ошибок
  
  async getContactInfo(): Promise<ContactInfo> {
    return this.contactInfo;
  }
  
  async updateContactInfo(contactInfo: Partial<ContactInfo>): Promise<ContactInfo> {
    this.contactInfo = { ...this.contactInfo, ...contactInfo };
    return this.contactInfo;
  }
}

export const storage = new MemStorage();
