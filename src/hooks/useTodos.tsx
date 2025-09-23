import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";
import type { ITodo } from "../types/types";
import { useModalStore } from "./useModalStore";
import type { CreateTodoRequest } from "../api/api.types";
import { EditTodoForm } from "../components/EditCardContent/EditCardContent";
import { ALL_TABS, TABS } from "../constants";

const QUERY_TODOS_KEY = 'todos'

export const useTodos = ({ currentTab }: { currentTab: TABS }) => {
  const { openModal, closeModal } = useModalStore();
  const queryClient = useQueryClient();

  // === GET ===
  const { data: todosData, isLoading: todosLoading } = useQuery({
    queryKey: [QUERY_TODOS_KEY, currentTab],
    queryFn: () =>
      api.getTodos(
        currentTab !== TABS.ALL
          ? { completed: currentTab === TABS.DONE }
          : undefined
      ),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  // === CREATE ===
  const { mutate: createTodo } = useMutation({
    mutationFn: (todoData: CreateTodoRequest) => api.createTodo(todoData),
    onSuccess: (newTodo) => {
      queryClient.setQueryData<ITodo[]>([QUERY_TODOS_KEY, TABS.ALL], (old = []) => [
        newTodo,
        ...old,
      ]);
      queryClient.setQueryData<ITodo[]>([QUERY_TODOS_KEY, newTodo.completed ? TABS.DONE : TABS.UNDONE], (old = []) => [
        newTodo,
        ...old,
      ]);
    },
  });

  // === UPDATE ===
  const { mutate: editTodo } = useMutation({
    mutationFn: (todoData: ITodo) =>
      api.updateTodo(todoData.id, {
        title: todoData.title,
        description: todoData.description,
        completed: todoData.completed,
      }),
    onMutate: async (updatedTodo) => {
      const prevData = {} as Record<TABS, ITodo[] | undefined>;

      for (const tab of ALL_TABS) {
        await queryClient.cancelQueries({ queryKey: [QUERY_TODOS_KEY, tab] });
        prevData[tab] = queryClient.getQueryData<ITodo[]>([QUERY_TODOS_KEY, tab]);
        queryClient.setQueryData<ITodo[]>([QUERY_TODOS_KEY, tab], (old = []) =>
          old.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
        );
      }

      return { prevData };
    },
    onError: (_err, _todo, context) => {
      if (context?.prevData) {
        for (const tab of Object.keys(context.prevData) as TABS[]) {
          queryClient.setQueryData([QUERY_TODOS_KEY, tab], context.prevData[tab]);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_TODOS_KEY] });
    },
  });

  // === DELETE ===
  const { mutate: deleteTodo } = useMutation({
    mutationFn: (todoId: number) => api.deleteTodo(todoId),
    onMutate: async (todoId) => {
      const prevData = {} as Record<TABS, ITodo[] | undefined>;

      for (const tab of ALL_TABS) {
        await queryClient.cancelQueries({ queryKey: [QUERY_TODOS_KEY, tab] });
        prevData[tab] = queryClient.getQueryData<ITodo[]>([QUERY_TODOS_KEY, tab]);
        queryClient.setQueryData<ITodo[]>([QUERY_TODOS_KEY, tab], (old = []) =>
          old.filter((t) => t.id !== todoId)
        );
      }

      return { prevData };
    },
    onError: (_err, _id, context) => {
      if (context?.prevData) {
        for (const tab of Object.keys(context.prevData) as TABS[]) {
          queryClient.setQueryData([QUERY_TODOS_KEY, tab], context.prevData[tab]);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_TODOS_KEY] });
    },
  });

  // === Handlers ===
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
