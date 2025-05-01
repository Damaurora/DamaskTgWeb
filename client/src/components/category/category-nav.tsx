import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CrownIcon, ZapIcon, LeafIcon, BatteryChargingIcon, 
  DropletIcon, PackageIcon, PaintbrushIcon, CloudIcon, WrenchIcon 
} from "lucide-react";
import { iconMap } from "@/lib/data";

interface CategoryNavProps {
  currentSlug?: string;
  title?: string;
  showTitle?: boolean;
  containerClass?: string;
}

export default function CategoryNav({ 
  currentSlug,
  title = "Категории", 
  showTitle = true,
  containerClass = "py-4 px-4"
}: CategoryNavProps) {
  const [, navigate] = useLocation();
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Функция для перехода к категории без полной перезагрузки страницы
  const navigateToCategory = (slug: string) => {
    window.scrollTo(0, 0);
    navigate(`/category/${slug}`);
  };
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'crown':
        return <CrownIcon className="h-6 w-6 text-primary" />;
      case 'flashlight':
        return <ZapIcon className="h-6 w-6 text-primary" />;
      case 'leaf':
        return <LeafIcon className="h-6 w-6 text-primary" />;
      case 'battery-2-charge':
        return <BatteryChargingIcon className="h-6 w-6 text-primary" />;
      case 'drop':
        return <DropletIcon className="h-6 w-6 text-primary" />;
      case 'box-3':
        return <PackageIcon className="h-6 w-6 text-primary" />;
      case 'paint':
        return <PaintbrushIcon className="h-6 w-6 text-primary" />;
      case 'cloud':
        return <CloudIcon className="h-6 w-6 text-primary" />;
      case 'tools':
        return <WrenchIcon className="h-6 w-6 text-primary" />;
      default:
        return <DropletIcon className="h-6 w-6 text-primary" />;
    }
  };
  
  if (isLoading) {
    return (
      <section className={containerClass} id="products">
        {showTitle && <h2 className="text-xl font-unbounded font-bold mb-4">{title}</h2>}
        <div className="flex overflow-x-auto gap-3 pb-4">
          <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 gap-2">
            <Skeleton className="w-16 h-16 rounded-full bg-primary/10" />
            <Skeleton className="h-4 w-16" />
          </div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center justify-center w-20 gap-2">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  if (!categories?.length) return null;
  
  return (
    <section className={containerClass} id="products">
      {showTitle && <h2 className="text-xl font-unbounded font-bold mb-4">{title}</h2>}
      
      <div className="categories-carousel flex overflow-x-auto gap-3 pb-4">
        <div 
          onClick={() => {
            // При клике на "Все товары" переходим на главную страницу и добавляем параметр для прокрутки к товарам
            navigate("/?scroll_to_products=true");
          }}
          className={`cursor-pointer flex-shrink-0 flex flex-col items-center justify-center w-20 gap-2 ${currentSlug === undefined || window.location.pathname === '/' ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
        >
          <div className={`w-16 h-16 rounded-full ${currentSlug === undefined || window.location.pathname === '/' ? 'bg-primary/30' : 'bg-primary/20'} flex items-center justify-center hover:bg-primary/30 transition-colors`}>
            <PackageIcon className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xs text-center">Все товары</span>
        </div>
        
        {categories.map((category) => (
          <div 
            key={category.id} 
            onClick={() => navigateToCategory(category.slug)}
            className={`cursor-pointer flex-shrink-0 flex flex-col items-center justify-center w-20 gap-2 ${currentSlug === category.slug ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
          >
            <div className={`w-16 h-16 rounded-full ${currentSlug === category.slug ? 'bg-primary/30' : 'bg-[hsl(var(--light-bg))]'} flex items-center justify-center hover:bg-primary/20 transition-colors`}>
              {getIconComponent(category.icon)}
            </div>
            <span className="text-xs text-center">{category.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
