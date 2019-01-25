const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.login) {
    res.render('indexAdmin', {
      session: req.session,
      result: ''
    });
  } else {
    res.render('login');
  }
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

router.get('/add-wine', function (req, res, next) {
  res.render('add-wine');
});

router.post('/add_wine', async function (req, res, next) {
  try {
    await controller.addWine(req.body.name, req.body.color, req.body.abv, req.body.type, req.body.capacity,
      req.body.country_of_origin, req.body.price);
    res.redirect('/')
  } catch (e) {
    console.log(e);
  }
});

router.get('/add-beer', function (req, res, next) {
  res.render('add-beer');
});

router.post('/add_beer', async function (req, res, next) {
  try {
    await controller.addBeer(req.body.name, req.body.brew, req.body.abv, req.body.type, req.body.capacity,
      req.body.container_type, req.body.price);
    res.redirect('/')
  } catch (e) {
    console.log(e);
  }
});

router.get('/add-liquor', function (req, res, next) {
  res.render('add-liquor');
});

router.post('/add_liquor', async function (req, res, next) {
  try {
    await controller.addLiquor(req.body.name, req.body.type, req.body.abv, req.body.capacity, req.body.price);
    res.redirect('/')
  } catch (e) {
    console.log(e);
  }
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', async function (req, res, next) {
  try {
    req.session = await controller.login(req.body.login, req.body.password, req.session);
    console.log(req.session.login);
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

router.get('/add-user', function (req, res, next) {
  res.render('add-user');
});

router.post('/add_user', async function (req, res, next) {
  try {
    await controller.addUser(req.body.login, req.body.password, req.body.type);
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
