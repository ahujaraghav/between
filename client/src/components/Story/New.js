import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { convertToRaw, ContentState } from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from '../../config/axios';
import { Prompt } from 'react-router-dom'

import StoryPublish from './Publish'


class EditorComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            editorState: '',
            htmlBody: '',
            saving: false,
            lastSaved: Date.now(),
            saveCommand: false,
            publishShow: false,
            isPublished: '',
            tags: [],
            topic: ''
        }
    }

    onEditorStateChange = (editorState) => {
        const htmlBody = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        let save
        if (this.state.saveCommand) {
            save = false
        }
        else {
            save = true
        }

        this.setState({
            editorState,
            htmlBody,
            saveCommand: true,
            saving: true
        })

        if (save) {
            setTimeout(() => {
                this.saveStory()
            }, 4000)
        }
    }

    saveStory = () => {
        const htmlBody = this.state.htmlBody
        const split = htmlBody.split('\n')
        const title = split.shift()
        const body = split.join('\n')

        this.setState(() => ({ saving: true }))

        setTimeout(() => {
            axios.put(`/story/${this.props.match.params.id}`, { title, body })
                .then(() => {
                    this.setState(() => ({
                        saving: false,
                        saveCommand: false,
                        lastSaved: Date.now(),
                    }))
                })
        }, 2000)

    }

    handlePublishShow = (bool = true) => {
        this.setState(() => ({ publishShow: bool }))
    }

    handlePublish = async (tags, fileInput, topicValue) => {
        const htmlBody = this.state.htmlBody
        const split = htmlBody.split('\n')
        const title = split.shift()
        const body = split.join('\n')

        for (let i = 0; i < tags.length; i++) {
            if (!tags[i].id) {
                const response = await axios.post('/tags', { tag: tags[i].label })
                tags[i].id = response.data
            }
        }
        const serverTags = []
        tags.forEach((tag) => {
            serverTags.push(tag.id)
        })

        // console.log(tags)
        const data = new FormData()
        data.append('previewImage', fileInput.current.files[0])
        data.append('title', title)
        data.append('body', body)
        data.append('isPublished', true)
        data.append('tags', JSON.stringify(serverTags))
        data.append('topic', topicValue.id)


        axios.put(`/story/publish/${this.props.match.params.id}`, data)
            .then(() => {
                this.props.history.replace('/stories/published')
            })
    }


    render() {
        let d = ''
        if (this.state.lastSaved) {
            let date = new Date(this.state.lastSaved)
            d = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        }
        return (
            <div className="container-fluid p-2 mt-5 position-relative">

                {this.state.publishShow ? <div className="container">
                    <StoryPublish
                        handlePublishShow={this.handlePublishShow}
                        handlePublish={this.handlePublish}
                        isPublished={this.state.isPublished}
                        id={this.props.match.params.id}
                        tags={this.state.tags}
                        topic={this.state.topic}
                    />
                </div> :
                    <div className="container">
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-sm btn-outline-info"
                                onClick={this.handlePublishShow}>
                                {this.state.isPublished ? 'Change Story Image' : 'Ready to publish ?'}
                            </button>
                        </div>
                        <div class="container border mt-2">
                            <p className="text-muted text-right font-italic font-custom-1"><span> {this.state.saveCommand && <>&#9702;</>} </span><span >{this.state.saving ? "saving..." : `last saved on ${d}`}</span></p>
                            <Editor
                                wrapperClassName="wrapper-class"
                                editorClassName="editor-class"
                                toolbarClassName="toolbar-class"
                                editorState={this.state.editorState}
                                onEditorStateChange={this.onEditorStateChange}
                                placeholder="Tell a story..."
                            />
                        </div>
                        <Prompt
                            when={this.state.saving}
                            message={location =>
                                `We are saving your story if you go back your changes wont be saved`
                            }
                        />
                    </div>
                }
            </div>
        )
    }

    componentDidMount() {
        axios.get(`/story/${this.props.match.params.id}`)
            .then((response) => {
                let html = ''
                if (response.data.title || response.data.body) {
                    html = response.data.title + '\n' + response.data.body
                } else {
                    // html = '<h1>Title...</h1>'
                }
                const contentBlock = htmlToDraft(html);
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    const editorState = EditorState.createWithContent(contentState);
                    const htmlBody = draftToHtml(convertToRaw(editorState.getCurrentContent()))
                    const options = []
                    if (response.data.tags) {
                        response.data.tags.forEach((option) => {
                            let data = {}
                            data.value = option.name
                            data.label = option.name
                            data.id = option._id
                            options.push(data)
                        })
                    }
                    let topic
                    if (response.data.topic) {
                         topic = { value: response.data.topic.name, label: response.data.topic.name, id: response.data.topic._id }
                    }

                    this.setState(() => ({ editorState, htmlBody, isPublished: response.data.isPublished, tags: options, topic }))
                }
            })
    }

    componentWillUnmount() {
        this.saveStory()
    }
}

export default EditorComponent
