import { type FC } from "react";
import type { ITodo } from "../../types/types";
import { IconEdit } from "../../icons/IconEdit";
import { TrashIcon } from "../../icons/TrashIcon";
import styles from "./TodoCard.module.css";

interface TodoCardProps {
  todo: ITodo;
  handleEditTodo: (todo: ITodo) => void;
  handleDeleteTodo: (todo: ITodo) => void;
  handleToggleComplete: (todo: ITodo) => void;
}

export const TodoCard: FC<TodoCardProps> = ({
  todo,
  handleDeleteTodo,
  handleEditTodo,
  handleToggleComplete,
}) => {
  const { description, title, completed } = todo;

  return (
    <article className={styles["todo-card"]}>
      <header>
        <h3>{title}</h3>

        <div className={styles.buttons}>
          <button
            className={styles.buttons}
            onClick={() => handleEditTodo(todo)}
          >
            <IconEdit />
          </button>
          <button onClick={() => handleDeleteTodo(todo)}>
            <TrashIcon />
          </button>

          <input
            type="checkbox"
            checked={completed}
            onClick={() => handleToggleComplete({ ...todo, completed: !completed })}
          />
        </div>
      </header>

      <main>{description}</main>
    </article>
  );
};
