"use client";

import { motion } from "framer-motion";
import { TodoCategory } from "@/types";

type CategoryBadgeProps = {
  category: TodoCategory;
  onClick?: () => void;
};

// Create a standardized color scheme for categories that works consistently across light/dark modes
const categoryColors = {
  none: {
    bg: "bg-gray-200 dark:bg-gray-700",
    text: "text-gray-600 dark:text-gray-300",
    hover: "hover:bg-gray-300 dark:hover:bg-gray-600",
    ring: "ring-gray-400 dark:ring-gray-500"
  },
  work: {
    bg: "bg-blue-100 dark:bg-blue-900/70",
    text: "text-blue-700 dark:text-blue-300",
    hover: "hover:bg-blue-200 dark:hover:bg-blue-800",
    ring: "ring-blue-400 dark:ring-blue-500"
  },
  personal: {
    bg: "bg-purple-100 dark:bg-purple-900/70",
    text: "text-purple-700 dark:text-purple-300",
    hover: "hover:bg-purple-200 dark:hover:bg-purple-800",
    ring: "ring-purple-400 dark:ring-purple-500"
  },
  urgent: {
    bg: "bg-red-100 dark:bg-red-900/70",
    text: "text-red-700 dark:text-red-300",
    hover: "hover:bg-red-200 dark:hover:bg-red-800",
    ring: "ring-red-400 dark:ring-red-500"
  },
};

export const CategoryBadge = ({ category, onClick }: CategoryBadgeProps) => {
  const colors = categoryColors[category];

  // Using motion.button when clickable for better keyboard accessibility
  const Component = onClick ? motion.button : motion.span;
  const interactiveProps = onClick ? {
    type: "button" as "button",
    tabIndex: 0,
    role: "button",
    "aria-label": `Category: ${category}`,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
    className: `inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} cursor-pointer ${colors.hover}`
  } : {
    className: `inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`
  };

  return (
    <Component
      whileHover={onClick ? { y: -1, scale: 1.05 } : {}}
      whileTap={onClick ? { y: 0, scale: 0.95 } : {}}
      onClick={onClick}
      {...interactiveProps}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Component>
  );
};

type CategorySelectorProps = {
  currentCategory: TodoCategory;
  onChange: (category: TodoCategory) => void;
};

export const CategorySelector = ({ currentCategory, onChange }: CategorySelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select category">
      {(['none', 'work', 'personal', 'urgent'] as TodoCategory[]).map((category, index) => {
        const isSelected = currentCategory === category;
        const colors = categoryColors[category];
        const categoryDisplay = category === 'none' ? 'No Category' : category.charAt(0).toUpperCase() + category.slice(1);
        
        return (
          <motion.button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange(category);
              }
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.05,
              type: "spring",
              stiffness: 400,
              damping: 15
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              isSelected
                ? `${colors.bg} ${colors.text} ring-2 ${colors.ring}`
                : `${colors.bg} ${colors.text}`
            }`}
            role="radio"
            aria-checked={isSelected}
            aria-label={categoryDisplay}
            tabIndex={0}
          >
            {categoryDisplay}
          </motion.button>
        );
      })}
    </div>
  );
}; 