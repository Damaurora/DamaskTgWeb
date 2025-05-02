import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ProductGridProps {
  categoryId?: number;
  categorySlug?: string;
  title: string;
  limit?: number;
  showViewAll?: boolean;
  isHomePage?: boolean; // Добавляем флаг для главной страницы
}

export default function ProductGrid({ 
  categoryId, 
  categorySlug, 
  title, 
  limit = 4,
  showViewAll = true,
  isHomePage = false
}: ProductGridProps) {
  // Для главной страницы устанавливаем начальный лимит в 12
  const initialLimit = isHomePage ? 12 : limit;

  // Состояние для текущего количества отображаемых товаров
  const [currentLimit, setCurrentLimit] = useState(initialLimit);

  // If categoryId is provided, query products by category
  // Otherwise, query all products
  const queryUrl = categoryId 
    ? `/api/products?categoryId=${categoryId}`
    : "/api/products";

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: [queryUrl],
    initialData: [],
  });

  // Общее количество доступных товаров
  const totalProducts = products?.length || 0;

  // Проверяем, можно ли загрузить еще товары
  const canLoadMore = products && currentLimit < totalProducts;

  // Функция для загрузки дополнительных товаров
  const handleLoadMore = () => {
    setCurrentLimit(prev => prev + 8); // Загружаем еще 8 товаров
  };

  // Filter and limit products
  const displayProducts = products?.slice(0, currentLimit);

  if (isLoading) {
    return (
      <section className="py-6 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-unbounded font-bold">{title}</h2>
          {showViewAll && !isHomePage && (
            <div className="w-16 h-6">
              <Skeleton className="h-full w-full" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: isHomePage ? 12 : 4 }).map((_, i) => (
            <div key={i} className="bg-[hsl(var(--light-bg))] rounded-xl overflow-hidden">
              <Skeleton className="w-full h-40" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!displayProducts?.length) return null;

  return (
    <section className="py-6 px-4" id={categorySlug}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-unbounded font-bold">{title}</h2>
        {showViewAll && categorySlug && !isHomePage && (
          <Link href={`/category/${categorySlug}`} className="text-sm text-primary hover:underline">
            Все товары
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Кнопка "Загрузить еще" для главной страницы */}
      {isHomePage && canLoadMore && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            className="min-w-32"
          >
            Загрузить еще
          </Button>
        </div>
      )}
    </section>
  );
}