const express = require ('express')
const authMiddleware = require('../middleware/auth')

const Version = require('../models/version')
const Document = require('../models/document')
const DocumentSave = require('../models/relations/documentSave')
const VersionSave = require('../models/relations/versionSave')
const { findOneAndUpdate } = require('../models/relations/documentSave')

const router = new express.Router()

router.get('/documents/:id/save', authMiddleware, async (req,res) =>{
    const id = req.param('id')
    const doc = await Document.findOne({_id: id})
    if (!doc){
        res.status(404).send()
    }
    const lastSave = await DocumentSave.findOne({document: id, user: req.user._id})
    if(lastSave != null)
    {
        res.status(400).send({message: 'already saved'})
    }
    const lastVersion = await doc.lastVersion
    const versionSave = new VersionSave({
        version: lastVersion._id,
        user: req.user._id
    })
    await versionSave.save()
    const documentSave = new DocumentSave({
        document: id,
        user: req.user._id
    })
    await documentSave.save()
    lastVersion.nbSaves += 1
    doc.nbSaves += 1
    await lastVersion.save()
    await doc.save()
    res.send()
})

router.get('/documents/:id/unsave', authMiddleware, async (req,res) =>{
    const id = req.param('id')
    const doc = await Document.findOne({_id: id})
    if (!doc){
        res.status(404).send()
    }
    const lastSave = await DocumentSave.findOne({document: id, user: req.user._id})
    if(lastSave == null)
    {
        res.status(400).send({message: 'not saved'})
    }
    await DocumentSave.findOneAndDelete({document: id, user: req.user._id})
    await doc.populate('versions').execPopulate()
    const versions = doc.versions
    for(const version of versions)
    {
        const deletedVersion = await VersionSave.findOneAndDelete({version: version._id, user: req.user._id})
        if (deletedVersion) {
            const vers = await Version.findById(deletedVersion.deletedVersion)
            vers.nbSaves -= 1
            await vers.save()
        }
    }
    doc.nbSaves -= 1
    await doc.save()
    res.send()
})

module.exports = router