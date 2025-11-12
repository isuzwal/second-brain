import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
 import dotenv from "dotenv";
 dotenv.config();

 cloudinary.config({ 
  cloud_name: "da0zslcf2",
  api_key: "947196628324946", 
  api_secret:"mQauKRrARnJmxY4VnSnK94XoWs4",
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

