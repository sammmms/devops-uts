import type { TodoModel } from "@/models/TodoModel";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface FormProps {
  selectedTodo?: TodoModel;
  handleSubmit: (todo: TodoModel) => void;
}

const Form = ({ selectedTodo, handleSubmit }: FormProps) => {
  const [todo, setTodo] = useState<TodoModel>({
    id: 0,
    name: "",
    description: "",
    deadline: undefined,
    completed: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (selectedTodo) {
      setTodo(selectedTodo);
    }
  }, [selectedTodo]);

  return (
    <div className="flex flex-col gap-2 m-4  p-4 border border-gray-200 rounded w-md">
      <h2 className="text-lg font-semibold mb-4">
        {selectedTodo ? "Edit Todo" : "Add Todo"}
      </h2>

      <input
        type="text"
        name="name"
        value={todo.name}
        onChange={handleInputChange}
        className="p-2 border border-gray-300 rounded"
        placeholder="Todo Title"
      />

      <textarea
        name="description"
        value={todo.description}
        onChange={(e) => setTodo({ ...todo, description: e.target.value })}
        className="p-2 border border-gray-300 rounded h-20"
        placeholder="Todo Description"
        rows={4}
      />

      <input
        type="date"
        name="deadline"
        value={todo.deadline ? todo.deadline.toISOString().split("T")[0] : ""}
        onChange={(e) =>
          setTodo({ ...todo, deadline: new Date(e.target.value) })
        }
        className="p-2 border border-gray-300 rounded w-fit"
        placeholder="Todo Deadline"
      />

      <button
        className="ml-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
        onClick={() => handleSubmit(todo)}
      >
        <Plus /> Add Todo
      </button>
    </div>
  );
};

export default Form;
