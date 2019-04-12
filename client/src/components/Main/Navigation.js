import React from 'react'

import { Link } from 'react-router-dom'

class Navigation extends React.Component {
    constructor() {
        super()
        this.state = {
            // links: []
            show: 9
        }
    }

    render() {
        const links = this.props.links.slice(0, this.state.show)
        return (
            <ul class="nav d-flex justify-content-center mt-3 sticky-top bg-white border-bottom p-2">
                <li class="nav-item">
                    <Link
                        className={this.props.active === 'HOME'
                            ? 'nav-link custom-nav-link active'
                            : 'nav-link custom-nav-link text-muted'}
                        name='HOME'
                        onClick={this.props.changeNavigationLink}
                    >
                        HOME</Link>
                </li>
                {
                    links.map((link) => {
                        const className = this.props.active === link.name
                            ? 'nav-link custom-nav-link active'
                            : 'nav-link custom-nav-link text-muted'
                        return (
                            <li class="nav-item">
                                <Link
                                    className={className}
                                    name={link.name}
                                    onClick={this.props.changeNavigationLink}
                                >{link.name}</Link>
                            </li>
                        )
                    })
                }
                <li class="nav-item">
                    <Link class="nav-link custom-nav-link text-muted" href="#">MORE</Link>
                </li>
            </ul>
        )
    }
}

export default Navigation