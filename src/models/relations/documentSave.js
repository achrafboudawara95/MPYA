const mongoose = require('mongoose')

const DocumentSaveSchema = new mongoose.Schema({
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

const DocumentSave = mongoose.model('DocumentSave', DocumentSaveSchema)

module.exports = DocumentSave