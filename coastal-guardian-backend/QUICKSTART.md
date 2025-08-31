# Quick Start Guide

## 🚀 Getting Started

### 1. Setup MongoDB Atlas
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string
4. Update the `.env` file with your MongoDB URI

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Edit the `.env` file and update these values:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/coastal-guardian?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
```

### 4. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will be available at `http://localhost:5000`

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Create Authority User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "authority@coastal.gov",
    "password": "password123",
    "username": "coastal_authority",
    "role": "authority",
    "organization": "Coastal Guard"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "authority@coastal.gov",
    "password": "password123"
  }'
```

### Get Alerts
```bash
curl http://localhost:5000/api/alerts
```

### Create Alert (Authority Only)
Replace `YOUR_JWT_TOKEN` with the token from login:
```bash
curl -X POST http://localhost:5000/api/alerts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "Pollution",
    "location": "Test Beach",
    "description": "Oil spill detected near the shore",
    "severity": "High"
  }'
```

### Submit User Request
```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Illegal Dumping",
    "location": "City Harbor",
    "description": "Plastic waste dumped near fishing boats",
    "reporter": "citizen123"
  }'
```

## 📁 Project Structure

```
coastal-guardian-backend/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middleware/      # Auth, upload, validation middleware
├── models/          # MongoDB schemas
├── routes/          # API route definitions
├── uploads/         # File upload storage
├── utils/           # Utility functions
├── server.js        # Main application file
├── .env            # Environment variables
└── package.json    # Project dependencies
```

## 🔑 API Endpoints Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/health` | Public | Health check |
| POST | `/api/auth/register` | Public | User registration |
| POST | `/api/auth/login` | Public | User login |
| GET | `/api/alerts` | Public | Get all alerts |
| POST | `/api/alerts` | Authority | Create alert |
| GET | `/api/requests` | Authority | Get user requests |
| POST | `/api/requests` | Public | Submit request |
| PUT | `/api/requests/:id/status` | Authority | Update request status |
| GET | `/api/dashboard/stats` | Authority | Dashboard statistics |
| GET | `/api/algae/latest` | Authority | Latest algae analysis |
| GET | `/api/calamity/latest` | Authority | Latest calamity prediction |
| POST | `/api/upload/single` | Public | Upload single file |

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `MAX_FILE_SIZE` | Max file upload size | 5000000 |

## ⚠️ Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Enable SSL/HTTPS
4. Configure proper CORS origins
5. Set up proper logging
6. Use PM2 or similar for process management
