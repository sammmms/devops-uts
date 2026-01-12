import type { TodoModel } from "@/models/TodoModel";
import TodoCard from "./TodoCard";
import { AnimatePresence } from "motion/react";

interface TodosListProps {
  todos: TodoModel[];
  handleDelete: (index: number) => void;
  handleEdit: (index: number, todo: TodoModel) => void;
  handleToggleComplete: (todo: TodoModel) => void;
}

const TodosList = ({
  todos,
  handleDelete,
  handleEdit,
  handleToggleComplete,
}: TodosListProps) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {todos.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            No tasks found in this category.
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {todos.map((todo, index) => (
            <TodoCard
              key={todo.id || index}
              todo={todo}
              handleDelete={() => handleDelete(index)}
              handleEdit={() => handleEdit(index, todo)}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default TodosList;
