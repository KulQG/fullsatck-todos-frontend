import type { ITodo } from "../types/types";

export type CreateTodoRequest = Pick<ITodo, "title" | "description">;
export type UpdateTodoRequest = Pick<
  ITodo,
  "title" | "description" | "completed"
>;
export interface GetTodoOptions {
  completed?: ITodo["completed"];
}
