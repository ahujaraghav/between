import React from 'react'
import axios from '../../config/axios'

class StoryCreate extends React.Component{
    render(){
        return (
            <span>Creating a new story for you..</span>
        )
    }
    componentDidMount(){
        axios.post('/story')
        .then((response)=>{
            console.log(response.data)
            this.props.history.replace(`/story/${response.data}`)
        })
    }
}

export default StoryCreate