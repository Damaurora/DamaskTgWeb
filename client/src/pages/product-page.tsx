import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Box, Shield, Activity, Battery, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductGrid from "@/components/products/product-grid";
import { Product, Category } from "@shared/schema";

export default function ProductPage() {
  const { slug } = useParams();
  const [notFound, setNotFound] = useState(false);
  
  // Query the product
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
    onError: () => setNotFound(true),
  });
  
  // Query the category for this product
  const { data: category } = useQuery<Category>({
    queryKey: [`/api/categories/${product?.categoryId}`],
    enabled: !!product?.categoryId,
  });
  
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
        <Link href="/">
          <Button variant="default">Вернуться на главную</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: a0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4 py-4">
        <Link href={category ? `/category/${category.slug}` : "/"}>
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {category ? `Назад к ${category.name}` : "Назад"}
          </Button>
        </Link>
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
              <p className="text-sm text-gray-400 mb-4">
                Категория: {category?.name || 'Загрузка...'}
              </p>
              
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
              
              <div className="flex items-center gap-4 mt-8">
                <span 
                  className={`py-1 px-3 rounded-md ${
                    product.availability 
                    ? 'bg-green-800/30 text-green-500' 
                    : 'bg-red-800/30 text-red-500'
                  }`}
                >
                  {product.availability ? 'В наличии' : 'Нет в наличии'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Related products */}
      {category && (
        <div className="mt-8 mb-16">
          <ProductGrid
            categoryId={category.id}
            categorySlug={category.slug}
            title="Похожие товары"
            limit={4}
            showViewAll={true}
          />
        </div>
      )}
    </motion.div>
  );
}
