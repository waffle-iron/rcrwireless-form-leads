import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import Dashboard from './Dashboard'
import Form from './Form'
import Admin from './Admin'
import NavBar from '../components/NavBar';

const store = configureStore()

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Router>
            <div>
              <NavBar currentUser={this.props.currentUser}/>
              <Route exact path={'/'} component={Dashboard} />
              <Route path={`/admin`} component={Admin} />
              <Route path={`/forms/:id`} component={Form} />
            </div>
          </Router>
        </div>
      </Provider>
    )
  }
}
