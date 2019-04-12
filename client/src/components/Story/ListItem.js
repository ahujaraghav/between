import React from 'react'
import { Dropdown } from 'react-bootstrap'
import axios from '../../config/axios';
import CustomToggle from '../commons/CustomToggle'

class ListItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.id,
            dropdown: false
        }
    }

    openStory = () => {
        this.props.history.push(`/story/${this.state.id}`)
    }

    deleteStory = () => {
        axios.delete(`/story/${this.state.id}`)
            .then(() => {
                this.props.removeItem(this.state.id)
            })
            .catch(() => {

            })
    }

    prepareTitleAndTime() {
        const time = Math.round((new Date() - new Date(this.props.created)) / 3600000)
        let title
        if (this.props.title) {
            title = this.props.title.replace(/(<([^>]+)>)/ig, "")
            if (title === '') {
                title = 'Untitled'
            }
        } else {
            title = 'Untitled'
        }
        return { title, time }
    }

    showDropdown = (e) => {
        this.setState((prevState) => ({ dropdown: true }))
    }

    hideDropdown = (e) => {
        this.setState((prevState) => ({ dropdown: false }))
    }

    toggle() {
        this.setState(prevState => ({
          dropdown: !prevState.dropdown
        }));
      }
    

    render() {
        const { title, time } = this.prepareTitleAndTime()
        return (
            <li className="list-group-item py-4" id={this.props.id} onMouseLeave={this.hideDropdown}>
                <h5 className="pointer" onClick={this.openStory}>{title}</h5>
                <span className="text-muted">Created about {time} hours ago    </span>
                <i className="text-muted pointer hover-unmute fa fa-angle-right"
                    onMouseEnter={this.showDropdown}></i>
                <ul
                    className={this.state.dropdown ? "dropdown-custom border rounded pointer show" : "dropdown-custom border rounded pointer hide"}
                    onMouseLeave={this.hideDropdown}>
                    <li onClick={this.openStory} className="text-muted">Edit Draft</li>
                    <li onClick={this.deleteStory} className="text-muted">Delete Draft</li>
                </ul>

                {/* <Dropdown onMouseOver={this.showDropdown} onMouseLeave={this.hideDropdown} isOpen={this.state.dropdown} toggle={this.toggle}>
                    <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                        <div className="mb-1">
                        <i className="text-muted pointer hover-unmute fa fa-angle-right"
                    onMouseEnter={this.showDropdown}></i>
                        </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="/stories">Stories</Dropdown.Item>
                        <Dropdown.Item href="/bookmarks">Bookmarks</Dropdown.Item>
                        <Dropdown.Item href="/logout">Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> */}

            </li>

        )
    }
}

export default ListItem