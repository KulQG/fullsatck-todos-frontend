import type { ITodo } from "../types/types";
import type {
  CreateTodoRequest,
  GetTodoOptions,
  UpdateTodoRequest,
} from "./api.types";

class Api {
  baseUrl: string;
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_ADDRESS || "http://localhost:3002/api";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  private buildQueryString(params?: Record<string, unknown>): string {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }

  async getTodos(params?: GetTodoOptions): Promise<ITodo[]> {
    const queryString = params
      ? this.buildQueryString(params as Record<string, boolean>)
      : "";
    return this.request<ITodo[]>(`/todos${queryString}`);
  }

  async createTodo(todoData: CreateTodoRequest) {
    return this.request<ITodo>("/todos", {
      method: "POST",
      body: JSON.stringify(todoData),
    });
  }

  async updateTodo(id: number, todoData: UpdateTodoRequest) {
    return this.request<ITodo>(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(todoData),
    });
  }

  async deleteTodo(id: number) {
    return this.request<{ message: string }>(`/todos/${id}`, {
      method: "DELETE",
    });
  }
}

export const api = new Api();
