import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiSmile } from 'react-icons/fi';
import { useUser } from '@/context/user-context';

const WelcomeScreen: React.FC = () => {
  const { setUserName, completeOnboarding } = useUser();
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim().length < 2) {
      setError('Please enter a name with at least 2 characters');
      return;
    }
    
    setUserName(name);
    setStep(2);
  };

  const handleContinue = () => {
    completeOnboarding();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex flex-col"
      key="welcome-screen"
    >
      <div className="h-16 border-b border-gray-200 bg-white/70 backdrop-blur-lg backdrop-filter dark:border-gray-800 dark:bg-gray-900/80">
        <div className="container mx-auto flex h-full items-center px-4">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 p-2 shadow-md">
              <FiSmile className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome to Toodoo</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800"
            >
              <h1 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-white">
                Getting Started
              </h1>
              <p className="mb-8 text-gray-600 dark:text-gray-300">
                Let&apos;s personalize your experience. Tell us your name to get started.
              </p>

              <form onSubmit={handleNameSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    autoFocus
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center w-full px-6 py-3 font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue
                  <FiArrowRight className="ml-2" />
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800"
            >
              <div className="flex flex-col items-center justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.3
                  }}
                  className="flex items-center justify-center w-20 h-20 mb-4 text-white bg-green-500 rounded-full"
                >
                  <FiSmile className="w-10 h-10" />
                </motion.div>
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                  Hi, {name}!
                </h1>
              </div>

              <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
                Welcome to Toodoo. We&apos;re excited to help you manage your tasks more effectively.
              </p>

              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center w-full px-6 py-3 font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get Started
                <FiArrowRight className="ml-2" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen; 