#!/usr/bin/env python3
"""
Setup and Integration Script for Coastal AI Monitoring System
This script helps set up the integration between Node.js backend and Python AI/ML code
"""

import os
import sys
import json
import subprocess
from pathlib import Path

def check_python_dependencies():
    """Check if all required Python packages are installed"""
    print("🔍 Checking Python dependencies...")
    
    required_packages = [
        'ee', 'geemap', 'pandas', 'numpy', 'matplotlib', 
        'sklearn', 'pymongo', 'requests', 'groq', 'dotenv'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'ee':
                import ee
            elif package == 'geemap':
                import geemap
            elif package == 'sklearn':
                import sklearn
            elif package == 'dotenv':
                import dotenv
            else:
                __import__(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - MISSING")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        print("Run: pip install -r requirements.txt")
        return False
    
    print("✅ All Python dependencies are installed!")
    return True

def check_environment_variables():
    """Check if required environment variables are set"""
    print("\n🔍 Checking environment variables...")
    
    required_vars = ['MONGODB_URI','EXTERNAL_GEE_API_KEY', 'GROQ_API_KEY']
    missing_vars = []
    
    for var in required_vars:
        if os.getenv(var):
            print(f"✅ {var}")
        else:
            print(f"❌ {var} - MISSING")
            missing_vars.append(var)
    
    if missing_vars:
        print(f"\n⚠️  Missing environment variables: {', '.join(missing_vars)}")
        print("Please set these in your .env file")
        return False
    
    print("✅ All environment variables are set!")
    return True

def test_python_service():
    """Test the Python service directly"""
    print("\n🧪 Testing Python service...")
    
    try:
        # Test the service with a simple location
        result = subprocess.run([
            sys.executable, 'python_service.py', 'analyze', 'Pulicat Lake'
        ], capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            try:
                output = json.loads(result.stdout)
                if output.get('success'):
                    print("✅ Python service test successful!")
                    return True
                else:
                    print(f"⚠️  Python service returned error: {output.get('error')}")
                    return False
            except json.JSONDecodeError:
                print("⚠️  Python service output is not valid JSON")
                print(f"Output: {result.stdout}")
                return False
        else:
            print(f"❌ Python service test failed with code {result.returncode}")
            print(f"Error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Python service test timed out")
        return False
    except Exception as e:
        print(f"❌ Python service test error: {e}")
        return False

def create_env_template():
    """Create a template .env file if it doesn't exist"""
    env_file = Path('.env')
    if not env_file.exists():
        print("\n📝 Creating .env template...")
        
        env_template = """# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/coastal_monitoring

#External Google Earth Engine API (using someone else's key)
EXTERNAL_GEE_API_KEY=your_external_gee_api_key_here
EXTERNAL_GEE_API_URL=https://api.external-gee.com

# Groq API Key for AI inference
GROQ_API_KEY=your_groq_api_key_here

# Node.js Environment
NODE_ENV=development
PORT=5000

# Python Environment
PYTHON_PATH=python
"""
        
        with open('.env', 'w') as f:
            f.write(env_template)
        
        print("✅ Created .env template")
        print("⚠️  Please update the values in .env file")
    else:
        print("✅ .env file already exists")

def main():
    """Main setup function"""
    print("🚀 Coastal AI Monitoring System - Integration Setup")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not Path('python_service.py').exists():
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Create .env template
    create_env_template()
    
    # Check dependencies
    deps_ok = check_python_dependencies()
    
    # Check environment variables
    env_ok = check_environment_variables()
    
    # Test Python service
    service_ok = test_python_service()
    
    print("\n" + "=" * 60)
    print("📊 Setup Summary:")
    print(f"Python Dependencies: {'✅' if deps_ok else '❌'}")
    print(f"Environment Variables: {'✅' if env_ok else '❌'}")
    print(f"Python Service: {'✅' if service_ok else '❌'}")
    
    if all([deps_ok, env_ok, service_ok]):
        print("\n🎉 Integration setup complete! You can now:")
        print("1. Start the Node.js backend: npm run dev")
        print("2. Test AI endpoints: GET /api/ai/health")
        print("3. Run analysis: GET /api/ai/analyze/Pulicat%20Lake")
    else:
        print("\n⚠️  Some setup steps failed. Please fix the issues above.")
        print("Then run this script again.")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()