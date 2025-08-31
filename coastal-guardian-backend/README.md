# TAT-RAKSHAK Coastal Guardian Backend

A comprehensive Node.js/Express backend API for the Coastal Guardian system that supports community-powered coastal threat reporting and authority management.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 🚨 **Alert Management** - CRUD operations for coastal alerts with comments system
- 📝 **Report Management** - User report submission and authority review system
- 🌊 **Algae Bloom Analysis** - Heat maps, graphs, and detailed analysis
- 🌪️ **Natural Calamity Prediction** - Risk assessment and prediction data
- 📁 **File Upload** - Support for images, videos, and documents
- 📊 **Dashboard Analytics** - Real-time statistics and activity monitoring
- 🛡️ **Security** - Rate limiting, CORS, helmet, and input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Setup Instructions

### 1. Environment Configuration

Update the `.env` file with your MongoDB Atlas connection string and other settings:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/coastal-guardian?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# Other settings are pre-configured
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Alerts
- `GET /api/alerts` - Get all alerts (public)
- `GET /api/alerts/:id` - Get single alert (public)
- `POST /api/alerts` - Create alert (authority only)
- `PUT /api/alerts/:id` - Update alert (authority only)
- `DELETE /api/alerts/:id` - Delete alert (authority only)
- `POST /api/alerts/:id/comments` - Add comment to alert (public)

### Requests
- `GET /api/requests` - Get all requests (authority only)
- `GET /api/requests/:id` - Get single request (authority only)
- `POST /api/requests` - Submit new request (public)
- `PUT /api/requests/:id/status` - Update request status (authority only)
- `DELETE /api/requests/:id` - Delete request (authority only)

### Algae Data
- `GET /api/algae` - Get algae data (authority only)
- `GET /api/algae/latest` - Get latest analysis (authority only)
- `GET /api/algae/heatmap` - Get heatmap data (authority only)
- `POST /api/algae` - Create algae data (authority only)
- `PUT /api/algae/:id` - Update algae data (authority only)

### Calamity Data
- `GET /api/calamity` - Get calamity data (authority only)
- `GET /api/calamity/latest` - Get latest analysis (authority only)
- `GET /api/calamity/heatmap` - Get heatmap data (authority only)
- `POST /api/calamity` - Create calamity data (authority only)
- `PUT /api/calamity/:id` - Update calamity data (authority only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (authority only)
- `GET /api/dashboard/activity` - Get recent activity (authority only)
- `GET /api/dashboard/alerts-distribution` - Get alerts distribution (authority only)
- `GET /api/dashboard/analytics` - Get time-based analytics (authority only)

### File Upload
- `POST /api/upload/single` - Upload single file (public)
- `POST /api/upload/multiple` - Upload multiple files (public)

### Utilities
- `GET /api/health` - Health check endpoint
- `GET /` - API information and endpoints list

## Data Models

### User
- Email, password, username, role (user/authority), organization
- BCrypt password hashing
- JWT token generation

### Alert
- Type, location, description, severity, status
- Comments system
- Media attachments
- Authority association

### Request
- Reporter info, type, location, description
- Status (pending/approved/rejected)
- Review system with notes
- Media attachments

### AlgaeData
- Region, coordinates, intensity, temperature
- Heat map data, graphs, analysis
- Prediction information

### CalamityData
- Region, type, risk level, coordinates
- Weather and sea data
- Heat map data, prediction with probability

## Security Features

- JWT authentication with expiration
- Role-based access control
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- File upload restrictions (images, videos, PDFs only)
- CORS configuration
- Helmet security headers

## Frontend Integration

This backend is designed to work with the Next.js frontend in the coastal-guardian folder. The API responses are formatted to match the expected frontend data structure.

## Development

The backend includes comprehensive error handling, logging, and validation. All endpoints return consistent JSON responses with success/error status.

For questions or contributions, please refer to the TAT-RAKSHAK project documentation.
