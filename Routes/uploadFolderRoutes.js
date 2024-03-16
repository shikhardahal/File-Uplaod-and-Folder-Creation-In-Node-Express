const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const Folder = require('../models/Folder');
const File = require('../models/File');
router.post('/upload', async (req, res) => {
    try {
        if (!req.files || !req.files.folder) {
            return res.status(400).json({ error: 'No folder uploaded' });
        }
        const uploadedFolder = req.files.folder;
        const folderPath = uploadedFolder.tempFilePath;
        // Process the uploaded folder
        await processFolder(folderPath, null);
        res.status(200).json({ message: 'Main folder uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload main folder' });
    }
});

async function processFolder(folderPath, parentFolderId) {
    const folderEntries = await fs.readdir(folderPath, { withFileTypes: true });

    for (const entry of folderEntries) {
        const entryPath = path.join(folderPath, entry.name);
        if (entry.isDirectory()) {
            // Create folder in database
            const folder = new Folder({ name: entry.name, parentFolderId });
            await folder.save();
            // Process nested folder
            await processFolder(entryPath, folder._id);
        } else {
            // Create file in database
            const fileData = await fs.readFile(entryPath);
            const file = new File({ name: entry.name, data: fileData, folderId: parentFolderId });
            await file.save();
        }
    }
}
module.exports = router;
