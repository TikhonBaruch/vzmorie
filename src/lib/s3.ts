// S3-compatible storage utility
// Works with Yandex Object Storage, AWS S3, Cloudflare R2, etc.

interface UploadOptions {
  file: File;
  folder?: string;
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  url: string;
  key: string;
}

export async function uploadToS3({
  file,
  folder = "uploads",
}: UploadOptions): Promise<UploadResult> {
  const response = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      folder,
    }),
  });

  const { uploadUrl, key, publicUrl } = await response.json();

  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  return {
    url: publicUrl,
    key,
  };
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
}

export function isAudioFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ["mp3", "wav", "ogg", "m4a", "webm"].includes(ext);
}

export function isVideoFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ["mp4", "webm", "mov", "avi"].includes(ext);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
