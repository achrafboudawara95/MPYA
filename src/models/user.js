const validator = require('validator')
const mongoose = require('mongoose')
const bcrybt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    birthDate:{
        type: Date,
        required: true
    },
    company: {
        type: String,
        required: false,
        trim: true
    },
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
    phone: {
        type: String,
        required: true
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
        default: 'user'
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

UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrybt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

UserSchema.pre('save', async function (next) {
    const user = this
    if(this.isModified('password')) {
        user.password = await bcrybt.hash(user.password, 8)
    }
    next()
})

UserSchema.methods.toJSON = function () {
    const userObject = this.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.role

    return userObject
}

UserSchema.virtual('documents', {
    ref: 'Document',
    localField: '_id',
    foreignField: 'user'
})

const User = mongoose.model('User', UserSchema)

module.exports = User