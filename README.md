# InkSpire - Note Taking Application

A full-stack note-taking application with user authentication, friend requests, and real-time notifications built with React and Node.js.

## Features

- User authentication (register/login with JWT)
- Create, read, update, and delete notes
- Friend request system
- User notifications
- Secure password hashing with bcrypt
- MongoDB database integration

## Tech Stack

**Frontend:**
- React 19.1.1
- React Router DOM 7.7.1
- Axios for API calls
- React Scripts 5.0.1

**Backend:**
- Node.js with Express 5.1.0
- MongoDB with Mongoose 8.17.0
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (running locally or MongoDB Atlas account)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd NodePracticeLink
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory (or modify the existing one):

```env
MONGO_URI=mongodb://localhost:27017/inkspire
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

**Important:** Change `your_jwt_secret_key_here` to a secure random string for production.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system:

**For local MongoDB:**
```bash
mongod
```

**For MongoDB Atlas:**
- Update the `MONGO_URI` in `backend/.env` with your Atlas connection string

## Running the Application

You need to run both the backend and frontend servers.

### Start Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:5000`

### Start Frontend Server

Open a new terminal window:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Notes
- `GET /api/notes` - Get all notes (authenticated)
- `POST /api/notes` - Create a new note (authenticated)
- `PUT /api/notes/:id` - Update a note (authenticated)
- `DELETE /api/notes/:id` - Delete a note (authenticated)

### Users
- `GET /api/users` - Get all users (authenticated)

### Friend Requests
- `POST /api/friend-request` - Send friend request (authenticated)
- `GET /api/friend-request` - Get friend requests (authenticated)

## Project Structure

```
NodePracticeLink/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── noteController.js  # Note CRUD operations
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Note.js            # Note schema
│   │   ├── FriendRequest.js   # Friend request schema
│   │   └── Notification.js    # Notification schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── noteRoutes.js      # Note endpoints
│   │   ├── users.js           # User endpoints
│   │   └── friendRequest.js   # Friend request endpoints
│   ├── .env                   # Environment variables
│   ├── server.js              # Express server setup
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/inkspire |
| JWT_SECRET | Secret key for JWT tokens | your_jwt_secret_key |
| PORT | Backend server port | 5000 |

## Development

### Running Tests

**Frontend:**
```bash
cd frontend
npm test
```

**Backend:**
```bash
cd backend
npm test
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `frontend/build` folder.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check if the `MONGO_URI` in `.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Set `PORT=3001` (or another port) before running `npm start`

### CORS Issues
- Ensure the backend CORS configuration allows your frontend URL
- Check that both servers are running

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC

## Author

Your Name

---

**Note:** This is a practice project for learning full-stack development with the MERN stack.
