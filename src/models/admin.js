const validator = require('validator')
const mongoose = require('mongoose')
const bcrybt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const AdminSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isLength(value, {min: 6, max: undefined})) {
                throw new Error('Password must be more than 6 caracters')
            }
            if(validator.equals(value.trim().toUpperCase(), 'PASSWORD')) {
                throw new Error('Chose other value different to password')
            }
        }
    },
    role: {
        type: String,
        required: false,
        trim: true,
        default: 'admin'
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

AdminSchema.methods.generateAuthToken = async function () {
    const admin = this
    const token = await jwt.sign({ _id: admin._id.toString() }, process.env.JWT_SECRET_KEY)

    admin.tokens = admin.tokens.concat({ token })
    await admin.save()

    return token
}

AdminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({email})

    if (!admin) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrybt.compare(password, admin.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return admin
}

AdminSchema.pre('save', async function (next) {
    const admin = this
    if(this.isModified('password')) {
        admin.password = await bcrybt.hash(admin.password, 8)
    }
    next()
})

AdminSchema.methods.toJSON = function () {
    const adminObject = this.toObject()

    delete adminObject.password
    delete adminObject.tokens
    delete adminObject.role

    return adminObject
}

const Admin = mongoose.model('Admin', AdminSchema, 'users')

module.exports = Admin