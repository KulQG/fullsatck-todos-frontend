import { create } from "zustand";
import type { ITodo } from "../types/types";

interface TodosStore {
  todoList: ITodo[];
  createNewTodo: (newTodo: ITodo) => void;
  deleteTodo: (id: ITodo["id"]) => void;
  editTodo: (id: ITodo["id"], todo: Omit<ITodo, "id">) => void;
}

export const useTodosStore = create<TodosStore>()((set) => ({
  todoList: [],
  createNewTodo: (newTodo) =>
    set((state) => ({ todoList: [...state.todoList, newTodo] })),
  deleteTodo: (id) =>
    set((state) => ({ todoList: state.todoList.filter((t) => t.id !== id) })),
  editTodo: (id, todo) =>
    set((state) => ({
      todoList: state.todoList.map((t) => {
        if (t.id !== id) return t;
        return { id: t.id, ...todo };
      })
    })),
}));
