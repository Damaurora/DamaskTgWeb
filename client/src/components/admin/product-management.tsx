import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit2, Loader2, Search, X, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import ProductForm from "./product-form";

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    inStock: false,
    isNew: false, 
    isTop: false,
    isRecommended: false
  });
  
  // Получаем все товары
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Получаем все категории для фильтрации
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Фильтрация товаров
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product: Product) => {
      // Поиск по тексту
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Фильтр по наличию
      const matchesStock = !filters.inStock || 
        (product.availabilityGagarina || product.availabilityPobedy);
      
      // Фильтры по меткам
      const matchesNew = !filters.isNew || product.isNew;
      const matchesTop = !filters.isTop || product.isTop;
      const matchesRecommended = !filters.isRecommended || product.isRecommended;
      
      return matchesSearch && matchesStock && matchesNew && matchesTop && matchesRecommended;
    });
  }, [products, searchQuery, filters]);
  
  // Обработчик сброса фильтров
  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      inStock: false,
      isNew: false,
      isTop: false,
      isRecommended: false
    });
  };
  
  // Обработчик создания нового товара
  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setActiveTab("edit");
  };
  
  // Обработчик редактирования существующего товара
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab("edit");
  };
  
  // Обработчик возврата к списку товаров
  const handleBackToList = () => {
    setSelectedProduct(null);
    setActiveTab("list");
  };
  
  // Отображение списка товаров
  const renderProductList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (!products || products.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Товары отсутствуют</p>
          <Button onClick={handleCreateProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Создать товар
          </Button>
        </div>
      );
    }
    
    return (
      <>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Поиск и фильтры */}
          <div className="flex-grow flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Фильтры</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Фильтрация товаров</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    onClick={() => setFilters({...filters, inStock: !filters.inStock})}
                  >
                    <span className={filters.inStock ? "text-primary" : ""}>
                      {filters.inStock ? '✓ ' : ''}В наличии
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilters({...filters, isNew: !filters.isNew})}
                  >
                    <span className={filters.isNew ? "text-primary" : ""}>
                      {filters.isNew ? '✓ ' : ''}Новинки
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilters({...filters, isTop: !filters.isTop})}
                  >
                    <span className={filters.isTop ? "text-primary" : ""}>
                      {filters.isTop ? '✓ ' : ''}ТОП товары
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilters({...filters, isRecommended: !filters.isRecommended})}
                  >
                    <span className={filters.isRecommended ? "text-primary" : ""}>
                      {filters.isRecommended ? '✓ ' : ''}Рекомендуемые
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Button 
                  variant="ghost" 
                  className="w-full justify-center text-sm"
                  onClick={resetFilters}
                >
                  Сбросить фильтры
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Button onClick={handleCreateProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Создать товар
          </Button>
        </div>
        
        {/* Информация о выборке */}
        {(searchQuery || Object.values(filters).some(v => v)) && (
          <div className="mb-4 text-sm text-gray-500">
            {filteredProducts.length === 0 ? (
              <p>По вашему запросу ничего не найдено</p>
            ) : (
              <p>Показано {filteredProducts.length} из {products.length} товаров</p>
            )}
          </div>
        )}
        
        <ScrollArea className="h-[600px]">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">По вашему запросу ничего не найдено</p>
              <Button variant="outline" onClick={resetFilters}>Сбросить все фильтры</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product: Product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/300x300/png?text=Нет+изображения";
                      }}
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {product.isNew && <Badge variant="default" className="bg-blue-500">Новинка</Badge>}
                      {product.isTop && <Badge variant="default" className="bg-red-500">ТОП</Badge>}
                      {product.isRecommended && <Badge variant="default" className="bg-green-500">Рекомендуем</Badge>}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg truncate">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Badge variant={product.availabilityGagarina ? "default" : "outline"} className={product.availabilityGagarina ? "bg-primary" : ""}>
                          Гагарина
                        </Badge>
                        <Badge variant={product.availabilityPobedy ? "default" : "outline"} className={product.availabilityPobedy ? "bg-primary" : ""}>
                          Победы
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                        <Edit2 className="h-4 w-4 mr-1" />
                        Изменить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="list">Список товаров</TabsTrigger>
        <TabsTrigger value="edit">{selectedProduct ? "Редактирование товара" : "Новый товар"}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list" className="mt-4">
        {renderProductList()}
      </TabsContent>
      
      <TabsContent value="edit" className="mt-4">
        <ProductForm 
          product={selectedProduct || undefined} 
          onSuccess={handleBackToList} 
          onCancel={handleBackToList} 
        />
      </TabsContent>
    </Tabs>
  );
}