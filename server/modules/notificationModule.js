    const path = require('path');
const iconv = require('iconv-lite');
const { spawn } = require('child_process');

class NotificationModule {
    callPython(scriptName, input) {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(__dirname, '..', 'python_scripts', scriptName);
            const pythonPath = path.join(__dirname, '..', '.venv', 'Scripts', 'python.exe');

            const py = spawn(pythonPath, [scriptPath, JSON.stringify(input)], {
                env: {
                    ...process.env,
                    PYTHONIOENCODING: 'utf-8'
                }
            });

            let stdoutData = '';
            let stderrData = '';

            py.stdout.on('data', (data) => {
                stdoutData += iconv.decode(data, 'utf-8');
            });

            py.stderr.on('data', (data) => {
                stderrData += iconv.decode(data, 'utf-8');
            });

            py.on('close', (code) => {
                if (code !== 0) {
                    console.error('Python stderr:', stderrData);
                    return reject(new Error(`Python exited with code ${code}`));
                }

                try {
                    const json = stdoutData ? JSON.parse(stdoutData) : null;
                    resolve(json);
                } catch (e) {
                    resolve(); // не парсить если нет данных
                }
            });
        });
    }

    sendNotification({ chat_id, text, image_url }) {
        return this.callPython('send_tg_notification.py', {
            chat_id,
            text,
            image_url
        });
    }
}

module.exports = new NotificationModule();