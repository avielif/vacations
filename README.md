# Vacations — Full-Stack Vacation Management System

A full-stack web application for browsing, following, and managing vacation packages. Users can register, log in, and follow vacations they're interested in with live-updating follower counts. Admins get a dashboard to create, edit, and delete vacations (with image uploads) and view follower statistics.

## Features

- **Authentication & authorization** — JWT-based login/register with role-based access control (User / Admin)
- **Follow system** — users can follow/unfollow vacations, with follower counts updated in real time via WebSockets
- **Admin vacation management** — full CRUD for vacations, including image upload
- **Stats dashboard** — chart of vacations by follower count (Chart.js)
- **CSV export** — download vacation data as CSV
- **End-to-end test suite** — Playwright tests covering core user flows

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Redux (state management)
- React Router
- Axios
- Socket.IO client
- Chart.js / react-chartjs-2
- React Hook Form
- SweetAlert2
- react-csv / react-csv-downloader

**Backend**
- Node.js + Express 5 + TypeScript
- MySQL (mysql2)
- JWT authentication (jsonwebtoken) + bcrypt password hashing
- Joi (request validation)
- Multer (image uploads)
- Socket.IO (real-time follower updates)

**Testing**
- Playwright (end-to-end tests)

## Project Structure

```
vacations/
├── backend/     # Express + TypeScript REST API
├── frontend/    # React + TypeScript client
└── testing/     # Playwright E2E test suite
```

## Getting Started

### Prerequisites
- Node.js
- A running MySQL server

### Backend

```bash
cd backend
npm install
```

Database and JWT settings are configured in `backend/src/utils/app-config.ts`. Update the `host`, `user`, `password`, and `database` fields to match your local MySQL setup before running the API:

```typescript
public readonly host = "localhost";
public readonly user = "root";
public readonly password = "your_db_password";
public readonly database = "vacations_project";
```

Run the API:

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The app runs at `http://localhost:3000` by default and expects the API at `http://localhost:4000`.

### End-to-end tests

```bash
cd testing
npm install
npx playwright test
```

## License

ISC
