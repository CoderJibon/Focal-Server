import multer from "multer";

//create a multer storage
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});

// Create a upload photo
export const uploadPhoto = multer({ storage: storage });
