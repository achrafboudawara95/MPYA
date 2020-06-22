const jwt = require('jsonwebtoken')
const User = require('../models/user')

const user = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})
        if (!user) {
            req.user = null
        }
        req.user = user
    } catch (e) {
        req.user = null
    }
    next()
}

module.exports = user