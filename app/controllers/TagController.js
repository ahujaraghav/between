const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../middlewares/authenticateUser')
const { Tag } = require('../models/Tag')

router.post('/', authenticateUser, (req, res, next) => {
    const tag = new Tag({ name: req.body.tag })
    // console.log(req.body.tag)
    tag.save()
        .then((tag) => {
            console.log(tag)
            res.send(tag._id)
        })
        .catch(() => {
            res.send(500)
        })
})

router.get('/', authenticateUser, (req, res, next) => {
    const {search} = req.query
    Tag.find({name:{$regex: new RegExp(search), $options:'i'}})
        .then((tags) => {
            if (tags.length === 0) {
                res.sendStatus(404)
            }
            res.send(tags)
        })
        .catch(() => {
            res.sendStatus(404)
        })
})

module.exports = {
    tagRouter: router
}