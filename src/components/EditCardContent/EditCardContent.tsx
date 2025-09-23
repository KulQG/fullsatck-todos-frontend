import type { FC } from "react";
import { useForm } from "react-hook-form";
import type { ITodo } from "../../types/types";

type TodoForm = Pick<ITodo, "title" | "description">;

interface EditTodoFormProps {
  submitFn: (data: TodoForm) => void;
  defaultValues?: TodoForm;
}

export const EditTodoForm: FC<EditTodoFormProps> = ({
  submitFn,
  defaultValues,
}) => {
  const form = useForm<TodoForm>({ defaultValues });

  const submit = form.handleSubmit(submitFn);

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <input
        {...form.register("title")}
        type="text"
        placeholder="Название"
        className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-bg-default text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <textarea
        {...form.register("description")}
        placeholder="Описание"
        className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-bg-default text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none h-32"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-action text-white rounded-lg font-semibold hover:bg-[#c34195] transition-colors cursor-pointer "
      >
        Сохранить
      </button>
    </form>
  );
};
