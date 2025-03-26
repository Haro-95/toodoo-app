"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiEdit2, FiCheck, FiCheckCircle, FiTag } from "react-icons/fi";
import { Todo, TodoCategory } from "@/types";
import { useTodo } from "@/context/todo-context";
import { CategoryBadge, CategorySelector } from "./CategoryBadge";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const MAX_TODO_LENGTH = 100; // Character limit for todos
  const { toggleTodo, deleteTodo, updateTodo, setTodoCategory } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      updateTodo(todo.id, editValue);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit input to MAX_TODO_LENGTH characters
    const value = e.target.value;
    if (value.length <= MAX_TODO_LENGTH) {
      setEditValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(todo.title);
      setIsEditing(false);
    }
  };

  const handleCategoryChange = (category: TodoCategory) => {
    setTodoCategory(todo.id, category);
    setShowCategorySelector(false);
  };

  const charactersLeft = MAX_TODO_LENGTH - editValue.length;
  const isNearLimit = charactersLeft <= 20;
  const isAtLimit = charactersLeft <= 0;

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-2 sm:p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
        <div className="flex-shrink-0">
          <motion.button
            onClick={() => toggleTodo(todo.id)}
            whileTap={{ scale: 0.9 }}
            className={`flex h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
              todo.completed
                ? "border-green-500 bg-green-500 text-white"
                : "border-gray-300 bg-white hover:border-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-blue-400"
            }`}
            aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
            tabIndex={0}
          >
            {todo.completed && (
              <FiCheck className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
            )}
          </motion.button>
        </div>

        <div className="flex flex-col gap-1 overflow-hidden">
          {isEditing ? (
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={handleInputChange}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={`w-full rounded-md bg-transparent py-1 text-xs sm:text-sm dark:text-white ${
                  isAtLimit ? "border-red-500 text-red-600" : isNearLimit ? "text-yellow-600" : ""
                }`}
                autoFocus
              />
              <div className={`absolute bottom-[-1.25rem] right-0 text-xs transition-colors ${
                isAtLimit
                  ? "text-red-500"
                  : isNearLimit
                  ? "text-yellow-500 dark:text-yellow-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}>
                {charactersLeft} characters left
              </div>
            </div>
          ) : (
            <span
              className={`truncate text-xs sm:text-sm font-medium ${
                todo.completed
                  ? "text-gray-500 line-through dark:text-gray-400"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {todo.title}
            </span>
          )}
          
          {!isEditing && todo.category !== 'none' && (
            <div>
              <CategoryBadge category={todo.category} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1 opacity-60 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-100">
        <AnimatePresence mode="wait">
          {showCategorySelector ? (
            <button
              key="cancel-category"
              onClick={() => setShowCategorySelector(false)}
              className="rounded-full p-1 sm:p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label="Cancel category selection"
              tabIndex={0}
            >
              <FiTag className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
            </button>
          ) : (
            <button
              key="show-category"
              onClick={() => setShowCategorySelector(true)}
              className="rounded-full p-1 sm:p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label="Change category"
              tabIndex={0}
            >
              <FiTag className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
            </button>
          )}
        </AnimatePresence>
      
        <AnimatePresence mode="wait">
          {isEditing ? (
            <button
              key="save"
              onClick={handleSave}
              className="rounded-full p-1 sm:p-1.5 text-green-500 hover:bg-green-50 hover:text-green-600 dark:text-green-400 dark:hover:bg-green-900/30 dark:hover:text-green-300"
              aria-label="Save edit"
              tabIndex={0}
            >
              <FiCheckCircle className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
            </button>
          ) : (
            <button
              key="edit"
              onClick={handleEdit}
              className="rounded-full p-1 sm:p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
              aria-label="Edit todo"
              tabIndex={0}
            >
              <FiEdit2 className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
            </button>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => deleteTodo(todo.id)}
          className="rounded-full p-1 sm:p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          aria-label="Delete todo"
          tabIndex={0}
        >
          <FiTrash2 className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
        </button>
      </div>
      
      <AnimatePresence>
        {showCategorySelector && (
          <div 
            className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <CategorySelector 
              currentCategory={todo.category} 
              onChange={handleCategoryChange} 
            />
          </div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}; 