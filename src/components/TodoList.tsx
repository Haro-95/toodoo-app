"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiMic, FiMicOff } from "react-icons/fi";
import { useTodo } from "@/context/todo-context";
import { TodoItem } from "./TodoItem";
import { TodoCategory } from "@/types";
import { CategorySelector } from "./CategoryBadge";
import { CategoryBadge } from "./CategoryBadge";

// Simplified Web Speech API type declaration
type SpeechRecognitionType = any;

export const TodoList = () => {
  const MAX_TODO_LENGTH = 40; // Character limit for todos
  const { todos, addTodo, clearCompleted } = useTodo();
  const [newTodo, setNewTodo] = useState("");
  const [newTodoCategory, setNewTodoCategory] = useState<TodoCategory>("none");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionType | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  // Setup Web Speech API
  useEffect(() => {
    // @ts-ignore - Web Speech API types are complex
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // @ts-ignore - Web Speech API types are complex
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        processVoiceCommand(transcript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      setIsSpeechSupported(true);
    }
  }, []);

  const processVoiceCommand = (command: string) => {
    // Clean up the command
    const lowerCommand = command.toLowerCase().trim();
    
    // Pattern for "add [task] to my list"
    const addPattern = /add\s+["']?([^"']+)["']?\s+to\s+my\s+list/i;
    const addMatch = lowerCommand.match(addPattern);
    
    if (addMatch && addMatch[1]) {
      const taskTitle = addMatch[1].trim();
      if (taskTitle) {
        // Limit the task title length
        const limitedTaskTitle = taskTitle.substring(0, MAX_TODO_LENGTH);
        addTodo(limitedTaskTitle, newTodoCategory);
        return;
      }
    }
    
    // Detect category mentions
    if (lowerCommand.includes("work")) {
      setNewTodoCategory("work");
    } else if (lowerCommand.includes("personal")) {
      setNewTodoCategory("personal");
    } else if (lowerCommand.includes("urgent")) {
      setNewTodoCategory("urgent");
    }
    
    // If no pattern matched, just set the text as a todo
    if (lowerCommand && !addMatch) {
      // Remove filler words that might appear at the beginning
      const cleanedCommand = lowerCommand
        .replace(/^(ok|okay|hey|hi|umm|uh|add|create|new|todo|task)\s+/i, '')
        .replace(/\s+(todo|task)$/i, '');
        
      if (cleanedCommand) {
        // Limit the task title length
        const limitedCommand = cleanedCommand.substring(0, MAX_TODO_LENGTH);
        addTodo(limitedCommand, newTodoCategory);
      }
    }
  };

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit input to MAX_TODO_LENGTH characters
    const value = e.target.value;
    if (value.length <= MAX_TODO_LENGTH) {
      setNewTodo(value);
    }
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo, newTodoCategory);
      setNewTodo("");
      setNewTodoCategory("none");
      setIsAddingCategory(false);
    }
  };

  const handleClearCompleted = () => {
    clearCompleted();
    // If we're on the completed tab, switch to "all" filter
    // This avoids confusion of seeing an empty list after clearing completed tasks
    if (filter === "completed") {
      setFilter("all");
    }
  };

  const handleCategoryChange = (category: TodoCategory) => {
    setNewTodoCategory(category);
    setIsAddingCategory(false);
  };

  const charactersLeft = MAX_TODO_LENGTH - newTodo.length;
  const isNearLimit = charactersLeft <= 20;
  const isAtLimit = charactersLeft <= 0;

  // Memoize filtered and sorted todos to improve performance
  const filteredAndSortedTodos = useMemo(() => {
    // First filter by active/completed status
    let result = [...todos];
    
    if (filter === "active") {
      result = result.filter(todo => !todo.completed);
    } else if (filter === "completed") {
      result = result.filter(todo => todo.completed);
    }
    
    // Sort todos so completed items are at the bottom
    return result.sort((a, b) => {
      // First sort by completion status
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      
      // Then sort by order/id for consistent ordering
      return a.order - b.order;
    });
  }, [todos, filter]);

  const completedCount = useMemo(() => todos.filter(todo => todo.completed).length, [todos]);
  const activeCount = useMemo(() => todos.length - completedCount, [todos, completedCount]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto w-full max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
      role="region"
      aria-label="Todo list manager"
    >
      {/* Add todo form */}
      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="relative w-full mb-4 sm:mb-0">
              <div className="flex items-center relative">
                <input
                  type="text"
                  value={newTodo}
                  onChange={handleInputChange}
                  placeholder="Add a new task..."
                  className={`w-full rounded-lg border bg-white px-4 text-gray-900 ${
                    newTodoCategory !== 'none' ? 'pr-[5.5rem]' : 'pr-4'
                  } py-3 text-sm shadow-sm transition-colors dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                    isAtLimit
                      ? "border-red-500 dark:border-red-500"
                      : isNearLimit
                      ? "border-yellow-500 dark:border-yellow-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  aria-label="New todo input"
                  maxLength={MAX_TODO_LENGTH}
                />
                {newTodoCategory !== 'none' && (
                  <div className="absolute right-3 z-10 pointer-events-none">
                    <CategoryBadge category={newTodoCategory} />
                  </div>
                )}
              </div>
              <div className={`absolute bottom-[-1.5rem] sm:bottom-[-1.25rem] left-0 sm:right-2 sm:left-auto text-xs transition-colors ${
                isAtLimit
                  ? "text-red-500"
                  : isNearLimit
                  ? "text-yellow-500 dark:text-yellow-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
                aria-live="polite"
                aria-atomic="true"
              >
                {charactersLeft} characters left
              </div>
            </div>
            
            <div className="flex w-full sm:w-auto gap-2 justify-between sm:justify-start">
              {/* Voice input button */}
              {isSpeechSupported && (
                <motion.button
                  type="button"
                  onClick={toggleListening}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 flex h-10 sm:h-11 w-10 sm:w-11 items-center justify-center rounded-lg shadow-sm transition-colors ${
                    isListening 
                      ? "animate-pulse bg-red-500 text-white" 
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  aria-label={isListening ? "Stop listening" : "Start voice command"}
                  aria-pressed={isListening}
                  tabIndex={0}
                >
                  {isListening ? <FiMicOff className="h-5 w-5" /> : <FiMic className="h-5 w-5" />}
                </motion.button>
              )}
              
              {/* Category button */}
              <motion.button
                type="button"
                onClick={() => setIsAddingCategory(!isAddingCategory)}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 flex h-10 sm:h-11 items-center justify-center rounded-lg px-3 text-xs sm:text-sm font-medium shadow-sm transition-colors ${
                  isAddingCategory
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                aria-label="Toggle category selection"
                aria-expanded={isAddingCategory}
                tabIndex={0}
              >
                {isAddingCategory ? "Cancel" : "Category"}
              </motion.button>
              
              {/* Add button */}
              <motion.button
                type="submit"
                disabled={!newTodo.trim() || isAtLimit}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 flex h-10 sm:h-11 w-10 sm:w-11 items-center justify-center rounded-lg bg-blue-500 p-2 text-white shadow-sm transition-colors hover:bg-blue-600 disabled:opacity-50"
                aria-label="Add todo"
                tabIndex={0}
              >
                <FiPlus className="h-5 sm:h-6 w-5 sm:w-6" />
              </motion.button>
            </div>
          </div>
          
          {/* Voice listening indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-center text-sm"
                aria-live="polite"
              >
                <span className="rounded-full bg-red-100 px-3 py-1 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  Listening... Try saying "Add call mom to my list" or "Work meeting tomorrow"
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Category selector */}
          <AnimatePresence>
            {isAddingCategory && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                  <CategorySelector 
                    currentCategory={newTodoCategory}
                    onChange={handleCategoryChange}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Filter tabs */}
      <div className="mb-5 sm:mb-6 flex justify-center">
        <div className="inline-flex rounded-lg bg-gray-100 p-1 sm:p-1.5 shadow-sm dark:bg-gray-700" role="tablist" aria-label="Todo filters">
          {["all", "active", "completed"].map((filterType, index) => (
            <motion.button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              whileTap={{ scale: 0.95 }}
              className={`rounded-md px-2 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                filter === filterType
                  ? "bg-white text-gray-800 shadow-sm dark:bg-gray-600 dark:text-white"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              }`}
              role="tab"
              aria-selected={filter === filterType}
              aria-controls={`${filterType}-todos`}
              tabIndex={0}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === "active" && ` (${activeCount})`}
              {filterType === "completed" && ` (${completedCount})`}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Todo list */}
      {filteredAndSortedTodos.length > 0 ? (
        <>
          <motion.ul 
            className="mb-4 sm:mb-6 space-y-2 sm:space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            layout="position"
            role="list"
            aria-label={`${filter} todos`}
            id={`${filter}-todos`}
          >
            <AnimatePresence initial={false}>
              {filteredAndSortedTodos.map((todo) => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                />
              ))}
            </AnimatePresence>
          </motion.ul>

          {/* Clear completed button */}
          {completedCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <motion.button
                onClick={handleClearCompleted}
                whileTap={{ scale: 0.95 }}
                className="rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                aria-label="Clear all completed todos"
                tabIndex={0}
              >
                Clear completed
              </motion.button>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-24 sm:h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
          role="status"
          aria-label="Empty todo list"
        >
          <motion.p 
            className="text-xs sm:text-sm text-gray-500 px-2 text-center dark:text-gray-400"
          >
            No todos yet. Add one above!
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
}; 