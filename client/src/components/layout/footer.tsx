import { useState } from "react";
import { Link, useLocation } from "wouter";
import FireLogo from "@/components/ui/fire-logo";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Footer() {
  const { data: locations } = useQuery({
    queryKey: ["/api/locations"],
  });
  
  const [clickCount, setClickCount] = useState(0);
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  // Обработчик для скрытой кнопки администратора
  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5) {
      setClickCount(0);
      navigate("/auth");
    }
  };
  
  // Выход из панели администратора
  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/");
  };

  return (
    <footer className="bg-black py-10 px-4" id="contacts">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <FireLogo className="w-8 h-8 mr-2" onClick={handleSecretClick} />
              <h3 className="text-xl font-unbounded font-bold text-white">
                <span className="text-primary">DAMASK</span> SHOP
              </h3>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Премиальный магазин вейп товаров с широким ассортиментом и профессиональной консультацией.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">О магазине</h4>
            <ul className="text-gray-400 space-y-2">
              <li>
                <Link 
                  href="/"
                  className="hover:text-primary"
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link 
                  href="/#products"
                  className="hover:text-primary"
                >
                  Товары
                </Link>
              </li>
              <li>
                <Link 
                  href="/#locations"
                  className="hover:text-primary"
                >
                  Магазины
                </Link>
              </li>
              <li>
                <Link 
                  href="/#contacts"
                  className="hover:text-primary"
                >
                  Контакты
                </Link>
              </li>
              {user && (
                <li>
                  <Link 
                    href="/admin"
                    className="hover:text-primary"
                  >
                    Админ-панель
                  </Link>
                </li>
              )}
              {user && (
                <li>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-primary bg-transparent border-none p-0 cursor-pointer"
                  >
                    Выйти
                  </button>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Контакты</h4>
            <ul className="text-gray-400 space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mt-1 mr-2" />
                <span>
                  {locations?.map((loc: any) => loc.address).join("\n")}
                </span>
              </li>
              {locations?.[0] && (
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-2" />
                  <a href={`tel:${locations[0].phone}`} className="hover:text-primary">
                    {locations[0].phone}
                  </a>
                </li>
              )}
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <a href="mailto:info@damaskshop.ru" className="hover:text-primary">
                  info@damaskshop.ru
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Damask Shop. Все права защищены.</p>
          <p className="mt-2">Продукция предназначена только для совершеннолетних потребителей.</p>
        </div>
      </div>
    </footer>
  );
}
