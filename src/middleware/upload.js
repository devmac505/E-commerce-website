const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/products');
  },
  filename: (req, file, cb) => {
    // Create a unique filename based on product name and timestamp
    const productName = req.body.productName || 'product';
    const sanitizedName = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `${sanitizedName}-${timestamp}${extension}`);
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg/;
  const isValidType = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMimeType = allowedTypes.test(file.mimetype);
  
  if (isValidType && isValidMimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
