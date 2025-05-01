import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Category, InsertCategory, insertCategorySchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Расширяем схему для валидации формы
const categoryFormSchema = insertCategorySchema;

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

type CategoryFormProps = {
  category?: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Устанавливаем начальные значения формы
  const defaultValues: Partial<CategoryFormValues> = {
    name: category?.name || "",
    slug: category?.slug || "",
    icon: category?.icon || "",
  };

  // Инициализируем форму
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Мутация для создания новой категории
  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const response = await apiRequest("POST", "/api/categories", data);
      return await response.json();
    },
    onSuccess: (newCategory: Category) => {
      toast({
        title: "Успешно!",
        description: `Категория "${newCategory.name}" успешно создана`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка!",
        description: `Не удалось создать категорию: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Мутация для обновления существующей категории
  const updateMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const response = await apiRequest(
        "PUT",
        `/api/categories/${category?.id}`,
        data
      );
      return await response.json();
    },
    onSuccess: (updatedCategory: Category) => {
      toast({
        title: "Успешно!",
        description: `Категория "${updatedCategory.name}" успешно обновлена`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка!",
        description: `Не удалось обновить категорию: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Мутация для удаления категории
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!category?.id) return;
      await apiRequest("DELETE", `/api/categories/${category.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Успешно!",
        description: `Категория "${category?.name}" успешно удалена`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка!",
        description: `Не удалось удалить категорию: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Обработчик отправки формы
  const onSubmit = (data: CategoryFormValues) => {
    if (category) {
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
        <CardTitle>{category ? `Редактирование категории: ${category.name}` : "Новая категория"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Название категории */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название категории</FormLabel>
                  <FormControl>
                    <Input placeholder="Поды" {...field} />
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
                    <Input placeholder="pods" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Иконка */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Иконка (название иконки из Lucide React)</FormLabel>
                  <FormControl>
                    <Input placeholder="crown" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <div>
              {category && (
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Удалить
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Вы уверены, что хотите удалить категорию "{category.name}"? Это действие необратимо и будут удалены все товары в этой категории.
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
                {category ? "Сохранить" : "Создать"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}