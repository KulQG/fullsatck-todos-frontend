import type { FC } from "react";
import { useForm } from "react-hook-form";
import type { ITodo } from "../../types/types";
import styles from "./EditCardContent.module.css";

type TodoForm = Pick<ITodo, "title" | "description">;

interface EditTodoFormProps {
  submitFn: (data: TodoForm) => void;
  defaultValues?: TodoForm;
}

export const EditTodoForm: FC<EditTodoFormProps> = ({ submitFn, defaultValues }) => {
  const form = useForm<TodoForm>({ defaultValues });

  const submit = form.handleSubmit(submitFn);

  return (
    <form onSubmit={submit}>
      <div className={styles["form-content"]}>
        <input {...form.register("title")} type="text" placeholder="Название" />
        <textarea {...form.register("description")} />
        <button type="submit">Сохранить</button>
      </div>
    </form>
  );
};
