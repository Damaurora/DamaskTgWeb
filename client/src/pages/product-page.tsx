import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast"; // Corrected import statement
import { Separator } from "@/components/ui/separator";
import CategoryNav from "@/components/category/category-nav";
import ProductGrid from "@/components/products/product-grid";

export default function ProductPage() {
  const [location] = useLocation();
  const slug = location.split("/").pop() || "";

  // Получаем данные товара
  const { data: product } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) {
        throw new Error("Ошибка загрузки товара");
      }
      return response.json();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Ошибка загрузки товара",
      });
    }
  });

  if (!product) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <CategoryNav />
      <Separator className="my-8" />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Изображение товара */}
        <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="object-contain w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/600x600/png?text=Нет+изображения";
            }}
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {product.isNew && <Badge variant="secondary">Новинка</Badge>}
            {product.isTop && <Badge variant="destructive">ТОП</Badge>}
            {product.isRecommended && <Badge className="bg-green-500">Рекомендуем</Badge>}
          </div>
        </div>

        {/* Информация о товаре */}
        <div>
          <h1 className="text-3xl font-unbounded font-bold mb-4">{product.name}</h1>
          <p className="text-lg mb-6">{product.description}</p>

          {product.features && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Характеристики</h2>
              <ul className="space-y-2">
                {Object.entries(product.features).map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Наличие в магазинах:</h3>
            <div className="flex gap-4">
              <Badge variant={product.availabilityGagarina ? "default" : "outline"}>
                Гагарина
              </Badge>
              <Badge variant={product.availabilityPobedy ? "default" : "outline"}>
                Победы
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      <section>
        <h2 className="text-2xl font-unbounded font-bold mb-8">Похожие товары</h2>
        <ProductGrid categoryId={product.categoryId} excludeId={product.id} limit={4} />
      </section>
    </main>
  );
}