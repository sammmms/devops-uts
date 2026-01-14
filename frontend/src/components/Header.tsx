import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  CheckSquare,
  Info,
  Moon,
  Sun,
  LogOut,
  AlertTriangle,
  LogIn,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutOpen(false);
    navigate({ to: "/login" });
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="sticky top-0 md:top-6 z-50 w-full md:w-[90%] md:max-w-3xl md:mx-auto md:rounded-full rounded-b-3xl glass border border-white/20 shadow-xl backdrop-blur-xl"
    >
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="hidden md:flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src="/logo.png"
                alt="Todo Logo"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <span className="hidden sm:block text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Todo
            </span>
          </Link>

          <nav className="relative flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50">
            {(isAuthenticated
              ? [
                  {
                    to: "/dashboard",
                    label: "Dashboard",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="7" height="9" x="3" y="3" rx="1" />
                        <rect width="7" height="5" x="14" y="3" rx="1" />
                        <rect width="7" height="9" x="14" y="12" rx="1" />
                        <rect width="7" height="5" x="3" y="16" rx="1" />
                      </svg>
                    ),
                  },
                  {
                    to: "/todos",
                    label: "Todo",
                    icon: <CheckSquare className="w-4 h-4" />,
                  },
                  {
                    to: "/about",
                    label: "About",
                    icon: <Info className="w-4 h-4" />,
                  },
                ]
              : [
                  {
                    to: "/",
                    label: "Home",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    ),
                  },
                  {
                    to: "/about",
                    label: "About",
                    icon: <Info className="w-4 h-4" />,
                  },
                ]
            ).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                activeProps={{
                  className: "!text-blue-600 dark:!text-blue-400",
                }}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-pill"
                        className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        initial={false}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {link.icon}
                      <span className="hidden sm:inline">{link.label}</span>
                    </span>
                  </>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated && user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {user.username}
                </span>
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            {isAuthenticated ? (
              <Dialog.Root open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
                <Dialog.Trigger asChild>
                  <button
                    className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </Dialog.Trigger>

                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
                  <Dialog.Content asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl z-50 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                          <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                            Confirm Logout
                          </Dialog.Title>
                          <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Are you sure you want to logout? You will be
                            redirected to the login page.
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
                          onClick={handleConfirmLogout}
                          className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                        >
                          Logout
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
            ) : (
              <button
                onClick={() => navigate({ to: "/login" })}
                className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                aria-label="Login"
              >
                <LogIn className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
