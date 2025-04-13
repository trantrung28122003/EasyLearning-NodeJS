import { uploadToCloudinary } from '../utils/cloudinary'; 
import slugify from 'slugify';
export const handleAvatarUpload = async (file?: Express.Multer.File): Promise<string> => {
  const defaultUrl = 'https://res.cloudinary.com/demo/image/upload/v123456789/default_avatar.png';
  if (!file) return defaultUrl;

  try {
    const result: any = await uploadToCloudinary(file.buffer);
    return result.secure_url || defaultUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return defaultUrl;
  }
};

export const handleImageUpload = async (file?: Express.Multer.File): Promise<string> => {
    if (!file) return '';
    const result: any = await uploadToCloudinary(file.buffer);
    return result.secure_url || '';
};


export const handleVideoUpload = async (file?: Express.Multer.File): Promise<string> => {
  if (!file) return '';
  try {
    const result: any = await uploadToCloudinary(file.buffer, 'elearning', 'video');
    return result.secure_url || '';
  } catch (error) {
      console.error('Error uploading video:', error);
    return '';
  }
};

export const uploadPdf = async (
  file?: Express.Multer.File,
  fullName?: string
): Promise< string> => {
  if (!file || !fullName) return '';

  try {
    const cleanName = slugify(fullName, { lower: false, replacement: '', remove: /[*+~.()'"!:@]/g });

    const pdfPublicId = `Certificate_${cleanName}s`;  
    const pdfResult: any = await uploadToCloudinary(file.buffer, 'elearning', 'image', pdfPublicId);
    const pdfUrl = pdfResult.secure_url;
    return pdfUrl;

  } catch (error) {
    console.error('Error uploading PDF and generating image:', error);
    return '';
  }
};
