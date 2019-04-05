const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type:String,
        required:[true, 'Password is required']
    },
    stories: [{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }],
    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    clappedStories: [{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }],
    tokens:[
        {type:String}
    ]
})

module.exports = {
    userSchema
}