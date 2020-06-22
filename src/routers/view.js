const express = require ('express')
const userMiddleware = require('../middleware/user')
const Version = require('../models/version')
const Document = require('../models/document')
const DocumentView = require('../models/relations/documentView')
const VersionView = require('../models/relations/versionView')

const router = new express.Router()

router.get('/documents/:id/view', userMiddleware, async (req,res) =>{
    const id = req.param('id')
    const doc = await Document.findOne({_id: id})
    if (!doc){
        res.status(404).send()
    }
    const lastVersion = await doc.lastVersion
    lastVersion.nbViews += 1
    await lastVersion.save()
    doc.nbViews += 1
    await doc.save()
    let userId = null
    if (req.user !== null) {
        userId = req.user._id
    }
    const versionView = new VersionView({
        version: lastVersion._id,
        user: userId
    })
    await versionView.save()
    const documentView = new DocumentView({
        document: id,
        user: userId
    })
    await documentView.save()
    res.set('Content-Type', 'application/pdf')
    res.send(lastVersion.file)
})

module.exports = router