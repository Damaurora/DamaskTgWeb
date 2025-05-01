import { Link } from "wouter";
import { motion } from "framer-motion";
import { Product } from "@shared/schema";
import { Info, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  // Проверяем наличие товара хотя бы в одном магазине
  const isAvailableAnywhere = product.availabilityGagarina || product.availabilityPobedy;
  
  // Если есть метки, показываем их
  const hasLabels = product.isNew || product.isTop || product.isRecommended;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={cn(
        "product-card bg-[hsl(var(--light-bg))] rounded-xl overflow-hidden transition-all duration-300 flex flex-col",
        className
      )}
    >
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="block">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-40 object-cover"
          />
        </Link>
        
        {/* Метки товара */}
        {hasLabels && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge variant="default" className="bg-blue-500">Новинка</Badge>
            )}
            {product.isTop && (
              <Badge variant="default" className="bg-red-500">ТОП</Badge>
            )}
            {product.isRecommended && (
              <Badge variant="default" className="bg-green-500">Рекомендуем</Badge>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 flex-grow">{product.description}</p>
        
        {/* Кнопка подробнее */}
        <div className="flex justify-end mt-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:text-primary px-2 py-0 h-7"
            asChild
          >
            <Link href={`/product/${product.slug}`}>
              <Info className="h-4 w-4 mr-1" />
              <span>Подробнее</span>
            </Link>
          </Button>
        </div>
        
        {/* Блок с наличием - всегда внизу карточки */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Наличие:</span>
            <span className={isAvailableAnywhere ? "text-green-500" : "text-red-500"}>
              {isAvailableAnywhere ? 'В наличии' : 'Нет в наличии'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-1 mt-1 text-xs">
            <div className="flex items-center">
              <span className="mr-1">
                {product.availabilityGagarina ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
              </span>
              <span className="text-gray-400">Гагарина</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">
                {product.availabilityPobedy ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
              </span>
              <span className="text-gray-400">Победы</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
