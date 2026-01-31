
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../.env');

// Read .env
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }
        envVars[key] = value;
    }
});

const docusignKeys = [
    'DOCUSIGN_INTEGRATION_KEY',
    'DOCUSIGN_USER_ID',
    'DOCUSIGN_API_ACCOUNT_ID',
    'DOCUSIGN_PRIVATE_KEY'
];

async function uploadKey(key) {
    const value = envVars[key];
    if (!value) {
        console.error(`Missing ${key} in .env`);
        return;
    }

    console.log(`Uploading ${key}...`);
    return new Promise((resolve, reject) => {
        // Use spawn to avoid shell escaping issues
        const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
        const child = spawn(cmd, ['convex', 'env', 'set', key, value], {
            stdio: 'inherit',
            cwd: path.join(__dirname, '..')
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ ${key} set successfully.`);
                resolve();
            } else {
                console.error(`❌ Failed to set ${key}. Exit code: ${code}`);
                reject(new Error(`Failed to set ${key}`));
            }
        });
    });
}

async function run() {
    for (const key of docusignKeys) {
        try {
            await uploadKey(key);
        } catch (e) {
            console.error(e);
        }
    }
}

run();
