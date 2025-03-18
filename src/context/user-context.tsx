"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserContextType = {
  userName: string;
  isFirstVisit: boolean;
  setUserName: (name: string) => void;
  completeOnboarding: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string>('');
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);

  // Load user data from localStorage on component mount
  useEffect(() => {
    try {
      const savedUserName = localStorage.getItem('toodoo-user-name');
      const onboardingCompleted = localStorage.getItem('toodoo-onboarding-completed');
      
      if (savedUserName) {
        setUserName(savedUserName);
      }
      
      if (onboardingCompleted === 'true') {
        setIsFirstVisit(false);
      }
    } catch (error) {
      console.error("Failed to load user data from localStorage:", error);
    }
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    try {
      if (userName) {
        localStorage.setItem('toodoo-user-name', userName);
      }
    } catch (error) {
      console.error("Failed to save user name to localStorage:", error);
    }
  }, [userName]);

  const completeOnboarding = () => {
    setIsFirstVisit(false);
    localStorage.setItem('toodoo-onboarding-completed', 'true');
  };

  return (
    <UserContext.Provider value={{ 
      userName, 
      isFirstVisit, 
      setUserName, 
      completeOnboarding 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 