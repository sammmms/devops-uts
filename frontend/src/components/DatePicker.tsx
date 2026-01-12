import { useState, useRef, useEffect } from "react";
// import { format } from "date-fns"; // Removed unused import
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

const DatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize view date (current month/year viewed)
  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(initialDate);

  const [view, setView] = useState<"calendar" | "month" | "year">("calendar");

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setView("calendar"); // Reset view on close
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helpers
  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDate = (day: number) => {
    const month = viewDate.getMonth() + 1;
    const year = viewDate.getFullYear();
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleSelectMonth = (monthIndex: number) => {
    setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1));
    setView("calendar");
  };

  const handleSelectYear = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setView("calendar");
  };

  const handleToday = () => {
    const today = new Date();
    setViewDate(today);
    // Optional: Select today immediately or just navigate?
    // User requested "pick today date", implying selection.
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const day = today.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Assume dropdown height is around 350px
      if (spaceBelow < 350 && rect.top > 350) {
        setPlacement("top");
      } else {
        setPlacement("bottom");
      }
    }
  }, [isOpen]);

  // Calendar Grid Generation
  const daysInMonth = getDaysInMonth(
    viewDate.getFullYear(),
    viewDate.getMonth()
  );
  const firstDay = getFirstDayOfMonth(
    viewDate.getFullYear(),
    viewDate.getMonth()
  );
  const days = [];

  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const currentDateStr = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
    const isSelected = value === currentDateStr;
    const isToday = new Date().toISOString().split("T")[0] === currentDateStr;

    days.push(
      <button
        key={d}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          handleSelectDate(d);
        }}
        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all
          ${
            isSelected
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
              : isToday
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 font-bold"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          }
        `}
      >
        {d}
      </button>
    );
  }

  // Generate Years (Current year - 10 to + 10)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group
          ${
            isOpen
              ? "border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-gray-800"
              : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800"
          }
        `}
      >
        <div
          className={`p-2 rounded-lg transition-colors ${isOpen ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500"}`}
        >
          <CalendarIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">
            Deadline
          </p>
          <p
            className={`text-sm font-medium ${value ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
          >
            {value ? formatDateDisplay(value) : placeholder}
          </p>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: placement === "bottom" ? 10 : -10,
              scale: 0.95,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: placement === "bottom" ? 10 : -10,
              scale: 0.95,
            }}
            transition={{ duration: 0.2 }}
            className={`absolute left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden min-w-[300px] ${
              placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              {view === "calendar" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePrevMonth();
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <div className="flex items-center gap-2 mx-auto">
                <button
                  type="button"
                  onClick={() =>
                    setView(view === "month" ? "calendar" : "month")
                  }
                  className={`font-semibold transition-colors rounded-lg px-2 py-1 ${
                    view === "month"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {viewDate.toLocaleDateString("en-US", { month: "long" })}
                </button>
                <button
                  type="button"
                  onClick={() => setView(view === "year" ? "calendar" : "year")}
                  className={`font-semibold transition-colors rounded-lg px-2 py-1 ${
                    view === "year"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {viewDate.getFullYear()}
                </button>
              </div>

              {view === "calendar" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNextMonth();
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Views */}
            {view === "calendar" && (
              <>
                <div className="grid grid-cols-7 mb-2 text-center">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-xs font-medium text-gray-400 dark:text-gray-500 py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 place-items-center mb-4">
                  {days}
                </div>
                <button
                  type="button"
                  onClick={handleToday}
                  className="w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                >
                  Today
                </button>
              </>
            )}

            {view === "month" && (
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleSelectMonth(index)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                      viewDate.getMonth() === index
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}

            {view === "year" && (
              <div className="grid grid-cols-4 gap-2 max-h-[240px] overflow-y-auto custom-scrollbar">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleSelectYear(year)}
                    className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                      viewDate.getFullYear() === year
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
