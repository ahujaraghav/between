const mongoose = require('mongoose')
const { storySchema } = require('./schemas/storySchema')
const { Tag } = require('./Tag')
const { Topic } = require('./Topic')

storySchema.statics.addPublishDate = function (userStory) {
    const Story = this
    Story.findById(userStory._id)
        .then((story) => {
            if (story.publishDate) {
                return Promise.resolve()
            }
            else {
                story.publishDate = new Date()
                story.save()
                    .then(() => {
                        return Promise.resolve()
                    })
            }
        })
}

storySchema.methods.removeTagsAndTopic = function () {
    const story = this
    return Tag.updateMany({ _id: { $in: story.tags } }, { $pull: { stories: story._id } })
        .then(() => {
            console.log(story.topic)
            return Topic.updateOne({ _id: story.topic }, { $pull: { stories: story._id } })
                .then(() => {
                    return Promise.resolve()
                })
        })

}

storySchema.methods.addTagsAndTopic = async function () {
    const story = this
    return Tag.updateMany({ _id: { $in: story.tags } }, { $push: { stories: story._id } })
        .then(() => {
            return Topic.updateOne({ _id: story.topic }, { $push: { stories: story._id } })
                .then(() => {
                    return Promise.resolve()
                })
        })

}

const Story = mongoose.model('Story', storySchema)
module.exports = {
    Story
}