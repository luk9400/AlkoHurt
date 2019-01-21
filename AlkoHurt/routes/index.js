const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('indexAdmin', { title: 'AlkoHurt' });
});

router.get('/supplier', function (req, res, next) {
  res.render('supplier');
});

router.post('/add_supplier', function (req, res, next) {
  try {
    controller.addSupplier(req.body.name, req.body.nip, req.body.street, req.body.postal, req.body.city, req.body.phone, req.body.email);
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
