í³¦ Inventory Management System â€“ Full Stack

A complete full-stack inventory management application, developed as part of the Backend Developer Intern assignment.
The project features a scalable Node.js backend API and a responsive React frontend powered by Material-UI.

íº€ Live Demo

Frontend (Vercel): View App

Backend API (Render): Explore API

âœ¨ Features
í´¹ Backend (Primary Focus)

âœ… Authentication â€“ Secure user registration with OTP email verification (via SendGrid) & login with JWT.

âœ… Role-Based Access Control (RBAC) â€“ Admin/User roles with protected routes & distinct permissions.

âœ… CRUD APIs â€“ Full Create, Read, Update, Delete for Products, Suppliers, and Categories.

âœ… Database â€“ Relational schema using Prisma with MySQL.

âœ… Security â€“ Password hashing (bcrypt), centralized error handling, and express-rate-limit to prevent brute-force attacks.

âœ… Scalable Architecture â€“ Built using SOLID principles with clear separation of routes, controllers, and service layer.

í´¹ Frontend (Supportive)

âœ… React + Material-UI â€“ Modern, responsive, and professional UI.

âœ… Complete Auth Flow â€“ Login, Signup, OTP Verification pages.

âœ… Role-Aware UI â€“ Admins get "Create/Delete" options; regular users see restricted actions.

âœ… Data Management â€“ Interactive tables for Products, Suppliers, and Categories.

âœ… API Integration â€“ Centralized Axios instance with JWT interceptors.

í» ï¸ Tech Stack
Category	Technologies
Backend	Node.js, Express.js, Prisma, MySQL, JWT, SendGrid, bcryptjs
Frontend	React, Vite, Material-UI, Axios, React Router
Database	MySQL (hosted on Railway)
Deployment	Render (Backend), Vercel (Frontend)
í³‚ Project Structure
inventory-management-system/
â”‚
â”œâ”€â”€ /server   # Backend API (Node.js + Express + Prisma)
â””â”€â”€ /client   # Frontend UI (React + Material-UI)

âš™ï¸ Running Locally
Prerequisites

Node.js (v18+)

npm / yarn

A running MySQL instance

í´§ Backend Setup (/server)
cd server
npm install
cp .env.example .env   # Fill in DB URL, JWT secret, SendGrid credentials
npx prisma migrate dev # Run database migrations
npx prisma db seed     # (Optional) Seed database with sample data
npm run dev            # Start server at http://localhost:5000

í¾¨ Frontend Setup (/client)
cd client
npm install
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env.local
npm run dev   # Runs frontend at http://localhost:5173

í³ˆ Scalability Roadmap

This system is built with scalability in mind. Future improvements include:

Caching with Redis â€“ Reduce DB load & improve performance for frequent GET requests.

Containerization with Docker â€“ Ensure reproducible environments & smooth deployments (Docker + docker-compose).

Load Balancing â€“ Distribute traffic across multiple backend instances with Nginx or cloud load balancers.

Microservices Architecture â€“ Split monolith into services (Auth, Inventory, Suppliers) for independent scaling, using RabbitMQ or lightweight APIs for communication.

í³š API Documentation

A complete Postman collection with all API endpoints is included in the /server directory.
