import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CheckSquare, Info, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Header() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="sticky top-6 z-50 mx-auto max-w-3xl w-[90%] sm:w-full rounded-full glass border border-white/20 shadow-xl backdrop-blur-xl"
    >
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
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
            <span className="hidden sm:block text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
              Todo
            </span>
          </Link>

          <nav className="relative flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50">
            {[
              {
                to: "/",
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
            ].map((link) => (
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
        </div>
      </div>
    </motion.header>
  );
}
