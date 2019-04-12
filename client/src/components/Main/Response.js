import React from 'react'
import axios from '../../config/axios';

class Response extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: props.user,
            isAuthenticated: props.isAuthenticated,
            response: '',
            responses: props.responses
        }
    }

    // will receive props in update story
    componentWillReceiveProps(nextProps) {
        const props = Object.assign({}, nextProps)
        props.response = ''
        this.setState(() => (props))
    }

    handleResponseChange = (e) => {
        e.persist()
        const value = e.target.value
        if (this.state.isAuthenticated) {
            this.setState(() => ({ response: value}))
        }else{
            this.props.history.push('/login')
        }
    }


    handleSubmit = (e) => {
        e.preventDefault()
        e.persist()
        axios.post('/responses',
            { response: this.state.response, story: this.props.story._id })
            .then(() => {
                this.props.updateStory()
            })

        // e.target.reset()
    }

    render() {
        // console.log(this.state.responses)
        return (
            <div>
                <h6>Responses</h6>
                <form onSubmit={this.handleSubmit}>
                    <input className="form-control mt-2 p-2 row-1"
                        value={this.state.response}
                        onChange={this.handleResponseChange}
                        placeholder="Write a response..." />
                    <input type="submit" hidden />
                </form>

                {this.state.responses.map((response) => {
                    return (<div class="card mt-3">
                        <div class="card-body">
                            <div className="d-flex">
                                <span className="google-circle-2 mr-2">{response.user.name[0]}</span>
                                <div>
                                    <h6 className="mb-0">{response.user.name}</h6>
                                    <small className="">&nbsp;{new Date(response.createdAt).toString().split(' ').splice(1, 3).join(' ')}</small>
                                </div>
                            </div>
                            <div className="m-2">
                                {response.body}
                            </div>
                        </div>
                    </div>)
                })}
            </div>
        )
    }
}

export default Response