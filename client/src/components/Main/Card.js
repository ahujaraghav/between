import React from 'react'
import { Link } from 'react-router-dom'

class Card extends React.Component {

    getReadTime(body) {
        const words = body.split(' ').length
        return Math.ceil(words / 180)
    }

    render() {
        let story = {}
        if (this.props.story) {
            story = Object.assign({}, this.props.story)
            if (story.title) {
                story.title = story.title.replace(/(<([^>]+)>)/ig, "")
            }
            if (story.body) {
                story.body = story.body.replace(/(<([^>]+)>)/ig, "")
                story.readTime = this.getReadTime(story.body)
                story.body = story.body.split(' ').slice(0, 30).join(' ') + '...'
            }
            story.publishDate = new Date(story.publishDate).toString().split(' ').splice(1, 3).join(' ')
            story.topic = this.props.topic
        }

        return (
            <div className="card mb-3">
                <Link to={`/${story._id}`} className="text-decoration-none text-dark">
                <div className="row no-gutters container">

                    <div className="col-md-4 p-3 d-block m-auto">
                        <img src={`http://localhost:3005/${story.previewImageUrl}`} className="card-img" alt="..." />
                    </div>

                    <div className="col-md-8 p-2 pointer">
                        <div className="card-body">
                            <h5 className="card-title">{story.title}</h5>
                            <p className="card-text">{story.body}</p>
                            <p className="card-text">
                                <small className="text-muted">
                                    {story.publishDate} &bull; {story.readTime} mins read
                            </small></p>
                            <p className="card-text">
                                <small className="text-muted">
                                    {this.props.active === 'HOME' && story.topic}
                                </small></p>
                        </div>
                    </div>
                </div>
                </Link>
            </div>
        )
    }
}

export default Card