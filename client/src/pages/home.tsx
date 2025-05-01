import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

import HeroSection from "@/components/hero-section";
import NewsCarousel from "@/components/carousel/news-carousel";
import CategoryNav from "@/components/category/category-nav";
import ProductGrid from "@/components/products/product-grid";
import LocationCard from "@/components/locations/location-card";


export default function Home() {
  const [location, setLocation] = useLocation();
  
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  const { data: locations } = useQuery({
    queryKey: ["/api/locations"],
  });
  
  // Scroll to section if hash is present in URL
  useEffect(() => {
    if (location.includes("#")) {
      const id = location.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  
  // Back to top button
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Get first 2 categories for featured products
  const featuredCategories = categories?.slice(0, 2);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <HeroSection />
        <NewsCarousel />
        <CategoryNav />
        
        {/* Featured Product Categories */}
        {featuredCategories?.map(category => (
          <ProductGrid
            key={category.id}
            categoryId={category.id}
            categorySlug={category.slug}
            title={category.name}
            limit={4}
          />
        ))}
        
        {/* Locations Section */}
        <section className="py-8 px-4 bg-[hsl(var(--dark-bg))]" id="locations">
          <h2 className="text-xl font-unbounded font-bold mb-6">Наши магазины</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations?.map(location => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </section>
        

        {/* Back to top button */}
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 p-3 bg-primary text-white rounded-full shadow-lg"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-5 w-5" />
          <span className="sr-only">Наверх</span>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
