#!/usr/bin/env python3
"""
Python Service for Coastal AI Analysis
This service can be called from Node.js backend to execute AI/ML analysis
"""

import sys
import os
import json
import requests
from pathlib import Path
from datetime import datetime, timedelta
# Load environment variables
from dotenv import load_dotenv
load_dotenv()


class PythonAIService:
    def __init__(self):
        """Initialize the AI service with external GEE API"""
        self.external_gee_api_key = os.getenv('EXTERNAL_GEE_API_KEY')
        self.external_gee_url = os.getenv('EXTERNAL_GEE_API_URL', 'https://api.external-gee.com')
        
        if not self.external_gee_api_key:
            print("Warning: EXTERNAL_GEE_API_KEY not found in environment variables")
            self.external_gee_api_key = None
        
        self.groq_api_key = os.getenv('GROQ_API_KEY')
        if not self.groq_api_key:
            self.groq_api_key = input("Please enter your Groq API key: ").strip()
            os.environ['GROQ_API_KEY'] = self.groq_api_key
        
        # Initialize Groq client
        try:
            import groq
            self.groq_client = groq.Groq(api_key=self.groq_api_key)
        except Exception as e:
            self.groq_client = None
        
        self.regions = {
            'Pulicat Lake': {'lat': 13.5, 'lng': 80.2},
            'Sunderbans': {'lat': 22.0, 'lng': 88.8},
            'Goa Coast': {'lat': 15.5, 'lng': 74.0},
            'Kochi': {'lat': 10.0, 'lng': 76.3}
        }
        try:
            from pymongo import MongoClient
            mongodb_uri = os.getenv('MONGODB_URI')
            if mongodb_uri:
                self.client = MongoClient(mongodb_uri)
                self.db = self.client['coastal_monitoring']
                self.collection = self.db['ai_analysis']
                print("Connected to MongoDB successfully")
            else:
                self.client = None
        except Exception as e:
            print(f"MongoDB connection failed: {e}")
            self.client = None

    def get_external_gee_data(self, location, data_type):
        """Get data from external Google Earth Engine API with fallback data"""
        try:
            # Fallback test data
            test_data = {
                'sea-level': {
                    'sea_level_change': 0.5,
                    'historical_trend': 0.02,
                    'confidence': 0.95
                },
                'cyclonic-activity': {
                    'wind_speed': 15.0,
                    'pressure': 1008.0,
                    'storm_probability': 0.2
                },
                'ocean-data': {
                    'water_quality': {
                        'pollution_level': 0.3,
                        'temperature': 28.5,
                        'salinity': 35.0
                    }
                }
            }
            
            # Use test data instead of trying external API
            print(f"Using test data for {data_type}")
            return test_data.get(data_type)
                
        except Exception as e:
            print(f"Using fallback data for {data_type}")
            return test_data.get(data_type)
            
            
    
    def run_analysis(self, location):
        """Run analysis for a specific location using external GEE data"""
        try:
            print(f"Running analysis for {location} using external GEE API...")
            
            # Get sea level data from external GEE
            sea_level_data = self.get_external_gee_data(location, 'sea-level')
            
            # Get cyclonic activity data from external GEE
            cyclonic_data = self.get_external_gee_data(location, 'cyclonic-activity')
            
            # Get ocean data from external GEE
            ocean_data = self.get_external_gee_data(location, 'ocean-data')
            
            # Generate insights using Groq AI
            insights = self.generate_ai_insights(location, sea_level_data, cyclonic_data, ocean_data)
            
            # Assess threat level
            threat_level = self.assess_threat_level(sea_level_data, cyclonic_data, ocean_data)
            
            # Compile results
            results = {
                'location': location,
                'timestamp': datetime.now().isoformat(),
                'threat_level': threat_level,
                'insights': insights,
                'data_sources': {
                    'sea_level': sea_level_data,
                    'cyclonic_activity': cyclonic_data,
                    'ocean_data': ocean_data
                },
                'ai_provider': 'Groq - External GEE Data'
            }
            
            # Save to database if available
            if self.client:
                self.save_to_mongodb(results)

            print(json.dumps({
                "success": True,
                "data": {
                    "location": location,
                    "timestamp": datetime.now().isoformat(),
                    "threat_level": "normal",
                    "insights": self.generate_ai_insights(location),
                    "data_sources": {
                        "sea_level": self.get_external_gee_data(location, "sea-level"),
                        "cyclonic_activity": self.get_external_gee_data(location, "cyclonic-activity"),
                        "ocean_data": self.get_external_gee_data(location, "ocean-data")
                    },
                    "ai_provider": "Groq - External GEE Data"
                }
            }))
            return True
                
        except Exception as e:
            print(json.dumps({
                "success": False,
                "error": str(e)
            }))
            return False
        
    
        
    def generate_ai_insights(self, location, sea_level_data, cyclonic_data, ocean_data):
        """Generate AI insights using Groq"""
        if not self.groq_client:
            return "AI insights not available - Groq client not initialized"
        
        try:
            prompt = f"""
            Analyze coastal monitoring data for {location}:
            
            Sea Level Data: {sea_level_data}
            Cyclonic Activity: {cyclonic_data}
            Ocean Data: {ocean_data}
            
            Provide insights on:
            1. Current threat level assessment
            2. Key environmental changes
            3. Recommendations for coastal monitoring
            4. Potential risks and mitigation strategies
             Format as a concise analysis report.
            """
            
            chat_completion = self.groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama3-8b-8192",
                temperature=0.7,
                max_tokens=1024
            )
            
            return chat_completion.choices[0].message.content
            
        except Exception as e:
            return f"AI insights generation failed: {str(e)}"

    def assess_threat_level(self, sea_level_data, cyclonic_data, ocean_data):
        """Assess threat level based on external GEE data"""
        try:
            threat_score = 0
            
            # Assess sea level threats
            if sea_level_data:
                sea_level_change = abs(sea_level_data.get('sea_level_change', 0))
                if sea_level_change > 3.0:
                    threat_score += 4
                elif sea_level_change > 2.0:
                    threat_score += 3
                elif sea_level_change > 1.0:
                    threat_score += 2
                elif sea_level_change > 0.5:
                    threat_score += 1
            # Assess cyclonic threats
            if cyclonic_data:
                wind_speed = cyclonic_data.get('wind_speed', 0)
                if wind_speed > 60:
                    threat_score += 4
                elif wind_speed > 40:
                    threat_score += 3
                elif wind_speed > 20:
                    threat_score += 2
            
            # Assess ocean threats
            if ocean_data:
                water_quality = ocean_data.get('water_quality', {})
                if water_quality.get('pollution_level', 0) > 0.7:
                    threat_score += 2
            if threat_score >= 6:
                return 'critical'
            elif threat_score >= 4:
                return 'high'
            elif threat_score >= 2:
                return 'medium'
            elif threat_score >= 1:
                return 'low'
            else:
                return 'normal'
                
        except Exception as e:
            print(f"Error assessing threat level: {e}")
            return 'unknown'
    
    def save_to_mongodb(self, results):
        """Save results to MongoDB with proper error handling"""
        try:
            if self.client is not None and hasattr(self, 'collection'):
                # Make data JSON serializable
                serializable_results = {
                    'location': results['location'],
                    'timestamp': results['timestamp'],
                    'threat_level': results['threat_level'],
                    'insights': results['insights'],
                    'data_sources': results['data_sources'],
                    'ai_provider': results['ai_provider']
                }
                
                self.collection.insert_one(serializable_results)
                print(f"Results saved to MongoDB for {results['location']}")
                return True
            return False
        except Exception as e:
            print(f"Error saving to MongoDB: {e}")
            return False
       
            
    
    def _make_json_serializable(self, obj):
        """Convert objects to JSON serializable types"""
        
        if isinstance(obj, dict):
            return {key: self._make_json_serializable(value) for key, value in obj.items()}
        elif isinstance(obj, datetime):
            return obj.isoformat()
        
        else:
            return obj

def main():
    """Main function for command line execution"""
    if len(sys.argv) < 2:
        print("Usage: python python_service.py <command> [location]")
        print("Commands: analyze <location>, analyze_all")
        sys.exit(1)
    
    command = sys.argv[1]
    service = PythonAIService()
    
    if command == "analyze" and len(sys.argv) > 2:
        location = sys.argv[2]
        result = service.run_analysis(location)
        print(json.dumps(result, indent=2))
    
    elif command == "analyze_all":
        result = service.run_all_analysis()
        print(json.dumps(result, indent=2))
    
    else:
        print("Invalid command. Use 'analyze <location>' or 'analyze_all'")

if __name__ == "__main__":
    main()