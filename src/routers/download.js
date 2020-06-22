const express = require ('express')
const userMiddleware = require('../middleware/user')
const Version = require('../models/version')
const Document = require('../models/document')
const DocumentView = require('../models/relations/documentView')
const VersionView = require('../models/relations/versionView')

const router = new express.Router()

router.get('/documents/:id/download', authMiddleware, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
        const lastVersion = await document.lastVersion
        if (!document)
        {
            res.status(404)
        }
        lastVersion.nbDownloads += 1
        document.nbDownloads += 1
        await lastVersion.save()
        await document.save()
        const versionDownload = new VersionDownload({
            version: lastVersion._id,
            user: req.user._id
        })
        await versionDownload.save()
        const documentDownload = new DocumentDownload({
            document: id,
            user: req.user._id
        })
        await documentDownload.save()
        res.set('Content-Type', 'application/pdf')
        res.send(lastVersion.file)
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

module.exports = router