const mongoose = require('mongoose')

const VersionSaveSchema = new mongoose.Schema({
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

const VersionSave = mongoose.model('VersionSave', VersionSaveSchema)

module.exports = VersionSave