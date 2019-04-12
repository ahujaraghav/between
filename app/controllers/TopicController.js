const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middlewares/authenticateUser')

const { Topic } = require('../models/Topic')

router.post('/', authenticateUser, (req, res, next) => {

    Topic.insertMany(req.body.topics)
        .then(() => {
            res.send()
        })
})

router.get('/',((req, res, next)=>{
    Topic.find()
    .select('name')
    .then((topics)=>{
        res.send(topics)
    })
}))

module.exports = {
    topicRouter: router
}