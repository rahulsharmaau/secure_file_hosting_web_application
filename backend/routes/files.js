const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const File = require('../models/File');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename: remove special characters, prefix with timestamp
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueName = Date.now() + '-' + sanitized;
    cb(null, uniqueName);
  },
});

// File filter: only allow .pdf and .mp4
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.mp4'];
  const allowedMimeTypes = ['application/pdf', 'video/mp4'];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf and .mp4 files are supported.'), false);
  }
};

// Multer upload middleware: max 20MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// POST /api/upload
router.post('/upload', auth, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size exceeds the 20MB limit.' });
      }
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
      const fileDoc = new File({
        filename: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        uploaded_by: req.user.userId,
      });

      await fileDoc.save();

      res.status(201).json({
        message: 'File uploaded successfully.',
        file: {
          id: fileDoc._id,
          filename: fileDoc.filename,
          size: fileDoc.size,
          uploaded_at: fileDoc.uploaded_at,
        },
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error.' });
    }
  });
});

// GET /api/public-files
router.get('/public-files', auth, async (req, res) => {
  try {
    const files = await File.find().populate('uploaded_by', 'username email');

    const result = files.map((file) => ({
      id: file._id,
      filename: file.filename,
      size: file.size,
      uploaded_at: file.uploaded_at,
      owner: file.uploaded_by ? file.uploaded_by.username : 'Unknown',
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/my-files
router.get('/my-files', auth, async (req, res) => {
  try {
    const files = await File.find({ uploaded_by: req.user.userId });

    const result = files.map((file) => ({
      id: file._id,
      filename: file.filename,
      size: file.size,
      uploaded_at: file.uploaded_at,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/files/:id
router.delete('/files/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    // Check ownership
    if (file.uploaded_by.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this file.' });
    }

    // Delete file from filesystem
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete file metadata from DB
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: 'File deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
