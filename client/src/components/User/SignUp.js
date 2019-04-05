import React from 'react'
import { Link } from 'react-router-dom'
import axios from '../../config/axios'

import logo from '../../images/logo.png'

import InputField from './SignUpInputField';


class UserSignUp extends React.Component {
    constructor() {
        super()
        this.state = {
            inputFields: {
                name: {
                    type: 'text',
                    value: '',
                    placeholder: 'First and Last Name',
                    invalidFeedback: 'new'
                },
                username: {
                    type: 'text',
                    value: '',
                    placeholder: 'Pick a username',
                    invalidFeedback: 'new'
                },
                email: {
                    type: 'text',
                    value: '',
                    placeholder: 'Your email address',
                    invalidFeedback: 'new'
                },
                password: {
                    type: 'password',
                    value: '',
                    placeholder: 'Create a password',
                    invalidFeedback: 'new'
                }
            },
            termsAgreed: false
        }
        document.title = "Join Between."
    }

    handleCheckbox = (e) => {
        const checked = e.target.checked
        this.setState(() => ({
            termsAgreed: checked
        }))
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {}
        Object.keys(this.state.inputFields).forEach((field) => {
            formData[field] = this.state.inputFields[field].value
        })

        console.log(formData)
        const results = await this.clientSideValidations(formData)


        if (results.allOk) {
            axios.post('/users', formData)
                .then((response) => {
                    localStorage.setItem('x-auth', response.data)
                    axios.defaults.headers['x-auth'] = response.data
                    this.props.history.push('/')
                })
        }

        else {
            delete results.allOk
            this.setState((prevState) => {
                const changes = Object.assign({}, prevState.inputFields)
                for (let key in results) {
                    if (!results[key].verified) {
                        changes[key].invalidFeedback = results[key].message
                    } else {
                        changes[key].invalidFeedback = false
                    }
                }
                return { inputFields: changes }
            })
        }
    }

    handleChange = (e) => {
        e.persist()
        let value = []
        if (e.target.name == 'name') {
            if (e.nativeEvent.data === ' ') {
                value = e.target.value + ' '
            } else {
                const ar = e.target.value.split(' ')
                ar.forEach((val) => {
                    if (val.length > 0) {
                        value.push(val[0].toUpperCase() + val.slice(1))
                    }
                })
                value = value.join(' ')
            }
        } else {
            value = e.target.value
        }
        this.setState((prevState) => {
            let changes = Object.assign({}, prevState.inputFields)
            changes[e.target.name].value = value
            return { inputFields: changes }
        })
    }

    // called on username, email and password
    handleBlur = async (e) => {
        e.persist()
        const formData = {
            [e.target.name]: e.target.value,
        }
        const results = await this.clientSideValidations(formData)

        if (results.allOk) {
            this.setState((prevState) => {
                const changes = Object.assign({}, prevState.inputFields)
                changes[e.target.name].invalidFeedback = false
                return { inputFields: changes }
            })
        }

        else {
            this.setState((prevState) => {
                const changes = Object.assign({}, prevState.inputFields)
                changes[e.target.name].invalidFeedback = results[e.target.name].message
                return { inputFields: changes }
            })
        }
    }

    async clientSideValidations(formData) {
        let emailRegex = /^\w+@\w+\.[a-z]+$/
        let usernameRegex = /^\w+$/

        let results = { name: {}, email: {}, username: {}, password: {}, allOk: true }
        let promiseEmail, promiseUsername

        if (Object.keys(formData).includes('email')) {
            if (!formData.email) {
                results.email.message = '* Email is required'
                results.allOk = false
            }
            else {
                results.email.verified = emailRegex.test(formData.email)
                if (results.email.verified === false) {
                    results.email.message = 'Enter a valid email address'
                    results.allOk = false
                } else {
                    console.log("going to server")
                    promiseEmail = new Promise((resolve) => {
                        axios.post('/users/checkField', { email: formData.email })
                            .then((response) => {
                                resolve()
                            })
                            .catch(() => {
                                results.email.message = <div><div>This email is already registered</div> <Link to="/signin">Sign In</Link><span> or </span><Link>Recover Your Account</Link></div>
                                results.allOk = false
                                results.email.verified = false
                                resolve()
                            })
                    })

                }
            }
        }


        if (Object.keys(formData).includes('username')) {
            if (!formData.username) {
                results.username.message = '* Username is required'
                results.allOk = false
            }
            else {
                results.username.verified = usernameRegex.test(formData.username)
                if (results.username.verified === false) {
                    results.username.message = 'Enter a valid username'
                    results.allOk = false
                }
                else {
                    promiseUsername = new Promise((resolve) => {
                        axios.post('/users/checkField', { username: formData.username })
                            .then(() => {
                                resolve()
                            })
                            .catch(() => {
                                results.username.message = "Username already taken"
                                results.allOk = false
                                results.username.verified = false
                                resolve()
                            })
                    })
                }
            }
        }


        if (Object.keys(formData).includes('password')) {
            console.log("password verifi")
            if (!formData.password) {
                results.password.message = '* Password is required'
                results.allOk = false
            }
            else {
                let value = formData.password
                results.password.verified = value.length > 7 && value.length < 20 && value.match(/[0-9]/)
                if (results.password.verified === false) {
                    results.password.message = 'Must be between 7-20 characters and contain atleast 1 number'
                    results.allOk = false
                }
            }
        }

        if (Object.keys(formData).includes('name')) {
            if (!formData.name) {
                results.name.verified = false
                results.name.message = '* Name is required'
                results.allOk = false
            } else {
                results.name.verified = true
            }
        }

        if (promiseEmail) {
            await promiseEmail
        }
        if (promiseUsername) {
            await promiseUsername
        }
        return results
    }

    render() {
        return (
            <div class="container w-50 p-1 mt-3 text-center border rounded shadow" >
                <img class="w-logo float-left" src={logo} alt="logo" />
                <form onSubmit={this.handleSubmit}>
                    <h2 class="mt-5 font-custom-1">Join Between.</h2>
                    <p class="px-5 font-custom-1">Create an account to receive great stories in your inbox, personalize your homepage,
                    and follow authors and topics that you love.</p>
                    <div class="m-5 w-60 mt-c-5">
                        {
                            Object.keys(this.state.inputFields).map((field) => {
                                const obj = this.state.inputFields
                                return (
                                    <InputField
                                        type={obj[field].type} name={[field]}
                                        handleChange={this.handleChange}
                                        value={obj[field].value}
                                        placeholder={obj[field].placeholder}
                                        invalidFeedback={obj[field].invalidFeedback}
                                        handleBlur={this.handleBlur}
                                    />
                                )
                            })
                        }

                        <div class="form-group">
                            <input
                             type="checkbox" 
                             checked={this.state.termsAgreed} 
                             onChange={this.handleCheckbox} 
                             className="form-check-input" required />

                            <label class="mx-2" className="form-check-label font-custom-1">I agree all statements in <Link>Terms of service</Link></label>

                            <div class="invalid-feedback text-left">
                                You must agree before submitting.
                            </div>
                        </div>

                        <div class="form-group">
                            <button class="btn btn-success px-5" type="submit">Create Account</button>
                        </div>

                        <p class="font-custom-1">Already have an account? <Link to="/signin">Sign in</Link> </p>
                    </div>
                </form>
            </div>
        )
    }
}

export default UserSignUp