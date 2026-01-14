import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { Button, Input, PasswordInput } from "@/components/ui";

export const Route = createFileRoute("/register")({
  component: RegisterComponent,
});

function RegisterComponent() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !username || !password || !confirmPassword) {
      showErrorToast("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      showErrorToast("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      await register(email, username, password);
      showSuccessToast("Account created successfully!");
      navigate({ to: "/dashboard" });
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-90px)] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl lg:grid lg:grid-cols-2 lg:h-[700px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
      >
        {/* Banner Section (Left) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="hidden lg:relative lg:block bg-gray-900 h-full"
        >
          <img
            src="/auth-banner.png"
            alt="Workspace"
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-0 left-0 p-12 text-white"
          >
            <blockquote className="space-y-2">
              <p className="text-lg font-medium">
                "Joining this platform was the best decision for my personal
                organization. It's simply beautiful."
              </p>
              <footer className="text-sm text-gray-300">
                — Sarah Miller, Designer
              </footer>
            </blockquote>
          </motion.div>
        </motion.div>

        {/* Form Section (Right) */}
        <div className="flex items-center justify-center p-8 lg:p-12 h-full overflow-y-auto">
          <div className="mx-auto w-full max-w-[350px] space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col space-y-2 text-center"
            >
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Create an account
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your details to get started
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email"
                  disabled={isLoading}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all focus:scale-[1.01]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Input
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  label="Username"
                  disabled={isLoading}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all focus:scale-[1.01]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <PasswordInput
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  disabled={isLoading}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all focus:scale-[1.01]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <PasswordInput
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  label="Confirm Password"
                  disabled={isLoading}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all focus:scale-[1.01]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  isLoading={isLoading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center text-sm text-gray-500 dark:text-gray-400"
            >
              Already have an account?{" "}
              <button
                onClick={() => navigate({ to: "/login" })}
                className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                type="button"
              >
                Sign in
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
