const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    parentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    }
});
const File = mongoose.model('file', fileSchema); // Use 'uploader' as the collection name
module.exports = File;

