import React from 'react'

class SignUpInputField extends React.Component {

    render() {
        return (
            <div class="form-group text-left">
                {/* <label class="text-left" for={this.props.name}>{this.props.name}</label> */}
                <div class="input-group">
                    <input
                        className=
                        {this.props.invalidFeedback && this.props.invalidFeedback !== 'new' ?
                            "form-control font-custom-1 rounded-right is-invalid" : "form-control font-custom-1 p-2 rounded-right"}
                        type={this.props.type} name={this.props.name}
                        id={this.props.name}
                        onChange={this.props.handleChange}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                        onBlur={this.props.handleBlur}
                        required />
                    {
                        this.props.invalidFeedback && this.props.invalidFeedback !== 'new'
                        &&
                        <div class="feedback-icon">
                            <i class="fa fa-times-circle"></i>
                        </div>
                    }

                    {
                        !this.props.invalidFeedback &&
                        <div class="feedback-icon">
                            <i class="fa fa-check-circle"></i>
                        </div>
                    }

                    {
                        <div class="invalid-feedback text-left text-muted">
                            {this.props.invalidFeedback}
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default SignUpInputField