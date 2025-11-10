import multer from 'multer';
import path from 'path';
import fs from 'fs';

const imageDir = path.join('public', 'images');

// Create directory if it doesn't exist
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const file_upload_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageDir);
  },
  filename: function (req, file, cb) {
    //original name helps us to get the file extension
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const single_image_Upload = multer({
  storage: file_upload_config,
  limits: { fileSize: 1024 * 1024 * 20 /* 20 mb */ },
  fileFilter(req, file, cb) {
    // if file type valid
    // if (
    //   ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(
    //     file.mimetype,
    //   )
    // ) {
    cb(null, true);
    // } else {
    //   cb(null, false);
    //   return cb(new Error('file type is not allowed'));
    // }
  },
});
