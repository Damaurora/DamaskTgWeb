import { Location } from "@shared/schema";
import { Phone, MapPin } from "lucide-react";

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="bg-[hsl(var(--light-bg))] rounded-xl overflow-hidden">
      <img 
        src={location.imageUrl} 
        alt={`Магазин на ${location.name}`} 
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-lg font-medium mb-2">{location.address}</h3>
        <p className="text-sm text-gray-300 mb-4 whitespace-pre-line">
          {location.hours}
        </p>
        <div className="flex space-x-3">
          <a 
            href={`tel:${location.phone}`} 
            className="flex items-center text-primary hover:text-accent"
          >
            <Phone className="h-4 w-4 mr-1" />
            <span className="text-sm">Позвонить</span>
          </a>
          <a 
            href={`https://maps.google.com/maps?q=${encodeURIComponent(location.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary hover:text-accent"
          >
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">Маршрут</span>
          </a>
        </div>
      </div>
    </div>
  );
}
