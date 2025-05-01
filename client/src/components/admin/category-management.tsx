import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Loader2 } from "lucide-react";
import CategoryForm from "./category-form";
import { iconMap } from "@/lib/data";

export default function CategoryManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Получаем все категории
  const { data: categories, isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Обработчик создания новой категории
  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setActiveTab("edit");
  };
  
  // Обработчик редактирования существующей категории
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setActiveTab("edit");
  };
  
  // Обработчик возврата к списку категорий
  const handleBackToList = () => {
    setSelectedCategory(null);
    setActiveTab("list");
  };
  
  // Отображение списка категорий
  const renderCategoryList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (!categories || categories.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Категории отсутствуют</p>
          <Button onClick={handleCreateCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Создать категорию
          </Button>
        </div>
      );
    }
    
    // Функция для отображения иконки
    const getIconComponent = (iconName: string) => {
      const IconComponent = iconMap[iconName];
      return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
    };
    
    return (
      <>
        <div className="flex justify-end mb-4">
          <Button onClick={handleCreateCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Создать категорию
          </Button>
        </div>
        
        <ScrollArea className="h-[500px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category: Category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="mb-2 text-primary">
                    {getIconComponent(category.icon)}
                  </div>
                  <h3 className="font-bold text-lg text-center">{category.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">/{category.slug}</p>
                  
                  <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Изменить
                  </Button>
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
        <TabsTrigger value="list">Список категорий</TabsTrigger>
        <TabsTrigger value="edit">{selectedCategory ? "Редактирование категории" : "Новая категория"}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list" className="mt-4">
        {renderCategoryList()}
      </TabsContent>
      
      <TabsContent value="edit" className="mt-4">
        <CategoryForm 
          category={selectedCategory || undefined} 
          onSuccess={handleBackToList} 
          onCancel={handleBackToList} 
        />
      </TabsContent>
    </Tabs>
  );
}