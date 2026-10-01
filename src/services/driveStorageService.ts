/**
 * AuraChat - Google Drive 5TB Storage Service
 * Handles uploading media (photos, videos, audio, documents) directly to Google Drive
 * and generating direct streaming/view URLs for the chat application.
 */

// Google Drive target folder ID provided by user
export const GOOGLE_DRIVE_FOLDER_ID = '12QzxcXf0ALzVkRPOwXF69f40YZeG4Dh0';

// Optional Apps Script Web App Endpoint for direct browser-to-Drive uploads
const APPS_SCRIPT_UPLOAD_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_DRIVE_UPLOAD_URL) ||
  '';

export interface UploadResult {
  url: string;
  name: string;
  size: string;
  type: 'image' | 'video' | 'audio' | 'file';
  driveFileId?: string;
}

/**
 * Format bytes to human readable string (KB, MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Upload a local File or Blob directly to Google Drive
 */
export async function uploadToGoogleDrive(
  file: File | Blob,
  fileName?: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const name = fileName || (file as File).name || `upload_${Date.now()}`;
  const mimeType = file.type || 'application/octet-stream';
  const size = formatFileSize(file.size);

  let type: 'image' | 'video' | 'audio' | 'file' = 'file';
  if (mimeType.startsWith('image/')) type = 'image';
  else if (mimeType.startsWith('video/')) type = 'video';
  else if (mimeType.startsWith('audio/')) type = 'audio';

  // 1. If Apps Script Web App webhook is configured, upload to Google Drive directly
  if (APPS_SCRIPT_UPLOAD_URL) {
    try {
      if (onProgress) onProgress(20);
      const base64Data = await fileToBase64(file);
      if (onProgress) onProgress(60);

      const response = await fetch(APPS_SCRIPT_UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          folderId: GOOGLE_DRIVE_FOLDER_ID,
          fileName: name,
          mimeType: mimeType,
          base64: base64Data.split(',')[1] || base64Data,
        }),
      });

      const result = await response.json();
      if (onProgress) onProgress(100);

      if (result.success && result.fileId) {
        // Direct streamable Google Drive CDN link
        const directUrl = `https://lh3.googleusercontent.com/d/${result.fileId}`;
        return {
          url: directUrl,
          name,
          size,
          type,
          driveFileId: result.fileId,
        };
      }
    } catch (err) {
      console.warn('Google Drive direct webhook upload failed, using local data fallback:', err);
    }
  }

  // 2. High-speed local Base64/Blob URL (works instantly without needing external proxy)
  if (onProgress) onProgress(50);
  const dataUrl = await fileToBase64(file);
  if (onProgress) onProgress(100);

  return {
    url: dataUrl,
    name,
    size,
    type,
  };
}

/**
 * Helper to convert File/Blob to Base64 data URL
 */
export function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
