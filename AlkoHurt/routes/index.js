const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AlkoHurt' });
});

router.get('/supplier', function (req, res, next) {
  res.render('supplier');
});

router.post('/add_supplier', function (req, res, next) {
  controller.test(req.body.name);
  res.redirect('/');
});

router.get('/login_page', function (req, res, next) {
  res.render('login_page');
});

router.post('/login', function (req, res, next) {
  controller.test(req.body.name);
  res.redirect('/');
});module.exports = router;
