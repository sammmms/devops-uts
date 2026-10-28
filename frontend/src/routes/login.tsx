import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { Button, Input, PasswordInput } from "@/components/ui";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LoginComponent() {
  const navigate = useNavigate();
  const { login, loginWithOAuth, isAuthenticated } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

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
    if (!emailOrUsername || !password) {
      showErrorToast("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(emailOrUsername, password);
      showSuccessToast("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    try {
      await loginWithOAuth(provider);
      showSuccessToast(`Signed in with ${provider === "google" ? "Google" : "GitHub"}!`);
      navigate({ to: "/dashboard" });
    } catch (error) {
      showErrorToast("OAuth sign in failed");
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-90px)] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl lg:grid lg:grid-cols-2 min-h-[660px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
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
                "This app dramatically improved our team's productivity and
                workflow clarity. Highly recommended!"
              </p>
              <footer className="text-sm text-gray-300">
                — Alex Chen, Product Lead
              </footer>
            </blockquote>
          </motion.div>
        </motion.div>

        {/* Form Section (Right) */}
        <div className="flex items-center justify-center p-8 lg:p-12 h-full overflow-y-auto">
          <div className="mx-auto w-full max-w-[360px] space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col space-y-1.5 text-center"
            >
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Welcome back
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your credentials or continue with OAuth
              </p>
            </motion.div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={isLoading || !!oauthLoading}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
              >
                <GoogleIcon className="h-4 w-4" />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuth("github")}
                disabled={isLoading || !!oauthLoading}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
              >
                <GitHubIcon className="h-4 w-4" />
                <span>GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              <span className="absolute bg-white dark:bg-slate-900 px-2.5 text-xs uppercase tracking-wider text-gray-400">
                Or with password
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Input
                  type="text"
                  placeholder="Email or username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  label="Email or Username"
                  disabled={isLoading}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all focus:scale-[1.01]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  isLoading={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-sm text-gray-500 dark:text-gray-400"
            >
              Don't have an account?{" "}
              <button
                onClick={() => navigate({ to: "/register" })}
                className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors cursor-pointer"
                type="button"
              >
                Sign up
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
