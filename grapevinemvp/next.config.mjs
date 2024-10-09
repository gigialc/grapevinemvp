/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
    env: {
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: 'user_uploads',
    },
    images: {
      domains: ['res.cloudinary.com'],
    },
    webpack: (config) => {
      config.resolve.alias['@'] = path.resolve(__dirname);
      return config;
    },
  };
  
  export default nextConfig;