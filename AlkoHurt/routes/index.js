const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('indexAdmin', { title: 'AlkoHurt' });
});

router.get('/add-supplier', function (req, res, next) {
  res.render('add-supplier');
});

router.post('/add_supplier', function (req, res, next) {
  try {
    controller.addSupplier(req.body.name, req.body.nip, req.body.street, req.body.postal, req.body.city, req.body.phone, req.body.email);
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

router.get('/add-client', function (req, res, next) {
  res.render('add-client');
});

router.get('/add_client', function (req, res, next) {
  try {
    controller.addClient(req.body.name, req.body.nip, req.body.street, req.body.postal, req.body.city, req.body.phone, req.body.email);
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login', function (req, res, next) {
    controller.test(req.body.name);
    res.redirect('/');
});

module.exports = router;
