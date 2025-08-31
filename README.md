## **URL Shortener**

A full-stack URL Shortener application built with NestJS (backend), MongoDB, and React (frontend).
Users can register, log in, shorten URLs, and view their URL history.

### **Features**

- User authentication with JWT
- Secure password storage
- URL shortening with redirection
- URL history tracking per user
- Form validation and centralized error handling
- RESTful API architecture

### **Tech Stack**

- Backend: NestJS, MongoDB
- Frontend: React
- Deployment: Vercel (frontend), Render (backend)

### **Setup & Installation**

1. Clone the repository
```
git clone https://github.com/muhduvais/url-shortener.git
cd url-shortener
```

2. Backend Setup
```
cd backend
npm install
npm run start:dev
```

 Runs on - http://localhost:3000

3. Frontend Setup
```
cd frontend
npm install
npm start
```

 Runs on - http://localhost:5173 (default Vite server)

### **Environment Variables**

**Backend (.env)**

 Create a .env file inside the backend/ directory and add:
```
PORT=3000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
MONGO_URI=your_mongodb_connection_string
BASE_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
```
**Frontend (.env)**

 Create a .env file inside the frontend/ directory and add:
```
VITE_SERVER_URL=http://localhost:3000
```
### **Deployment**

- Frontend: Vercel
- Backend: Render

### **Folder Structure**

.
├── backend
│   ├── dist                # Compiled output (JS + .d.ts)
│   ├── src                 # Main backend source code
│   │   ├── auth            # Authentication module
│   │   ├── common          # Constants & filters
│   │   ├── config          # Configuration (JWT, DB, etc.)
│   │   ├── routes          # API route definitions
│   │   ├── url             # URL shortener module
│   │   ├── user            # User module
│   │   └── utils           # Utilities
│   ├── test                # E2E and unit tests
│   ├── package.json
│   └── tsconfig.json
│
├── frontend
│   ├── public              # Static files
│   ├── src                 # Frontend source code
│   │   ├── api             # API client & services
│   │   ├── assets          # Images, SVGs, etc.
│   │   ├── components      # Reusable React components
│   │   ├── pages           # App pages (Home, Login, etc.)
│   │   ├── schemas         # Validation schemas
│   │   ├── store           # Redux store
│   │   └── App.tsx         # Root component
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── README.md

### **Future Improvements**

- Add click tracking for shortened URLs
- Analytics dashboard for users
- Testing (unit & e2e)
- Docker support
