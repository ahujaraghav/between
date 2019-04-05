const mongoose = require('mongoose')
const Schema = mongoose.Schema

const responseSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    body:String,
    createdAt:Date
})

module.exports = {
    responseSchema
}