import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CrownIcon, ZapIcon, LeafIcon, BatteryChargingIcon, 
  DropletIcon, PackageIcon, PaintbrushIcon, CloudIcon, WrenchIcon 
} from "lucide-react";
import { iconMap } from "@/lib/data";

export default function CategoryNav() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
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
      <section className="py-4 px-4" id="products">
        <h2 className="text-xl font-unbounded font-bold mb-4">Категории</h2>
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
    <section className="py-4 px-4" id="products">
      <h2 className="text-xl font-unbounded font-bold mb-4">Категории</h2>
      
      <div className="categories-carousel flex overflow-x-auto gap-3 pb-4">
        <Link 
          href="/#products"
          className="flex-shrink-0 flex flex-col items-center justify-center w-20 gap-2"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors">
            <PackageIcon className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xs text-center">Все товары</span>
        </Link>
        
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/category/${category.slug}`}
            className="flex-shrink-0 flex flex-col items-center justify-center w-20 gap-2"
          >
            <div className="w-16 h-16 rounded-full bg-[hsl(var(--light-bg))] flex items-center justify-center hover:bg-primary/20 transition-colors">
              {getIconComponent(category.icon)}
            </div>
            <span className="text-xs text-center">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
