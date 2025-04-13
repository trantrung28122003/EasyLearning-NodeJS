
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder = 'elearning',
  resourceType: 'image' | 'video' | 'raw' = 'image',
  publicId?: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: publicId,
        filename_override: publicId, 
        use_filename: !!publicId,   
        unique_filename: false,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });
};

