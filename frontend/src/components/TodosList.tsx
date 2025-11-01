import type { TodoModel } from "@/models/TodoModel";
import TodoCard from "./TodoCard";

interface TodosListProps {
  todos: TodoModel[];
  handleDelete: (index: number) => void;
  handleEdit: (index: number, todo: TodoModel) => void;
}

const TodosList = ({ todos, handleDelete, handleEdit }: TodosListProps) => {
  return (
    <div className="w-full flex flex-col gap-4 max-w-md">
      {todos.map((item, index) => {
        return (
          <TodoCard
            key={index}
            todo={item}
            handleEdit={() => handleEdit(index, item)}
            handleDelete={() => handleDelete(index)}
          />
        );
      })}

      {todos.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No todos available.</p>
      )}
    </div>
  );
};

export default TodosList;
