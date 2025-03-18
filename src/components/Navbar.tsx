"use client";

import { ThemeToggle } from "./theme-toggle";
import { FiCheckSquare } from "react-icons/fi";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-lg backdrop-filter">
      <div className="border-b border-gray-200 bg-white/70 dark:border-gray-800 dark:bg-gray-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 p-2 shadow-md">
              <FiCheckSquare className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Toodoo</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}; 