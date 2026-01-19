import type { TodoModel } from "@/models/TodoModel";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import Form from "./Form";

interface CreateTodoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTodo: TodoModel | undefined;
  onSubmit: (todo: TodoModel) => Promise<void>;
  selectedCategoryId: number | null;
}

export const CreateTodoDialog = ({
  isOpen,
  onOpenChange,
  selectedTodo,
  onSubmit,
  selectedCategoryId,
}: CreateTodoDialogProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl focus:outline-none glass-card border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-xl font-bold">
                    {selectedTodo ? "Edit Todo" : "Add Todo"}
                  </Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Form to {selectedTodo ? "edit an existing" : "add a new"}{" "}
                    todo item
                  </Dialog.Description>
                  <Dialog.Close asChild>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <X size={24} />
                    </button>
                  </Dialog.Close>
                </div>

                <Form
                  handleSubmit={(todo) => {
                    // Only set category from selectedCategoryId when creating a new todo
                    // When editing, keep the todo's existing category_id (which can be changed in the form)
                    const todoWithCategory = selectedTodo
                      ? todo // Editing: use whatever category was selected in the form
                      : {
                          ...todo,
                          category_id:
                            selectedCategoryId && selectedCategoryId !== -1
                              ? selectedCategoryId
                              : todo.category_id,
                        };
                    return onSubmit(todoWithCategory);
                  }}
                  selectedTodo={selectedTodo}
                  hideCategory={!selectedTodo} // Show category dropdown when editing
                />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
