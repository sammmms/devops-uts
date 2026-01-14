import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui";
import { ListTodo, ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";

import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navbar is handled by __root.tsx but we want a hero section here */}

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="container px-4 mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-semibold mb-6">
              Productivity Simplified
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              Master your <span className="text-blue-600">Tasks</span>
              <br />
              Master your <span className="text-blue-600">Day</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The only task management tool you'll ever need. Simple, fast, and
              distraction-free. Organized specifically for high-performers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Button
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="px-8 py-4 text-lg h-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => navigate({ to: "/register" })}
                    className="px-8 py-4 text-lg h-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate({ to: "/login" })}
                    className="px-8 py-4 text-lg h-auto rounded-full border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8">
        <div className="container px-4 mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<ListTodo className="w-8 h-8 text-blue-600" />}
                title="Smart Organization"
                description="Categorize tasks instantly. Filter by projects, deadlines, or priority with our intuitive tag system."
                delay={0.1}
              />
              <FeatureCard
                icon={<Zap className="w-8 h-8 text-amber-500" />}
                title="Lightning Fast"
                description="Built for speed. No lag, no clutter. Just you and your tasks flowing in perfect sync."
                delay={0.2}
              />
              <FeatureCard
                icon={<ShieldCheck className="w-8 h-8 text-emerald-500" />}
                title="Secure & Private"
                description="Your data is encrypted and safe. We prioritize your privacy so you can focus on work."
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-8">
        <div className="container px-4 mx-auto">
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-700/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <StatItem value="10k+" label="Active Users" />
              <StatItem value="500k+" label="Tasks Completed" />
              <StatItem value="99.9%" label="Uptime" />
              <StatItem value="4.9/5" label="User Rating" />
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>
          © {new Date().getFullYear()} Kelompok Asal Jadi. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700"
    >
      <div className="mb-4 inline-block p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-md">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-2">
      <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
        {value}
      </div>
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}
