import type { CategoryModel } from "@/models/CategoryModel";
import type { TodoModel } from "@/models/TodoModel";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CategoriesListProps {
  categories: CategoryModel[];
  allTodos: TodoModel[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number) => void;
  onEditCategory: (category: CategoryModel) => void;
  onDeleteCategory: (id: number) => void;
  onOpenAddDialog: () => void;
}

export const CategoriesList = ({
  categories,
  allTodos,
  selectedCategoryId,
  onSelectCategory,
  onEditCategory,
  onDeleteCategory,
  onOpenAddDialog,
}: CategoriesListProps) => {
  return (
    <div className="glass-card rounded-3xl p-4 sm:p-6 border border-white/40 dark:border-white/10 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Categories
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenAddDialog}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          Add
        </motion.button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {/* Uncategorized Option */}
          <motion.div
            layout
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(-1)}
            className={`relative flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 group ${
              selectedCategoryId === -1
                ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/30"
                : "bg-white/50 dark:bg-gray-800/40 border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:shadow-md"
            }`}
          >
            <div className="flex-1 z-10">
              <h3
                className={`font-bold text-sm sm:text-base transition-colors ${
                  selectedCategoryId === -1
                    ? "text-white"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                Uncategorized
              </h3>
              <p
                className={`text-xs transition-colors ${
                  selectedCategoryId === -1
                    ? "text-blue-100"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {allTodos.filter((t) => !t.category_id).length} tasks
              </p>
            </div>
          </motion.div>

          {categories.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm"
            >
              No other categories yet.
            </motion.p>
          ) : (
            categories.map((category) => {
              const isSelected = selectedCategoryId === category.id;

              return (
                <motion.div
                  key={category.id}
                  layout
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectCategory(category.id)}
                  className={`relative flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 group ${
                    isSelected
                      ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/30"
                      : "bg-white/50 dark:bg-gray-800/40 border-transparent hover:border-gray-200 dark:hover:border-white/10 hover:shadow-md"
                  }`}
                >
                  <div className="flex-1 z-10">
                    <h3
                      className={`font-bold text-sm sm:text-base transition-colors ${
                        isSelected
                          ? "text-white"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {category.name}
                    </h3>
                    <p
                      className={`text-xs transition-colors ${
                        isSelected
                          ? "text-blue-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {
                        allTodos.filter((t) => t.category_id === category.id)
                          .length
                      }{" "}
                      tasks
                    </p>
                  </div>

                  <div className="flex items-center gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCategory(category);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSelected
                          ? "text-blue-100 hover:text-white hover:bg-white/20"
                          : "text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCategory(category.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSelected
                          ? "text-blue-100 hover:text-white hover:bg-white/20"
                          : "text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
