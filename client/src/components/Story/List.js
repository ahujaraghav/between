import React from 'react'
import { Link } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap'
import axios from '../../config/axios';

import ListItem from './ListItem'

class StoryList extends React.Component {

    constructor(props) {
        super(props)
        // console.log(props.match.params.tab)
        this.state = {
            stories: [],
            tab: props.match.params.tab || 'draft',
        }
    }

    handleTabChange = (e) => {
        e.persist()
        this.props.history.replace(`/stories/${e.target.id}`)
        this.setState(()=>({tab: e.target.id}))
    }

    removeItem = (id) => {
        this.setState((prevState) => {
            const stories = prevState.stories.filter((story) => {
                return story._id !== id
            })
            return { stories }
        })
    }

    prepareStories = () => {
        const drafts = [], published = []
        this.state.stories.forEach((story) => {
            if (!story.isPublished) {
                return drafts.push(story)
            }else{
                published.push(story)
            }
    })
    return {drafts, published}
}


render() {
    const {drafts, published} = this.prepareStories()
    const stories = this.state.tab === 'draft'? drafts : published
    return (
        <div className="container mt-5">
            <div className="p-5 clearfix">
                <h1 className="float-left">Your Stories</h1>
                <Link className="float-right" to="/story/new">Write a story</Link>
            </div>
            <div className="px-5 mb-5">
                <ul className="nav justify-content-left border-bottom-1 pointer">
                    <li className="nav-item">
                        <span
                            className={this.state.tab === 'draft'
                                ? "nav-link active hover-unmute"
                                : "nav-link text-muted hover-unmute"}
                            id="draft"
                            onClick={this.handleTabChange}>
                            Drafts {drafts.length}
                            </span>
                    </li>
                    <li className="nav-item">
                        <span
                            className={this.state.tab === 'published'
                                ? "nav-link  hover-unmute active"
                                : "nav-link text-muted hover-unmute"}
                            id="published"
                            onClick={this.handleTabChange}>
                            Published {published.length}
                            </span>
                    </li>
                </ul>
                <ul className="list-group">
                    {
                        stories.map((story) => {
                            return (
                                <ListItem
                                    key={story._id}
                                    title={story.title}
                                    created={story.createdDate}
                                    id={story._id}
                                    history={this.props.history}
                                    removeItem={this.removeItem}
                                />
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

componentDidMount() {
    axios.get('/story')
        .then((response) => {
            this.setState(() => ({ stories: response.data }))
        })
        .catch((err) => {
            console.log(err)
        })
}

}

export default StoryList