import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
 import dotenv from "dotenv";
 dotenv.config();

 if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
  throw new Error(" Missing Cloudinary environment variables");
}

 cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY, 
  api_secret:process.env.API_SECRECT!,
});


const storage=new CloudinaryStorage({
    cloudinary:cloudinary, 
    params:{
          // @ts-ignore
            folder:'orbix',
            allowed_formats: ['jpg', 'png', 'jpeg']
    } 
})

export const uploadimage = multer({storage})

