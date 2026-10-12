/**
 * AuraChat - Google Drive 5TB Multi-User Organizer & Storage Engine
 * Auto-creates User folders, Categories (Photos, Videos, Status, VoiceNotes, Documents), and Chat Logs
 * 
 * Instructions:
 * 1. Open https://script.google.com/
 * 2. Paste this entire updated code into your project
 * 3. Click "Deploy" > "Manage deployments" > Edit (pencil) > New version > Deploy
 * 4. Anyone can access as "Me"
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var rootFolderId = data.folderId || "12QzxcXf0ALzVkRPOwXF69f40YZeG4Dh0";
    var rootFolder = DriveApp.getFolderById(rootFolderId);

    var action = data.action || "upload"; // "upload" | "save_log"
    var userId = data.userId || "anonymous";
    var userName = (data.userName || "User").replace(/[^a-zA-Z0-9_-]/g, "_");
    var category = data.category || "General"; // "Images", "Videos", "Status", "VoiceNotes", "Documents", "Logs"

    // 1. Get or Create "Users" Folder
    var usersFolder = getOrCreateFolder(rootFolder, "Users");
    
    // 2. Get or Create Specific User Folder (e.g., "Talha_uid123")
    var userFolderName = userName + "_" + userId.slice(0, 8);
    var userFolder = getOrCreateFolder(usersFolder, userFolderName);

    // 3. Get or Create Category Subfolder (e.g., "Images", "Videos", "Status")
    var targetFolder = getOrCreateFolder(userFolder, category);

    // Handle File Upload
    if (action === "upload") {
      var fileName = data.fileName || ("media_" + new Date().getTime());
      var mimeType = data.mimeType || "application/octet-stream";
      var base64 = data.base64;

      var decoded = Utilities.base64Decode(base64);
      var blob = Utilities.newBlob(decoded, mimeType, fileName);

      var file = targetFolder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      var fileId = file.getId();

      // Also append to User Activity Log
      logUserActivity(rootFolder, userId, userName, "Uploaded " + category + ": " + fileName, fileId);

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        fileId: fileId,
        viewUrl: "https://lh3.googleusercontent.com/d/" + fileId,
        name: fileName,
        folderPath: "aura chats/Users/" + userFolderName + "/" + category
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Handle Chat Transcript / JSON Logs
    if (action === "save_log") {
      var chatsFolder = getOrCreateFolder(rootFolder, "Chats");
      var chatId = data.chatId || "general_chats";
      var specificChatFolder = getOrCreateFolder(chatsFolder, chatId);

      var logFileName = "chat_" + chatId + "_" + (new Date().toISOString().split("T")[0]) + ".json";
      var jsonContent = JSON.stringify(data.logData, null, 2);

      // Overwrite or create new log file
      var existingFiles = specificChatFolder.getFilesByName(logFileName);
      var logFile;
      if (existingFiles.hasNext()) {
        logFile = existingFiles.next();
        logFile.setContent(jsonContent);
      } else {
        logFile = specificChatFolder.createFile(logFileName, jsonContent, "application/json");
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        logFileId: logFile.getId(),
        name: logFileName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Unknown action"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateFolder(parent, name) {
  var folders = parent.getFoldersByName(name);
  if (folders.hasNext()) {
    return folders.next();
  }
  return parent.createFolder(name);
}

function logUserActivity(rootFolder, userId, userName, eventText, fileId) {
  try {
    var logsFolder = getOrCreateFolder(rootFolder, "Logs");
    var logDate = new Date().toISOString().split("T")[0];
    var logName = "activity_" + logDate + ".json";
    
    var existingFiles = logsFolder.getFilesByName(logName);
    var logs = [];
    var file;
    if (existingFiles.hasNext()) {
      file = existingFiles.next();
      try {
        logs = JSON.parse(file.getBlob().getDataAsString());
      } catch(e) { logs = []; }
    }

    logs.push({
      timestamp: new Date().toISOString(),
      userId: userId,
      userName: userName,
      event: eventText,
      fileId: fileId || null
    });

    if (file) {
      file.setContent(JSON.stringify(logs, null, 2));
    } else {
      logsFolder.createFile(logName, JSON.stringify(logs, null, 2), "application/json");
    }
  } catch(e) {}
}
