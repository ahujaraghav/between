const mongoose = require('mongoose')
const Schema = mongoose.Schema

const responseSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    body:String,
    createdAt:{
        type:Date,
        default: Date.now
    }
})

module.exports = {
    responseSchema
}