import { Link } from "wouter";
import { motion } from "framer-motion";
import { Product } from "@shared/schema";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={cn(
        "product-card bg-[hsl(var(--light-bg))] rounded-xl overflow-hidden transition-all duration-300",
        className
      )}
    >
      <Link href={`/product/${product.slug}`}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-40 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-gray-400 mt-1">{product.description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
            {product.availability ? 'В наличии' : 'Нет в наличии'}
          </span>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:text-primary"
            asChild
          >
            <Link href={`/product/${product.slug}`}>
              <Info className="h-4 w-4" />
              <span className="sr-only">Подробнее</span>
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
