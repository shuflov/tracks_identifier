Agentic coding guidelines for the Tracks Identifier project.

## Project Overview

A React + Express web app that identifies animal tracks using Google Gemini AI, designed to run on a Raspberry Pi. Optimized for Central European (Slovakia) wildlife.

## Build / Run Commands

```bash
# Development (runs both frontend + backend concurrently)
npm run start

# Run separately:
npm run server   # Express backend on port 3004
npm run dev      # Vite frontend on port 3003

# Build for production
npm run build    # TypeScript check + Vite build
npm run preview  # Preview production build
```

- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:3004

Note: No test framework or linter is currently configured.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite 5, Tailwind CSS (CDN) |
| Backend | Express.js, Node.js (ES Modules) |
| AI | Google Gemini Flash 2.5 |
| Storage | CSV file (server/filesystem) |

## Project Structure

```
tracks_identifier/
├── src/
│   ├── App.tsx                     # Main app component
│   ├── index.tsx                   # Entry point
│   ├── types.ts                    # TypeScript interfaces and enums
│   ├── components/
│   │   ├── FileUploader.tsx        # Image upload component
│   │   ├── ResultsDisplay.tsx       # Results display component
│   │   ├── HistoryView.tsx          # Track history view
│   │   ├── Settings.tsx             # Settings configuration
│   │   ├── Spinner.tsx              # Loading spinner
│   │   └── ErrorDisplay.tsx         # Error display component
│   └── services/
│       └── apiService.ts            # Backend API calls
├── server/
│   ├── index.js                    # Express server
│   └── tracks.csv                  # CSV data storage (auto-created)
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tsconfig.node.json
```

## CSV Data Format

| Column | Description | Type |
|--------|-------------|------|
| timestamp | ISO 8601 date | string |
| species | Common name | string |
| scientificName | Latin name | string |
| family | Animal family | string |
| confidence | low/medium/high | string |
| imageUrl | Reference image URL | string |
| notes | Additional notes | string |

## API Endpoints

- `POST /api/identify` - Identify track from image (body: {image, mimeType, apiKey})
- `GET /api/tracks` - Get all tracks as JSON
- `GET /api/csv` - Download CSV file

## Running on Raspberry Pi

1. Copy project to Pi
2. `npm install`
3. `npm run start`
4. Access via `http://<pi-ip>:3003` from mobile

---

## Code Style Guidelines

### TypeScript

- **Strict mode** is enabled in tsconfig.json
- Use explicit return types for functions when not obvious
- Use `interface` for object shapes, `type` for unions/aliases
- Use `enum` for fixed sets of values (see `UploadState` in types.ts)
- Prefer `const` over `let`; avoid `var`

### Naming Conventions

- **Files**: PascalCase for components (e.g., `FileUploader.tsx`), camelCase for utilities (e.g., `apiService.ts`)
- **Components**: PascalCase (e.g., `const FileUploader: React.FC = ...`)
- **Interfaces**: PascalCase with `I` prefix optional (current codebase uses none: `Track`, `AppSettings`)
- **Variables/functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for configuration objects

### Imports

- React imports: `import React, { useState, useEffect } from 'react'`
- Type imports: `import type { Track, ApiResponse } from './types'`
- Group imports: external first, then internal components, then relative
- Use absolute paths for internal imports (`./components/...`)

### React Patterns

- Use functional components with explicit `React.FC` typing
- Prefer hooks (`useState`, `useEffect`) over class components
- Destructure props in component parameters
- Extract reusable logic into custom hooks if needed
- Use `useCallback` or `useMemo` for expensive operations

### Error Handling

- Use try/catch for async operations
- Check error types: `err instanceof Error`
- Display user-friendly error messages in UI
- Log errors to console with context: `console.error('Error identifying track:', error)`

### CSS / Tailwind

- Use Tailwind utility classes (current setup uses CDN)
- Keep custom styles minimal; prefer Tailwind classes
- Use responsive classes (e.g., `max-w-md`, `md:flex`)
- Dark theme colors: `bg-gray-900`, `text-gray-100`, `border-gray-700`
- Accent color: `green-400` / `green-600`

### Server (Express)

- Use async/await for route handlers
- Return appropriate HTTP status codes (200, 400, 500)
- Validate required fields in request body
- Handle errors with try/catch blocks
- Use JSON responses with `success` flag pattern

### Best Practices

- Never commit secrets (API keys, credentials) - use environment variables
- Keep components focused on single responsibility
- Extract types to `types.ts` for shared interfaces
- Use TypeScript strict mode - no `any` types
- Handle loading and error states in UI
- Use enum for state machine patterns (see `UploadState`)