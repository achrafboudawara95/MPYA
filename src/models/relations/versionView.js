const mongoose = require('mongoose')

const VersionViewSchema = new mongoose.Schema({
    version: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Version"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User"
    }
},{
    timestamps: true
})

const VersionView = mongoose.model('VersionView', VersionViewSchema)

module.exports = VersionView