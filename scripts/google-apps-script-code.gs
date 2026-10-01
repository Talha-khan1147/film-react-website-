/**
 * AuraChat - Google Apps Script 5TB Drive Uploader
 * 
 * Instructions:
 * 1. Open https://script.google.com/
 * 2. Click "New project"
 * 3. Paste this entire code
 * 4. Click "Deploy" > "New deployment"
 * 5. Type: Select "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone"
 * 8. Click "Deploy" -> Authorize access -> Copy the Web App URL
 * 9. Paste the URL into .env:
 *    VITE_GOOGLE_DRIVE_UPLOAD_URL="https://script.google.com/macros/s/.../exec"
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var folderId = data.folderId || "12QzxcXf0ALzVkRPOwXF69f40YZeG4Dh0";
    var fileName = data.fileName || ("upload_" + new Date().getTime());
    var mimeType = data.mimeType || "application/octet-stream";
    var base64 = data.base64;
    
    var decoded = Utilities.base64Decode(base64);
    var blob = Utilities.newBlob(decoded, mimeType, fileName);
    
    var folder = DriveApp.getFolderById(folderId);
    var file = folder.createFile(blob);
    
    // Set file to anyone with link can view
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    var fileId = file.getId();
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      fileId: fileId,
      viewUrl: "https://lh3.googleusercontent.com/d/" + fileId,
      name: fileName
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
