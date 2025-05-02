import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import FireLogo from "@/components/ui/fire-logo";
import SearchDialog from "@/components/search-dialog";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Menu, Search, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    initialData: [],
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing location
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={`sticky top-0 z-50 transition-all ${isScrolled ? 'bg-black/95 backdrop-blur-sm border-b border-primary/30' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <FireLogo className="w-8 h-8 mr-2" />
            <h1 className="text-xl font-unbounded font-bold text-white">
              <span className="text-primary">DAMASK</span> SHOP
            </h1>
          </Link>
        </div>
        
        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-full bg-[hsl(var(--light-bg))] text-white hover:bg-primary transition-colors"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Поиск</span>
          </Button>
          
          <Button
            variant="ghost" 
            size="icon"
            className="p-2 rounded-full bg-[hsl(var(--light-bg))] text-white hover:bg-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Меню</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="bg-black/95 backdrop-blur-sm border-t border-gray-800">
          <nav className="container mx-auto px-4 py-4">
            {/* Основная навигация */}
            <div className="mb-6">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 tracking-wider">Навигация</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="block py-1.5 text-white hover:text-primary transition-colors font-medium">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link href="/#products" className="block py-1.5 text-white hover:text-primary transition-colors font-medium">
                    Все товары
                  </Link>
                </li>
                <li>
                  <Link href="/#locations" className="block py-1.5 text-white hover:text-primary transition-colors font-medium">
                    Магазины
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Категории товаров */}
            <div className="mb-4">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2 tracking-wider">Категории</h3>
              <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                {categories?.map((category: any) => (
                  <li key={category.id}>
                    <Link 
                      href={`/category/${category.slug}`}
                      className="block py-1.5 text-white hover:text-primary transition-colors font-medium text-sm"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      )}
      
      {/* Search Dialog */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
}
