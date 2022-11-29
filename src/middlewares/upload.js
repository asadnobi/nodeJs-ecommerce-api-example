const multer  = require('multer');
const path = require('path');

const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.env.UPLOAD_PATH)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    },
    fileFilter: (req, file, cb) => {
      cb(null, true);
    }
  }),
  limits: { fileSize: 1000000 }
})


module.exports = fileUpload
