const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    stories:[{
        type:Schema.Types.ObjectId,
        ref:'Story'
    }]
})

module.exports = {
    tagSchema
}