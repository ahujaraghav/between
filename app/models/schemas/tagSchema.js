const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new Schema({
    name:{
        type:String
    },
    stories:[{
        type:Schema.Types.ObjectId,
        ref:'Story'
    }]
})

module.exports = {
    tagSchema
}