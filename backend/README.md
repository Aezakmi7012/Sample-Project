# Blogging Platform Backend

A secure blogging platform backend built with Express.js, Prisma ORM, and JWT authentication.

## Features

- **Authentication & Authorization**
  - User registration and login with JWT
  - Role-based access control (USER, ADMIN)
  - Password hashing with bcrypt
  - Rate limiting on login route (5 attempts per 15 minutes)

- **Blog Posts**
  - Create, read, update, and delete posts
  - Pagination support
  - Timestamps (createdAt, updatedAt)
  - Owner can update/delete their posts
  - Admin can delete any post

- **Security**
  - Helmet.js for security headers
  - CORS configuration
  - CSRF protection
  - XSS prevention with HTML sanitization
  - Input validation with Zod
  - Parameterized queries (Prisma)
  - httpOnly cookies for JWT storage

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update database connection string and secrets

3. Initialize Prisma:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Start the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (rate limited)
- `POST /api/auth/logout` - Logout user

### Posts
- `GET /api/posts` - Get all posts (public, paginated)
- `GET /api/posts/:id` - Get single post (public)
- `POST /api/posts` - Create post (authenticated)
- `PUT /api/posts/:id` - Update post (owner only)
- `DELETE /api/posts/:id` - Delete post (owner or admin)

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/                # Configuration files
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── routes/                # API routes
│   ├── schemas/               # Zod validation schemas
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   └── server.js              # Main application file
├── .env                       # Environment variables
├── .env.example               # Example environment variables
└── package.json
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

ISC
