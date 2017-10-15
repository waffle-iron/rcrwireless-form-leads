const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const btoa = require('btoa');
const fetch = require('node-fetch');

const headers = {
  Authorization: `Basic ${btoa(`${process.env.ELOQUA_COMPANY}\\${process.env.ELOQUA_USERNAME}:${process.env.ELOQUA_PASSWORD}`)}`,
  Accept: 'application/json'
}

router.get('/:id', middleware.isUser, (req, res) => {
  let items = [];
  let baseUrl = '';
  let allowedForms = '';
  if (!req.user.admin) {
    allowedForms = `AND forms.id IN (${req.user.forms.join(',')})`
  }
  fetch('https://login.eloqua.com/id', { headers }).then(res => res.json())
  .then(json => {
    baseUrl = json.urls.base;
    function fetchFormDataPage(page) {
      fetch(`${baseUrl}/api/rest/2.0/data/form/${req.params.id}?page=${page}&startAt=${req.query.startAt}&endAt=${req.query.endAt}`, { headers })
      .then(res => res.json())
      .then(json => {
        Array.prototype.push.apply(items, json.elements)
        if (++page < Math.ceil(json.total / json.pageSize) + 1) {
          return fetchFormDataPage(page)
        } else {
          const connection = require('../config/mysql')();
          connection.connect();
          connection.query(`
            SELECT forms_elements.id, forms_elements.name 
            FROM forms_elements
            JOIN forms ON forms.yosql_id = forms_elements.forms_yosql_id
            WHERE forms.id = ${parseInt(req.params.id)} ${allowedForms};
          `, (err, formElements) => {
            if (err) console.error(err)
            if (!formElements.length) return res.json([]);
            const itemsWithLabels = items.map(formDatum => {
              const obj = {};
              formElements.forEach(formElement => {
                const element = formDatum.fieldValues.find(fieldValue => {
                  return parseInt(formElement.id) === parseInt(fieldValue.id);
                })
                obj[formElement.name] = element && element.value ? element.value : '';
              })
              obj.submittedAt = formDatum.submittedAt;
              return obj;
            })
            return res.json(itemsWithLabels);
          });
          connection.end();
        }
      }).catch(err => {
        console.error(err)
        res.status(500).send(err);
      })
    }
  
    fetchFormDataPage(1, req.params.id);
  }).catch(err => {
    console.error(err);
    res.status(500).send(err);
  })
})

router.get('/', middleware.isUser, (req, res) => {
  let allowedForms = '';
  if (!req.user.admin) {
    allowedForms = `AND forms.id IN (${req.user.forms.join(',')})`
  }
  const connection = require('../config/mysql')();
  connection.connect();
  connection.query(`
    SELECT id, name, createdAt, updatedAt
    FROM forms
    WHERE currentStatus = 'Active' ${allowedForms};
  `, (err, forms) => {
    if (err) console.error(err)
    return res.json(forms)
  });
  connection.end();
})

module.exports = router;
