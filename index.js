const express = require('express')
const cors = require('cors')
require('./app/config/database')
const app = express()

const {userRouter} = require('./app/controllers/UserController')
const {storyRouter} = require('./app/controllers/StoryController')

const {tagRouter} = require('./app/controllers/TagController')
const {topicRouter} = require('./app/controllers/TopicController')
const {responseRouter} = require('./app/controllers/ResponseController')

const {rootRouter} = require('./app/controllers/RootController')

app.use(cors())
app.use(express.json())
app.use('/users', userRouter)
app.use('/story', storyRouter)

app.use('/tags', tagRouter)
app.use('/public/images', express.static('public/images'))

app.use('/topics', topicRouter)
app.use('/responses', responseRouter)
app.use('/', rootRouter)


app.listen(3005,()=>{
    console.log("listening on 3005")
})

