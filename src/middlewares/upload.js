import multer from 'multer';

const upload = multer({
  dest: 'temp/',
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export const uploadMiddleware = (req, res, next) => {
  console.log('⭐ Upload Middleware - Start');
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);

  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('❌ Upload Error:', err);
      if (err instanceof multer.MulterError) {
        console.error('❌ Multer Error Details:', {
          name: err.name,
          message: err.message,
          field: err.field,
          code: err.code,
        });
        return res.status(400).json({
          status: 400,
          message: 'File upload error',
          error: err.message,
          code: err.code,
        });
      }
      return res.status(500).json({
        status: 500,
        message: 'File upload failed',
        error: err.message,
      });
    }

    console.log('✅ Upload Success');
    console.log('Uploaded file:', req.file);
    next();
  });
};
