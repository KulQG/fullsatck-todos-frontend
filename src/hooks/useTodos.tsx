import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";
import type { ITodo } from "../types/types";
import { useModalStore } from "./useModalStore";
import type { CreateTodoRequest } from "../api/api.types";
import { EditTodoForm } from "../components/EditCardContent/EditCardContent";
import { TABS } from "../constants";

export const useTodos = ({ currentTab }: { currentTab: TABS }) => {
  const { openModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const { data: todosData, isLoading: todosLoading } = useQuery({
    queryKey: ["todos", currentTab],
    queryFn: async () =>
      api.getTodos(
        currentTab !== TABS.ALL
          ? { completed: currentTab === TABS.DONE }
          : undefined
      ),
  });

  const { mutate: createTodo } = useMutation({
    mutationKey: ["createTodo"],
    mutationFn: (todoData: CreateTodoRequest) => api.createTodo(todoData),
    onSuccess: (newTodo) => {
      queryClient.setQueryData<ITodo[]>(["todos", TABS.ALL], (old = []) => [
        newTodo,
        ...old,
      ]);

      if (newTodo.completed) {
        queryClient.setQueryData<ITodo[]>(["todos", TABS.DONE], (old = []) => [
          newTodo,
          ...old,
        ]);
      } else {
        queryClient.setQueryData<ITodo[]>(
          ["todos", TABS.UNDONE],
          (old = []) => [newTodo, ...old]
        );
      }
    },
  });

  const { mutate: editTodo } = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: (todoData: ITodo) =>
      api.updateTodo(todoData.id, {
        title: todoData.title,
        description: todoData.description,
        completed: todoData.completed,
      }),
    onMutate: async (updatedTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const prevTodos = queryClient.getQueryData<ITodo[]>(["todos"]);

      queryClient.setQueryData<ITodo[]>(["todos"], (old = []) =>
        old.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
      );

      return { prevTodos };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.prevTodos) {
        queryClient.setQueryData(["todos"], context.prevTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { mutate: deleteTodo } = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: (todoId: number) => api.deleteTodo(todoId),
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const prevTodos = queryClient.getQueryData<ITodo[]>(["todos"]);

      queryClient.setQueryData<ITodo[]>(["todos"], (old = []) =>
        old.filter((t) => t.id !== todoId)
      );

      return { prevTodos };
    },
    onError: (_err, _id, context) => {
      if (context?.prevTodos) {
        queryClient.setQueryData(["todos"], context.prevTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleCreateTodo = useCallback(() => {
    openModal({
      title: "Создание новой карточки",
      content: (
        <EditTodoForm
          submitFn={(data) => {
            createTodo(data);
            closeModal();
          }}
        />
      ),
    });
  }, [closeModal, createTodo, openModal]);

  const handleEditTodo = useCallback(
    (data: ITodo) => {
      openModal({
        title: "Редактирование карточки",
        content: (
          <EditTodoForm
            submitFn={(formData) => {
              editTodo({ ...data, ...formData });
              closeModal();
            }}
            defaultValues={{ title: data.title, description: data.description }}
          />
        ),
      });
    },
    [closeModal, editTodo, openModal]
  );

  const handleDeleteTodo = useCallback(
    (todo: ITodo) => {
      openModal({
        title: `Удалить задачу ${todo.title}?`,
        content: (
          <div>
            <button onClick={closeModal}>Отмена</button>
            <button
              onClick={() => {
                deleteTodo(todo.id);
                closeModal();
              }}
            >
              Удалить
            </button>
          </div>
        ),
      });
    },
    [closeModal, deleteTodo, openModal]
  );

  const handleToggleCompleteTodo = useCallback(
    (todo: ITodo) => {
      editTodo(todo);
    },
    [editTodo]
  );

  return {
    todosData,
    isLoading: todosLoading,
    handleCreateTodo,
    handleEditTodo,
    handleDeleteTodo,
    handleToggleCompleteTodo,
  };
};
