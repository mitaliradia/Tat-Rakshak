# coastal_ai_analyst_pro.py
import ee
import geemap
import groq
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.exceptions import NotFittedError
import requests
from pymongo import MongoClient
import json
import warnings
import os
from dotenv import load_dotenv
warnings.filterwarnings('ignore')

load_dotenv()

# Initialize Earth Engine
try:
    print("1. Opening browser for authentication...")
    ee.Authenticate(auth_mode="notebook")

    ee.Initialize(project='ee-hetrank08')
    
except Exception as e:
    print("Please authenticate Earth Engine first:")
    print("Run: ee.Authenticate() and then ee.Initialize()")

class CoastalAIAnalyst:
    def __init__(self, mongodb_uri="mongodb+srv://shrutipatel0308:prNaEIQnvZTv6Iwy@cluster0.22ngsj8.mongodb.net/hackout25?retryWrites=true&w=majority&appName=Cluster0"):
        
        self.groq_api_key = os.getenv('GROQ_API_KEY')
        if not self.groq_api_key:
            self.groq_api_key = input("Please enter your Groq API key: ").strip()
            os.environ['GROQ_API_KEY'] = self.groq_api_key
        
        # Initialize Groq client
        try:
            self.groq_client = groq.Groq(api_key=self.groq_api_key)
        except Exception as e:
            self.groq_client = None
        
        self.regions = {
            'Sunderbans': ee.Geometry.Rectangle(88.0, 21.5, 89.5, 22.5),
            'Pulicat Lake': ee.Geometry.Rectangle(80.0, 13.3, 80.5, 13.8),
            'Goa Coast': ee.Geometry.Rectangle(73.5, 15.0, 74.5, 16.0),
            'Kochi': ee.Geometry.Rectangle(76.0, 9.8, 76.5, 10.2)
        }
        
        # Initialize AI components
        self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
        self.scaler = StandardScaler()
        self.trend_model = LinearRegression()
        
        # MongoDB connection
        try:
            self.client = MongoClient(mongodb_uri)
            self.db = self.client['coastal_monitoring']
            self.collection = self.db['ai_analysis']
            self.map_collection = self.db['map_configurations']
            print("Connected to MongoDB successfully")
        except Exception as e:
            print(f"MongoDB connection failed: {e}")
            self.client = None

    def query_groq_api(self, prompt, model="llama3-8b-8192"):
      """Use Groq's ultra-fast inference API"""
      if not hasattr(self, 'groq_client') or not self.groq_client:
          return None
          
      try:
          print(f"Using Groq with {model}...")
          
          chat_completion = self.groq_client.chat.completions.create(
              messages=[
                  {
                      "role": "user",
                      "content": prompt,
                  }
              ],
              model=model,
              temperature=0.7,
              max_tokens=1024,
              top_p=0.8,
              stream=False,
          )
          
          return chat_completion.choices[0].message.content
          
      except Exception as e:
          print(f"Groq API call failed: {e}")
          return None
    
    def generate_ai_insights(self, location, df, trends, anomalies):
        latest = df.iloc[-1] if len(df) > 0 else {}
        
        prompt = f"""
As an expert coastal environmental analyst, provide a detailed assessment for {location}, India.

ENVIRONMENTAL DATA:
- Current NDWI (Water Index): {latest.get('NDWI', 'N/A'):.3f}
- Current NDCI (Chlorophyll Index): {latest.get('NDCI', 'N/A'):.3f}
- Monitoring Period: {df['date'].iloc[0]} to {df['date'].iloc[-1]}
- Data Points Analyzed: {len(df)}
- Environmental Anomalies Detected: {len(anomalies)}

TREND ANALYSIS:
- Annual NDWI Change: {trends.get('NDWI_annual_change', 0):.4f}
- Annual NDCI Change: {trends.get('NDCI_annual_change', 0):.4f}

Please provide a comprehensive professional assessment including:
1. Current coastal health status and environmental conditions
2. Analysis of erosion/accretion patterns based on water indices
3. Water quality assessment and potential algal bloom risks
4. Threat level evaluation with specific evidence
5. Detailed recommendations for disaster management authorities
6. Community impact assessment and safety measures
7. Long-term monitoring suggestions

Write in clear, actionable language suitable for government officials.
"""
        
        # Try Groq API with multiple model options
        groq_models = [
            "llama3-8b-8192",      
            "mixtral-8x7b-32768",  
            "gemma-7b-it",         
            "llama3-70b-8192"      
        ]
        
        for model in groq_models:
            groq_response = self.query_groq_api(prompt, model)
            if groq_response:
                return f"GROQ AI ANALYSIS ({model}):\n{groq_response}"
        
        # Fallback to enhanced rule-based system
        print("Using enhanced rule-based analysis (Groq unavailable)")
        return self.generate_enhanced_insights(location, df, trends, anomalies)
    
    def generate_enhanced_insights(self, location, df, trends, anomalies):
        latest = df.iloc[-1] if len(df) > 0 else {}
        threat_level = self.assess_threat_level(trends, latest)
        
        environmental_analysis = self.get_detailed_environmental_analysis(trends, latest, anomalies)
        
        insights = f"""
🌊 COASTAL INTELLIGENCE REPORT - {location.upper()}
📅 Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}
📍 Location: {location}, India
🤖 Analysis: Enhanced Rule-Based AI System

📊 EXECUTIVE SUMMARY:
Threat Level: {threat_level.upper()} 
Data Period: {df['date'].iloc[0]} to {df['date'].iloc[-1]}
Monitoring Points: {len(df)} monthly observations
Anomalies Detected: {len(anomalies)}

🔬 ENVIRONMENTAL METRICS:
- Water Index (NDWI): {latest.get('NDWI', 'N/A'):.3f} 
- Chlorophyll Index (NDCI): {latest.get('NDCI', 'N/A'):.3f}

📈 TREND ANALYSIS:
- Water Index Change: {trends.get('NDWI_annual_change', 0):.4f} per year
- Chlorophyll Change: {trends.get('NDCI_annual_change', 0):.4f} per year

{environmental_analysis}

🚨 THREAT ASSESSMENT: {threat_level.upper()}
{self.get_recommendations(threat_level)}

🎯 RECOMMENDED ACTIONS:
{self.get_detailed_recommendations(threat_level, trends, latest)}

🔍 NEXT STEPS:
- Field validation and ground truthing
- Continuous satellite monitoring
- Community awareness programs
- Coordination with local authorities
"""
        return insights
    
    def get_detailed_environmental_analysis(self, trends, current_data, anomalies):
        """Generate detailed environmental analysis"""
        analysis = []
        
        ndwi = current_data.get('NDWI', 0)
        ndci = current_data.get('NDCI', 0)
        ndwi_trend = trends.get('NDWI_annual_change', 0)
        ndci_trend = trends.get('NDCI_annual_change', 0)
        
        # Water analysis
        if ndwi < -0.3:
            analysis.append("CRITICAL: Significant water recession detected (-0.3 NDWI). This indicates substantial coastal erosion or water body shrinkage requiring immediate attention.")
        elif ndwi < -0.2:
            analysis.append("MODERATE: Water recession observed (-0.2 NDWI). Suggests ongoing erosion that needs monitoring and potential intervention.")
        elif ndwi > 0.4:
            analysis.append("ELEVATED: High water presence detected (+0.4 NDWI). Could indicate flooding, accretion, or normal seasonal variation.")
        
        # Chlorophyll analysis
        if ndci > 0.25:
            analysis.append("ALERT: High chlorophyll levels (>0.25 NDCI) suggest active algal bloom. Water quality may be compromised.")
        elif ndci > 0.15:
            analysis.append("NOTICE: Elevated chlorophyll levels (>0.15 NDCI) indicate potential algal activity.")
        
        # Trend analysis
        if abs(ndwi_trend) > 0.15:
            trend_direction = "accelerating erosion" if ndwi_trend < 0 else "rapid water accumulation"
            analysis.append(f"SIGNIFICANT TREND: Water index changing at {ndwi_trend:.3f}/year indicating {trend_direction}.")
        
        if ndci_trend > 0.1:
            analysis.append(f"INCREASING: Chlorophyll levels rising at {ndci_trend:.3f}/year. Suggests deteriorating water quality.")
        
        # Anomaly analysis
        if len(anomalies) > 0:
            analysis.append(f"DETECTED: {len(anomalies)} environmental anomalies. These irregular patterns warrant investigation.")
        
        if not analysis:
            analysis.append("STABLE: Environmental conditions within normal seasonal variations.")
        
        return "\n".join(analysis)
    
    def get_recommendations(self, threat_level):
      recommendations = {
          'low': [
              "Continue regular monthly monitoring schedule",
              "Maintain community awareness programs",
              "Document baseline environmental conditions",
              "Share findings with local environmental departments"
          ],
          'medium': [
              "Increase monitoring frequency to bi-weekly",
              "Alert local authorities and coastal management teams",
              "Conduct field verification of satellite findings",
              "Review historical data for pattern confirmation",
              "Engage with fishing communities for ground reports"
          ],
          'high': [
              "Issue public advisories about coastal conditions",
              "Deploy rapid assessment teams for field validation",
              "Prepare emergency response resources",
              "Increase sensor deployment for real-time monitoring",
              "Coordinate with state disaster management authorities"
          ],
          'critical': [
              "ACTIVATE EMERGENCY RESPONSE PROTOCOLS",
              "Evacuate vulnerable coastal areas if necessary",
              "Mobilize all available response teams and resources",
              "Implement continuous monitoring with hourly updates",
              "Coordinate with national disaster management agencies",
              "Establish emergency operation centers"
          ]
      }
      
      return "\n".join([f"• {rec}" for rec in recommendations.get(threat_level, [])])
    
    def get_detailed_recommendations(self, threat_level, trends, current_data):
        recommendations = []
        
        base_recommendations = {
            'low': [
                "Continue current monitoring frequency (monthly)",
                "Maintain community awareness programs",
                "Document baseline conditions"
            ],
            'medium': [
                "Increase monitoring to bi-weekly frequency",
                "Alert local authorities and coastal management teams",
                "Conduct field verification"
            ],
            'high': [
                "Issue public advisories about coastal conditions",
                "Deploy rapid assessment teams for field validation",
                "Prepare emergency response resources"
            ],
            'critical': [
                "ACTIVATE EMERGENCY RESPONSE PROTOCOLS",
                "Evacuate vulnerable coastal areas if necessary",
                "Mobilize all available response teams"
            ]
        }
        
        recommendations.extend(base_recommendations.get(threat_level, []))
        return "\n".join([f"• {rec}" for rec in recommendations])
    
    def save_map_configuration(self, location, map_settings):
        if not self.client:
            return False
        
        try:
            region = self.regions[location]
            coords = region.getInfo()['coordinates'][0]
            
            map_config = {
                'location': location,
                'map_settings': map_settings,
                'coordinates': coords,
                'center': [sum(y for x, y in coords)/len(coords), sum(x for x, y in coords)/len(coords)],
                'bounds': region.bounds().getInfo(),
                'created_at': datetime.now()
            }
            
            result = self.map_collection.update_one(
                {'location': location},
                {'$set': map_config},
                upsert=True
            )
            
            print(f"🗺️ Map configuration saved for {location}")
            return True
            
        except Exception as e:
            print(f"Failed to save map configuration: {e}")
            return False
    
    def generate_gee_map(self, location):
        """Generate a GEE map for the specified location"""
        try:
            region = self.regions[location]
            collection = self.get_sentinel_data(location, '2024-01-01', '2024-01-15')
            recent_image = collection.median()
            
            Map = geemap.Map(
                center=[region.centroid().coordinates().getInfo()[1], 
                       region.centroid().coordinates().getInfo()[0]],
                zoom=10
            )
            
            Map.addLayer(recent_image, {'bands': ['B4', 'B3', 'B2'], 'min': 0, 'max': 3000}, 'Satellite View')
            Map.addLayer(region, {'color': 'red'}, 'Study Area')
            
            print(f"GEE map generated for {location}")
            return Map
            
        except Exception as e:
            print(f"Map generation failed: {e}")
            return None
        
    def get_sentinel_data(self, location, start_date, end_date, cloud_threshold=30):
        """Get Sentinel-2 data for analysis"""
        region = self.regions[location]
        collection = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
            .filterBounds(region)
            .filterDate(start_date, end_date)
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloud_threshold))
        )
        return collection
    
    def calculate_indices(self, image):
        """Calculate environmental indices"""
        ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI')
        ndci = image.normalizedDifference(['B5', 'B4']).rename('NDCI')
        return image.addBands([ndwi, ndci])
    
    def extract_time_series_data(self, location, years=1):
        """Extract multi-year time series data"""
        all_data = []
        print(f"Starting data collection for {location}...")
        
        for year in range(2024 - years, 2024):
            for month in range(1, 13):
                start_date = f'{year}-{month:02d}-01'
                end_date = f'{year}-{month+1:02d}-01' if month < 12 else f'{year+1}-01-01'
                
                try:
                    collection = self.get_sentinel_data(location, start_date, end_date)
                    if collection.size().getInfo() == 0:
                        continue
                        
                    processed_collection = collection.map(self.calculate_indices)
                    if processed_collection.size().getInfo() > 0:
                        median_image = processed_collection.median()
                        stats = median_image.reduceRegion(
                            reducer=ee.Reducer.mean(),
                            geometry=self.regions[location],
                            scale=500,
                            bestEffort=True
                        ).getInfo()
                        
                        if stats:
                            stats['location'] = location
                            stats['year'] = year
                            stats['month'] = month
                            stats['date'] = f'{year}-{month:02d}'
                            all_data.append(stats)
                            
                except Exception as e:
                    continue
        
        print(f"{location}: Collected {len(all_data)} monthly data points")
        return pd.DataFrame(all_data)
    
    def detect_environmental_anomalies(self, df):
        """Detect anomalies using AI"""
        if len(df) < 5:
            df['anomaly_score'] = 0
            df['is_anomaly'] = False
            return df
        
        features = ['NDWI', 'NDCI']
        valid_features = [f for f in features if f in df.columns and not df[f].isnull().all()]
        
        if not valid_features:
            df['anomaly_score'] = 0
            df['is_anomaly'] = False
            return df
        
        X = df[valid_features].fillna(0).values
        
        try:
            X_scaled = self.scaler.fit_transform(X)
            self.anomaly_detector.fit(X_scaled)
            anomaly_scores = self.anomaly_detector.decision_function(X_scaled)
            predictions = self.anomaly_detector.predict(X_scaled)
            
            df['anomaly_score'] = anomaly_scores
            df['is_anomaly'] = predictions == -1
            
            anomaly_count = df['is_anomaly'].sum()
            print(f"✅ Anomaly detection: {anomaly_count} anomalies found")
            
        except Exception as e:
            df['anomaly_score'] = 0
            df['is_anomaly'] = False
        
        return df
    
    def analyze_environmental_trends(self, df):
        """Analyze environmental trends"""
        trends = {}
        
        for feature in ['NDWI', 'NDCI']:
            if feature in df.columns and not df[feature].isnull().all():
                feature_data = df[[feature, 'year', 'month']].dropna()
                if len(feature_data) > 2:
                    feature_data['time_index'] = feature_data['year'] + (feature_data['month'] - 1) / 12
                    X = feature_data['time_index'].values.reshape(-1, 1)
                    y = feature_data[feature].values
                    
                    try:
                        self.trend_model.fit(X, y)
                        slope = self.trend_model.coef_[0]
                        trends[f'{feature}_trend'] = slope
                        trends[f'{feature}_annual_change'] = slope * 12
                    except:
                        trends[f'{feature}_trend'] = 0
                        trends[f'{feature}_annual_change'] = 0
        
        return trends
    
    def assess_threat_level(self, trends, current_data):
        """Assess comprehensive threat level"""
        score = 0
        ndwi_trend = abs(trends.get('NDWI_annual_change', 0))
        if ndwi_trend > 0.1: score += 2
        
        ndci_trend = trends.get('NDCI_annual_change', 0)
        if ndci_trend > 0.08: score += 2
        
        ndci_current = current_data.get('NDCI', 0)
        if ndci_current > 0.15: score += 2
        
        if score >= 6: return 'critical'
        if score >= 4: return 'high'
        if score >= 2: return 'medium'
        return 'low'
    
    def create_visualization(self, df, location):
        """Create comprehensive visualization"""
        fig, axes = plt.subplots(1, 2, figsize=(15, 10))
        fig.suptitle(f'Coastal AI Analysis - {location}', fontsize=16, fontweight='bold')
        
        if 'NDWI' in df.columns:
            axes[0].plot(df['date'], df['NDWI'], 'b-', linewidth=2, label='NDWI')
            if 'is_anomaly' in df.columns and df['is_anomaly'].any():
                anomalies = df[df['is_anomaly']]
                axes[0].scatter(anomalies['date'], anomalies['NDWI'], color='red', s=100, label='Anomalies')
            axes[0].set_title('Water Index (NDWI)')
            axes[0].set_ylabel('NDWI Value')
            axes[0].tick_params(axis='x', rotation=45)
            axes[0].legend()
            axes[0].grid(True, alpha=0.3)
        
        if 'NDCI' in df.columns:
            axes[1].plot(df['date'], df['NDCI'], 'g-', linewidth=2, label='NDCI')
            if 'is_anomaly' in df.columns and df['is_anomaly'].any():
                anomalies = df[df['is_anomaly']]
                axes[1].scatter(anomalies['date'], anomalies['NDCI'], color='red', s=100, label='Anomalies')
            axes[1].set_title('Chlorophyll Index (NDCI)')
            axes[1].set_ylabel('NDCI Value')
            axes[1].tick_params(axis='x', rotation=45)
            axes[1].legend()
            axes[1].grid(True, alpha=0.3)
        
        plt.tight_layout()
        return fig
    
    def save_to_mongodb(self, analysis_results):
        """Save analysis results to MongoDB"""
        if not self.client:
            return False
        
        try:
            results_serializable = json.loads(json.dumps(analysis_results, default=str))
            result = self.collection.insert_one(results_serializable)
            print(f"Analysis saved to MongoDB with ID: {result.inserted_id}")
            return True
        except Exception as e:
            print(f"Failed to save to MongoDB: {e}")
            return False
    
    def run_complete_analysis_pipeline(self, location):
        """Complete analysis pipeline for a location"""
        print(f"\n{'='*60}")
        print(f"🌊 ANALYZING: {location}")
        print(f"{'='*60}")
        
        try:
            # 1. Data Collection
            print("Collecting satellite data...")
            df = self.extract_time_series_data(location, years=1)
            
            if df.empty or len(df) < 3:
                return None
            
            # 2. AI Analysis
            print("Running AI analysis...")
            df = self.detect_environmental_anomalies(df)
            trends = self.analyze_environmental_trends(df)
            
            # 3. Insights Generation
            print("Generating insights...")
            anomalies = df[df['is_anomaly']] if 'is_anomaly' in df.columns else pd.DataFrame()
            insights = self.generate_ai_insights(location, df, trends, anomalies)
            
            # 4. Threat Assessment
            latest_data = df.iloc[-1].to_dict()
            threat_level = self.assess_threat_level(trends, latest_data)
            
            # 5. Visualization
            print("Creating visualizations...")
            fig = self.create_visualization(df, location)
            
            # 6. Save Map Configuration
            print("Saving map configuration...")
            map_config = {
                'center': [self.regions[location].centroid().coordinates().getInfo()[1], 
                          self.regions[location].centroid().coordinates().getInfo()[0]],
                'zoom': 10,
                'layers': ['NDWI', 'NDCI', 'threat_heatmap'],
                'style': 'satellite'
            }
            self.save_map_configuration(location, map_config)
            
            # 7. Generate GEE Map
            print("Generating interactive map...")
            gee_map = self.generate_gee_map(location)
            
            # 8. Compile Results
            results = {
                'location': location,
                'timestamp': datetime.now().isoformat(),
                'data_points': len(df),
                'threat_level': threat_level,
                'anomaly_count': len(anomalies),
                'trends': trends,
                'insights': insights,
                'recommendations': self.get_recommendations(threat_level),
                'map_configuration': map_config,
                'has_gee_map': gee_map is not None,
                'ai_provider': 'Groq - Llama 3 8B'
            }
            
            # 9. Save to Database
            print("Saving results...")
            self.save_to_mongodb(results)
            
            # 10. Save Visualization
            viz_filename = f"{location.replace(' ', '_')}_analysis.png"
            fig.savefig(viz_filename, dpi=300, bbox_inches='tight')
            plt.close()
            
            print(f"Analysis complete for {location}!")
            print(f"AI Provider: {results['ai_provider']}")
            print(f"Data Points: {len(df)}")
            print(f"Anomalies: {len(anomalies)}")
            print(f"Threat Level: {threat_level.upper()}")
            
            return results
            
        except Exception as e:
            print(f"Error in analysis pipeline: {e}")
            import traceback
            traceback.print_exc()
            return None

# Main execution
if __name__ == "__main__":
    analyst = CoastalAIAnalyst()
    target_locations = ['Pulicat Lake', 'Sunderbans', 'Goa Coast', 'Kochi']
    
    print("Starting Coastal AI Monitoring System")
    print("Attempting Groq API integration")
    print("Will use enhanced fallback if API unavailable")
    print(f"Analyzing {len(target_locations)} coastal regions\n")
    
    all_results = {}
    
    for location in target_locations:
        results = analyst.run_complete_analysis_pipeline(location)
        if results:
            all_results[location] = results
            
            print(f"\nINSIGHTS FOR {location.upper()}:")
            print("-" * 60)
            print(results['insights'])
            print("-" * 60)
            print("\n" + "="*80 + "\n")
    
    print("COASTAL MONITORING SUMMARY REPORT")
    print("=" * 60)
    for location, results in all_results.items():
        threat_level = results['threat_level']
        anomalies = results['anomaly_count']
        ai_provider = results['ai_provider']
        print(f"📍 {location:15} | AI: {ai_provider:16} | Threat: {threat_level.upper():8} | Anomalies: {anomalies:3d}")
    
    print(f"\nAnalysis completed at {datetime.now().strftime('%Y-%m-%d %H:%M')}")