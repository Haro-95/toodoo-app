# Toodoo App

A modern, feature-rich todo application built with Next.js, Tailwind CSS, and TypeScript.

![Toodoo App Screenshot](public/screenshots/toodoo-preview.png)

## Features

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
- **React Context API** - For state management
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
│   ├── context/     # React context providers
│   ├── hooks/       # Custom React hooks
│   ├── styles/      # Global styles
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```
