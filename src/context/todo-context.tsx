"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Todo, TodoCategory } from "@/types";

type TodoContextType = {
  todos: Todo[];
  addTodo: (title: string, category?: TodoCategory) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, title: string) => void;
  clearCompleted: () => void;
  setTodoCategory: (id: string, category: TodoCategory) => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const MAX_TODO_LENGTH = 100; // Character limit for todos
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos);
        // Convert string dates back to Date objects
        setTodos(
          parsedTodos.map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            category: todo.category || 'none',
            order: todo.order || 0,
          }))
        );
      } catch (error) {
        console.error("Failed to parse todos from localStorage:", error);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string, category: TodoCategory = 'none') => {
    if (!title.trim()) return;
    
    // Limit title length
    const limitedTitle = title.trim().substring(0, MAX_TODO_LENGTH);
    
    setTodos((prev) => [
      ...prev,
      {
        id: uuidv4(),
        title: limitedTitle,
        completed: false,
        createdAt: new Date(),
        category,
        order: prev.length,
      },
    ]);
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  };

  const updateTodo = (id: string, title: string) => {
    if (!title.trim()) return;
    
    // Limit title length
    const limitedTitle = title.trim().substring(0, MAX_TODO_LENGTH);
    
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, title: limitedTitle } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const setTodoCategory = (id: string, category: TodoCategory) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, category } : todo
      )
    );
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        deleteTodo,
        toggleTodo,
        updateTodo,
        clearCompleted,
        setTodoCategory,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}; 