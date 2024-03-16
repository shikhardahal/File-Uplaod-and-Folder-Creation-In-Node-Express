const express = require('express');
const router = express.Router();
const multer = require('multer');
const File = require('../models/File');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
router.post('/upload', upload.array('files'), async (req, res) => {
    try {
        const files = req.files.map(file => ({
            filename: file.filename,
            path: file.path
        }));
        const savedFiles = await File.create(files);
        res.json(savedFiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload files' });
    }
});
module.exports = router;
