const { spawn } = require('child_process');
const path = require('path');

const runPythonScript = () => {
  return new Promise((resolve, reject) => {
    const python = spawn('python', [path.join(__dirname, 'data_generator.py')]);
    
    let dataBuffer = '';
    
    python.stdout.on('data', (data) => {
      dataBuffer += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}`));
      } else {
        try {
          const result = JSON.parse(dataBuffer);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
};

module.exports = { runPythonScript };