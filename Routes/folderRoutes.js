const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
router.post('/create', async (req, res) => { 
    try {
        const { name, parentFolderId } = req.body;
        
        // Set parentFolderId to null if it's "root"
        const normalizedParentFolderId = parentFolderId === 'root' ? null : parentFolderId;

        // Create new folder in the database
        const folder = new Folder({ name, parentFolderId: normalizedParentFolderId });
        await folder.save();
        res.json(folder);
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ error: 'Failed to create folder' });
    }
});
router.get('/', async (req, res) => {
    try {
        const folders = await Folder.find();
        res.json(folders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch folders' });
    }
});
module.exports = router;

