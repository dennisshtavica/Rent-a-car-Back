const multer = require("multer");
const path = require("path");

// Define allowed file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG and PNG files are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File is too large. Maximum size is 50MB'
            });
        }
        return res.status(400).json({
            message: 'File upload error',
            error: err.message
        });
    }
    if (err) {
        return res.status(400).json({
            message: err.message
        });
    }
    next();
};

module.exports = {
    upload,
    handleMulterError
};