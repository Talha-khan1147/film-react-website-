/**
 * AuraChat - Google Drive 5TB Storage Service
 * Handles uploading media (photos, videos, audio, documents, status) directly to Google Drive
 * with dedicated per-user folders and chat transcript logs.
 */

// Google Drive target folder ID provided by user
export const GOOGLE_DRIVE_FOLDER_ID = '12QzxcXf0ALzVkRPOwXF69f40YZeG4Dh0';

// Apps Script Web App Endpoint for direct browser-to-Drive uploads
const APPS_SCRIPT_UPLOAD_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_DRIVE_UPLOAD_URL) ||
  'https://script.google.com/macros/s/AKfycbwDmX-h8R1Ev_9JezQKE3vQiVuzp6qVykswVwm1f5vrDvXNo7R3nj2SZYiuwGIbQIhG/exec';

export type MediaCategory = 'Photos' | 'Videos' | 'Status' | 'VoiceNotes' | 'Documents' | 'General';

export interface UploadOptions {
  fileName?: string;
  userId?: string;
  userName?: string;
  category?: MediaCategory;
  onProgress?: (percent: number) => void;
}

export interface UploadResult {
  url: string;
  name: string;
  size: string;
  type: 'image' | 'video' | 'audio' | 'file';
  driveFileId?: string;
  folderPath?: string;
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
 * Upload a local File or Blob directly to Google Drive with Multi-User Folder Organization
 */
export async function uploadToGoogleDrive(
  file: File | Blob,
  optionsOrFileName?: UploadOptions | string,
  legacyProgress?: (percent: number) => void
): Promise<UploadResult> {
  const options: UploadOptions =
    typeof optionsOrFileName === 'string'
      ? { fileName: optionsOrFileName, onProgress: legacyProgress }
      : optionsOrFileName || {};

  const name = options.fileName || (file as File).name || `upload_${Date.now()}`;
  const mimeType = file.type || 'application/octet-stream';
  const size = formatFileSize(file.size);

  let type: 'image' | 'video' | 'audio' | 'file' = 'file';
  let defaultCategory: MediaCategory = 'Documents';

  if (mimeType.startsWith('image/')) {
    type = 'image';
    defaultCategory = 'Photos';
  } else if (mimeType.startsWith('video/')) {
    type = 'video';
    defaultCategory = 'Videos';
  } else if (mimeType.startsWith('audio/')) {
    type = 'audio';
    defaultCategory = 'VoiceNotes';
  }

  const category = options.category || defaultCategory;

  // 1. Upload directly to Google Drive via Apps Script Web App
  if (APPS_SCRIPT_UPLOAD_URL) {
    try {
      if (options.onProgress) options.onProgress(20);
      const base64Data = await fileToBase64(file);
      if (options.onProgress) options.onProgress(50);

      const payload = {
        action: 'upload',
        folderId: GOOGLE_DRIVE_FOLDER_ID,
        fileName: name,
        mimeType: mimeType,
        base64: base64Data.split(',')[1] || base64Data,
        userId: options.userId || 'general_user',
        userName: options.userName || 'User',
        category: category,
      };

      const response = await fetch(APPS_SCRIPT_UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (options.onProgress) options.onProgress(100);

      if (result.success && result.fileId) {
        // Direct streamable Google Drive CDN link
        const directUrl = `https://lh3.googleusercontent.com/d/${result.fileId}`;
        return {
          url: directUrl,
          name,
          size,
          type,
          driveFileId: result.fileId,
          folderPath: result.folderPath,
        };
      }
    } catch (err) {
      console.warn('Google Drive direct webhook upload failed, using local fallback:', err);
    }
  }

  // 2. High-speed local Base64/Blob fallback
  if (options.onProgress) options.onProgress(70);
  const dataUrl = await fileToBase64(file);
  if (options.onProgress) options.onProgress(100);

  return {
    url: dataUrl,
    name,
    size,
    type,
  };
}

/**
 * Save chat transcript logs to Google Drive
 */
export async function saveChatLogToDrive(
  chatId: string,
  logData: Record<string, any>,
  userId?: string,
  userName?: string
): Promise<boolean> {
  if (!APPS_SCRIPT_UPLOAD_URL) return false;

  try {
    const payload = {
      action: 'save_log',
      folderId: GOOGLE_DRIVE_FOLDER_ID,
      chatId,
      logData,
      userId: userId || 'system',
      userName: userName || 'System',
    };

    const res = await fetch(APPS_SCRIPT_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    return Boolean(result.success);
  } catch (e) {
    console.warn('Failed to save chat log to Google Drive:', e);
    return false;
  }
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
