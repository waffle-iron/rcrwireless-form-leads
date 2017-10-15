import fetch from 'isomorphic-fetch'

let baseUrl = '';

const fetchOptions = {
  headers: {
    'Accept': 'application/json',
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
    'Content-type': 'application/json',
  },
  credentials: 'include'
};

export const REQUEST_FORMS = 'REQUEST_FORMS';
export const RECEIVE_FORMS = 'RECEIVE_FORMS';
export const REQUEST_ITEMS = 'REQUEST_ITEMS';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';
export const REQUEST_USERS = 'REQUEST_USERS';
export const RECEIVE_USERS = 'RECEIVE_USERS';
export const RECEIVE_USER = 'RECEIVE_USER';

function requestForms() {
  return {
    type: REQUEST_FORMS
  }
}

function receiveForms(forms) {
  return {
    type: RECEIVE_FORMS,
    forms
  }
}

export function fetchForms() {
  return dispatch => {
    dispatch(requestForms())
    return fetch(`/api/forms`, fetchOptions)
      .then(response => response.json())
      .then(forms => dispatch(receiveForms(forms)))
      .catch(error => {
        console.error(error);
        dispatch(receiveForms([]))
      })
  }
}

function requestItems() {
  return {
    type: REQUEST_ITEMS
  }
}

function receiveItems(items) {
  return {
    type: RECEIVE_ITEMS,
    items
  }
}

export function fetchItems(formId, startAt, endAt) {
  return dispatch => {
    dispatch(requestItems())
    return fetch(`/api/forms/${formId}?startAt=${startAt}&endAt=${endAt}`, fetchOptions)
      .then(response => response.json())
      .then(json => dispatch(receiveItems(json)))
      .catch(error => {
        console.error(error);
        dispatch(receiveItems([]))
      })
  }
}

function requestUsers() {
  return {
    type: REQUEST_USERS
  }
}

function receiveUsers(users) {
  return {
    type: RECEIVE_USERS,
    users
  }
}

function receiveUser(user) {
  return {
    type: RECEIVE_USER,
    user
  }
}

export function fetchUsers() {
  return dispatch => {
    dispatch(requestUsers())
    return fetch(`/api/users`, fetchOptions)
      .then(response => response.json())
      .then(users => dispatch(receiveUsers(users)))
      .catch(error => {
        console.error(error);
        dispatch(receiveUsers([]))
      })
  }
}

export function updateUser(user) {
  return dispatch => {
    return fetch(
      `/api/users/${user._id}`,
        Object.assign({}, fetchOptions, {
        method: 'PUT',
        body: JSON.stringify(user)
      })
    ).then(response => response.json())
    .then(user => dispatch(receiveUser(user)))
  }  
}
