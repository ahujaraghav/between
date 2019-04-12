const express = require('express')
const _ = require('lodash')
const router = express.Router()

const { User } = require('../models/User')
const { authenticateUser } = require('../middlewares/authenticateUser')

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
                    res.status(200).send({ token, user: user.name })
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

// sending user personal info on every reload
router.get('/', authenticateUser, (req, res) => {
    const user = req.user
    User.findOne({ _id: user._id })
        .populate({
            path: 'followers',
            select: 'name'
        })
        .populate({
            path: 'following',
            select: 'name'
        })
    const response = _.pick(user, ['_id', 'followers', 'following', 'name'])
    res.send(response)
})

router.post('/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password'])
    console.log(body)
    User.verify(body.email, body.password)
        .then((user) => {
            // console.log(user)
            user.generateToken()
                .then((token) => {
                    // console.log(token)
                    res.status(200).send({ token, user: user.name, id: user._id })
                })
        })
        .catch((err) => {
            console.log(err)
            res.send(400)
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

router.put('/following', authenticateUser, (req, res, next) => {
    const user = req.user
    let query, query1
    if (req.body.following) {
        query = User.updateOne({ _id: user._id }, {$push:{following:req.body._id}})
        query1 = User.updateOne({ _id: req.body._id }, {$push:{followers:user._id}})
    } else if(!req.body.following){
        query = User.updateOne({ _id: user._id }, {$pull:{following:req.body._id}})
        query1 = User.updateOne({ _id: req.body._id }, {$pull:{followers:user._id}})
    }

    Promise.all([query.then(), query1.then()])
    .then(()=>{
        res.sendStatus(200)
    })
    .catch(()=>{
        res.sendStatus(500)
    })
})

module.exports = {
    userRouter: router
}