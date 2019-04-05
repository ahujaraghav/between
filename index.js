const express = require('express')
const cors = require('cors')
require('./app/config/database')
const app = express()

const {userRouter} = require('./app/controllers/UserController')

app.use(cors())
app.use(express.json())
app.use('/users', userRouter)


app.listen(3005,()=>{
    console.log("listening on 3005")
})

