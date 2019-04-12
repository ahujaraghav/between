import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'
import 'babel-polyfill';
import 'draft-js/dist/Draft.css'

import UserSignUp from './components/User/SignUp'
import StoryNew from './components/Story/New'
import Header from './components/commons/Header'
import StoryList from './components/Story/List'
import StoryCreate from './components/Story/Create'
import Login from './components/authentication/Login'

import Page from './components/Main/Page'
import StoryView from './components/Main/StoryView'

import axios from './config/axios';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: undefined,
      user: {}
    }
  }

  // handleUserAuthenticated = (authenticated) => {
  //   if (authenticated) {
  //     axios.get('/users')
  //       .then((response) => {
  //         this.setState(() => ({
  //           user: response.data,
  //           isAuthenticated: true
  //         }))
  //       })
  //   } else {
  //     this.setState(() => ({ isAuthenticated: false }))
  //   }
  // }

  updateUser = () => {
    axios.get('/users')
      .then((response) => {
        this.setState(() => ({
          user: response.data,
          isAuthenticated: true
        }))
      })
      .catch(()=>{
        this.setState(()=>({isAuthenticated: false}))
      })
  }

  render() {
    return this.state.isAuthenticated === undefined ? <></> :
      <div>
        <BrowserRouter>
          <Route path="/" render={(props) => {
            return <Header isAuthenticated={this.state.isAuthenticated}
              user={this.state.user} {...props} />
          }} />

          {/* <Switch> */}
          {
            this.state.isAuthenticated && (
              <Switch>
                <Route path="/" component={Page} exact={true} />
                {/* New story and editing that story */}
                <Route path="/story/new" component={StoryCreate} />
                <Route path="/story/:id" component={StoryNew} />
                {/* Drafts and published tabs inside user stories */}
                <Route path="/stories/:tab" component={StoryList} />
                <Route path="/stories/" component={StoryList} />

                <Route path="/logout" render={(props) => {
                  localStorage.clear()
                  props.history.replace('/')
                  window.location.reload()
                  return (<div>Logging you out...</div>)
                }} />


                {/* For viewing a story */}
                <Route path="/:id" render={(props) => {
                  return <StoryView {...props} user={this.state.user} updateUser={this.updateUser} />
                }} />
              </Switch>
            )
          }


          {
            !this.state.isAuthenticated && (<Switch>
              <Route path="/" component={Page} exact={true} />
              <Route path="/signup" component={UserSignUp} />
              <Route path="/login" render={(props) => {
                return <Login {...props} 
                // handleUserAuthenticated={this.handleUserAuthenticated} 
                  updateUser={this.updateUser}
                />
              }} />

              {/* For viewing a story */}
              <Route path="/:id" component={StoryView} />
            </Switch>)
          }
          {/* </Switch> */}
        </BrowserRouter>
      </div>
  }

  componentDidMount() {
    this.updateUser()
  //   if (localStorage.getItem('x-auth')) {
  //     axios.get('/users')
  //       .then((response) => {
  //         console.log(response.data)
  //         this.setState(() => ({
  //           user: response.data,
  //           isAuthenticated: true
  //         }))
  //       })
  //   } else {
  //     this.setState(() => ({ isAuthenticated: false }))
  //   }
  }
}

export default App;
