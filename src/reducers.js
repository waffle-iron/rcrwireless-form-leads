import { combineReducers } from 'redux'
import {
  REQUEST_FORMS,
  RECEIVE_FORMS,
  REQUEST_ITEMS,
  RECEIVE_ITEMS,
  REQUEST_USERS,
  RECEIVE_USERS,
  RECEIVE_USER
} from './actions'

function forms(state = [], action) {
  switch (action.type) {
    case REQUEST_FORMS:
      return []
    case RECEIVE_FORMS:
      return action.forms
    default:
      return state
  }
}

function items(state = [], action) {
  switch (action.type) {
    case REQUEST_ITEMS:
      return []
    case RECEIVE_ITEMS:
      return action.items
    default:
      return state
  }
}

function users(state = [], action) {
  switch (action.type) {
    case REQUEST_USERS:
      return []
    case RECEIVE_USERS:
      return action.users
    case RECEIVE_USER:
      return state.slice().splice(state.findIndex(item => item._id === action.user._id), 1, action.user);
    default:
      return state
  }
}

const rootReducer = combineReducers({
  forms,
  items,
  users
})

export default rootReducer
