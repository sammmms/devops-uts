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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container px-4 mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-sm font-bold mb-8 backdrop-blur-sm border border-blue-100 dark:border-blue-500/20 shadow-sm animate-pulse">
              Productivity Simplified
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight drop-shadow-sm">
              Master your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                Tasks
              </span>
              <br />
              Master your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                Day
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              The only task management tool you'll ever need. Simple, fast, and
              distraction-free. Organized specifically for high-performers.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {isAuthenticated ? (
                <Button
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="px-6 py-3 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-1 font-semibold"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => navigate({ to: "/register" })}
                    className="px-8 py-3 text-lg rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-105 font-bold tracking-wide"
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate({ to: "/login" })}
                    className="px-8 py-3 text-lg rounded-full border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 text-slate-700 dark:text-slate-100 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md font-semibold"
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
      <section className="py-12 md:py-20">
        <div className="container px-4 mx-auto">
          <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-white/50 dark:border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
              <FeatureCard
                icon={
                  <ListTodo className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
                }
                title="Smart Organization"
                description="Categorize tasks instantly. Filter by projects, deadlines, or priority with our intuitive tag system."
                delay={0.1}
              />
              <FeatureCard
                icon={
                  <Zap className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />
                }
                title="Lightning Fast"
                description="Built for speed. No lag, no clutter. Just you and your tasks flowing in perfect sync."
                delay={0.2}
              />
              <FeatureCard
                icon={
                  <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-emerald-500" />
                }
                title="Secure & Private"
                description="Your data is encrypted and safe. We prioritize your privacy so you can focus on work."
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="pb-16 pt-6 md:pb-24 md:pt-8">
        <div className="container px-4 mx-auto">
          <div className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-slate-800/30 dark:to-slate-900/30 backdrop-blur-lg rounded-3xl p-6 md:p-10 border border-indigo-100/50 dark:border-white/5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-indigo-100/50 dark:divide-white/5">
              <StatItem value="10k+" label="Active Users" />
              <StatItem value="500k+" label="Tasks Completed" />
              <StatItem value="99.9%" label="Uptime" />
              <StatItem value="4.9/5" label="User Rating" />
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm font-medium">
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-indigo-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60 backdrop-blur-md hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border border-indigo-50/50 dark:border-white/5 hover:border-blue-200/50 dark:hover:border-blue-500/20 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-24 md:p-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500" />

      <div className="mb-4 md:mb-6 inline-flex p-3 md:p-4 rounded-2xl bg-white dark:bg-slate-950 shadow-lg shadow-indigo-100/50 dark:shadow-none group-hover:scale-110 transition-transform duration-300 relative z-10">
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base md:text-lg relative z-10">
        {description}
      </p>
    </motion.div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-3">
      <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-400">
        {value}
      </div>
      <div className="text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}
