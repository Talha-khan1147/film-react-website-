const { google } = require('googleapis');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Google Drive Folder ID from user
const DRIVE_FOLDER_ID = '12QzxcXf0ALzVkRPOwXF69f40YZeG4Dh0';
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../service-account.json');

// Check if credentials file exists
if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('\n❌ ERROR: "service-account.json" file nahi mili!');
  console.error('Barahe karam Google Cloud se download ki gayi JSON key ko:');
  console.error(SERVICE_ACCOUNT_PATH);
  console.error('par save karein aur dobara chalayein.\n');
  process.exit(1);
}

const serviceAccount = require(SERVICE_ACCOUNT_PATH);

// 1. Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'chatting-5b811',
  });
}
const db = admin.firestore();

// 2. Initialize Google Drive Client
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_PATH,
  scopes: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
  ],
});
const drive = google.drive({ version: 'v3', auth });

async function uploadJsonToDrive(fileName, jsonData, parentFolderId) {
  const tempPath = path.join(__dirname, fileName);
  fs.writeFileSync(tempPath, JSON.stringify(jsonData, null, 2), 'utf8');

  const fileMetadata = {
    name: fileName,
    parents: [parentFolderId],
  };
  const media = {
    mimeType: 'application/json',
    body: fs.createReadStream(tempPath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id, name',
  });

  try {
    fs.unlinkSync(tempPath);
  } catch (e) {}

  console.log(`  ✅ Uploaded: ${response.data.name}`);
}

async function startBackup() {
  console.log('====================================================');
  console.log('🚀 AuraChat -> Google Drive Backup Process Shuru');
  console.log('====================================================');
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  const folderName = `Backup_${dateStr}_${timeStr}`;

  try {
    // 1. Create timestamped subfolder in Google Drive
    console.log(`📁 Google Drive me naya folder ban raha hai: "${folderName}"...`);
    const folderRes = await drive.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps/folder',
        parents: [DRIVE_FOLDER_ID],
      },
      fields: 'id',
    });
    const backupFolderId = folderRes.data.id;
    console.log(`✅ Folder ban gaya! (ID: ${backupFolderId})\n`);

    // 2. Backup Users Collection
    console.log('👤 Users ka data Firestore se fetch ho raha hai...');
    const usersSnap = await db.collection('users').get();
    const users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    console.log(`   Pae gaye: ${users.length} users`);
    await uploadJsonToDrive(`users_${dateStr}.json`, users, backupFolderId);

    // 3. Backup Chats Collection
    console.log('\n💬 Chats ka data Firestore se fetch ho raha hai...');
    const chatsSnap = await db.collection('chats').get();
    const chats = chatsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    console.log(`   Pae gaye: ${chats.length} conversations`);
    await uploadJsonToDrive(`chats_${dateStr}.json`, chats, backupFolderId);

    // 4. Backup Messages for each chat
    console.log('\n📩 Har conversation ke live messages fetch ho rahe hain...');
    let totalMessages = 0;
    for (const chatDoc of chatsSnap.docs) {
      const messagesSnap = await db
        .collection('chats')
        .doc(chatDoc.id)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .get();

      const messages = messagesSnap.docs.map((m) => ({ id: m.id, ...m.data() }));
      totalMessages += messages.length;

      if (messages.length > 0) {
        await uploadJsonToDrive(
          `messages_${chatDoc.id}_${dateStr}.json`,
          messages,
          backupFolderId
        );
      }
    }
    console.log(`   Total messages backed up: ${totalMessages}`);

    console.log('\n====================================================');
    console.log('🎉 MUBARAK HO! Backup mukammal ho gaya!');
    console.log(`Apne Google Drive folder "aura chats" me "${folderName}" check karein.`);
    console.log('====================================================');
  } catch (error) {
    console.error('\n❌ Backup me error aaya:');
    if (error.message && error.message.includes('File not found')) {
      console.error('Google Drive folder access nahi ho saka. Baraye mehrbani check karein ke service account email ko folder me "Editor" share kiya gaya hai.');
    } else {
      console.error(error.message || error);
    }
  }
}

startBackup();
