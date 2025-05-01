import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите ваш email",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Успешно!",
        description: "Вы успешно подписались на нашу рассылку",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <section className="py-12 px-4">
      <motion.div 
        className="max-w-lg mx-auto bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-unbounded font-bold mb-4">Будьте в курсе новинок</h2>
        <p className="text-gray-300 mb-6">
          Подпишитесь на рассылку, чтобы первыми узнавать о новых поступлениях и акциях
        </p>
        
        <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow px-4 py-3 rounded-lg bg-background border border-gray-700 text-white focus:outline-none focus:border-primary"
          />
          <Button 
            type="submit"
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-accent transition-colors whitespace-nowrap"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Подписка..." : "Подписаться"}
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
