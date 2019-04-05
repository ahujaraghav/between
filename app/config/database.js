const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/between"
mongoose.connect(url, { useNewUrlParser: true })
    .then(() => {
        console.log("succesfully connected to db")
    })
    .catch((err) => {
        console.log("error connecting to db")
    })

module.exports = {
    mongoose
}