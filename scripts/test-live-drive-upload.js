const https = require('https');
const { URL } = require('url');

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwDmX-h8R1Ev_9JezQKE3vQiVuzp6qVykswVwm1f5vrDvXNo7R3nj2SZYiuwGIbQIhG/exec';
const FOLDER_ID = '12QzxcXf0ALzVkRPOwXF69f40YZeG4Dh0';

function postToAppsScript(payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const parsedUrl = new URL(WEBHOOK_URL);

    function doRequest(targetUrl, method = 'POST', data = postData) {
      const u = new URL(targetUrl);
      const options = {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      if (method === 'POST') {
        options.headers['Content-Length'] = Buffer.byteLength(data);
      }

      const req = https.request(options, (res) => {
        // Follow Google Apps Script 302 redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return doRequest(res.headers.location, 'GET', '');
        }

        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve({ raw: body, statusCode: res.statusCode });
          }
        });
      });

      req.on('error', (e) => reject(e));
      if (method === 'POST') {
        req.write(data);
      }
      req.end();
    }

    doRequest(WEBHOOK_URL, 'POST', postData);
  });
}

async function runLiveTests() {
  console.log('===============================================================');
  console.log('🌐 TESTING LIVE GOOGLE DRIVE 5TB WEBHOOK ENDPOINT');
  console.log('URL: ' + WEBHOOK_URL);
  console.log('Folder: aura chats (' + FOLDER_ID + ')');
  console.log('===============================================================\n');

  // 1. TEST REAL IMAGE UPLOAD
  console.log('1️⃣  [IMAGE TEST] Uploading real image to Google Drive...');
  // Red square 2x2 PNG base64
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  try {
    const imgRes = await postToAppsScript({
      folderId: FOLDER_ID,
      fileName: 'live_test_image_' + Date.now() + '.png',
      mimeType: 'image/png',
      base64: testImageBase64,
    });
    console.log('   Response:', imgRes);
    if (imgRes.success && imgRes.fileId) {
      console.log('   🎉 IMAGE STORED IN GOOGLE DRIVE!');
      console.log('   👉 File ID: ' + imgRes.fileId);
      console.log('   👉 Direct CDN View URL: ' + imgRes.viewUrl);
    } else {
      console.log('   ⚠️ Result:', imgRes);
    }
  } catch (err) {
    console.error('   ❌ Error uploading image:', err.message);
  }

  // 2. TEST REAL VIDEO UPLOAD
  console.log('\n2️⃣  [VIDEO TEST] Uploading real video to Google Drive...');
  // Minimal valid MP4 header base64 (ftypisom)
  const testVideoBase64 = 'AAAAFGZ0eXBpc29tAAAAAGlzb21tcDQxAAAACGZyZWVhAAAAAAA=';
  try {
    const vidRes = await postToAppsScript({
      folderId: FOLDER_ID,
      fileName: 'live_test_video_' + Date.now() + '.mp4',
      mimeType: 'video/mp4',
      base64: testVideoBase64,
    });
    console.log('   Response:', vidRes);
    if (vidRes.success && vidRes.fileId) {
      console.log('   🎉 VIDEO STORED IN GOOGLE DRIVE!');
      console.log('   👉 File ID: ' + vidRes.fileId);
      console.log('   👉 Direct Streaming URL: ' + vidRes.viewUrl);
    } else {
      console.log('   ⚠️ Result:', vidRes);
    }
  } catch (err) {
    console.error('   ❌ Error uploading video:', err.message);
  }

  // 3. TEST REAL SMS / CHAT TRANSCRIPT UPLOAD
  console.log('\n3️⃣  [SMS / TEXT TEST] Uploading SMS conversation backup to Google Drive...');
  const testChatTranscript = JSON.stringify({
    chatId: 'dm_test_live',
    messages: [
      { sender: 'User A', text: 'Hello, testing real live chat sync!', time: new Date().toISOString() },
      { sender: 'User B', text: 'Received! Storing into Google Drive 5TB storage.', time: new Date().toISOString() }
    ]
  }, null, 2);
  const textBase64 = Buffer.from(testChatTranscript).toString('base64');

  try {
    const textRes = await postToAppsScript({
      folderId: FOLDER_ID,
      fileName: 'live_test_sms_' + Date.now() + '.json',
      mimeType: 'application/json',
      base64: textBase64,
    });
    console.log('   Response:', textRes);
    if (textRes.success && textRes.fileId) {
      console.log('   🎉 SMS CONVERSATION STORED IN GOOGLE DRIVE!');
      console.log('   👉 File ID: ' + textRes.fileId);
      console.log('   👉 View URL: ' + textRes.viewUrl);
    } else {
      console.log('   ⚠️ Result:', textRes);
    }
  } catch (err) {
    console.error('   ❌ Error uploading SMS transcript:', err.message);
  }

  console.log('\n===============================================================');
  console.log('🏁 TESTING COMPLETED');
  console.log('===============================================================');
}

runLiveTests();
