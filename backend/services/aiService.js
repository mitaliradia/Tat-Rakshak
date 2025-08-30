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
            ]);

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
                        const result = JSON.parse(outputData);
                        resolve(result);
                    } catch (e) {
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
            ]);

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
                        resolve(result);
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
        try {
            const pythonProcess = spawn(this.pythonPath, [this.scriptPath, 'health']);

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
                        return result.success || result.error !== 'AI Service not initialized';
                    } catch (error) {
                        console.error('Failed to parse health check output:', error);
                        return false;
                    }
                } else {
                    console.error(`Health check process failed with code ${code}: ${stderr}`);
                    return false;
                }
            });

            pythonProcess.on('error', (error) => {
                console.error('Failed to start health check process:', error);
                return false;
            });
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
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