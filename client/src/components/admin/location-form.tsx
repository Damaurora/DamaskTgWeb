import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Location, InsertLocation, insertLocationSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Расширяем схему для валидации формы
const locationFormSchema = insertLocationSchema.extend({
  workHours: z.string().min(1, "Часы работы обязательны"),
  phone: z.string().min(1, "Телефон обязателен"),
});

type LocationFormValues = z.infer<typeof locationFormSchema>;

type LocationFormProps = {
  location?: Location;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function LocationForm({ location, onSuccess, onCancel }: LocationFormProps) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Устанавливаем начальные значения формы
  const defaultValues: Partial<LocationFormValues> = {
    name: location?.name || "",
    address: location?.address || "",
    phone: location?.phone || "",
    workHours: location?.workHours || "",
    mapLink: location?.mapLink || "",
  };

  // Инициализируем форму
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Мутация для создания нового магазина
  const createMutation = useMutation({
    mutationFn: async (data: LocationFormValues) => {
      const response = await apiRequest("POST", "/api/locations", data);
      return await response.json();
    },
    onSuccess: (newLocation: Location) => {
      toast({
        title: "Успешно!",
        description: `Магазин "${newLocation.name}" успешно создан`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка!",
        description: `Не удалось создать магазин: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Мутация для обновления существующего магазина
  const updateMutation = useMutation({
    mutationFn: async (data: LocationFormValues) => {
      const response = await apiRequest(
        "PUT",
        `/api/locations/${location?.id}`,
        data
      );
      return await response.json();
    },
    onSuccess: (updatedLocation: Location) => {
      toast({
        title: "Успешно!",
        description: `Магазин "${updatedLocation.name}" успешно обновлен`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка!",
        description: `Не удалось обновить магазин: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Мутация для удаления магазина
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!location?.id) return;
      await apiRequest("DELETE", `/api/locations/${location.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Успешно!",
        description: `Магазин "${location?.name}" успешно удален`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка!",
        description: `Не удалось удалить магазин: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Обработчик отправки формы
  const onSubmit = (data: LocationFormValues) => {
    if (location) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // Обработчик удаления
  const handleDelete = () => {
    setDeleteDialogOpen(false);
    deleteMutation.mutate();
  };

  // Вычисляем состояние загрузки
  const isLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{location ? `Редактирование магазина: ${location.name}` : "Новый магазин"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Название магазина */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название магазина</FormLabel>
                  <FormControl>
                    <Input placeholder="Гагарина" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Адрес */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес</FormLabel>
                  <FormControl>
                    <Input placeholder="ул. Гагарина, 32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Телефон */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="+7 (999) 123-45-67" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Часы работы */}
            <FormField
              control={form.control}
              name="workHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Часы работы</FormLabel>
                  <FormControl>
                    <Input placeholder="Пн-Пт: 10:00 - 20:00, Сб-Вс: 10:00 - 18:00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ссылка на карту */}
            <FormField
              control={form.control}
              name="mapLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ссылка на карту</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yandex.ru/maps/-/123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <div>
              {location && (
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Удалить
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удалить магазин?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Вы уверены, что хотите удалить магазин "{location.name}"? Это действие необратимо.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {location ? "Сохранить" : "Создать"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}