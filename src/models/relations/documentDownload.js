const mongoose = require('mongoose')

const DocumentDownloadSchema = new mongoose.Schema({
    document: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Document"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
},{
    timestamps: true
})

const DocumentDownload = mongoose.model('DocumentDownload', DocumentDownloadSchema)

module.exports = DocumentDownload