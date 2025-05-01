import { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PageTransition from "@/components/ui/page-transition";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/products/product-card";
import CategoryNav from "@/components/category/category-nav";
import { Product, Category } from "@shared/schema";
import { defaultCategoryImages } from "@/lib/data";

export default function CategoryPage() {
  const { slug } = useParams();
  const [, navigate] = useLocation();
  const [notFound, setNotFound] = useState(false);
  const pageTopRef = useRef<HTMLDivElement>(null);
  
  // Query the category
  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/category-by-slug/${slug}`],
    onError: () => setNotFound(true),
  });
  
  // Query products by category
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: [`/api/products?categoryId=${category?.id}`],
    enabled: !!category?.id,
  });
  
  const isLoading = categoryLoading || productsLoading;
  
  // Get background image for the category
  const bgImage = defaultCategoryImages[slug ?? ''] || defaultCategoryImages.accessories;
  
  // Предотвращение автоматического скролла при переходе на страницу
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  const navigateToCategory = (slug: string) => {
    window.scrollTo(0, 0);
    navigate(`/category/${slug}`);
  };
  
  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Категория не найдена</h1>
        <p className="mb-6">Запрашиваемая категория не существует или была удалена.</p>
        <Link href="/">
          <Button variant="default">Вернуться на главную</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <PageTransition>
      {/* Category header */}
      <div className="relative h-[25vh] min-h-[200px] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img 
          src={bgImage}
          alt={category?.name ?? "Категория"} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Skeleton className="h-10 w-40 mb-4" />
            </div>
          ) : (
            <h1 className="text-3xl font-unbounded font-bold mb-2">
              {category?.name}
            </h1>
          )}
        </div>
      </div>
      
      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
      </div>
      
      {/* Category Navigation */}
      <div ref={pageTopRef}>
        <CategoryNav 
          currentSlug={slug} 
          title="Выберите категорию"
          containerClass="py-2 px-4"
        />
      </div>
      
      {/* Products */}
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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
        ) : products?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold mb-2">Нет товаров в этой категории</h2>
            <p className="text-gray-400 mb-6">Скоро здесь появятся новые товары!</p>
            <Button 
              variant="default"
              onClick={() => navigate("/")}
            >
              Вернуться на главную
            </Button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
