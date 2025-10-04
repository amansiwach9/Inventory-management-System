# Inventory Management System

A full-stack inventory management application built with Node.js, Express, React, and MySQL. This project demonstrates enterprise-grade architecture with role-based access control, secure authentication, and a modern responsive interface.

## Live Demo

- **Frontend:** [View Application](https://inventory-management-system-ivory-six.vercel.app/)
- **Backend API:** [API Documentation](https://inventory-management-system-1-yol2.onrender.com)

## Features

### Backend API
- **Authentication & Authorization**
  - User registration with OTP email verification (SendGrid integration)
  - JWT-based authentication with secure token management
  - Role-based access control (Admin/User roles)
  - Password hashing with bcrypt

- **Core Functionality**
  - RESTful CRUD operations for Products, Suppliers, and Categories
  - Relational database design with Prisma ORM
  - Request validation and sanitization
  - Rate limiting to prevent abuse
  - Centralized error handling middleware

- **Architecture**
  - Service-oriented architecture with clear separation of concerns
  - Route → Controller → Service layer pattern
  - Follows SOLID principles for maintainability
  - Comprehensive API documentation

### Frontend Application
- **User Interface**
  - Modern, responsive design with Material-UI components
  - Role-aware interface (conditional rendering based on user permissions)
  - Interactive data tables with sorting and filtering
  - Form validation and user feedback

- **Authentication Flow**
  - Complete signup, login, and OTP verification workflow
  - Protected routes with automatic redirection
  - Persistent authentication state management

- **API Integration**
  - Centralized Axios instance with JWT interceptors
  - Error handling and loading states
  - Automatic token refresh mechanism

## Technology Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Node.js, Express.js, Prisma ORM, MySQL |
| **Authentication** | JWT, bcrypt, SendGrid |
| **Frontend** | React, Vite, Material-UI, Axios |
| **Database** | MySQL (Railway) |
| **Deployment** | Render (Backend), Vercel (Frontend) |

## Project Structure

```
inventory-management-system/
├── server/                 # Backend API
│   ├── controllers/        # Request handlers
│   ├── services/          # Business logic layer
│   ├── routes/            # API route definitions
│   ├── middleware/        # Authentication, validation, error handling
│   ├── prisma/            # Database schema and migrations
│   └── utils/             # Helper functions
│
└── client/                # Frontend application
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Route-level components
    │   ├── api/           # API service layer
    │   ├── services/      # Business logic services
    │   ├── context/       # React Context providers
    │   ├── hooks/         # Custom React hooks
    │   └── routes/        # Route configuration
    └── public/
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL database instance
- SendGrid API key (for email verification)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="mysql://user:password@localhost:3306/inventory_db"
JWT_SECRET="your-secure-jwt-secret"
SENDGRID_API_KEY="your-sendgrid-api-key"
EMAIL_FROM="noreply@yourdomain.com"
PORT=5000
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. (Optional) Seed the database:
```bash
npx prisma db seed
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env.local
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Documentation

Complete API documentation is available in the `/server` directory. Import the Postman collection to explore all available endpoints:

- Authentication (Register, Verify OTP, Login)
- Products (CRUD operations)
- Suppliers (CRUD operations)
- Categories (CRUD operations)

### Sample API Endpoints

```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/verify-otp        # Verify email
POST   /api/v1/auth/login             # User login
GET    /api/v1/products               # Get all products
POST   /api/v1/products               # Create product (Admin only)
PUT    /api/v1/products/:id           # Update product (Admin only)
DELETE /api/v1/products/:id           # Delete product (Admin only)
```

## Security Features

- Password hashing using bcrypt (10 salt rounds)
- JWT token-based authentication with expiration
- Role-based authorization middleware
- Rate limiting on authentication endpoints
- Input validation and sanitization
- SQL injection prevention via Prisma ORM
- CORS configuration
- Environment variable protection

## Scalability Considerations

This application is designed with scalability in mind. Future enhancements may include:

### Performance Optimization
- **Redis Caching:** Cache frequently accessed data to reduce database load
- **Database Indexing:** Optimize query performance with strategic indexes
- **Query Optimization:** Implement pagination and lazy loading

### Infrastructure
- **Containerization:** Docker and Docker Compose for consistent environments
- **Load Balancing:** Distribute traffic across multiple server instances
- **CDN Integration:** Serve static assets via content delivery network

### Architecture Evolution
- **Microservices:** Split monolithic application into independent services
- **Message Queuing:** Implement asynchronous processing with RabbitMQ/Redis
- **API Gateway:** Centralized routing and rate limiting
- **Monitoring:** Application performance monitoring (APM) and logging

## Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Configure environment variables in Render dashboard
3. Deploy from the `server` directory

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure `VITE_API_URL` environment variable

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- Built as part of the Backend Developer Intern assignment
- Material-UI for the component library
- Prisma for the excellent ORM
- SendGrid for email delivery services

## Contact

For questions or support, please open an issue in the repository or contact the development team.

---

**Note:** This is a portfolio/assignment project demonstrating full-stack development capabilities with modern technologies and best practices.