import sharp from 'sharp';

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  channels: number;
  colorSpace: string;
  density: number;
  fileSize: number;
}

export interface EXIFMetadata {
  cameraModel?: string;
  deviceManufacturer?: string;
  creationDate?: string;
  modificationDate?: string;
  editingSoftware?: string;
  gpsCoordinates?: {
    latitude?: number;
    longitude?: number;
  };
}

export interface VideoMetadata {
  duration: number;
  resolution: string;
  fileSize: number;
  format: string;
}

export interface ExtractedMetadata {
  type: 'image' | 'video' | 'unknown';
  image?: ImageMetadata;
  exif?: EXIFMetadata;
  video?: VideoMetadata;
  error?: string;
}

/**
 * Extract metadata from an image file using Sharp
 */
export async function extractImageMetadata(buffer: Buffer): Promise<ImageMetadata> {
  try {
    const metadata = await sharp(buffer).metadata();
    
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      channels: metadata.channels || 0,
      colorSpace: metadata.space || 'unknown',
      density: metadata.density || 0,
      fileSize: buffer.length,
    };
  } catch (error) {
    throw new Error(`Failed to extract image metadata: ${error}`);
  }
}

/**
 * Extract EXIF metadata from an image buffer using Sharp
 * This works server-side in Node.js
 */
export async function extractEXIFMetadata(buffer: Buffer): Promise<EXIFMetadata> {
  try {
    const metadata = await sharp(buffer).metadata();
    const exifData: EXIFMetadata = {};

    // Sharp's metadata doesn't directly expose make/model in the basic metadata
    // For full EXIF parsing, you would need a library like exif-reader
    // For now, we return empty EXIF data to avoid errors
    // The basic image metadata (width, height, format) is already extracted

    return exifData;
  } catch (error) {
    console.error('Error extracting EXIF metadata:', error);
    return {};
  }
}

/**
 * Extract metadata from a video file
 * Note: This is a placeholder implementation. For real video metadata extraction,
 * you would need to use a library like fluent-ffmpeg or ffprobe
 */
export async function extractVideoMetadata(buffer: Buffer): Promise<VideoMetadata> {
  // Placeholder implementation
  // In a real implementation, you would use ffprobe or similar
  return {
    duration: 0,
    resolution: 'unknown',
    fileSize: buffer.length,
    format: 'unknown',
  };
}

/**
 * Extract metadata from a file based on its type
 */
export async function extractMetadata(file: File): Promise<ExtractedMetadata> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = file.type;
  
  // Determine file type
  if (fileType.startsWith('image/')) {
    try {
      const imageMetadata = await extractImageMetadata(buffer);
      const exifMetadata = await extractEXIFMetadata(buffer);
      return {
        type: 'image',
        image: imageMetadata,
        exif: exifMetadata,
      };
    } catch (error) {
      return {
        type: 'image',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  } else if (fileType.startsWith('video/')) {
    try {
      const videoMetadata = await extractVideoMetadata(buffer);
      return {
        type: 'video',
        video: videoMetadata,
      };
    } catch (error) {
      return {
        type: 'video',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  } else {
    return {
      type: 'unknown',
      error: 'Unsupported file type',
    };
  }
}
