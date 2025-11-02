import type { TodoModel } from "@/models/TodoModel";
import type { CategoryModel } from "@/models/CategoryModel";
import axiosInstance from "@/utils/axios_instance";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@radix-ui/react-label";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

interface FormProps {
  selectedTodo?: TodoModel;
  handleSubmit: (todo: TodoModel) => void;
  hideCategory?: boolean;
}

const Form = ({
  selectedTodo,
  handleSubmit,
  hideCategory = false,
}: FormProps) => {
  const [todo, setTodo] = useState<TodoModel>({
    id: 0,
    name: "",
    description: "",
    deadline: "",
    completed: false,
    category_id: undefined,
  });

  // Fetch categories for the dropdown
  const { data: categories = [] } = useQuery<CategoryModel[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/category");
      return res.data.categories;
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setTodo({
      ...todo,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    if (selectedTodo) {
      setTodo(selectedTodo);
    } else {
      // Reset form when selectedTodo is cleared
      setTodo({
        id: 0,
        name: "",
        description: "",
        deadline: "",
        completed: false,
        category_id: undefined,
      });
    }
  }, [selectedTodo]);

  const onSubmit = () => {
    // Clean up the todo data before submitting
    const todoToSubmit = {
      ...todo,
      // Convert empty string to undefined for optional fields
      deadline: todo.deadline?.trim() || undefined,
      description: todo.description?.trim() || undefined,
    };
    handleSubmit(todoToSubmit);
    // Reset form after submit if not editing
    if (!selectedTodo) {
      setTodo({
        id: 0,
        name: "",
        description: "",
        deadline: "",
        completed: false,
        category_id: undefined,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="todo-name"
          className="text-sm font-medium text-gray-700"
        >
          Title
        </Label>
        <input
          id="todo-name"
          type="text"
          name="name"
          value={todo.name}
          onChange={handleInputChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Todo Title"
          required
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="todo-description"
          className="text-sm font-medium text-gray-700"
        >
          Description
        </Label>
        <textarea
          id="todo-description"
          name="description"
          value={todo.description || ""}
          onChange={(e) => setTodo({ ...todo, description: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Todo Description"
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="todo-deadline"
          className="text-sm font-medium text-gray-700"
        >
          Deadline
        </Label>
        <input
          id="todo-deadline"
          type="date"
          name="deadline"
          value={todo.deadline || ""}
          onChange={(e) => setTodo({ ...todo, deadline: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          placeholder="Todo Deadline"
          max="9999-12-31"
        />
      </div>

      {!hideCategory && (
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700">Category</Label>
          <Select.Root
            value={todo.category_id ? String(todo.category_id) : ""}
            onValueChange={(val) =>
              setTodo({
                ...todo,
                category_id: val ? Number(val) : undefined,
              })
            }
          >
            <Select.Trigger className="inline-flex items-center justify-between gap-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <Select.Value placeholder="Select Category (Optional)" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="z-50 rounded-md border border-gray-200 bg-white shadow-md">
                <Select.Viewport className="p-1">
                  <Select.Item
                    value=""
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none focus:bg-gray-100"
                  >
                    <Select.ItemText>None</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                  {categories.map((category) => (
                    <Select.Item
                      key={category.id}
                      value={String(category.id)}
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none focus:bg-gray-100"
                    >
                      <Select.ItemText>{category.name}</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      )}

      <div className="flex items-center gap-2 cursor-pointer">
        <Checkbox.Root
          id="todo-completed"
          checked={todo.completed}
          onCheckedChange={(val) =>
            setTodo({ ...todo, completed: val === true })
          }
          className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-white data-[state=checked]:bg-blue-600"
        >
          <Checkbox.Indicator className="text-white">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <Label
          htmlFor="todo-completed"
          className="text-sm font-medium text-gray-700"
        >
          Mark as completed
        </Label>
      </div>

      <button
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        onClick={onSubmit}
        disabled={!todo.name.trim()}
      >
        <Plus size={20} /> {selectedTodo ? "Update Todo" : "Add Todo"}
      </button>
    </div>
  );
};

export default Form;
