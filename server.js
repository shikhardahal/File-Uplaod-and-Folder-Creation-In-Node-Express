const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs-extra'); // Import the fs-extra module for filesystem operations
const path = require('path');
const fileRoutes = require('./routes/fileRoutes');
const folderRoutes = require('./routes/folderRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
const Folder = require('./models/Folder'); // Import the Folder model
const multer = require('multer');
const File = require('./models/File');

// Setup multer for handling file uploads
const fileUpload = multer({ dest: 'uploads/' });

// Setup multer for handling folder uploads
const folderUpload = multer({ dest: 'uploads/' });

// Middleware
app.use(express.json());

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/folders', folderRoutes);

// Route for uploading a single file to the root folder
app.post('/api/upload-file-to-root', fileUpload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const uploadedFile = req.file;
        
        // Create a new file in the database
        const file = new File({ filename: uploadedFile.originalname, path: uploadedFile.path, parentFolder: null });
        await file.save();
        
        res.json({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/file', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'error connecting db'));
db.once('open', () => {
    console.log('Connected to database');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
