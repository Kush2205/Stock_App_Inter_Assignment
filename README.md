# Stock App Intern Assignment

This repository contains a Bun/Express backend and a Vite/React frontend for a simple stock watchlist application built on MongoDB + Prisma.

## Prerequisites

- **Node.js 20+** (or install [Bun](https://bun.sh) which is used by both apps)
- **Bun 1.1+** (preferred runtime/package manager)
- **Docker** (optional, for MongoDB or containerized runs)

## Environment Variables

Each app keeps its own `.env` file. Duplicate the provided examples when available and adjust the values before running.

### Backend (`backend/.env`)

```
DATABASE_URL="mongodb://localhost:27017/stock-app?replicaSet=rs0"
JWT_SECRET="replace-me"
PORT=8080
```

The MongoDB connection string must point to a replica-set capable server. See the section below for a quick local setup.

### Frontend (`frontend/.env`)

```
VITE_API_BASE_URL="http://localhost:8080"
```

## MongoDB Replica Set (local)

Prisma needs MongoDB transactions. Start a single-node replica set locally:

```bash
# stop any existing mongod first
mongod --replSet rs0 --bind_ip localhost --dbpath /path/to/mongodb-data
# new shell once the server is listening
mongosh --eval "rs.initiate()"
```

Leave `mongod` running whenever you work on the project.

## Backend (Express + Prisma)

```bash
cd backend
bun install
bun run dev       # watches and restarts on change
```

Common scripts:

- `bun run index.ts` – production-style start
- `bun run lint` – lint backend code (if defined)
- `bun run migrate` – run Prisma migrations (if scripts exist)

The backend listens on `http://localhost:8080` by default. Adjust `PORT` in `.env` to change it.

## Frontend (Vite + React)

```bash
cd frontend
bun install
bun run dev       # starts Vite dev server on http://localhost:5173
```

To create a production build and preview it:

```bash
bun run build
bun run preview   # serves dist/ on http://localhost:4173
```

## Running Everything Together

1. Start MongoDB with replica set support.
2. In one terminal, run the backend (`bun run dev` inside `backend/`).
3. In another terminal, run the frontend (`bun run dev` inside `frontend/`).
4. Visit `http://localhost:5173` and log in/sign up. The frontend will proxy API calls to the backend using `VITE_API_BASE_URL`.

## Docker Notes

- **Frontend**: Build the Vite app using `bun run build`, then serve the `dist/` directory with your preferred static server (`bun run preview`, `serve`, Nginx, etc.).
- **Backend**: You can wrap the backend in a container; ensure the MongoDB replica set is reachable from within the container.

## Project Structure

```
backend/   # Bun + Express API, Prisma client
frontend/  # Vite + React UI
```

## Testing & Linting

Run linting from each package:

```bash
cd backend
bun run lint

cd ../frontend
bun run lint
```

Add additional tests/lint scripts as the project grows.

## Troubleshooting

- **`P2031` Prisma errors**: Ensure MongoDB is running as a replica set (`rs.status()` in `mongosh` should show `PRIMARY`).
- **CORS/Networking**: Make sure `VITE_API_BASE_URL` matches the backend URL available to the browser.
- **Bun missing**: Install via `curl -fsSL https://bun.sh/install | bash` or fall back to npm/yarn (update scripts accordingly).
