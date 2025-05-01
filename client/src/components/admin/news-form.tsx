import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { News, InsertNews, insertNewsSchema } from "@shared/schema";
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
const newsFormSchema = insertNewsSchema.extend({
  date: z.string().min(1, "Дата обязательна"),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

type NewsFormProps = {
  news?: News;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function NewsForm({ news, onSuccess, onCancel }: NewsFormProps) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Конвертируем дату в формат YYYY-MM-DD для input type="date"
  const formatDateForInput = (dateStr: string | undefined): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };
  
  // Устанавливаем начальные значения формы
  const defaultValues: Partial<NewsFormValues> = {
    title: news?.title || "",
    content: news?.content || "",
    imageUrl: news?.imageUrl || "",
    date: formatDateForInput(news?.date) || formatDateForInput(new Date().toISOString()),
  };

  // Инициализируем форму
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Мутация для создания новой новости
  const createMutation = useMutation({
    mutationFn: async (data: NewsFormValues) => {
      const response = await apiRequest("POST", "/api/news", data);
      return await response.json();
    },
    onSuccess: (newNews: News) => {
      toast({
        title: "Успешно!",
        description: `Новость "${newNews.title}" успешно создана`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка!",
        description: `Не удалось создать новость: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Мутация для обновления существующей новости
  const updateMutation = useMutation({
    mutationFn: async (data: NewsFormValues) => {
      const response = await apiRequest(
        "PUT",
        `/api/news/${news?.id}`,
        data
      );
      return await response.json();
    },
    onSuccess: (updatedNews: News) => {
      toast({
        title: "Успешно!",
        description: `Новость "${updatedNews.title}" успешно обновлена`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка!",
        description: `Не удалось обновить новость: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Мутация для удаления новости
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!news?.id) return;
      await apiRequest("DELETE", `/api/news/${news.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Успешно!",
        description: `Новость "${news?.title}" успешно удалена`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка!",
        description: `Не удалось удалить новость: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Обработчик отправки формы
  const onSubmit = (data: NewsFormValues) => {
    if (news) {
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
        <CardTitle>{news ? `Редактирование новости: ${news.title}` : "Новая новость"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Заголовок новости */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заголовок новости</FormLabel>
                  <FormControl>
                    <Input placeholder="Новая коллекция подов уже в магазине!" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Содержимое новости */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Содержимое новости</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Подробное описание новости..." 
                      rows={5}
                      {...field} 
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

            {/* Дата публикации */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата публикации</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <div>
              {news && (
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Удалить
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удалить новость?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Вы уверены, что хотите удалить новость "{news.title}"? Это действие необратимо.
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
                {news ? "Сохранить" : "Создать"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}