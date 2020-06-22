const validator = require('validator')
const mongoose = require('mongoose')
const Document = require('./document')

const VersionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    file: {
        type: Buffer
    },
    screenShot: {
        type: Buffer
    },
    number: {
        type: Number,
        default: 1
    },
    document:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Document"
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
    }
},{
    timestamps: true
})

VersionSchema.methods.toJSON = function () {
    const versionObject = this.toObject()

    delete versionObject.file
    delete versionObject.screenShot

    return versionObject
}

// VersionSchema.pre('save', async function (next) {
//     this.wasNew = this.isNew;
//     next()
// })

// VersionSchema.post('save', function() {
//     if (this.wasNew) {
//         const document = Document.findOne({ _id: this.document})
//         console.log(document);
        
//         document.nbVersions = 1
//         document.save()
//     }
// })

const Version = mongoose.model('Version', VersionSchema)

module.exports = Version