const express = require('express')
const router = express.Router()
const { authenticateUser } = require('../middlewares/authenticateUser')
const _ = require('lodash')
const { Story } = require('../models/Story')
const { Topic } = require('../models/Topic')

// multer config
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb('invalid format', false)
    }
}
// Limit is 5 mb
const upload = multer(
    {
        storage,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter
    });



// creating a new story.. and giving the id back
router.post('/', authenticateUser, (req, res, next) => {
    const user = req.user
    const story = new Story({ user: user._id, isPublished: false })
    story.save()
        .then((story) => {
            console.log(story)
            res.send(story._id)
        })
        .catch(() => {
            res.sendStatus(500)
        })
})

// sending all stories for a user
router.get('/', authenticateUser, (req, res, next) => {
    const user = req.user
    Story.find({ user: user._id })
        .then((stories) => {
            res.send(stories)
        })
})

router.get('/topic/:topic', (req, res, next) => {
    let query
    if (req.params.topic === 'all') {
        query = Story.find({ isPublished: true })
            .populate({
                path: 'topic',
                model: 'Topic',
                select: 'name'
            })

    } else {
        query = Story.find({ isPublished: true })
            .populate({
                path: 'topic',
                model: 'Topic',
                select: 'name',
                match: { name: req.params.topic.toUpperCase() }
            })
    }
    query.populate({
        path:'user',
        select:'name'
    })
        .sort({ publishDate: -1 })
        .then((stories) => {
            const result = []
            stories.forEach((story) => {
                if (story.topic !== null) {
                    result.push(story)
                }
            })
            res.send(result)
            console.log(result)
        })

    // let query 
    // if(req.params.topic === 'all' ){
    //     query = Topic.find()
    // }else{
    //     query = Topic.find({name: req.params.topic.toUpperCase()})
    // }

    //      query.populate({
    //          path:'stories',
    //          model:'Story',
    //         //  options:{orderby:{publishDate:1}},
    //          select: '_id tags user responses claps body title previewImageUrl publishDate',
    //          populate:{
    //             path: 'user',
    //             model:'User',
    //             select: '_id name'
    //          }
    //      })
    //      .then((topics)=>{
    //          topics.forEach((topic)=>{
    //             topic.stories.reverse()
    //          })
    //         // topics.stories.reverse()
    //         res.send(topics)
    //      })
})


// sending a single story for the user
router.get('/:id', authenticateUser, (req, res, next) => {
    const id = req.params.id
    const user = req.user
    Story.findOne({ _id: id, user: user._id })
        .populate('tags')
        .populate('topic')
        .then((story) => {
            res.send({ title: story.title, body: story.body, isPublished: story.isPublished, tags: story.tags, topic: story.topic })
        })
        .catch(() => {
            res.sendStatus(404)
        })
})

// updating the story,, this is called every 5 sec for save
router.put('/:id', authenticateUser, (req, res, next) => {
    const id = req.params.id
    const user = req.user
    Story.findOne({ _id: id, user: user._id })
        .then((story) => {
            story.body = req.body.body
            story.title = req.body.title
            story.save()
                .then((story) => {
                    console.log(story)
                    res.sendStatus(200)
                })
                .catch(() => {
                    res.sendStatus(500)
                })
        })
        .catch(() => {
            res.sendStatus(404)
        })
})

// publish the story,, tag's are maintained here. called when publish now is clicked.
router.put('/publish/:id', authenticateUser, upload.single('previewImage'), (req, res, next) => {
    const id = req.params.id
    const user = req.user

    const body = _.pick(req.body, ['isPublished', 'title', 'body'])
    const tags = []
    const topic = req.body.topic
    req.body.tags = JSON.parse(req.body.tags)
    console.log(Object.values(req.body.tags))
    if (!req.body.tags.length == 0) {
        req.body.tags.forEach((tag) => {
            tags.push(tag)
        })
    }

    body.previewImageUrl = req.file.path

    Story.findOne({ _id: id, user: user._id })
        .then((story) => {
            Object.assign(story, body)
            Story.addPublishDate(story)
            story.removeTagsAndTopic()
                .then(() => {
                    story.tags = tags
                    story.topic = topic
                    story.save()
                        .then(() => {
                            story.addTagsAndTopic()
                                .then(() => {
                                    res.sendStatus(200)
                                })
                                .catch(() => {
                                    res.sendStatus(500)
                                })
                        })
                })
        })

        .catch((err) => {
            console.log(err)
            res.sendStatus(404)
        })
})

// deletes the story
router.delete('/:id', authenticateUser, (req, res, next) => {
    const id = req.params.id
    const user = req.user
    Story.findOneAndDelete({ _id: id, user: user._id })
        .then((story) => {
            res.sendStatus(200)
        })
        .catch(() => {
            res.sendStatus(404)
        })
})

module.exports = {
    storyRouter: router
}