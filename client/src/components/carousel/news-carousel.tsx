import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { News } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });
  
  // Scroll to next item every 5 seconds
  useEffect(() => {
    if (!containerRef.current || !news?.length) return;
    
    const container = containerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    // Calculate item width (including gap)
    const itemWidth = scrollWidth / news.length;
    
    let currentIndex = 0;
    let intervalId: NodeJS.Timeout | null = null;
    
    const scrollToNext = () => {
      if (!containerRef.current) return;
      
      currentIndex = (currentIndex + 1) % news.length;
      const nextScrollPosition = itemWidth * currentIndex;
      
      containerRef.current.scrollTo({
        left: nextScrollPosition,
        behavior: 'smooth'
      });
    };
    
    // Start interval after delay
    const intervalId2 = setInterval(scrollToNext, 5000);
    
    // Pause on mouse enter
    const handleInteraction = () => {
      clearInterval(intervalId2);
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
    
    // Resume on mouse leave
    const handleEndInteraction = () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      intervalId = setInterval(scrollToNext, 5000);
    };
    
    container.addEventListener('mouseenter', handleInteraction);
    container.addEventListener('touchstart', handleInteraction);
    container.addEventListener('mouseleave', handleEndInteraction);
    container.addEventListener('touchend', handleEndInteraction);
    
    return () => {
      clearInterval(intervalId2);
      if (intervalId) clearInterval(intervalId);
      container.removeEventListener('mouseenter', handleInteraction);
      container.removeEventListener('touchstart', handleInteraction);
      container.removeEventListener('mouseleave', handleEndInteraction);
      container.removeEventListener('touchend', handleEndInteraction);
    };
  }, [news]);
  
  if (isLoading) {
    return (
      <section className="py-8 px-4">
        <h2 className="text-xl font-unbounded font-bold mb-4">Новости и акции</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="flex-shrink-0 w-[90%] md:w-[45%] lg:w-[30%] bg-[hsl(var(--light-bg))] rounded-xl overflow-hidden"
            >
              <Skeleton className="w-full h-40" />
              <div className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  if (!news?.length) return null;
  
  return (
    <section className="py-8 px-4">
      <h2 className="text-xl font-unbounded font-bold mb-4">Новости и акции</h2>
      
      <div 
        ref={containerRef}
        className="news-carousel flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {news.map((item) => (
          <motion.div
            key={item.id}
            className="snap-start flex-shrink-0 w-[90%] md:w-[45%] lg:w-[30%] bg-[hsl(var(--light-bg))] rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <span className="text-xs text-primary font-medium">{item.date}</span>
              <h3 className="text-lg font-medium mt-1">{item.title}</h3>
              <p className="text-sm text-gray-300 mt-2">{item.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
