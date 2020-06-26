const express = require ('express')
const authMiddleware = require('../middleware/auth')
const documentOwnerMiddleware = require('../middleware/document-owner')
const versionOwnerMiddleware = require('../middleware/version-owner')

const router = new express.Router()

router.get('/user/document/:id/versions', authMiddleware, documentOwnerMiddleware, async (req, res) => {
    try {
        const document = req.document
        await document.populate('versions').execPopulate()
        const versions = document.versions
        res.send(versions)
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

router.get('/user/version/:id', authMiddleware, versionOwnerMiddleware, async (req, res) => {
    try {
        res.send(req.version)
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

router.get('/user/version/:id/preview', authMiddleware, versionOwnerMiddleware, async (req, res) => {
    try {
        res.set('Content-Type', 'image/jpg')
        res.send(req.version.screenShot)
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

router.get('/user/version/:id/file', authMiddleware, versionOwnerMiddleware, async (req, res) => {
    try {
        res.set('Content-Type', 'image/jpg')
        res.send(req.version.file)
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

module.exports = router