import { Form, TodosList } from "@/components";
import type { TodoModel } from "@/models/TodoModel";
import axiosInstance from "@/utils/axios_instance";
import { createFileRoute } from "@tanstack/react-router";
import {
  queryOptions,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";

const postQuery = queryOptions({
  queryKey: ["todos"],
  queryFn: async (): Promise<TodoModel[]> => {
    const res = await axiosInstance.get("/todo");
    return res.data.todos;
  },
});

export const Route = createFileRoute("/todos")({
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(postQuery);
  },
  component: TodosPage,
});

function TodosPage() {
  const { data: todos } = useSuspenseQuery(postQuery);
  const queryClient = useQueryClient();
  const [selectedTodo, setSelectedTodo] = useState<TodoModel | undefined>(
    undefined
  );

  const handleOnAddTodo = async (todo: TodoModel) => {
    await axiosInstance.post("/todo", todo);
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  };

  const handleOnEditTodo = async (todo: TodoModel) => {
    if (selectedTodo?.id) {
      await axiosInstance.put(`/todo/${selectedTodo.id}`, todo);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setSelectedTodo(undefined);
    }
  };

  const handleDelete = async (index: number) => {
    const todoToDelete = todos[index];
    if (todoToDelete?.id) {
      await axiosInstance.delete(`/todo/${todoToDelete.id}`);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  };

  const handleEdit = (index: number, _todo: TodoModel) => {
    setSelectedTodo(todos[index]);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 flex flex-col gap-4 items-center ">
      <Form
        handleSubmit={(todo) =>
          selectedTodo === undefined
            ? handleOnAddTodo(todo)
            : handleOnEditTodo(todo)
        }
        selectedTodo={selectedTodo}
      />

      <TodosList
        todos={todos}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </div>
  );
}
