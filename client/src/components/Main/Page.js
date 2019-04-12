import React from 'react'

import Navigation from './Navigation'
import axios from '../../config/axios';

import Card from './Card'

class Page extends React.Component {
    constructor() {
        super()
        this.state = {
            links: [],
            stories: [],
            active: 'HOME'
        }
    }

    changeNavigationLink = (e) => {
        e.persist()
        let p1
        if (e.target.name === 'HOME') {
            p1 = axios.get('/story/topic/all')
        } else {
            p1 = axios.get(`/story/topic/${e.target.name.toLowerCase()}`)
        }
        p1.then((response) => {
            this.setState(() => ({ active: e.target.name, stories: response.data }))
        })
    }

    render() {
        return (
            <div>
                <Navigation
                    links={this.state.links}
                    active={this.state.active}
                    changeNavigationLink={this.changeNavigationLink}
                />
                {
                    this.state.stories && (
                        this.state.stories.map((story) => {
                                return (<Card
                                    story={story}
                                    topic={story.topic.name}
                                    active={this.state.active}
                                />)
                            })
                    )
                }

            </div>
        )
    }

    componentDidMount() {

        const p1 = axios.get('/topics')
        let p2 = axios.get('/story/topic/all')

        Promise.all([p1, p2])
            .then((values) => {
                console.log(values[1].data)
                this.setState(() => ({ links: values[0].data, stories: values[1].data }))
            })
    }
}

export default Page