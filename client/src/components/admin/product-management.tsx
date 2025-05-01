import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProductForm from "./product-form";

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Получаем все товары
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });
  
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
        <div className="flex justify-end mb-4">
          <Button onClick={handleCreateProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Создать товар
          </Button>
        </div>
        
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product: Product) => (
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