const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const User = require('../models/User');
const sqlite3 = require('sqlite3');
const btoa = require('btoa');
const fetch = require('node-fetch');

const headers = {
  Authorization: `Basic ${btoa(`${process.env.ELOQUA_COMPANY}\\${process.env.ELOQUA_USERNAME}:${process.env.ELOQUA_PASSWORD}`)}`,
  Accept: 'application/json'
}

router.get('/admin', middleware.isAdmin, (req, res) => {
  User.find().then(users => {
    const db = new sqlite3.Database('database.sqlite3');
    db.serialize(() => {
      db.all(`
        SELECT id, name, createdAt, updatedAt
        FROM forms
        WHERE currentStatus = 'Active;
      `, (err, forms) => {
        if (err) console.error(err)
        return res.json({ users, forms })
      });
    });
    db.close();
  })
});

router.post('/admin', middleware.isAdmin, (req, res) => {
  User.findById(req.body.userId).then(user => {
    user.forms = user.forms.concat([req.body.formId]);
    return user.save();
  }).then(user => {
    return res.json(user);
  })
})

router.get('/forms/:id', middleware.isUser, (req, res) => {
  let items = [];
  let baseUrl = '';

  fetch('https://login.eloqua.com/id', { headers }).then(res => res.json())
  .then(json => {
    baseUrl = json.urls.base;
    function fetchFormDataPage(page) {
      fetch(`${baseUrl}/api/rest/2.0/data/form/${req.params.id}?page=${page}`, { headers })
      .then(res => res.json())
      .then(json => {
        Array.prototype.push.apply(items, json.elements)
        if (++page < Math.ceil(json.total / json.pageSize) + 1) {
          return fetchFormDataPage(page)
        } else {
          const db = new sqlite3.Database('database.sqlite3');
          db.serialize(() => {
            db.all(`
              SELECT forms_elements.id, forms_elements.name 
              FROM forms_elements
              JOIN forms ON forms.yosql_id = forms_elements.forms_yosql_id
              WHERE forms.id = ${parseInt(req.params.id)};
            `, (err, formElements) => {
              if (err) console.error(err)
              const itemsWithLabels = items.map(formDatum => {
                const obj = {};
                formElements.forEach(formElement => {
                  const element = formDatum.fieldValues.find(fieldValue => {
                    return parseInt(formElement.id) === parseInt(fieldValue.id);
                  })
                  obj[formElement.name] = element && element.value ? element.value : '';
                })
                return obj;
              })
              return res.json(itemsWithLabels);
            });
          });
          db.close();
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

router.get('/forms', middleware.isUser, (req, res) => {
  const db = new sqlite3.Database('database.sqlite3');
  db.serialize(() => {
    db.all(`
      SELECT id, name, createdAt, updatedAt
      FROM forms
      WHERE currentStatus = 'Active';
    `, (err, forms) => {
      if (err) console.error(err)
      return res.json(forms)
    });
  });
  db.close();
})

module.exports = router;
