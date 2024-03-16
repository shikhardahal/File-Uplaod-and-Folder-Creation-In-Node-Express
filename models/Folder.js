const mongoose = require('mongoose');
const folderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    parentFolderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }, // Reference to parent folder
    createdAt: { type: Date, default: Date.now }
});
const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;
