import { TodoCard } from "../TodoCard/TodoCard";
import { useTodos } from "../../hooks/useTodos";
import styles from "./App.module.css";
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
    <main className={styles.content}>
      <button onClick={handleCreateTodo}>Создать задачу</button>
      <Tabs
        tabs={TABS_ARR}
        defaultTab={currenFilter}
        onChange={(tab) => setCurrentFilter(tab)}
      />

      <div className={styles.todos}>
        {isLoading && "LOADING"}
        {!!todosData?.length &&
          todosData.map((t) => (
            <TodoCard
              todo={t}
              key={t.id}
              handleDeleteTodo={handleDeleteTodo}
              handleEditTodo={handleEditTodo}
              handleToggleComplete={handleToggleCompleteTodo}
            />
          ))}
      </div>
    </main>
  );
}

export default App;
