const localtunnel = require('localtunnel');
const fs = require('fs');
const path = require('path');

const BACKEND_PORT = 5000;
const FRONTEND_PORT = 3000;
const API_FILE_PATH = path.join(__dirname, '../frontend/src/services/api.js');

async function start() {
  console.log('🚀 Starting tunnels...');

  try {
    // 1. Start Backend Tunnel
    console.log(`📡 Connecting Backend (Port ${BACKEND_PORT}) to localtunnel...`);
    const backendTunnel = await localtunnel({ port: BACKEND_PORT, local_host: '127.0.0.1' });
    const backendUrl = backendTunnel.url;
    console.log(`✅ Backend Tunnel Active: ${backendUrl}`);

    // 2. Update frontend/src/services/api.js
    console.log(`📝 Updating API baseURL in ${API_FILE_PATH}...`);
    if (fs.existsSync(API_FILE_PATH)) {
      let content = fs.readFileSync(API_FILE_PATH, 'utf8');
      // replace baseURL value
      content = content.replace(
        /baseURL:\s*["'][^"']+["']/g,
        `baseURL: "${backendUrl}/api"`
      );
      fs.writeFileSync(API_FILE_PATH, content, 'utf8');
      console.log(`✅ API baseURL updated to: ${backendUrl}/api`);
    } else {
      console.error(`❌ API file not found at ${API_FILE_PATH}`);
    }

    // 3. Start Frontend Tunnel
    console.log(`📡 Connecting Frontend (Port ${FRONTEND_PORT}) to localtunnel...`);
    const frontendTunnel = await localtunnel({ port: FRONTEND_PORT, local_host: '127.0.0.1' });
    const frontendUrl = frontendTunnel.url;
    console.log(`\n🎉 INSTANT DEMO LINK GENERATED!`);
    console.log(`👉 Open this link on any laptop: ${frontendUrl}`);
    console.log(`⚠️ Make sure your local servers (frontend and backend) are running!`);

  } catch (err) {
    console.error('❌ Error creating tunnels:', err);
  }
}

start();