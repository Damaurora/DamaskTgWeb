import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  categoryId?: number;
  categorySlug?: string;
  title: string;
  limit?: number;
  showViewAll?: boolean;
}

export default function ProductGrid({ 
  categoryId, 
  categorySlug, 
  title, 
  limit = 4,
  showViewAll = true
}: ProductGridProps) {
  // If categoryId is provided, query products by category
  // Otherwise, query all products
  const queryUrl = categoryId 
    ? `/api/products?categoryId=${categoryId}`
    : "/api/products";
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: [queryUrl],
  });
  
  // Filter and limit products
  const displayProducts = products?.slice(0, limit);
  
  if (isLoading) {
    return (
      <section className="py-6 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-unbounded font-bold">{title}</h2>
          {showViewAll && (
            <div className="w-16 h-6">
              <Skeleton className="h-full w-full" />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
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
        {showViewAll && categorySlug && (
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
    </section>
  );
}
