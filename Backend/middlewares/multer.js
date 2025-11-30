import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and PDF files are allowed"), false);
  }
};

// Multi-upload for students (profile + resume)
export const multiUpload = multer({
  storage,
  fileFilter,
}).fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

// Single upload for admin/company logo
export const singleUpload = multer({
  storage,
  fileFilter,
}).single("logo");
