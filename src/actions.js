import fetch from 'isomorphic-fetch'

let baseUrl = '';

const fetchOptions = {
  headers: {
    Accept: 'application/json',
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  },
  credentials: 'include'
};

export const REQUEST_FORMS = 'REQUEST_FORMS';
export const RECEIVE_FORMS = 'RECEIVE_FORMS';
export const REQUEST_ITEMS = 'REQUEST_ITEMS';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';

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

export function fetchItems(formId) {
  return dispatch => {
    dispatch(requestItems())
    return fetch(`/api/forms/${formId}`, fetchOptions)
      .then(response => response.json())
      .then(json => dispatch(receiveItems(json)))
      .catch(error => {
        console.error(error);
        dispatch(receiveItems([]))
      })
  }
}
