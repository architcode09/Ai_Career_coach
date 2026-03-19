# AI Career Coach (React + Vite + MERN Backend)

This repository contains:
- Frontend: React + Vite (`/` root)
- Backend: Express + MongoDB (`/server`)

## 1) Install dependencies

Frontend:
```bash
npm install
```

Backend:
```bash
cd server
npm install
```

## 2) Environment files

Backend env is in:
- `server/.env`

Frontend env values are in:
- `.env` (root)
- `src/.env` (added as requested)

## 3) Run in development

Start backend (port 5000):
```bash
cd server
npm run dev
```

Start frontend (port 5173):
```bash
npm run dev
```

## 4) Build frontend

```bash
npm run build
npm run preview
```

## API Base URL

Frontend uses:
- `VITE_API_URL=http://localhost:5000/api`
