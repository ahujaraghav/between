import React from 'react'
import axios from '../../config/axios';
import parser from 'html-react-parser'

import Response from './Response'

import ClapsImg from '../../images/claps.png'

class StoryView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            story: undefined,
            user: props.user,
            following: undefined,
            claps: 0
        }
    }
    getReadTime(body) {
        const words = body.split(' ').length
        // console.log(words)
        return Math.ceil(words / 180)
    }

    handleClaps = () => {
       
        axios.put(`/story/${this.state.story._id}/claps`)
        .then((response)=>{
         
            this.setState(()=>({claps: response.data.claps}))
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    toggleFollow = (e) => {
        if (!this.state.user) {
            this.props.history.push('/login')
        } else {
            axios.put('/users/following', { _id: this.state.story.user._id, following: !this.state.following })
                .then(() => {
                    // this.setState((prevState) => {
                    //     let following = !prevState.following
                    //     return {
                    //         following
                    //     }
                    // })
                    this.props.updateUser()
                })
        }
    }

    // used by responses also
    updateStory = () => {
        axios.get(`/${this.props.match.params.id}`)
            .then((response) => {
                let following
                if (this.state.user) {
                    if (this.state.user.following.includes(response.data.user._id)) {
                        following = true
                    } else {
                        // console.log(false)
                        following = false
                    }
                }
                let story = response.data
                story.readTime = this.getReadTime(story.body.replace(/(<([^>]+)>)/ig, ""))
                story.title = parser(story.title)
                story.body = parser(story.body)
                story.publishDate = new Date(story.publishDate).toString().split(' ').splice(1, 3).join(' ')
                // console.log(this.state.user)
                // console.log(story)

                this.setState(() => ({ story, following }))
            })
    }

    // used to update responses
    // updateStory = (e)=>{
    //     this.getStory()
    // }

    // when follow or unfollow is triggered new props are received
    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        let following = undefined
        if (nextProps.user._id && this.state.story) {
            if (nextProps.user.following.includes(this.state.story.user._id)) {
                following = true
            } else {
                following = false
            }
        }

        this.setState(() => ({ user: nextProps.user, following }))
    }

    render() {
        let story, user
        if (this.state.user === undefined) {
            user = { _id: undefined }
        } else {
            user = Object.assign(this.state.user)
        }
        if (this.state.story) {
            story = this.state.story
        }
        return this.state.story === undefined ? (<div></div>) : (
            <div className="container my-5">
                <div className="w-70 mx-auto">
                    <div className="my-4">
                        {story.title}
                    </div>
                    <div className="m-5 ">
                        <div className="d-flex">
                            <span className="google-circle-2 mr-2">{story.user.name[0]}</span>
                            <div>
                                <h6
                                    className="text-secondary mt-2 mb-0">
                                    {user._id === story.user._id ?
                                        'Written by you' : story.user.name} &nbsp;
                                {user._id !== story.user._id &&
                                        <small
                                            className="border border-success rounded px-2 mx-1 py-1 pointer"
                                            onClick={this.toggleFollow}
                                        >
                                            {this.state.following ? 'Following' : 'Follow'}
                                        </small>}
                                </h6>
                                <small className="text-muted">{story.publishDate} &bull; {story.readTime} min read</small>
                            </div>
                        </div>

                    </div>
                    <div className="text-center mb-5">
                        <img style={{ width: '100%' }} src={`http://localhost:3005/${story.previewImageUrl}`} />
                    </div>
                    <div>
                        {story.body}
                    </div>
                    <div>
                        <div>
                            {
                                story.tags.map((tag) => {
                                    return <span className="badge badge-custom p-2 mr-2">{tag.name}</span>
                                })
                            }

                        </div>
                        <div className="my-3">
                            <button onClick={this.handleClaps} className="claps-button"><img src={ClapsImg} style={{ width: '35px' }} alt="claps"></img><span>{this.state.claps}</span></button>
                            <span style={{ fontSize: '22px', color: 'grey' }} className="float-right my-auto mt-3">
                                <i class="far fa-comments mr-3"></i>
                                <i class="far fa-bookmark"></i>
                            </span>
                        </div>
                    </div>
                    <div className="pt-3 border-top">
                        <Response
                            story={this.state.story}
                            updateStory={this.updateStory}
                            responses={this.state.story.responses}
                            isAuthenticated={!!this.state.user}
                            history={this.props.history}
                        />
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.updateStory()
    }
}

export default StoryView