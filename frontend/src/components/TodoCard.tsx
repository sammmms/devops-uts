import type { TodoModel } from "@/models/TodoModel";
import type { CategoryModel } from "@/models/CategoryModel";
import axiosInstance from "@/utils/axios_instance";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  Edit2,
  Trash2,
  Calendar,
  Tag,
  AlertTriangle,
  Check as CheckIcon,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";

interface TodoCardProps {
  todo: TodoModel;
  handleEdit: (todo: TodoModel) => void;
  handleDelete: () => void;
  onToggleComplete: (todo: TodoModel) => void;
}

const TodoCard = ({
  todo,
  handleEdit,
  handleDelete,
  onToggleComplete,
}: TodoCardProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  const onConfirmDelete = () => {
    handleDelete();
    setIsDeleteOpen(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.99 }}
      onClick={() => handleEdit(todo)}
      className="glass-card rounded-2xl p-3 sm:p-5 transition-shadow hover:shadow-lg border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-800/60 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(todo);
              }}
              className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                todo.completed
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-500"
              }`}
            >
              {todo.completed && <CheckIcon className="w-4 h-4" />}
            </button>
            <h3
              className={`text-lg font-semibold truncate tracking-tight transition-colors ${
                todo.completed
                  ? "text-gray-400 dark:text-gray-500 line-through"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {todo.name}
            </h3>
          </div>

          {todo.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {todo.deadline && (
              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg text-gray-600 dark:text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(todo.deadline)}</span>
              </div>
            )}
            {todo.category_id !== undefined && (
              <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-lg text-indigo-600 dark:text-indigo-300">
                <Tag className="w-3.5 h-3.5" />
                <span>{getCategoryName(todo.category_id)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              handleEdit(todo);
            }}
            className="p-2.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </motion.button>

          <Dialog.Root
            open={isDeleteOpen}
            onOpenChange={(open) => {
              // Prevent card click when interacting with dialog trigger
              if (!open) {
                // e.stopPropagation() is handled on the trigger button
              }
              setIsDeleteOpen(open);
            }}
          >
            <Dialog.Trigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </Dialog.Trigger>

            <AnimatePresence>
              {isDeleteOpen && (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                  </Dialog.Overlay>
                  <Dialog.Content asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl z-50 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                            Delete Task
                          </Dialog.Title>
                          <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Are you sure you want to delete "{todo.name}"? This
                            action cannot be undone.
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
                          onClick={onConfirmDelete}
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
              )}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoCard;
