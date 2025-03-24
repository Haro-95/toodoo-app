# Toodoo App

A modern, feature-rich todo application built with Next.js, Tailwind CSS, and TypeScript.

## Screenshots

<div align="center">
  <img src="/public/screenshots/toodoo-welcome-screen.png" alt="Toodoo Welcome Screen" width="600" />
  <p><em>Personalized Welcome Experience</em></p>

  <img src="/public/screenshots/toodoo-light-mode.png" alt="Toodoo App Light Mode" width="600" />
  <p><em>Toodoo in Light Mode</em></p>
  
  <img src="/public/screenshots/toodoo-dark-mode.png" alt="Toodoo App Dark Mode" width="600" />
  <p><em>Toodoo in Dark Mode</em></p>
  
  <img src="/public/screenshots/toodoo-categories.png" alt="Toodoo Task Categories" width="600" />
  <p><em>Task Categories</em></p>
</div>

## Features

- **Welcome Screen** - Personalized user onboarding experience
- **Clean, Modern UI** with dark/light mode support
- **Task Management** - Add, edit, delete, and mark tasks as complete
- **Task Categories** - Organize tasks with color-coded categories (Work, Personal, Urgent)
- **Voice Input Support** - Add tasks using voice commands
- **Mobile Responsive Design** - Works on all device sizes
- **Smooth Animations** - Enhanced user experience with subtle animations
- **Keyboard Shortcuts** - For faster task management
- **Local Storage** - Tasks persist between sessions

## Technologies Used

- **Next.js** - React framework for server-rendered applications
- **TypeScript** - Type safety for better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **React Context API** - For state management (Todo and User contexts)
- **LocalStorage API** - For persistent data storage

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone or download this repository
   
2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

```
toodoo/
├── public/          # Static assets
├── src/
│   ├── app/         # Next.js app router
│   ├── components/  # React components
│   ├── context/     # React context providers (todo-context.tsx, user-context.tsx)
│   ├── hooks/       # Custom React hooks
│   ├── styles/      # Global styles
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```
