import type { TodoModel } from "@/models/TodoModel";
import type { CategoryModel } from "@/models/CategoryModel";
import axiosInstance from "@/utils/axios_instance";
import { useQuery } from "@tanstack/react-query";

interface TodoCardProps {
  todo: TodoModel;
  handleEdit: (todo: TodoModel) => void;
  handleDelete: () => void;
}

const TodoCard = ({ todo, handleEdit, handleDelete }: TodoCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fetch categories to display category name
  const { data: categories = [] } = useQuery<CategoryModel[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/category");
      return res.data.categories;
    },
  });

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return null;
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || `Category #${categoryId}`;
  };

  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {todo.name}
            </h3>
            {todo.completed && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                ✓ Completed
              </span>
            )}
          </div>

          {todo.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {todo.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
            {todo.deadline && (
              <div className="flex items-center gap-1">
                <span className="font-medium">📅 Deadline:</span>
                <span>{formatDate(todo.deadline)}</span>
              </div>
            )}
            {todo.category_id !== undefined && (
              <div className="flex items-center gap-1">
                <span className="font-medium">🏷️ Category:</span>
                <span>{getCategoryName(todo.category_id)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="ml-4 flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleEdit(todo)}
            aria-label={`Edit ${todo.name}`}
            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            aria-label={`Delete ${todo.name}`}
            className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default TodoCard;
