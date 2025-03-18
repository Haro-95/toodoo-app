"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiMic, FiMicOff } from "react-icons/fi";
import { useTodo } from "@/context/todo-context";
import { TodoItem } from "./TodoItem";
import { TodoCategory } from "@/types";

// Simplified Web Speech API type declaration
type SpeechRecognitionType = any;

export const TodoList = () => {
  const MAX_TODO_LENGTH = 100; // Character limit for todos
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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto w-full max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-white/80 p-6 shadow-xl backdrop-blur-lg backdrop-filter transition-all hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-gray-600"
      role="region"
      aria-label="Todo list manager"
    >
      {/* Add todo form */}
      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-full">
              <input
                type="text"
                value={newTodo}
                onChange={handleInputChange}
                placeholder="Add a new task..."
                className={`w-full rounded-lg border bg-white/90 px-4 py-3 text-sm shadow-inner transition-all focus:outline-none focus:ring-2 dark:bg-gray-700/90 dark:text-white dark:placeholder-gray-400 ${
                  isAtLimit
                    ? "border-red-500 focus:border-red-500 focus:ring-red-300 dark:focus:ring-red-500"
                    : isNearLimit
                    ? "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-300 dark:focus:ring-yellow-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-300 dark:border-gray-600 dark:focus:ring-blue-500"
                }`}
                aria-label="New todo input"
                maxLength={MAX_TODO_LENGTH}
              />
              <div className={`absolute bottom-[-1.25rem] right-2 text-xs transition-all ${
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
            
            {/* Voice input button */}
            {isSpeechSupported && (
              <motion.button
                type="button"
                onClick={toggleListening}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                  isListening 
                    ? "animate-pulse bg-gradient-to-r from-red-500 to-red-600 text-white" 
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
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
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" 
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex-shrink-0 flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-3 text-sm font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 p-2 text-white shadow-md transition-all hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
              aria-label="Add todo"
              tabIndex={0}
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <FiPlus className="h-6 w-6" />
              </motion.div>
            </motion.button>
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
                role="radiogroup"
                aria-label="Category selection"
              >
                <div className="flex flex-wrap gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                  {(['none', 'work', 'personal', 'urgent'] as TodoCategory[]).map((category, index) => (
                    <motion.button
                      key={category}
                      type="button"
                      onClick={() => setNewTodoCategory(category)}
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
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                        newTodoCategory === category
                          ? category === 'none'
                            ? 'bg-gray-200 text-gray-600 ring-2 ring-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-500'
                            : category === 'work'
                            ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-400 dark:bg-blue-900/70 dark:text-blue-300 dark:ring-blue-500'
                            : category === 'personal'
                            ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-400 dark:bg-purple-900/70 dark:text-purple-300 dark:ring-purple-500'
                            : 'bg-red-100 text-red-700 ring-2 ring-red-400 dark:bg-red-900/70 dark:text-red-300 dark:ring-red-500'
                          : category === 'none'
                          ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          : category === 'work'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/70 dark:text-blue-300'
                          : category === 'personal'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/70 dark:text-purple-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/70 dark:text-red-300'
                      }`}
                      aria-label={category === 'none' ? 'No Category' : category}
                      aria-checked={newTodoCategory === category}
                      role="radio"
                      tabIndex={0}
                    >
                      {category === 'none' ? 'No Category' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Filter tabs */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-lg bg-gray-100/80 p-1.5 shadow-inner dark:bg-gray-700/80" role="tablist" aria-label="Todo filters">
          {["all", "active", "completed"].map((filterType, index) => (
            <motion.button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              whileHover={{ 
                backgroundColor: filter === filterType ? "" : "rgba(229, 231, 235, 0.5)",
                color: filter === filterType ? "" : "#1F2937"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.2 + index * 0.1,
                type: "spring", 
                stiffness: 300, 
                damping: 24
              }}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                filter === filterType
                  ? "bg-white text-gray-800 shadow dark:bg-gray-600 dark:text-white"
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
            className="mb-6 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            layout="position"
            role="list"
            aria-label={`${filter} todos`}
            id={`${filter}-todos`}
          >
            <AnimatePresence initial={false} mode="popLayout">
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
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
              className="flex justify-end"
            >
              <motion.button
                onClick={handleClearCompleted}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "#E5E7EB", 
                  color: "#4B5563" 
                }}
                whileTap={{ scale: 0.95 }}
                className="rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50"
          role="status"
          aria-label="Empty todo list"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            No todos yet. Add one above!
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
}; 