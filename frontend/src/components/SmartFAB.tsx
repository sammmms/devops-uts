import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface SmartFABAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface SmartFABProps {
  actions: SmartFABAction[];
  defaultActionId?: string;
  className?: string; // Add className prop
}

export const SmartFAB = ({
  actions,
  defaultActionId,
  className = "",
}: SmartFABProps) => {
  const [activeActionId, setActiveActionId] = useState(
    defaultActionId || actions[0]?.id
  );
  const [isOpen, setIsOpen] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const activeAction =
    actions.find((a) => a.id === activeActionId) || actions[0];

  /* Idle timer for hint */
  const [showHint, setShowHint] = useState(false);
  const IDLE_TIMEOUT = 60000; // 1 minute
  // ACTUALLY user said "after like some minutes". I will set it to 1 minute (60000ms) to be less annoying.
  // Wait, let's use 60s.

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      setShowHint(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowHint(true);
      }, IDLE_TIMEOUT);
    };

    // Events to reset timer
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    // Initial start
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, []);

  const handlePressStart = () => {
    setShowHint(false); // Hide hint immediately on interaction
    isLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setIsOpen(true);
      // Haptic feedback if available
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms long press
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    setShowHint(false);
    if (isLongPress.current) {
      // Prevent default click if it was a long press
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (isOpen) {
      setIsOpen(false);
    } else {
      activeAction.onClick();
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      const close = () => setIsOpen(false);
      window.addEventListener("click", close);
      return () => window.removeEventListener("click", close);
    }
  }, [isOpen]);

  const handleSelectAction = (actionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent closing immediately from window click
    setActiveActionId(actionId);
    setIsOpen(false);
    setShowHint(false);
  };

  return (
    <div
      className={`fixed bottom-6 left-0 right-0 flex justify-center items-end sm:hidden z-50 pointer-events-none ${className}`}
    >
      <div className="relative flex flex-col items-center pointer-events-auto">
        <AnimatePresence>
          {/* Hint Tooltip */}
          {showHint && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-12 bg-gray-900/80 dark:bg-white/90 text-white dark:text-gray-900 text-xs px-3 py-1.5 rounded-full mb-2 backdrop-blur-sm shadow-sm whitespace-nowrap z-40 pointer-events-none"
            >
              Long Press
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/80 dark:border-t-white/90" />
            </motion.div>
          )}

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute bottom-20 flex flex-col gap-3 mb-2 items-stretch min-w-[180px]"
            >
              {actions.map((action) => (
                <motion.button
                  key={action.id}
                  onClick={(e) => handleSelectAction(action.id, e)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center justify-between w-full gap-4 px-5 py-3.5 rounded-2xl shadow-lg backdrop-blur-md border transition-all ${
                    activeActionId === action.id
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-white/95 dark:bg-slate-800/95 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {action.label}
                  </span>
                  <div className="p-0.5">{action.icon}</div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          // Pulsing animation when showing hint
          animate={
            showHint
              ? {
                  boxShadow: [
                    "0 0 0 0 rgba(37, 99, 235, 0)",
                    "0 0 0 10px rgba(37, 99, 235, 0.3)", // Blue pulse
                    "0 0 0 20px rgba(37, 99, 235, 0)",
                  ],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  },
                }
              : {}
          }
          className="relative flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/30 border-4 border-white dark:border-slate-900 bg-linear-to-br from-blue-500 to-blue-700 z-50"
        >
          <motion.div
            key={activeAction.id}
            initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {activeAction.icon}
          </motion.div>

          {/* Ring indicator for long press hint */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle
              cx="32"
              cy="32"
              r="30"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-white/30"
              strokeDasharray="188"
              strokeDashoffset="188"
            >
              {/* Could animate this dashoffset based on long press timer if we want a progress indicator */}
            </circle>
          </svg>
        </motion.button>
      </div>
    </div>
  );
};
