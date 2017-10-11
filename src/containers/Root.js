import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import Dashboard from './Dashboard'
import Form from './Form'

const store = configureStore()

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route exact path={window.location.pathname} component={Dashboard} />
            {/* <Route path={`${window.location.pathname}admin`} component={Admin} /> */}
            <Route path={`${window.location.pathname}forms/:id`} component={Form} />
          </div>
        </Router>
      </Provider>
    )
  }
}
