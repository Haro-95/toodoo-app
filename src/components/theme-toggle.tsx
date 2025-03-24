"use client";

import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentMode = theme === "dark" ? "dark" : "light";
  const nextMode = theme === "dark" ? "light" : "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(nextMode)}
      className="flex items-center justify-center rounded-full bg-gray-100 p-2 text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      aria-label={`Switch to ${nextMode} mode, currently ${currentMode} mode`}
      aria-pressed={theme === "dark"}
      tabIndex={0}
      title={`Toggle to ${nextMode} mode`}
    >
      {theme === "dark" ? (
        <FiSun className="h-5 w-5 text-yellow-500" aria-hidden="true" />
      ) : (
        <FiMoon className="h-5 w-5 text-blue-500" aria-hidden="true" />
      )}
    </motion.button>
  );
}; 