# Genzify Project Documentation

## Overview
Genzify is a web application designed to translate standard text into Gen Z slang and terminology. It provides users with a simple interface to input conventional text and receive the Gen Z equivalent, theorhetically making communication more relatable to younger audiences. In practice, it has gotten water dumped on my head by angry youths.

## Technology Stack
- **Frontend Framework**: Next.js
- **Language**: TypeScript/TSX
- **Styling**: CSS (with global styles)
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel Platform
- **Package Manager**: npnpm
- **UI Framework**: React

## Core Features
- Text translation from standard English to Gen Z slang
- User-friendly interface for text input and translation display
- Responsive design for mobile and desktop usage
- Fast, client-side processing of translations

## Architecture
The project follows Next.js architecture patterns:
- `/app`: Main application code using the App Router pattern
- `/app/layout.tsx`: Root layout component that wraps all pages
- `/app/globals.css`: Global styling
- `/components`: Reusable UI components
- `/lib`: Utility functions and business logic
- `/public`: Static assets
- `/notes`: Project documentation

## Development Guidelines
- **Code Style**: Follow TypeScript best practices and ESLint rules
- **Component Structure**: Use functional components with hooks
- **State Management**: Prefer React's built-in state management for simple state
- **Commits**: Write descriptive commit messages following conventional commits format
- **Responsive Design**: Ensure all features work on mobile and desktop
- **Documentation**: Document complex functions and components
- **Testing**: Write tests for critical functionality

## Setup Instructions
1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd genzify
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## Roadmap
- **Short-term Goals**
  - ???

- **Mid-term Goals**
  - Social sharing integrations
  
- **Long-term Vision**
  - carpe diem, who knows

---

Last Updated: [2025.05.16]
