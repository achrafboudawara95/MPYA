const jwt = require('jsonwebtoken')
const Admin = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token, role: 'admin'})
        if (!admin) {
            throw new Error()
        }
        req.admin = admin
        next()
    } catch (e) {
        res.status(401).send({'error': 'Please authenticate.'})
    }
}

module.exports = auth