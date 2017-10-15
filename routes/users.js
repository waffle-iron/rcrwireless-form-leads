const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const User = require('../models/User');

router.get('/', middleware.isAdmin, (req, res) => {
  User.find().then(users => {
    return res.json(users);
  })
});

router.put('/:id', middleware.isAdmin, (req, res) => {
  User.findById(req.params.id).then(user => {
    ['username', 'admin', 'forms'].forEach(attr => {
      user[attr] = req.body.hasOwnProperty(attr) ? req.body[attr] : user[attr];
    });
    return user.save();
  })
  .then(user => {
    return res.json(user);
  })
})

router.delete('/:id', middleware.isAdmin, (req, res) => {
  
})

module.exports = router;
