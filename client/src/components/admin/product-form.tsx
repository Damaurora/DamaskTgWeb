import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Product, InsertProduct, insertProductSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Расширяем схему для валидации формы
const productFormSchema = insertProductSchema.extend({
  categoryId: z.coerce.number().min(1, "Категория обязательна"),
  availabilityGagarina: z.boolean().default(false),
  availabilityPobedy: z.boolean().default(false),
  features: z.any().optional()
});

type ProductFormValues = z.infer<typeof productFormSchema>;

type ProductFormProps = {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Получаем список категорий
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Устанавливаем начальные значения формы
  const defaultValues: Partial<ProductFormValues> = {
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    fullDescription: product?.fullDescription || null,
    imageUrl: product?.imageUrl || "",
    categoryId: product?.categoryId || 0,
    availabilityGagarina: product?.availabilityGagarina || false,
    availabilityPobedy: product?.availabilityPobedy || false,
    isNew: product?.isNew || false,
    isTop: product?.isTop || false,
    isRecommended: product?.isRecommended || false,
    expectedDelivery: product?.expectedDelivery || "",
    features: product?.features || {}
  };

  // Инициализируем форму
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Мутация для создания нового товара
  const createMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const response = await apiRequest("POST", "/api/products", data);
      return await response.json();
    },
    onSuccess: (newProduct: Product) => {
      toast({
        title: "Успешно!",
        description: `Товар "${newProduct.name}" успешно создан`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка!",
        description: `Не удалось создать товар: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Мутация для обновления существующего товара
  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const response = await apiRequest(
        "PUT",
        `/api/products/${product?.id}`,
        data
      );
      return await response.json();
    },
    onSuccess: (updatedProduct: Product) => {
      toast({
        title: "Успешно!",
        description: `Товар "${updatedProduct.name}" успешно обновлен`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка!",
        description: `Не удалось обновить товар: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Мутация для удаления товара
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!product?.id) return;
      await apiRequest("DELETE", `/api/products/${product.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Успешно!",
        description: `Товар "${product?.name}" успешно удален`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка!",
        description: `Не удалось удалить товар: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Обработчик отправки формы
  const onSubmit = (data: ProductFormValues) => {
    if (product) {
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
        <CardTitle>{product ? `Редактирование товара: ${product.name}` : "Новый товар"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Название товара */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название товара</FormLabel>
                    <FormControl>
                      <Input placeholder="SMOK Nord 4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL-адрес (slug)</FormLabel>
                    <FormControl>
                      <Input placeholder="smok-nord-4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Категория */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category: any) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Краткое описание */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Краткое описание</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Компактная под-система с мощным аккумулятором" 
                      rows={2}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Полное описание */}
            <FormField
              control={form.control}
              name="fullDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Полное описание (необязательно)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Подробное описание товара..." 
                      rows={5}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL изображения */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL изображения</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Наличие в магазинах */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Наличие в магазинах</h3>
                
                <FormField
                  control={form.control}
                  name="availabilityGagarina"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0 p-2 border rounded-md">
                      <FormLabel className="cursor-pointer">ул. Гагарина, 32</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="availabilityPobedy"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0 p-2 border rounded-md">
                      <FormLabel className="cursor-pointer">ул. Победы, 7</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Метки и статусы */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Метки товара</h3>
                
                <FormField
                  control={form.control}
                  name="isNew"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-md">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Новинка</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isTop"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-md">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">ТОП продаж</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isRecommended"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-md">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Рекомендуемый</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Ожидаемая поставка */}
            <FormField
              control={form.control}
              name="expectedDelivery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ожидаемая поставка (если нет в наличии)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Например: 15 мая 2024" 
                      value={field.value || ""} 
                      onChange={(e) => field.onChange(e.target.value)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <div>
              {product && (
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Удалить
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Вы уверены, что хотите удалить товар "{product.name}"? Это действие необратимо.
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
                {product ? "Сохранить" : "Создать"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}