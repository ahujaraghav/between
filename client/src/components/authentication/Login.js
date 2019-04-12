import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from '../../config/axios';

class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: true,
            email: '',
            password: '',
            invalid: false
        };
    }

    handleClose() {
        this.setState({ show: false });
        // this.props.history.push('/')
        console.log(this.props.history.goBack())
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({ [e.target.name]: e.target.value }))
    }


    handleKey = (e) => {
        if (e.key === 'Enter') {
            this.handleEnter()
        }
    }

    handleEnter = (e) => {
        const formData = {
            email: this.state.email,
            password: this.state.password
        }
        axios.post('/users/login', formData)
            .then((response) => {
                this.setState(() => ({ invalid: false }))
                // const user = response.data.user
                const token = response.data.token
                // const id = response.data.id
               
                localStorage.setItem('x-auth', token) 
                // localStorage.setItem('user', user) 
                // localStorage.setItem('id', id)
                axios.defaults.headers['x-auth'] = token
                // this.props.handleUserAuthenticated(true)
                this.props.updateUser()
                this.handleClose()
                

            })
            .catch((err) => {
                console.log(err)
                this.setState(() => ({ invalid: true }))
            })
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <form>
                            <div className="form-group" onKeyPress={this.handleKey}>
                                {
                                    this.state.invalid && <div><label className="text-danger">Invalid id or password</label> </div>
                            }

                                <label for="email" className="form-input">Email Address</label>
                                <input id="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    name="email"
                                    className="form-control mb-2"
                                    type="text" placeholder="Email address" />

                                <label for="password" className="form-input">Password</label>
                                <input id="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    name="password"
                                    className="form-control mb-2"
                                    type="password" placeholder="Password" />

                                <Link className="float-right">Forgot password?</Link> <br />
                                <Link to="/signup" onClick={this.handleClose} className="float-right">Create account</Link>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleEnter}>
                        Login
                </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default Login