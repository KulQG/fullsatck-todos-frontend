import { type FC } from "react";
import type { ITodo } from "../../types/types";
import { IconEdit } from "../../icons/IconEdit";
import { TrashIcon } from "../../icons/TrashIcon";

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
    <article className="bg-light-primary rounded-lg shadow-md p-4 border-l-4 border-action hover:shadow-lg transition-shadow duration-200">
      <header className="flex justify-between items-start gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={completed}
            onChange={() =>
              handleToggleComplete({ ...todo, completed: !completed })
            }
            className="w-5 h-5 text-action rounded focus:ring-action focus:ring-2"
          />

          <h3 className={`text-lg font-semibold truncate text-white`}>
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => handleEditTodo(todo)}
            className="p-2 text-white hover:text-action hover:bg-gray-100 rounded-lg transition-colors duration-150 cursor-pointer"
            title="Редактировать"
          >
            <IconEdit />
          </button>

          <button
            onClick={() => handleDeleteTodo(todo)}
            className="p-2 text-white hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors duration-150 cursor-pointer"
            title="Удалить"
          >
            <TrashIcon />
          </button>
        </div>
      </header>

      <main className={`pl-8 text-white`}>
        {description && (
          <p className="whitespace-pre-wrap break-words">{description}</p>
        )}
      </main>
    </article>
  );
};
