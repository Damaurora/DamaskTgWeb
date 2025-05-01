import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit2, Loader2, Calendar } from "lucide-react";
import NewsForm from "./news-form";

// Безопасный форматтер даты
const safeFormatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Проверка на валидность даты
    if (isNaN(date.getTime())) {
      return dateString; // Возвращаем исходную строку, если дата некорректная
    }
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // В случае ошибки возвращаем исходную строку
  }
};

export default function NewsManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  
  // Получаем все новости
  const { data: news, isLoading } = useQuery({
    queryKey: ["/api/news"],
  });
  
  // Обработчик создания новой новости
  const handleCreateNews = () => {
    setSelectedNews(null);
    setActiveTab("edit");
  };
  
  // Обработчик редактирования существующей новости
  const handleEditNews = (newsItem: News) => {
    setSelectedNews(newsItem);
    setActiveTab("edit");
  };
  
  // Обработчик возврата к списку новостей
  const handleBackToList = () => {
    setSelectedNews(null);
    setActiveTab("list");
  };
  
  // Отображение списка новостей
  const renderNewsList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (!news || news.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Новости отсутствуют</p>
          <Button onClick={handleCreateNews}>
            <Plus className="mr-2 h-4 w-4" />
            Создать новость
          </Button>
        </div>
      );
    }
    
    return (
      <>
        <div className="flex justify-end mb-4">
          <Button onClick={handleCreateNews}>
            <Plus className="mr-2 h-4 w-4" />
            Создать новость
          </Button>
        </div>
        
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.map((item: News) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/800x450/png?text=Нет+изображения";
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{safeFormatDate(item.date)}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.content}</p>
                  
                  <Button size="sm" variant="outline" onClick={() => handleEditNews(item)}>
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
        <TabsTrigger value="list">Список новостей</TabsTrigger>
        <TabsTrigger value="edit">{selectedNews ? "Редактирование новости" : "Новая новость"}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list" className="mt-4">
        {renderNewsList()}
      </TabsContent>
      
      <TabsContent value="edit" className="mt-4">
        <NewsForm 
          news={selectedNews || undefined} 
          onSuccess={handleBackToList} 
          onCancel={handleBackToList} 
        />
      </TabsContent>
    </Tabs>
  );
}