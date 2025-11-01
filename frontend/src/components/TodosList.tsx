import type { TodoModel } from "@/models/TodoModel";
import TodoCard from "./TodoCard";

interface TodosListProps {
  todos: TodoModel[];
  handleDelete: (index: number) => void;
  handleEdit: (index: number, todo: TodoModel) => void;
}

const TodosList = ({ todos, handleDelete, handleEdit }: TodosListProps) => {
  return (
    <div>
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
    </div>
  );
};

export default TodosList;
