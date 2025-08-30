const { spawn } = require('child_process');
const path = require('path');

class AIService {
    constructor() {
        this.pythonPath = process.env.PYTHON_PATH || 'python';
        this.scriptPath = path.join(__dirname, '..', 'python_service.py');
    }

    /**
     * Run AI analysis for a specific location
     * @param {string} location - The coastal location to analyze
     * @returns {Promise<Object>} - Analysis results
     */
    async runAnalysis(location) {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn(this.pythonPath, [
                this.scriptPath,
                'analyze',
                location
            ], {
                env: { ...process.env, NODEJS_CALL: 'true' }
            });

            let outputData = '';
            let errorData = '';

            pythonProcess.stdout.on('data', (data) => {
                outputData += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorData += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    try {
                        // Parse the JSON output from Python service
                        const result = JSON.parse(outputData);
                        
                        // Wrap the result in the expected format for the API
                        resolve({
                            success: true,
                            data: result,
                            location: location,
                            timestamp: new Date().toISOString()
                        });
                    } catch (e) {
                        console.error('Failed to parse Python output:', e);
                        console.error('Raw output:', outputData);
                        reject(new Error('Failed to parse Python output'));
                    }
                } else {
                    reject(new Error(`Python process failed: ${errorData}`));
                }
            });
        });
    }

    /**
     * Run AI analysis for all locations
     * @returns {Promise<Object>} - Analysis results for all locations
     */
    async runAllAnalysis() {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn(this.pythonPath, [
                this.scriptPath,
                'analyze_all'
            ], {
                env: { ...process.env, NODEJS_CALL: 'true' }
            });

            let stdout = '';
            let stderr = '';

            pythonProcess.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    try {
                        const result = JSON.parse(stdout);
                        
                        // Wrap the result in the expected format for the API
                        resolve({
                            success: true,
                            data: result,
                            timestamp: new Date().toISOString()
                        });
                    } catch (error) {
                        reject(new Error(`Failed to parse Python output: ${error.message}`));
                    }
                } else {
                    reject(new Error(`Python process failed with code ${code}: ${stderr}`));
                }
            });

            pythonProcess.on('error', (error) => {
                reject(new Error(`Failed to start Python process: ${error.message}`));
            });
        });
    }

    /**
     * Check if Python service is available
     * @returns {Promise<boolean>} - True if service is available
     */
    async checkServiceHealth() {
        return new Promise((resolve, reject) => {
            try {
                // Test with a simple analyze command to check if service is working
                const pythonProcess = spawn(this.pythonPath, [
                    this.scriptPath, 
                    'analyze', 
                    'Pulicat Lake'
                ], {
                    env: { ...process.env, NODEJS_CALL: 'true' }
                });

                let stdout = '';
                let stderr = '';

                pythonProcess.stdout.on('data', (data) => {
                    stdout += data.toString();
                });

                pythonProcess.stderr.on('data', (data) => {
                    stderr += data.toString();
                });

                pythonProcess.on('close', (code) => {
                    if (code === 0) {
                        // Check if output contains expected analysis data
                        if (stdout.includes('"location": "Pulicat Lake"') && 
                            stdout.includes('"threat_level"') && 
                            stdout.includes('"insights"')) {
                            resolve(true);
                        } else {
                            console.error('Health check: Unexpected output format');
                            resolve(false);
                        }
                    } else {
                        console.error(`Health check process failed with code ${code}: ${stderr}`);
                        resolve(false);
                    }
                });

                pythonProcess.on('error', (error) => {
                    console.error('Failed to start health check process:', error);
                    resolve(false);
                });

                // Set a timeout to prevent hanging
                setTimeout(() => {
                    pythonProcess.kill();
                    console.error('Health check timed out');
                    resolve(false);
                }, 30000); // 30 second timeout

            } catch (error) {
                console.error('Health check failed:', error);
                resolve(false);
            }
        });
    }

    /**
     * Set custom Python path
     * @param {string} pythonPath - Path to Python executable
     */
    setPythonPath(pythonPath) {
        this.pythonPath = pythonPath;
    }
}

module.exports = new AIService();