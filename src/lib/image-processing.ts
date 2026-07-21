import sharp from "sharp";

interface ProcessImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "webp" | "jpeg" | "png" | "avif";
  reducePercent?: number;
}

interface ProcessedImage {
  buffer: Buffer;
  contentType: string;
  extension: string;
}

export async function processImage(
  inputBuffer: Buffer,
  options: ProcessImageOptions = {}
): Promise<ProcessedImage> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 80,
    format = "webp",
  } = options;

  const metadata = await sharp(inputBuffer).metadata();

  let pipeline = sharp(inputBuffer);

  // Resize if larger than max dimensions
  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, fit: "inside" });
  } else if (metadata.height && metadata.height > maxHeight) {
    pipeline = pipeline.resize({ height: maxHeight, fit: "inside" });
  }

  // Convert to target format
  switch (format) {
    case "webp":
      pipeline = pipeline.webp({ quality });
      break;
    case "jpeg":
      pipeline = pipeline.jpeg({ quality });
      break;
    case "png":
      pipeline = pipeline.png({ quality });
      break;
    case "avif":
      pipeline = pipeline.avif({ quality });
      break;
  }

  const buffer = await pipeline.toBuffer();

  const contentTypes: Record<string, string> = {
    webp: "image/webp",
    jpeg: "image/jpeg",
    png: "image/png",
    avif: "image/avif",
  };

  return {
    buffer,
    contentType: contentTypes[format],
    extension: format,
  };
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".bmp", ".tiff"];
  const ext = filename.toLowerCase().split(".").pop();
  return ext ? imageExtensions.includes(`.${ext}`) : false;
}
