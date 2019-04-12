const express = require('express')
const router = express.Router()
const { Story } = require('../models/Story')
const { authenticateUser } = require('../middlewares/authenticateUser')

router.post('/', authenticateUser, (req, res, next) => {
    const user = req.user
    Story.findById(req.body.story)
        .then((story) => {
            if (story) {
                const response = { user: user._id, body: req.body.response }
                story.responses.push(response)
                story.save()
                    .then((story) => {
                        console.log(story.responses)
                        res.sendStatus(200)
                    })
                    .catch(() => {
                        res.sendStatus(500)
                    })
            } else {

            }
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(404)
        })



})

module.exports = {
    responseRouter: router
}