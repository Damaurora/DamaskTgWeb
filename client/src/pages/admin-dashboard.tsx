import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Store, 
  Newspaper, 
  Settings,
  Users,
  LogOut
} from "lucide-react";
import ProductManagement from "@/components/admin/product-management";
import CategoryManagement from "@/components/admin/category-management";
import NewsManagement from "@/components/admin/news-management";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Панель администратора</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Пользователь: <span className="font-medium">{user.username}</span>
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => logoutMutation.mutate()}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Обзор
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Товары
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Категории
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Магазины
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            Новости
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Добро пожаловать в панель администратора</CardTitle>
                <CardDescription>
                  Используйте эту панель для управления контентом магазина Damask Shop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Выберите раздел в верхнем меню для начала работы. Вы можете управлять товарами, 
                  категориями, информацией о магазинах и новостями.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Быстрый доступ</CardTitle>
                <CardDescription>
                  Основные разделы для управления
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("products")}
                  className="justify-start"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Управление товарами
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("categories")}
                  className="justify-start"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Категории товаров
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("locations")}
                  className="justify-start"
                >
                  <Store className="mr-2 h-4 w-4" />
                  Магазины
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("news")}
                  className="justify-start"
                >
                  <Newspaper className="mr-2 h-4 w-4" />
                  Новости и акции
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Управление товарами</CardTitle>
              <CardDescription>
                Добавление, редактирование и удаление товаров в каталоге
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Управление категориями</CardTitle>
              <CardDescription>
                Организация структуры категорий товаров
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Управление магазинами</CardTitle>
              <CardDescription>
                Информация о локациях магазинов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                Содержимое раздела управления магазинами будет доступно в скором времени
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle>Управление новостями</CardTitle>
              <CardDescription>
                Публикация новостей и акций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewsManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}