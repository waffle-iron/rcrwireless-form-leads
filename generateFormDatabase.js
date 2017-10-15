const fetch = require('node-fetch');
const btoa = require('btoa');
const fs = require('fs');
const yosql = require('yosql');
const mysql = require('mysql');
const forms = [];
let baseUrl = '';

const headers = {
  Authorization: `Basic ${btoa(`${process.env.ELOQUA_COMPANY}\\${process.env.ELOQUA_USERNAME}:${process.env.ELOQUA_PASSWORD}`)}`,
  Accept: 'application/json'
}

console.log('fetching authorized base url')
fetch('https://login.eloqua.com/id', { headers }).then(res => res.json())
.then(json => {
  console.log('fetched authorized base url', json.urls.base)
  baseUrl = json.urls.base;
  fetchForms(1);
}).catch(err => console.error(err))

function fetchForms(page) {
  console.log('fetching forms page', page)
  fetch(`${baseUrl}/api/rest/2.0/assets/forms?page=${page}&depth=partial`, { headers })
  .then(res => res.json())
  .then(json => {
    Array.prototype.push.apply(forms, json.elements)
    console.log('forms fetched', forms.length)
    if (++page < Math.ceil(json.total / json.pageSize) + 1) fetchForms(page)
    else createDatabase()
  }).catch(err => console.error(err))
}

function createDatabase() {
  console.log('generating yosql database')
  yosql.createTable('forms', forms, (err, schema) => {
    if (err) return console.error(err);
    console.log('finished traversing forms');

    console.log('running queries');
    const connection = require('./config/mysql')();
    connection.connect();
    Object.keys(schema).forEach(table => {      
      connection.query(`DROP TABLE IF EXISTS ${table};`)
      connection.query(schema[table].queries.create);
      connection.query(schema[table].queries.insert);
    });
    connection.end();
  });
}
