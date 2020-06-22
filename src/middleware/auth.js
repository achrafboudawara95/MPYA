const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Admin = require('../models/admin')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token, role: 'user'})
        if (!user) {
            throw new Error()
        }
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({'error': 'Please authenticate.'})
    }
}

module.exports = auth