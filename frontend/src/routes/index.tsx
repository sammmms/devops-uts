import { createFileRoute } from "@tanstack/react-router";
import { Form, TodosList } from "@/components";
import { useState } from "react";
import type { TodoModel } from "@/models/TodoModel";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<TodoModel | undefined>(
    undefined
  );

  const handleOnAddTodo = (todo: TodoModel) => {};

  const handleOnEditTodo = (todo: TodoModel) => {};

  const handleDelete = (index: number) => {};

  const handleEdit = (index: number, todo: TodoModel) => {};

  return (
    <div className="App">
      <Form
        handleSubmit={(todo) =>
          selectedTodo === undefined
            ? handleOnAddTodo(todo)
            : handleOnEditTodo(todo)
        }
      />

      {todos.length === 0 ? (
        <div className="alert alert-success mt-2" role="alert">
          No Todos Available.
        </div>
      ) : (
        <TodosList
          todos={todos}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      )}
    </div>
  );
}
