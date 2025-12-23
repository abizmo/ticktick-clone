# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TickTick clone - a task management application. The project directory is currently empty and ready for initialization.

## Getting Started

Since this is a new project, you'll likely need to initialize it first. Common initialization patterns for a TickTick clone would be:

### Frontend Setup (React/Next.js)
```bash
npx create-next-app@latest . --typescript --tailwind --eslint
# or
npx create-react-app . --template typescript
```

### Full-stack Setup (Node.js/Express + React)
```bash
# Initialize package.json
npm init -y

# Backend dependencies
npm install express cors dotenv jsonwebtoken bcryptjs mongoose
npm install -D nodemon @types/node typescript ts-node

# Frontend (if separate)
npx create-react-app frontend --template typescript
```

## Common Development Commands

Once the project is initialized, typical commands would include:

### Development
```bash
npm run dev          # Start development server
npm start           # Start production server
npm run build       # Build for production
```

### Code Quality
```bash
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm run typecheck   # Run TypeScript compiler check
npm run format      # Format code with Prettier
```

### Testing
```bash
npm test           # Run tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Architecture Considerations for TickTick Clone

### Core Features to Implement
- Task creation, editing, and deletion
- Task organization (lists, folders, tags)
- Due dates and reminders
- Task priorities and status
- User authentication and authorization
- Real-time synchronization (if multi-user)
- Offline functionality

### Typical Tech Stack Options
- **Frontend**: React/Next.js with TypeScript
- **Backend**: Node.js/Express or Next.js API routes
- **Database**: MongoDB, PostgreSQL, or SQLite
- **State Management**: Redux Toolkit, Zustand, or React Context
- **Styling**: Tailwind CSS, styled-components, or CSS modules
- **Authentication**: NextAuth.js, Firebase Auth, or custom JWT

### Project Structure Patterns
```
src/
├── components/     # Reusable UI components
├── pages/         # Route components (Next.js) or views
├── hooks/         # Custom React hooks
├── store/         # State management
├── services/      # API calls and external services
├── utils/         # Helper functions
├── types/         # TypeScript type definitions
└── styles/        # Global styles and themes
```

## Development Notes

- Use TypeScript for type safety
- Implement proper error handling and loading states
- Follow accessibility best practices
- Use semantic HTML and proper ARIA labels
- Implement responsive design for mobile and desktop
- Consider implementing drag-and-drop for task reordering
- Plan for data persistence and sync strategies