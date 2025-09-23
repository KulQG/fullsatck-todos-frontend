import { TodoCard } from "../TodoCard/TodoCard";
import { useTodos } from "../../hooks/useTodos";
import { Tabs } from "../Tabs/Tabs";
import { TABS_ARR, TABS } from "../../constants";
import { useState } from "react";

function App() {
  const [currenFilter, setCurrentFilter] = useState(TABS.ALL);

  const {
    todosData,
    isLoading,
    handleCreateTodo,
    handleDeleteTodo,
    handleEditTodo,
    handleToggleCompleteTodo,
  } = useTodos({ currentTab: currenFilter });

  return (
    <main className="min-h-screen bg-bg-default py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Список задач
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <button
            onClick={handleCreateTodo}
            className="bg-action hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-lg cursor-pointer "
          >
            + Создать задачу
          </button>

          <Tabs
            tabs={TABS_ARR}
            defaultTab={currenFilter}
            onChange={(tab) => setCurrentFilter(tab)}
          />
        </div>

        <div className="space-y-3">
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="text-white mt-2">Загрузка...</p>
            </div>
          )}

          {!isLoading &&
            !!todosData?.length &&
            todosData.map((t) => (
              <TodoCard
                todo={t}
                key={t.id}
                handleDeleteTodo={handleDeleteTodo}
                handleEditTodo={handleEditTodo}
                handleToggleComplete={handleToggleCompleteTodo}
              />
            ))}

          {!isLoading && !todosData?.length && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Задачи не найдены</p>
              <p className="text-gray-500 text-sm mt-1">
                Создайте первую задачу или измените фильтр
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
