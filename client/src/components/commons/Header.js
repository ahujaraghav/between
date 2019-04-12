import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import CustomToggle from './CustomToggle'

class Header extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: props.user.name,
            isAuthenticated: props.isAuthenticated
        }
    }

    handleClickToHome = (e) => {
        this.props.history.replace('/')
    }

    // header is always there in the app, so once user login, header is not re mounted
    componentWillReceiveProps(nextProps) {
        this.setState(() => ({ name: nextProps.user.name, isAuthenticated: nextProps.isAuthenticated }))
    }

    render() {
        // console.log(this.props.user)
        if (this.props.location.pathname === '/signup') {
            return null
        }
        else {
            return (
                <div className="container-fluid shadow-sm">
                    <div class="container">
                        <div className="d-flex p-0 mt-3 mx-4 align-content-center justify-content-between">
                            <h2 className="font-custom-2 pointer" onClick={this.handleClickToHome}>Between.</h2>

                            {!this.state.isAuthenticated &&
                                <div className="">
                                    <Link className="btn btn-primary" to="/signup">Sign Up</Link>
                                    <Link className="btn" to="/login">Login</Link>
                                </div>
                            }

                            {this.state.isAuthenticated &&
                                <div className="">
                                    <Dropdown>
                                        <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                                            <div className="mt-1">
                                                {this.state.name && <span className="google-circle mr-5">{this.state.name[0]}</span>}
                                                {/* <span>{this.state.user}</span> */}
                                            </div>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="z-top">
                                            <Dropdown.Item href="/stories">Stories</Dropdown.Item>
                                            <Dropdown.Item href="/bookmarks">Bookmarks</Dropdown.Item>
                                            <Dropdown.Item href="/logout">Logout</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                </div>
                            }
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Header