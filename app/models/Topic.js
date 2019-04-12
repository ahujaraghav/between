const mongoose = require('mongoose')
const {topicSchema} = require('./schemas/topicSchema')

const Topic = mongoose.model('Topic', topicSchema)
module.exports = {
    Topic
}