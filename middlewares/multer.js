import multer from "multer";
import path from "path";
// Set storage engine for Multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../Images"); // Set upload folder
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize Multer with storage and file size limit
export const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    // Allow only image file types
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});
