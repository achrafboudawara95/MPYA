const mongoose = require('mongoose')

const VersionDownloadSchema = new mongoose.Schema({
    version: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Version"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
},{
    timestamps: true
})

const VersionDownload = mongoose.model('VersionDownload', VersionDownloadSchema)

module.exports = VersionDownload