import React from 'react'
import { Modal } from 'react-bootstrap'

import '../../css/modal.css'

import { FilePond, registerPlugin } from "react-filepond";
import Select from 'react-select'

import "filepond/dist/filepond.min.css";
import axios from '../../config/axios';
// import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
// import FilePondPluginImagePreview from "filepond-plugin-image-preview";
// import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
// registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);


class StoryPublish extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show: true,
            values: this.props.tags,
            tagOptions: [],
            topicOptions: [],
            topicValue:this.props.topic,
            defaultValue: this.props.tags,
            defaultTopic: this.props.topic,
            fileInputRef: React.createRef()
        }
    }


    handleClose = () => {
        console.log("close")
        this.props.handlePublishShow(false)
        // this.setState(() => ({ show: false }))
    }

    handleInputChange = (value) => {
        axios.get(`/tags?search=${value}`)
            .then((response) => {
                const tagOptions = []
                response.data.forEach((option) => {
                    let data = {}
                    data.id = option._id
                    data.value = option.name
                    data.label = option.name
                    tagOptions.push(data)
                })
                this.setState(() => ({ tagOptions }))
            })
            .catch(() => {
                const tagOptions = []
                let data = {
                    value: value,
                    label: value
                }
                // console.log(data)
                tagOptions.push(data)
                this.setState(() => ({ tagOptions }))
            })
    }

    handleTagChange = (values) => {
        console.log(values)
        this.setState(() => ({ values }))
    }

    handlePublish = () => {
        this.props.handlePublish(this.state.values, this.state.fileInputRef, this.state.topicValue)
    }

    handleTopicChange = (value) => {
        console.log(value)
        this.setState(()=>({topicValue:value}))
    }



    render() {
        console.log(this.state.defaultValue)
        return (
            <div className="">
                <Modal className="custom-modal" show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <div className="container p-5 col-6">
                            <h6 className="">Include a high-quality image in your story to make it more inviting to readers.</h6>
                            <div class="custom-file">
                                <input type="file" ref={this.state.fileInputRef} />
                            </div>
                            <input className="custom-file-input" />
                            <h6>Select the Topic of your story</h6>
                            <Select
                                onChange={this.handleTopicChange}
                                options={this.state.topicOptions}
                                defaultValue={this.state.defaultTopic}
                            />
                            <h6 className="mt-5">Add tags so readers know what your story is about</h6>
                            <Select
                                defaultValue={this.state.defaultValue}
                                // values={this.state.values}
                                onChange={this.handleTagChange}
                                onInputChange={this.handleInputChange}
                                isMulti
                                name="colors"
                                options={this.state.tagOptions}
                                placeholder='Add Tags..'
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                            <button onClick={this.handlePublish} className="btn btn-info mt-5 float-right">Publish now</button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }

    componentDidMount() {
        axios.get('/topics')
            .then((response) => {
                const topicOptions = []
                response.data.forEach((topic) => {
                    let data = {}
                    data.id = topic._id
                    data.value = topic.name
                    data.label = topic.name
                    topicOptions.push(data)
                })
                console.log(topicOptions)
                this.setState(() => ({ topicOptions }))
            })
    }
}

export default StoryPublish