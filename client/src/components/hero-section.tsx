import { motion } from "framer-motion";
import { getRandomInteriorImage } from "@/lib/images";

export default function HeroSection() {
  const heroImage = getRandomInteriorImage();
  
  return (
    <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      <img 
        src={heroImage}
        alt="Vape Shop Interior" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <motion.div 
        className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-unbounded font-bold mb-2">
          <span className="text-primary">DAMASK</span> SHOP
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-lg">
          Премиальные вейп товары в Москве
        </p>
        <motion.button 
          className="px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-accent transition-colors neon-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const productsElement = document.getElementById('products');
            if (productsElement) {
              productsElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Смотреть каталог
        </motion.button>
      </motion.div>
    </section>
  );
}
