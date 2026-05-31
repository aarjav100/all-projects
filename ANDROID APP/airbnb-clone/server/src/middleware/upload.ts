import multer from 'multer';
import { Request } from 'express';
import cloudinary from '../config/cloudinary';
import { AppError } from './errorHandler';

// Multer memory storage
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed.', 400) as any, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 20,
  },
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = 'airbnb-clone'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If cloudinary is not configured, return a placeholder
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
      resolve(`https://picsum.photos/800/600?random=${Date.now()}`);
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(new AppError('Image upload failed.', 500));
        else resolve(result!.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};
