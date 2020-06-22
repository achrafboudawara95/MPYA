const validator = require('validator')
const mongoose = require('mongoose')
const { Int32, Timestamp } = require('mongodb')
const Version = require('./version')
const DocumentSave = require('./relations/documentSave')

const DocumentSchema = new mongoose.Schema({
    address: {
        type: String,
        required: false
    },
    latitude: {
        type: String,
        required: false
    },
    longitude: {
        type: String,
        required: false
    },
    identifier: {
        type: String,
        default: new Date().getTime()
    },
    keywords: [String],
    events: [String],
    nbVersions: {
        type: Number,
        default: 0
    },
    nbViews: {
        type: Number,
        default: 0
    },
    nbSaves: {
        type: Number,
        default: 0
    },
    nbDownloads: {
        type: Number,
        default: 0
    },
    disabledAt: {
        type: Date,
        default: null
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
    }
},{
    timestamps: true
})

DocumentSchema.virtual('versions', {
    ref: 'Version',
    localField: '_id',
    foreignField: 'document'
})

DocumentSchema.methods.toJSON = function () {
    const documentObject = this.toObject()

    return documentObject
}

DocumentSchema.virtual('lastVersion').get(async function() {
    return await Version.findOne().sort({createdAt: -1})
})

DocumentSchema.methods.isSaved = async function (id_user) {
    const document=this
    isSaved = await DocumentSave.findOne({document: document._id, user: id_user})
    if(isSaved)
    {
        return true
    }
    else
    {
        return false
    }
}

const Document = mongoose.model('Document', DocumentSchema)

module.exports = Document