import type { CategoryModel } from "@/models/CategoryModel";
import type { TodoModel } from "@/models/TodoModel";
import { Edit2, Plus, Trash2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";

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
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleConfirmDelete = (categoryId: number) => {
    onDeleteCategory(categoryId);
    setDeleteConfirmId(null);
  };
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

                    <Dialog.Root
                      open={deleteConfirmId === category.id}
                      onOpenChange={(open) => {
                        if (!open) setDeleteConfirmId(null);
                      }}
                    >
                      <Dialog.Trigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(category.id);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isSelected
                              ? "text-blue-100 hover:text-white hover:bg-white/20"
                              : "text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </Dialog.Trigger>

                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
                        <Dialog.Content asChild>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{
                              duration: 0.2,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl z-50 border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex items-start gap-4 mb-4">
                              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                              </div>
                              <div>
                                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                                  Delete Category
                                </Dialog.Title>
                                <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Are you sure you want to delete "
                                  {category.name}"? This action cannot be
                                  undone.
                                </Dialog.Description>
                              </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                              <Dialog.Close asChild>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                  Cancel
                                </motion.button>
                              </Dialog.Close>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleConfirmDelete(category.id)}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                              >
                                Delete
                              </motion.button>
                            </div>

                            <Dialog.Close asChild>
                              <button
                                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Close"
                              >
                                <Cross2Icon className="w-4 h-4" />
                              </button>
                            </Dialog.Close>
                          </motion.div>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
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
