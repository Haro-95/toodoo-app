import { Navbar } from "@/components/Navbar";
import { TodoProvider } from "@/context/todo-context";
import { TodoList } from "@/components/TodoList";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-blue-100 opacity-30 blur-3xl filter dark:bg-blue-900 dark:opacity-10"></div>
        <div className="absolute -right-1/4 top-1/2 h-1/2 w-1/2 rounded-full bg-indigo-100 opacity-30 blur-3xl filter dark:bg-indigo-900 dark:opacity-10"></div>
      </div>
      
      <TodoProvider>
        <Navbar />
        <div className="container relative mx-auto flex flex-col items-center px-4 py-10">
          <h2 className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-center text-3xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400 sm:text-4xl">
            Manage your tasks with ease
          </h2>
          <TodoList />
        </div>
      </TodoProvider>
    </main>
  );
}
