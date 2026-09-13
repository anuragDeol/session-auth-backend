# Session Auth — Backend

Express + MongoDB backend for username/password authentication using server-side sessions.

**Live API:** https://session-auth-backend.onrender.com

**Frontend github repo:** https://github.com/anuragDeol/session-auth-frontend

## Features

- Register / login / logout with hashed passwords (bcrypt)
- Server-side sessions stored in MongoDB (`connect-mongo`)
- Protected route middleware for authenticated endpoints
- Rate limiting on login
- Cookie configuration that works across separate frontend/backend domains in production

## Tech Stack

- Node.js / Express 5
- MongoDB with Mongoose
- express-session + connect-mongo
- bcryptjs
- express-rate-limit

## API Routes

| Method | Route                | Description                          | Auth required |
|--------|-----------------------|--------------------------------------|----------------|
| POST   | `/api/auth/register`  | Create a new user, logs them in      | No             |
| POST   | `/api/auth/login`     | Log in with username + password      | No             |
| POST   | `/api/auth/logout`    | Destroy the current session          | Yes            |
| GET    | `/api/auth/me`        | Get the currently logged-in user     | Yes            |

## Running Locally

1. Clone and install:
   ```
   git clone https://github.com/anuragDeol/session-auth-backend.git
   cd session-auth-backend
   npm install
   ```

2. Create a `.env` file:
   ```
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=generated_secret
   PORT=7000
   CLIENT_URL=http://localhost:3000
   ```

3. Run:
   ```
   npm run dev
   ```

   API runs at `http://localhost:7000`.
