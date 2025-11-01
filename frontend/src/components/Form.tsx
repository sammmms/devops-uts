import type { TodoModel } from "@/models/TodoModel";
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
    <div className="Form">
      <input
        type="text"
        name="title"
        value={todo.name}
        onChange={handleInputChange}
        placeholder="Todo Title"
      />

      <input
        type="text"
        name="description"
        value={todo.description}
        onChange={handleInputChange}
        placeholder="Todo Description"
      />

      <input
        type="date"
        name="deadline"
        value={todo.deadline ? todo.deadline.toISOString().split("T")[0] : ""}
        onChange={(e) =>
          setTodo({ ...todo, deadline: new Date(e.target.value) })
        }
        placeholder="Todo Deadline"
      />

      <button onClick={() => handleSubmit(todo)}></button>
    </div>
  );
};

export default Form;
