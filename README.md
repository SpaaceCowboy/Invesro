

## Features

- **JWT Authentication** - Secure token-based authentication
- **Token Whitelisting** - Tokens are stored in MongoDB and validated on each request
- **Role-Based Access Control** - Three roles: `user`, `moderator`, `admin`
- **Logout Functionality** - Invalidates tokens from whitelist
- **Logout from All Devices** - Invalidates all tokens for a user

## Project Structure

```
fullstack-app/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT verification & role authorization
│   ├── models/
│   │   ├── User.js            # User model with roles
│   │   └── TokenWhitelist.js  # JWT whitelist model
│   ├── routes/
│   │   ├── auth.js            # Auth routes (login, register, logout)
│   │   └── protected.js       # Protected routes example
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Express server
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── components/
    │   │   ├── Dashboard.tsx
    │   │   ├── LoginForm.tsx
    │   │   └── RegisterForm.tsx
    │   └── context/
    │       └── AuthContext.tsx
    ├── .env.local
    ├── package.json
    └── next.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth_app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/logout` | Logout (invalidate token) | Private |
| POST | `/logout-all` | Logout from all devices | Private |
| GET | `/me` | Get current user | Private |

### Protected Routes (`/api/protected`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/user` | User-level access | All authenticated |
| GET | `/moderator` | Moderator-level access | moderator, admin |
| GET | `/admin` | Admin-level access | admin only |

## Token Whitelisting

When a user logs in, their JWT token is stored in the `TokenWhitelist` collection. On every protected request:

1. Token is extracted from `Authorization: Bearer <token>` header
2. Token is checked against the whitelist
3. If not whitelisted, request is rejected
4. If whitelisted, JWT is verified and user is authenticated

On logout, the token is removed from the whitelist, immediately invalidating it.

## Creating Admin Users

By default, all registered users get the `user` role. To create an admin:

1. Register a normal user
2. Use MongoDB shell or Compass to update the role:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```


## Security Notes

1. **Change JWT_SECRET** - Use a strong, random secret in production
2. **HTTPS** - Always use HTTPS in production
3. **Rate Limiting** - Consider adding rate limiting for auth endpoints
4. **Password Requirements** - Enforce stronger password policies as needed
5. **Token Expiration** - Adjust `JWT_EXPIRES_IN` based on your security requirements


