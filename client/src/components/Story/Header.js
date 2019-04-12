import React from 'react'
import logo from '../../images/logo.png'

class NewStoryHeader extends React.Component{
    render(){
        return(
            <div>
                <img style={{width:'30px'}} class="border" src={logo}></img>
            </div>
        )
    }
}

export default NewStoryHeader