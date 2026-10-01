const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwDmX-h8R1Ev_9JezQKE3vQiVuzp6qVykswVwm1f5vrDvXNo7R3nj2SZYiuwGIbQIhG/exec';
const FOLDER_ID = '12QzxcXf0ALzVkRPOwXF69f40YZeG4Dh0';

async function uploadFile(fileName, mimeType, base64) {
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({
      folderId: FOLDER_ID,
      fileName,
      mimeType,
      base64,
    }),
  });
  return await res.json();
}

async function run() {
  console.log('Testing Image Upload via fetch()...');
  const imgRes = await uploadFile(
    'test_image_' + Date.now() + '.png',
    'image/png',
    'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  );
  console.log('Image Result:', imgRes);

  console.log('\nTesting Video Upload via fetch()...');
  const vidRes = await uploadFile(
    'test_video_' + Date.now() + '.mp4',
    'video/mp4',
    'AAAAFGZ0eXBpc29tAAAAAGlzb21tcDQxAAAACGZyZWVhAAAAAAA='
  );
  console.log('Video Result:', vidRes);

  console.log('\nTesting SMS / Transcript Upload via fetch()...');
  const smsRes = await uploadFile(
    'test_sms_' + Date.now() + '.json',
    'application/json',
    Buffer.from(JSON.stringify({ text: "Hello from user!", sender: "Alex" })).toString('base64')
  );
  console.log('SMS Result:', smsRes);
}

run().catch(console.error);
