const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {responseSchema} = require('./responseSchema')

const storySchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    isPublished: Boolean,
    publishDate: Date,
    previewImageUrl: {
        type: String
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    responses: [responseSchema],
    claps: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        counts: {
            type: Number,
            max: 5
        }
    }]
})

module.exports = {
    storySchema
}