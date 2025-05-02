import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, X } from "lucide-react";
import { Product } from "@shared/schema";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  
  // Reset search query when dialog opens
  useEffect(() => {
    if (open) {
      setSearchQuery("");
    }
  }, [open]);
  
  // Use the search query to filter products
  const { data: searchResults = [], isLoading } = useQuery<Product[]>({
    queryKey: [`/api/products?search=${searchQuery}`],
    enabled: searchQuery.length > 2,
  });
  
  // Navigate to product page and close dialog
  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Поиск товаров</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Введите название товара..."
            className="pl-10 pr-10 py-3 bg-[hsl(var(--light-bg))] border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {isLoading && searchQuery.length > 2 && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {searchQuery.length > 2 && !isLoading && searchResults?.length === 0 && (
            <div className="text-center py-6 text-gray-400">
              Ничего не найдено
            </div>
          )}
          
          {searchResults?.length > 0 && (
            <div className="space-y-4">
              {searchResults.map(product => (
                <div 
                  key={product.id} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 cursor-pointer"
                  onClick={() => handleProductClick(product.slug)}
                >
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="h-12 w-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium text-sm">{product.name}</h3>
                    <p className="text-xs text-gray-400">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {searchQuery.length > 0 && searchQuery.length <= 2 && (
            <div className="text-center py-6 text-gray-400">
              Введите минимум 3 символа для поиска
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
