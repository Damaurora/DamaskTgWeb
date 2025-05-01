import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Location } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Clock, ExternalLink, Edit2, Plus, Loader2 } from "lucide-react";
import LocationForm from "./location-form";

export default function LocationManagement() {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Получаем все магазины
  const { data: locations, isLoading } = useQuery({
    queryKey: ["/api/locations"],
  });

  // Обработчик создания нового магазина
  const handleCreateLocation = () => {
    setSelectedLocation(null);
    setActiveTab("edit");
  };

  // Обработчик редактирования существующего магазина
  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setActiveTab("edit");
  };

  // Обработчик возврата к списку магазинов
  const handleBackToList = () => {
    setSelectedLocation(null);
    setActiveTab("list");
  };

  // Отображение списка магазинов
  const renderLocationList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!locations || locations.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Магазины отсутствуют</p>
          <Button onClick={handleCreateLocation}>
            <Plus className="mr-2 h-4 w-4" />
            Создать магазин
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-end mb-4">
          <Button onClick={handleCreateLocation}>
            <Plus className="mr-2 h-4 w-4" />
            Создать магазин
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((location: Location) => (
            <Card key={location.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl">{location.name}</h3>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEditLocation(location)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Изменить
                  </Button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-primary" />
                    <p>{location.address}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-1 text-primary" />
                    <p>{location.phone}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 mr-2 mt-1 text-primary" />
                    <p>{location.hours}</p>
                  </div>
                  
                  {location.mapLink && (
                    <div className="flex items-center mt-4">
                      <a 
                        href={location.mapLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary flex items-center hover:underline"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Открыть на карте
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="list">Список магазинов</TabsTrigger>
        <TabsTrigger value="edit">{selectedLocation ? "Редактирование магазина" : "Новый магазин"}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list" className="mt-4">
        {renderLocationList()}
      </TabsContent>
      
      <TabsContent value="edit" className="mt-4">
        <LocationForm 
          location={selectedLocation || undefined} 
          onSuccess={handleBackToList} 
          onCancel={handleBackToList} 
        />
      </TabsContent>
    </Tabs>
  );
}