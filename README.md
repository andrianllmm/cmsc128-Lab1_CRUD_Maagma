# CMSC 128 Lab 1 CRUD

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Node + Express + TypeScript
- Database: MongoDB (Mongoose)
- Package manager: pnpm

## Prerequisites

- Node.js and pnpm
- MongoDB running locally (or an Atlas connection string)

## Setup

Install dependencies:

```
pnpm install
```

Copy env files and adjust if needed:

```
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Start MongoDB locally (if not already running):

```
mongod
```

Run backend:

```
cd backend
pnpm dev
```

Run frontend:

```
cd frontend
pnpm dev
```

## Verify

- Backend health check: http://localhost:3000/api/health
- Frontend: http://localhost:5173
