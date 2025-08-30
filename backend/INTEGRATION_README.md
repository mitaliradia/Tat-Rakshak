# Coastal AI Monitoring System - Backend Integration

This document explains how the Node.js backend integrates with the Python AI/ML code to provide coastal monitoring capabilities.

## 🏗️ Architecture Overview

```
Frontend (React/Next.js) 
    ↓
Node.js Backend (Express)
    ↓
Python AI/ML Service
    ↓
Coastal AI Analyst (Original AI/ML Code)
```

## 📁 File Structure

```
backend/
├── server.js                 # Main Node.js server
├── python_service.py         # Python service wrapper
├── services/
│   └── aiService.js         # Node.js AI service interface
├── routes/
│   └── ai.js                # AI analysis API routes
├── requirements.txt          # Python dependencies
├── setup_integration.py     # Setup and testing script
└── INTEGRATION_README.md    # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Set Environment Variables

Create a `.env` file in the backend directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/coastal_monitoring

# Groq API Key for AI inference
GROQ_API_KEY=your_groq_api_key_here

# Node.js Environment
NODE_ENV=development
PORT=5000
```

### 3. Run Setup Script

```bash
python setup_integration.py
```

This script will:
- Check Python dependencies
- Verify environment variables
- Test the Python service
- Create .env template if needed

### 4. Start the Backend

```bash
npm run dev
```

## 🔌 API Endpoints

### AI Analysis Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/health` | GET | Check AI service health |
| `/api/ai/analyze/:location` | GET | Run AI analysis for specific location |
| `/api/ai/analyze-all` | GET | Run AI analysis for all locations |
| `/api/ai/latest-results` | GET | Get latest analysis results |
| `/api/ai/location/:location/history` | GET | Get historical data for location |

### Supported Locations

- `Pulicat Lake`
- `Sunderbans`
- `Goa Coast`
- `Kochi`

## 🐍 Python Service Integration

### How It Works

1. **Node.js Backend** receives API requests
2. **AI Service** spawns Python process with `python_service.py`
3. **Python Service** imports and runs the original `CoastalAIAnalyst`
4. **Results** are returned as JSON to Node.js
5. **Node.js** sends response to frontend

### Python Service Commands

```bash
# Analyze specific location
python python_service.py analyze "Pulicat Lake"

# Analyze all locations
python python_service.py analyze_all
```

### Error Handling

The integration includes comprehensive error handling:
- Python process failures
- Import errors
- Analysis failures
- Timeout handling
- JSON parsing errors

## 🔧 Configuration

### Python Path

If you have multiple Python versions, you can set the path:

```javascript
// In your Node.js code
const aiService = require('./services/aiService');
aiService.setPythonPath('/usr/bin/python3');
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `GROQ_API_KEY` | Groq API key for AI inference | Yes |
| `PYTHON_PATH` | Python executable path | No (default: 'python') |

## 🧪 Testing

### Test Python Service

```bash
# Test with specific location
python python_service.py analyze "Pulicat Lake"

# Test all locations
python python_service.py analyze_all
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/api/ai/health

# Analyze location
curl http://localhost:5000/api/ai/analyze/Pulicat%20Lake

# Get latest results
curl http://localhost:5000/api/ai/latest-results
```

## 🚨 Troubleshooting

### Common Issues

1. **Python Import Errors**
   - Ensure all dependencies are installed: `pip install -r requirements.txt`
   - Check Python path in `aiService.js`

2. **MongoDB Connection Issues**
   - Verify `MONGODB_URI` in `.env`
   - Ensure MongoDB is running

3. **AI Service Timeouts**
   - Analysis can take several minutes
   - Check Python process output for errors

4. **Permission Issues**
   - Ensure Python script is executable: `chmod +x python_service.py`
   - Check file paths and permissions

### Debug Mode

Enable debug logging in `aiService.js`:

```javascript
// Add this to see detailed Python process output
pythonProcess.stdout.on('data', (data) => {
    console.log('Python stdout:', data.toString());
});

pythonProcess.stderr.on('data', (data) => {
    console.log('Python stderr:', data.toString());
});
```

## 📊 Data Flow

```
1. Frontend Request → /api/ai/analyze/:location
2. Node.js Route Handler → aiService.runAnalysis()
3. Python Process Spawn → python_service.py
4. Python Service → CoastalAIAnalyst.run_complete_analysis_pipeline()
5. Results → JSON Serialization → Node.js
6. Response → Frontend
```

## 🔒 Security

- All AI endpoints require authentication (`auth` middleware)
- Input validation for location parameters
- Error messages don't expose sensitive information
- Python process runs in isolated environment

## 📈 Performance

- AI analysis runs asynchronously
- Results are cached in MongoDB
- Historical data queries are optimized
- Health checks prevent unnecessary analysis runs

## 🤝 Contributing

When modifying the integration:

1. **Don't change** the original AI/ML logic in `coastal_ai_analyst_fixed_1.py`
2. **Don't change** the frontend components
3. **Test** the Python service independently first
4. **Update** this documentation for any changes

## 📞 Support

For integration issues:
1. Check the setup script output
2. Verify Python dependencies
3. Test Python service directly
4. Check Node.js logs for errors
5. Verify environment variables

---

**Note**: This integration preserves the original AI/ML code logic while providing a robust Node.js API interface for the frontend.