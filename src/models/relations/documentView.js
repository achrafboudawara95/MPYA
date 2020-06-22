const mongoose = require('mongoose')

const DocumentViewSchema = new mongoose.Schema({
    document: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Document"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User"
    }
},{
    timestamps: true
})

const DocumentView = mongoose.model('DocumentView', DocumentViewSchema)

module.exports = DocumentView