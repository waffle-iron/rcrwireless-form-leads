import { combineReducers } from 'redux'
import {
  REQUEST_FORMS,
  RECEIVE_FORMS,
  REQUEST_ITEMS,
  RECEIVE_ITEMS
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

const rootReducer = combineReducers({
  forms,
  items
})

export default rootReducer
