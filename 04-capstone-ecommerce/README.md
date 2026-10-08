# Capstone E-Commerce Web Application

Final Week 4 capstone based on the E-Commerce Web Application option.

## Features

- React frontend + Express backend
- MongoDB / Mongoose persistence
- Signup and login
- bcrypt password hashing
- JWT authentication
- Product listing and search
- Cart
- Order placement and order history
- Admin product dashboard
- Protected routes
- Vercel-ready frontend configuration
- Render-ready backend configuration
- MongoDB Atlas compatible environment setup

## Local Setup

```bash
npm install
npm run install:all
```

Copy `server/.env.example` to `server/.env`.

Then run:

```bash
npm run dev
```

## Admin Account

Set `ADMIN_EMAIL` in `server/.env`. Any account registered using that email becomes an admin account.

## Deployment

### Frontend — Vercel

Deploy the `client` folder.

Set:

```text
VITE_API_URL=https://YOUR-RENDER-BACKEND.onrender.com/api
```

### Backend — Render

Deploy the `server` folder.

Set environment variables:

```text
MONGO_URI=<your MongoDB Atlas URI>
JWT_SECRET=<your secure JWT secret>
ADMIN_EMAIL=<your admin email>
```

### Database — MongoDB Atlas

Use your Atlas connection string as `MONGO_URI`.
