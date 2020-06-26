const express = require ('express')
const DocumentDTO = require ('../models/DTO/documentDTO')
const Document = require ('../models/document')
const Version = require ('../models/version')
const VersionDownload = require ('../models/relations/versionDownload')
const DocumentDownload = require ('../models/relations/documentDownload')
const authMiddleware = require('../middleware/auth')
const userMiddleware = require('../middleware/user')
var fs = require('fs');
const multer = require('multer')
const PDF2Pic = require("pdf2pic")
const user = require('../middleware/user')
const auth = require('../middleware/auth')

const router = new express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + new Date().getTime() + '.pdf')
    }
})
const pdf = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!(file.mimetype.startsWith('APPLICATION/PDF') || file.mimetype.startsWith('application/pdf'))){
            return cb(new Error('Please upload a pdf file'))
        }
        cb(undefined, true)
    }
})

router.post('/documents', authMiddleware, pdf.single('pdf'), async (req,res) =>{
    const user = req.user
    if (req.file === undefined) {
        return res.send({'message': 'Please upload a pdf file'}, 400)
    }
    const filePath = '/tmp/' + new Date().getTime() + '.pdf'
    fs.writeFile(filePath, req.file.buffer, async function(err) {
        if (err) {
           return console.error(err);
        }
        

        const pdf2pic = new PDF2Pic({
            density: 100,        // output pixels per inch
            savename: req.file.originalname,   // output file name
            savedir: "/tmp",    // output file location
            format: "png",          // output file format
            size: "600x600"         // output size in pixels
        });

        const pic = await pdf2pic.convertToBase64(filePath, 1);
        const screenShot = Buffer.from(pic.base64, 'base64')
        
        const doc = new Document({
            name: req.body.name,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            keywords: req.body.keywords!=null?req.body.keywords.split(','):[],
            events: req.body.events!=null?req.body.events.split(','):[],
            user: user._id,
            nbVersions: 1
        })
        await doc.save()
        // const file = await fs.readFileSync(req.file.path)
        const file = req.file.buffer
        const vers = await new Version({
            name: req.body.name,
            file,
            screenShot,
            document: doc._id
        })
        await vers.save()
        try {
            res.send(doc)
        } catch (error) {
            res.status(500).send(error.message)
        }


    });
})

router.patch('/documents/:id', authMiddleware, pdf.single('pdf'), async (req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'address', 'latitude', 'longitude', 'keywords', 'events', 'disabledAt']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    const id = req.param('id')
    try {
        const document = await Document.findOne({_id: id, user: req.user._id})
        const lastVersion = await document.lastVersion
        let vers=null
        if (!document){
            res.status(404).send()
        }
        //update the document
        if(req.body.name && document.name != req.body.name){
            document.name = req.body.name
            vers = await new Version({
                name: req.body.name,
                file: lastVersion.file,
                screenShot: lastVersion.screenShot,
                document: document._id
            })
            document.nbVersions+=1
            vers.number = document.nbVersions
            await vers.save()
        }
        if(req.body.address){
            document.address = req.body.address
        }
        if(req.body.latitude){
            document.latitude = req.body.latitude
        }
        if(req.body.longitude){
            document.longitude = req.body.longitude
        }
        if(req.body.keywords){
            document.keywords = req.body.keywords.split(',')
        }
        if(req.body.events){
            document.events = req.body.events.split(',')
        }
        if(req.body.disabledAt){
            if (req.body.disabledAt == 'null') {
                document.disabledAt = null
            }else {
                document.disabledAt = req.body.disabledAt
            }
        }
        //new file
        if(req.file !== undefined)
        {
            const filePath = '/tmp/' + new Date().getTime() + '.pdf'
            fs.writeFile(filePath, req.file.buffer, async function(err) {
                if (err) {
                return console.error(err);
                }

                const pdf2pic = new PDF2Pic({
                    density: 100,        // output pixels per inch
                    savename: req.file.originalname,   // output file name
                    savedir: "/tmp",    // output file location
                    format: "png",          // output file format
                    size: "600x600"         // output size in pixels
                });
        
                const pic = await pdf2pic.convertToBase64(filePath, 1);
                const screenShot = Buffer.from(pic.base64, 'base64')

                const file = req.file.buffer

                if (req.body.name && document.name != req.body.name) {
                    vers.file = file
                    vers.screenShot = screenShot
                }
                else{
                    vers = new Version({
                        name: lastVersion.name,
                        file,
                        screenShot,
                        document: document._id
                    })
                    document.nbVersions+=1
                    vers.number = document.nbVersions
                    await vers.save()
                }
                await document.save()
                res.send(document)
            })
        }
        else
        {
            await document.save()
            res.send(document)
        }
        //END update the document
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/documents', userMiddleware, async (req,res) =>{
    // const match = {}
    // if (req.query.completed){
    //     // match.completed = req.query.completed === 'true'
    // }
    const sort = {}
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }
    try {
        const documents = await Document.find({disabledAt: null})
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .sort(sort)
        let documentsList = []
        for (const document of documents) {
            let saved = false
            if(req.user) {
                saved = await document.isSaved(req.user._id)
            }
            let dto = new DocumentDTO({...document.toJSON(), saved})
            documentsList.push(dto.toJSON())
        }
        res.send(documentsList)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/user/documents', authMiddleware, async (req,res) =>{
    const sort = {}
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }
    try {
        const documents = await Document.find({disabledAt: null, user: req.user._id})
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .sort(sort)
        res.send(documents)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/documents/byid/:id/', userMiddleware, async (req, res) => {
    try {
        const document = await Document.findOne({_id: req.params.id, disabledAt: null})
        if (!document)
        {
            res.status(404).send()
        }
        let saved = false
            if(req.user) {
                saved = await document.isSaved(req.user._id)
            }
            const dto = new DocumentDTO({...document.toJSON(), saved})
        res.send(dto.toJSON())
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

router.get('/documents/byidentifier/:code/', userMiddleware, async (req, res) => {
    try {
        const document = await Document.findOne({identifier: req.params.identifier, disabledAt: null})
        if (!document)
        {
            res.status(404).send()
        }
        let saved = false
            if(req.user) {
                saved = await document.isSaved(req.user._id)
            }
            const dto = new DocumentDTO({...document.toJSON(), saved})
        res.send(dto.toJSON())
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

router.get('/documents/byaddress/:address/', userMiddleware, async (req, res) => {
    const sort = {}
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }
    try {
        const documents = await Document.find({disabledAt: null, address: { $regex: '.*' + req.params.address + '.*'}, disabledAt: null})
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .sort(sort)
        let documentsList = []
        for (const document of documents) {
            let saved = false
            if (req.user) {
                saved = await document.isSaved(req.user._id)   
            }
            let dto = new DocumentDTO({...document.toJSON(), saved})
            documentsList.push(dto.toJSON())
        }
        res.send(documentsList)
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

router.get('/documents/:id/simmilar/', userMiddleware, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
        if (!document)
        {
            res.status(404).send()
        }
        const documents = await Document.find({disabledAt: null, keywords: { $in: document.keywords }, _id: { $ne: document._id }})
            .limit(parseInt(req.query.limit))
        let documentsList = []
        for (const document of documents) {
            let saved = false
            if (req.user) {
                saved = await document.isSaved(req.user._id)   
            }
            let dto = new DocumentDTO({...document.toJSON(), saved})
            documentsList.push(dto.toJSON())
        }
        res.send(documentsList)
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

router.get('/user/documents', authMiddleware, async (req, res) => {
    try {
        const documents = await Document.find({user: req.user._id})
            .limit(parseInt(req.query.limit))
        res.send(documents)
    } catch (error) {
        res.status(400).send({error: err.message})
    }
})

router.get('/documents/:id/preview', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
        const lastVersion = await document.lastVersion
        if (!document)
        {
            res.status(404).send()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(lastVersion.screenShot)
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

module.exports = router