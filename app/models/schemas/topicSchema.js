const mongoose = require('mongoose')
const Schema = mongoose.Schema

const topicSchema = new Schema({
    name: String,
    stories: [{
        type: Schema.Types.ObjectId,
        ref:'Story'
    }]
})

module.exports = {
    topicSchema
}