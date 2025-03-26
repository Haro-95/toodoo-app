"use client";

import { ComponentProps } from "react";
import { TodoCategory } from "@/types";
import { motion } from "framer-motion";

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
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-700 dark:text-blue-300",
    hover: "hover:bg-blue-200 dark:hover:bg-blue-800",
    ring: "ring-blue-400 dark:ring-blue-500"
  },
  personal: {
    bg: "bg-purple-100 dark:bg-purple-900",
    text: "text-purple-700 dark:text-purple-300",
    hover: "hover:bg-purple-200 dark:hover:bg-purple-800",
    ring: "ring-purple-400 dark:ring-purple-500"
  },
  urgent: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-700 dark:text-red-300",
    hover: "hover:bg-red-200 dark:hover:bg-red-800",
    ring: "ring-red-400 dark:ring-red-500"
  },
};

export const CategoryBadge = ({ category, onClick }: CategoryBadgeProps) => {
  const colors = categoryColors[category];

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        tabIndex={0}
        aria-label={`Category: ${category}`}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} cursor-pointer ${colors.hover}`}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </button>
    );
  }

  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
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
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange(category);
              }
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${colors.bg} ${colors.text} ${colors.hover} ${
              isSelected ? `ring-2 ${colors.ring}` : ''
            }`}
            role="radio"
            aria-checked={isSelected}
            aria-label={categoryDisplay}
            tabIndex={0}
          >
            {categoryDisplay}
          </button>
        );
      })}
    </div>
  );
}; 