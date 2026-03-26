Agentic coding guidelines for the Tracks Identifier project.

## Project Overview

A React + Express web app that identifies animal tracks using Google Gemini AI, designed to run on a Raspberry Pi. Optimized for Central European (Slovakia) wildlife.

## Build / Run Commands

```bash
# Development (runs both frontend + backend)
npm run start

# Or separately:
npm run server  # Express on port 3001
npm run dev    # Vite frontend on port 3003
```

- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:3001

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite 5, Tailwind CSS (CDN) |
| Backend | Express.js, Node.js |
| AI | Google Gemini Flash |
| Storage | CSV file (server/filesystem) |

## Project Structure

```
tracks_identifier/
├── src/                    # React frontend
│   ├── App.tsx             # Main app component
│   ├── index.tsx           # Entry point
│   ├── types.ts            # TypeScript interfaces
│   ├── components/         # React components
│   │   ├── FileUploader.tsx
│   │   ├── ResultsDisplay.tsx
│   │   ├── HistoryView.tsx
│   │   ├── Settings.tsx
│   │   ├── Spinner.tsx
│   │   └── ErrorDisplay.tsx
│   └── services/
│       └── apiService.ts   # Backend API calls
├── server/
│   ├── index.js            # Express server
│   └── tracks.csv          # Data storage (auto-created)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## CSV Format

| Column | Description |
|--------|-------------|
| timestamp | ISO 8601 date |
| species | Common name |
| scientificName | Latin name |
| family | Animal family |
| confidence | low/medium/high |
| imageUrl | Reference image URL |
| notes | Additional notes |

## Running on Pi

1. Copy project to Pi
2. `npm install`
3. `npm run start`
4. Access via `http://<pi-ip>:3003` from mobile

## API Endpoints

- `POST /api/identify` - Identify track from image
- `GET /api/tracks` - Get all tracks as JSON
- `GET /api/csv` - Download CSV file