const mongoose = require('mongoose')
const { userSchema } = require('./schemas/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

userSchema.pre('save', function (next) {
    const user = this
    if (user.isNew) {
        bcrypt.genSalt(10)
            .then((salt) => {
                bcrypt.hash(user.password, salt)
                    .then((encryptedPassword) => {
                        user.password = encryptedPassword
                        next()
                    })
                    .catch((err) => {
                        // hash error
                        console.log("hash error", err)
                    })
            })
            .catch((err) => {
                // salt error
                console.log("salt error", err)
            })
    } else {
        next()
    }
})

userSchema.statics.verify = function (email, password) {
    const User = this
    return User.findOne({ email })
        .then((user) => {
            return bcrypt.compare(password, user.password)
                .then((match) => {
                    // console.log(match)
                    if (match) {
                        return Promise.resolve(user)
                    } else {
                        return Promise.reject("Password does not match")
                    }
                })
        })
        .catch(() => {
            return Promise.reject("No email found")
        })
}

userSchema.methods.generateToken = function () {
    const user = this
    const tokenData = {
        userId: user._id,
        email: user.email,
        date: Date.now(),
        // Token valid for 15 days
        expire: (Date.now() + (1000 * 60 * 60 * 24 * 15))
    }
    const token = jwt.sign(tokenData, 'secret123')
    user.tokens.push(token)
    return user.save()
        .then(() => {
            return token
        })
}

const User = mongoose.model('User', userSchema)
module.exports = {
    User
}