import { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PageTransition from "@/components/ui/page-transition";
import { ArrowLeft, Box, Shield, Activity, Battery, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductGrid from "@/components/products/product-grid";
import CategoryNav from "@/components/category/category-nav";
import { Product, Category } from "@shared/schema";

export default function ProductPage() {
  const { slug } = useParams();
  const [, navigate] = useLocation();
  const [notFound, setNotFound] = useState(false);
  const pageTopRef = useRef<HTMLDivElement>(null);
  
  // Query the product
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
    onError: () => setNotFound(true),
  });
  
  // Предотвращение автоматического скролла при переходе на страницу
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  // Format features for display
  const getFeatureIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'power':
        return <Activity className="h-5 w-5 text-primary" />;
      case 'capacity':
        return <Box className="h-5 w-5 text-primary" />;
      case 'battery':
        return <Battery className="h-5 w-5 text-primary" />;
      case 'protection':
        return <Shield className="h-5 w-5 text-primary" />;
      case 'duration':
        return <Clock className="h-5 w-5 text-primary" />;
      default:
        return <Box className="h-5 w-5 text-primary" />;
    }
  };
  
  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
        <p className="mb-6">Запрашиваемый товар не существует или был удален.</p>
        <Button 
          variant="default"
          onClick={() => navigate("/")}
        >
          Вернуться на главную
        </Button>
      </div>
    );
  }
  
  return (
    <PageTransition>
      {/* Верхняя навигационная панель с кнопкой назад */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
      </div>
      
      {isLoading ? (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="pt-4">
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </div>
        </div>
      ) : product ? (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl font-unbounded font-bold mb-2">{product.name}</h1>
              <p className="text-lg mb-6">{product.description}</p>
              
              {product.features && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Характеристики:</h2>
                  <div className="space-y-2">
                    {Object.entries(product.features as Record<string, string>).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3 p-2 bg-[hsl(var(--light-bg))] rounded-lg">
                        {getFeatureIcon(key)}
                        <div>
                          <span className="text-gray-400 text-sm capitalize">{key}: </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 space-y-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">Наличие в магазинах:</h3>
                  <div className="flex items-center gap-3">
                    <span 
                      className={`py-1 px-3 rounded-md ${
                        product.availabilityGagarina 
                        ? 'bg-green-800/30 text-green-500' 
                        : 'bg-red-800/30 text-red-500'
                      }`}
                    >
                      <span className="font-medium">Гагарина, 32:</span> {product.availabilityGagarina ? 'В наличии' : 'Нет в наличии'}
                    </span>
                    
                    <span 
                      className={`py-1 px-3 rounded-md ${
                        product.availabilityPobedy 
                        ? 'bg-green-800/30 text-green-500' 
                        : 'bg-red-800/30 text-red-500'
                      }`}
                    >
                      <span className="font-medium">Победы, 7:</span> {product.availabilityPobedy ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </div>
                </div>

                <div className="flex pt-2">
                  <Button 
                    variant="default"
                    onClick={() => {
                      const managerUsername = '@Nndogss';
                      const message = `Здравствуйте, а можно уточнить по товару "${product.name}" в вашем магазине`;
                      const telegramUrl = `https://t.me/${managerUsername.replace('@', '')}?text=${encodeURIComponent(message)}`;
                      window.open(telegramUrl, '_blank');
                    }}
                  >
                    Уточнить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Удалено отображение похожих товаров из той же категории */}
    </PageTransition>
  );
}
