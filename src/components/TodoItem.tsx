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
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { type: "spring", stiffness: 350, damping: 25 }
      }}
      exit={{ 
        opacity: 0, 
        y: -15, 
        scale: 0.96,
        transition: { duration: 0.2 } 
      }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
      }}
      className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white/90 p-3 shadow-sm backdrop-blur-sm transition-all hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/90 dark:hover:border-gray-600"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex-shrink-0">
          <motion.button
            onClick={() => toggleTodo(todo.id)}
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
              todo.completed
                ? "border-green-500 bg-gradient-to-br from-green-400 to-green-500 text-white shadow-sm"
                : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-blue-400 dark:hover:bg-blue-900/30"
            } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
            aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
            tabIndex={0}
          >
            {todo.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FiCheck className="h-3 w-3" />
              </motion.div>
            )}
          </motion.button>
        </div>

        <div className="flex flex-col gap-1 overflow-hidden">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={handleInputChange}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={`w-full rounded-md bg-transparent py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 dark:text-white ${
                  isAtLimit ? "border-red-500 text-red-600" : isNearLimit ? "text-yellow-600" : ""
                }`}
                autoFocus
              />
              <div className={`absolute bottom-[-1.25rem] right-2 text-xs transition-all ${
                isAtLimit
                  ? "text-red-500"
                  : isNearLimit
                  ? "text-yellow-500 dark:text-yellow-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}>
                {charactersLeft} characters left
              </div>
            </motion.div>
          ) : (
            <motion.span
              layout
              className={`truncate text-sm font-medium transition-all ${
                todo.completed
                  ? "text-gray-500 line-through dark:text-gray-400"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {todo.title}
            </motion.span>
          )}
          
          {!isEditing && todo.category !== 'none' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <CategoryBadge category={todo.category} />
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-100">
        <AnimatePresence mode="wait">
          {showCategorySelector ? (
            <motion.button
              key="cancel-category"
              onClick={() => setShowCategorySelector(false)}
              whileHover={{ scale: 1.15, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Cancel category selection"
              tabIndex={0}
            >
              <FiTag className="h-3.5 w-3.5" />
            </motion.button>
          ) : (
            <motion.button
              key="show-category"
              onClick={() => setShowCategorySelector(true)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Change category"
              tabIndex={0}
            >
              <FiTag className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.button
              key="save"
              onClick={handleSave}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="rounded-full p-1.5 text-green-500 hover:bg-green-50 hover:text-green-600 dark:text-green-400 dark:hover:bg-green-900/30 dark:hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Save edit"
              tabIndex={0}
            >
              <FiCheckCircle className="h-3.5 w-3.5" />
            </motion.button>
          ) : (
            <motion.button
              key="edit"
              onClick={handleEdit}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="rounded-full p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Edit todo"
              tabIndex={0}
            >
              <FiEdit2 className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
        
        <motion.button
          onClick={() => deleteTodo(todo.id)}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="rounded-full p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Delete todo"
          tabIndex={0}
        >
          <FiTrash2 className="h-3.5 w-3.5" />
        </motion.button>
      </div>
      
      <AnimatePresence>
        {showCategorySelector && (
          <motion.div 
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <CategorySelector 
              currentCategory={todo.category} 
              onChange={handleCategoryChange} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}; 