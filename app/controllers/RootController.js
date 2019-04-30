const express = require('express')
const router = express.Router()

const {Story} = require('../models/Story')

router.get('/:id', (req, res, next) => {
    Story.findOne({_id:req.params.id, isPublished:true})
    .populate('user')
    .populate('tags')
    .populate({
        path: 'claps.user'
    })
    .populate({
        path:'responses.user',
        // sort : {createdAt:-1}
    })
    .then((story)=>{
        if(!story){
            res.sendStatus(404)
        }else{
            story.responses.reverse()
            res.send(story)
        }
    })
    .catch(()=>{
        res.sendStatus(404)
    })
})

module.exports = {
    rootRouter: router
}