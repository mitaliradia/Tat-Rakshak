#!/usr/bin/env node
/**
 * Test script for Coastal AI Monitoring System Integration
 * This script tests the integration between Node.js backend and Python AI/ML service
 */

const aiService = require('./services/aiService');

async function testIntegration() {
    console.log('🧪 Testing Coastal AI Monitoring System Integration');
    console.log('=' .repeat(60));
    
    try {
        // Test 1: Service Health Check
        console.log('\n1️⃣ Testing AI Service Health...');
        const health = await aiService.checkServiceHealth();
        console.log(`   Health Status: ${health ? '✅ Healthy' : '❌ Unhealthy'}`);
        
        if (!health) {
            console.log('   ⚠️  AI Service is not healthy. Check Python dependencies and environment.');
            return;
        }
        
        // Test 2: Single Location Analysis
        console.log('\n2️⃣ Testing Single Location Analysis...');
        console.log('   Analyzing Pulicat Lake...');
        
        const singleResult = await aiService.runAnalysis('Pulicat Lake');
        if (singleResult.success) {
            console.log('   ✅ Single location analysis successful');
            console.log(`   📊 Data points: ${singleResult.data.data_points || 'N/A'}`);
            console.log(`   🚨 Threat level: ${singleResult.data.threat_level || 'N/A'}`);
        } else {
            console.log(`   ❌ Single location analysis failed: ${singleResult.error}`);
        }
        
        // Test 3: All Locations Analysis
        console.log('\n3️⃣ Testing All Locations Analysis...');
        console.log('   This may take several minutes...');
        
        const allResult = await aiService.runAllAnalysis();
        if (allResult.success) {
            console.log('   ✅ All locations analysis successful');
            const locations = Object.keys(allResult.data);
            console.log(`   📍 Analyzed locations: ${locations.join(', ')}`);
            
            for (const location of locations) {
                const data = allResult.data[location];
                console.log(`      ${location}: ${data.threat_level || 'N/A'} threat, ${data.anomaly_count || 0} anomalies`);
            }
        } else {
            console.log(`   ❌ All locations analysis failed: ${allResult.error}`);
        }
        
        console.log('\n🎉 Integration test completed!');
        
    } catch (error) {
        console.error('\n❌ Integration test failed:', error.message);
        console.error('   Stack trace:', error.stack);
        
        // Provide troubleshooting tips
        console.log('\n🔧 Troubleshooting Tips:');
        console.log('   1. Ensure Python dependencies are installed: pip install -r requirements.txt');
        console.log('   2. Check environment variables in .env file');
        console.log('   3. Verify MongoDB connection');
        console.log('   4. Test Python service directly: python python_service.py analyze "Pulicat Lake"');
    }
}

// Run the test if this script is executed directly
if (require.main === module) {
    testIntegration().catch(console.error);
}

module.exports = { testIntegration };