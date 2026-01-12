import type { CategoryModel } from "@/models/CategoryModel";
import { Edit2, Trash2 } from "lucide-react";
import { motion } from "motion/react";

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
    <motion.article
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-xl p-3 sm:p-5 hover:shadow-lg transition-all duration-300 bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
              {category.name}
            </h3>
          </div>
        </div>

        <div className="ml-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleEdit(category)}
            aria-label={`Edit ${category.name}`}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            aria-label={`Delete ${category.name}`}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default CategoryCard;
