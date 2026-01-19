import type { TodoModel, Priority } from "@/models/TodoModel";
import type { CategoryModel } from "@/models/CategoryModel";
import axiosInstance from "@/utils/axios_instance";
import { Plus, Flag } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@radix-ui/react-label";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import DatePicker from "./DatePicker";

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-gray-500" },
  { value: "medium", label: "Medium", color: "text-blue-500" },
  { value: "high", label: "High", color: "text-orange-500" },
  { value: "urgent", label: "Urgent", color: "text-red-500" },
];

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
    priority: "medium",
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
        priority: "medium",
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
        priority: "medium",
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
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && todo.name.trim()) {
              onSubmit();
            }
          }}
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
          htmlFor="todo-description"
          className="text-sm font-medium text-gray-700"
        >
          Deadline
        </Label>
        <DatePicker
          value={todo.deadline || ""}
          onChange={(date) => setTodo({ ...todo, deadline: date })}
          placeholder="Select deadline"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Priority
        </Label>
        <Select.Root
          value={todo.priority || "medium"}
          onValueChange={(val) =>
            setTodo({
              ...todo,
              priority: val as Priority,
            })
          }
        >
          <Select.Trigger
            className={`inline-flex items-center justify-between gap-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 ${priorityOptions.find((p) => p.value === (todo.priority || "medium"))?.color || ""}`}
          >
            <Select.Value placeholder="Select Priority" />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="z-50 rounded-md border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 shadow-md">
              <Select.Viewport className="p-1">
                {priorityOptions.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className={`relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none focus:bg-gray-100 dark:focus:bg-gray-700 ${option.color}`}
                  >
                    <Select.ItemText>
                      <span className="flex items-center gap-2">
                        <Flag className="w-3.5 h-3.5" />
                        {option.label}
                      </span>
                    </Select.ItemText>
                    <Select.ItemIndicator className="absolute right-2 inline-flex items-center">
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
      {!hideCategory && (
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700">Category</Label>
          <Select.Root
            value={todo.category_id ? String(todo.category_id) : "none"}
            onValueChange={(val) =>
              setTodo({
                ...todo,
                category_id: val && val !== "none" ? Number(val) : undefined,
              })
            }
          >
            <Select.Trigger className="inline-flex items-center justify-between gap-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600">
              <Select.Value placeholder="Select Category (Optional)" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="z-50 rounded-md border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 shadow-md">
                <Select.Viewport className="p-1">
                  <Select.Item
                    value="none"
                    className="relative flex cursor-pointer select-none items-center rounded-sm pl-8 pr-3 py-2 text-sm outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                  >
                    <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                      <CheckIcon />
                    </Select.ItemIndicator>
                    <Select.ItemText>None</Select.ItemText>
                  </Select.Item>
                  {categories.map((category) => (
                    <Select.Item
                      key={category.id}
                      value={String(category.id)}
                      className="relative flex cursor-pointer select-none items-center rounded-sm pl-8 pr-3 py-2 text-sm outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                    >
                      <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                        <CheckIcon />
                      </Select.ItemIndicator>
                      <Select.ItemText>{category.name}</Select.ItemText>
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
          className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-colors"
        >
          <Checkbox.Indicator className="text-white">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <Label
          htmlFor="todo-completed"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
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
