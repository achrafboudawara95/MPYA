const express = require ('express')
const User = require ('../models/user')
const authMiddleware = require('../middleware/auth')

const router = new express.Router()

router.post('/users/login', async ({body},res) =>{
    try {
        const user = await User.findByCredentials(body.email, body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/users/logout', authMiddleware, async ({body},res) =>{
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

router.post('/users/signup', async ({body},res) =>{
    const user = new User({body})
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/me', authMiddleware, async (req,res) =>{
    res.send(req.user)
})

// router.get('/users', async (req,res) =>{
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// router.get('/users/:id', async (req,res) =>{
//     const id = req.param.id
//     try {
//         const user = await User.findById(id)
//         if (!user){
//             res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

router.patch('/users', authMiddleware, async (req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'lastName', 'birthDate', 'company', 'email', 'phone', 'username', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }
    try {
        const user = req.user
        if (!user){
            res.status(404).send()
        }
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router