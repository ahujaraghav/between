import React from 'react';
import {BrowserRouter, Link, Route} from 'react-router-dom'
import 'babel-polyfill';
import 'draft-js/dist/Draft.css'

import UserSignUp from './components/User/SignUp'
import StoryNew from './components/Story/New'

class App extends React.Component {
  render() {
    return (
      <div>
      <BrowserRouter>
      <Route path="/signup" component={UserSignUp}/>
      <Route path="/story/new" component={StoryNew}/>
      </BrowserRouter>
      </div>
    );
  }
}

export default App;
