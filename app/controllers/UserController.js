const express = require('express')
const _ = require('lodash')
const router = express.Router()

const { User } = require('../models/User')

const { generateMongooseError } = require('../commons/generateMongooseError')
const { generateMongoError } = require('../commons/generateMongoError')

// handling /users

router.post('/', (req, res) => {
    const body = _.pick(req.body, ['username', 'email', 'name', 'password'])
    const user = new User(body)
    user.save()
        .then((user) => {
            user.generateToken()
                .then((token) => {
                    res.send(token)
                })
        })
        .catch((err) => {
            if (err.code == 11000) {
                res.status(422).send(generateMongoError(err))
            } else {
                res.status(422).send(generateMongooseError(err))
            }
        })
})

router.post('/checkField', (req, res) => {
    const field = Object.keys(req.body)[0]
    const value = req.body[field]
    console.log(field, value)
    User.findOne({ [field]: value })
        .then((user) => {
            console.log(user)
            if (user) {
                res.sendStatus(422)
            } else {
                res.sendStatus(200)
            }
        })
})

module.exports = {
    userRouter: router
}