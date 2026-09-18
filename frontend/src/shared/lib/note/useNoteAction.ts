import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleNotePin as toggleNotePinApi } from "@/entities/note/api/notes"; // Переименовали импорт, чтобы избежать конфликта

export function useToggleNotePin() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (noteId: string) => {
      if (!noteId) {
        throw new Error("Заметка не выбрана");
      }
      return toggleNotePinApi(noteId); // Вызываем функцию из API
    },
    onSuccess: async () => {
      // Инвалидируем кэш, чтобы UI мгновенно обновился
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notes"] }),
        queryClient.invalidateQueries({ queryKey: ["notes-count"] }),
      ]);
    },
    onError: (error) => {
      // Здесь лучше использовать глобальный toast-нотификатор, если он у вас есть
      console.error(
        error instanceof Error
          ? error.message
          : "Не удалось изменить статус закрепления",
      );
    },
  });

  // Возвращаем метод mutate и статус загрузки наружу
  return {
    togglePin: mutation.mutate,
    isPending: mutation.isPending,
  };
}
