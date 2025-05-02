
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import CategoryNav from "@/components/category/category-nav";
import ProductGrid from "@/components/products/product-grid";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export default function CategoryPage() {
  const [location] = useLocation();
  const slug = location.split("/").pop() || "";

  // Получаем данные категории
  const { data: category } = useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${slug}`);
      if (!response.ok) {
        throw new Error("Ошибка загрузки категории");
      }
      return response.json();
    }
  });

  if (!category) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <CategoryNav />
      <Separator className="my-8" />
      <h1 className="text-3xl font-unbounded font-bold mb-8">{category.name}</h1>
      <ProductGrid 
        title={category.name}
        categoryId={category.id} 
        showViewAll={false} 
      />
    </main>
  );
}
