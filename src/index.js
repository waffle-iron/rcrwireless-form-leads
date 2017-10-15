import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
const currentUserEl = document.querySelector('[data-current-user]');
const currentUser = JSON.parse(currentUserEl.getAttribute('data-current-user'));
currentUserEl.remove();
render(<Root currentUser={currentUser} />, document.getElementById('root'))
