import type { CategoryModel } from "@/models/CategoryModel";

interface CategoryCardProps {
  category: CategoryModel;
  handleEdit: (category: CategoryModel) => void;
  handleDelete: () => void;
}

const CategoryCard = ({
  category,
  handleEdit,
  handleDelete,
}: CategoryCardProps) => {
  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {category.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ID: {category.id}
          </p>
        </div>

        <div className="ml-4 flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleEdit(category)}
            aria-label={`Edit ${category.name}`}
            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            aria-label={`Delete ${category.name}`}
            className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default CategoryCard;
