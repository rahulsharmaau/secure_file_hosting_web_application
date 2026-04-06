# Secure File Hosting Web Application

A full-stack web application that allows users to register, log in, upload files, view file listings, and delete their own files. Built with React, Express.js, and MongoDB.

## Tech Stack

- **Frontend:** React (Vite), React Router
- **Backend:** Express.js, Node.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (jsonwebtoken), bcryptjs

## Folder Structure

```
secure_file_hosting_web_application/
├── backend/
│   ├── config/db.js           # MongoDB connection
│   ├── middleware/auth.js     # JWT verification middleware
│   ├── models/User.js         # User schema
│   ├── models/File.js         # File metadata schema
│   ├── routes/auth.js         # Register & Login routes
│   ├── routes/files.js        # Upload, listing & delete routes
│   ├── uploads/               # Uploaded files storage
│   ├── server.js              # Express app entry point
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/Navbar.jsx
│   │   ├── pages/Register.jsx
│   │   ├── pages/Login.jsx
│   │   ├── pages/Upload.jsx
│   │   ├── pages/Downloads.jsx
│   │   └── pages/MyFiles.jsx
│   └── vite.config.js
├── uploads/                   # Root-level uploads directory
└── README.md
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (running locally on `mongodb://localhost:27017`)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/rahulsharmaau/secure_file_hosting_web_application
cd secure_file_hosting_web_application
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (or update the existing one):

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/secure_file_hosting
JWT_SECRET=secureFileHostingCosc2956Secret
```

Start the backend server:

```bash
node server.js
```

The backend will run on `http://localhost:5001`.

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`.

### 4. Open in browser

Navigate to `http://localhost:5173` in your web browser.

## API Endpoints


| Method | Endpoint            | Description                               | Auth Required |
| ------ | ------------------- | ----------------------------------------- | ------------- |
| POST   | `/api/register`     | Register a new user                       | No            |
| POST   | `/api/login`        | Log in and receive a token                | No            |
| POST   | `/api/upload`       | Upload a file (.pdf or .mp4, max 20MB)    | Yes           |
| GET    | `/api/public-files` | List all uploaded files                   | Yes           |
| GET    | `/api/my-files`     | List files uploaded by the logged-in user | Yes           |
| DELETE | `/api/files/:id`    | Delete a file owned by the logged-in user | Yes           |


### API Details

#### POST /api/register

- **Body:** `{ "username": "string", "email": "string", "password": "string" }`
- **Success:** `201` — `{ "message": "User registered successfully." }`
- **Error:** `400` — `{ "message": "The email is already registered" }`

#### POST /api/login

- **Body:** `{ "email": "string", "password": "string" }`
- **Success:** `200` — `{ "token": "jwt_token_string" }`
- **Error:** `400` — `{ "message": "Invalid credentials." }`

#### POST /api/upload

- **Headers:** `Authorization: Bearer <token>`
- **Body:** `multipart/form-data` with field name `file`
- **Supported formats:** `.pdf`, `.mp4`
- **Max file size:** 20MB
- **Success:** `201` — `{ "message": "File uploaded successfully.", "file": { ... } }`

#### GET /api/public-files

- **Headers:** `Authorization: Bearer <token>`
- **Success:** `200` — Array of file objects with `filename`, `size`, `uploaded_at`, `owner`

#### GET /api/my-files

- **Headers:** `Authorization: Bearer <token>`
- **Success:** `200` — Array of file objects belonging to the authenticated user

#### DELETE /api/files/:id

- **Headers:** `Authorization: Bearer <token>`
- **Success:** `200` — `{ "message": "File deleted successfully." }`
- **Error:** `403` — `{ "message": "Unauthorized to delete this file." }`

## Frontend Pages


| Page      | Route        | Description                                          |
| --------- | ------------ | ---------------------------------------------------- |
| Register  | `/register`  | User registration form                               |
| Login     | `/login`     | User login form                                      |
| Upload    | `/upload`    | File upload form (protected)                         |
| Downloads | `/downloads` | List all files from all users (protected)            |
| My Files  | `/my-files`  | List user's own files with delete option (protected) |


## Security Features

- Passwords are hashed using bcryptjs before storage
- JWT tokens are used for authentication on all protected routes
- File types are restricted to `.pdf` and `.mp4` (validated by both extension and MIME type)
- File size is limited to 20MB
- Filenames are sanitized to prevent path traversal
- Only file owners can delete their own files
- Passwords are never returned in API responses

