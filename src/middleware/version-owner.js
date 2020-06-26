const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Document = require('../models/document')
const Version = require('../models/version')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token, role: 'user'})
        const version = await Version.findOne({_id: req.params.id})
        if (!version) {
            res.status(404).send()
        }
        const document = await Document.findOne({_id: version.document})
        if (user._id.equals(document.user)) {
            req.document = document
            req.version = version
            return next()
        }
        res.status(401).send({'error': 'You are not the owner of this document'})
    } catch (e) {
        res.status(401).send({'error': 'Please authenticate.'})
    }
}

module.exports = auth