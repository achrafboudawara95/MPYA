const express = require ('express')
const Admin = require ('../models/admin')
const adminMiddleware = require('../middleware/admin')

const router = new express.Router()

router.post('/admin/login', async ({body},res) =>{
    try {
        const admin = await Admin.findByCredentials(body.email, body.password)
        const token = await admin.generateAuthToken()
        res.send({ admin, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/admin/logout', adminMiddleware, async ({body},res) =>{
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/admin/me', adminMiddleware, async (req,res) =>{
    res.send(req.admin)
})

module.exports = router