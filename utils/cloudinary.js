import { v2 as cloudinary } from "cloudinary";
import { CLOUD_API_KEY, CLOUD_API_SECRET, CLOUD_NAME } from "./secret.js";
import asyncHandler from "express-async-handler";
// cloudinary configuration
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});
// cloudinary file upload functions
export const cloudUpload = asyncHandler((fileToUploads) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToUploads, (error, result) => {
      resolve(
        {
          url: result.url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        },
        {
          resource_type: "auto",
        }
      );
      console.log(error);
    });
  });
});

// cloudinary file Distro
export const cloudDelete = async (fileToDelete) => {
  return cloudinary.uploader.destroy(fileToDelete);
};
