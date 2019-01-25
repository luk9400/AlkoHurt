const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('indexAdmin', { title: 'AlkoHurt' });
});

router.get('/add-supplier', function (req, res) {
  res.render('add-supplier');
});

router.post('/add_supplier', function (req, res) {
  try {
    controller.addSupplier(req.body.name, req.body.nip, req.body.street, req.body.postal, req.body.city, req.body.phone, req.body.email);
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

router.get('/add-client', function (req, res) {
  res.render('add-client');
});

router.get('/add_client', function (req, res) {
  try {
    controller.addClient(req.body.name, req.body.nip, req.body.street, req.body.postal, req.body.city, req.body.phone, req.body.email);
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

router.get('/add-wine', function (req, res) {
  res.render('add-wine');
});

router.post('/add_wine', async function (req, res) {
  try {
    await controller.addWine(req.body.name, req.body.color, req.body.abv, req.body.type, req.body.capacity,
      req.body.country_of_origin, req.body.price);
    res.redirect('/')
  } catch (e) {
    console.log(e);
  }
});

router.get('/add-beer', function (req, res) {
  res.render('add-beer');
});

router.post('/add_beer', async function (req, res) {
  try {
    await controller.addBeer(req.body.name, req.body.brew, req.body.abv, req.body.type, req.body.capacity,
      req.body.container_type, req.body.price);
    res.redirect('/')
  } catch (e) {
    console.log(e);
  }
});

router.get('/add-liquor', function (req, res) {
  res.render('add-liquor');
});

router.post('/add_liquor', async function (req, res) {
  try {
    await controller.addLiquor(req.body.name, req.body.type, req.body.abv, req.body.capacity, req.body.price);
    res.redirect('/')
  } catch (e) {
    console.log(e);
  }
});

router.get('/plan-supply', async function (req, res) {
  controller.getNames()
    .then(e => {
      console.log(e);
      res.render('plan-supply', {data: e});
    });
});

router.post('/plan_supply', async function (req, res) {
  try {
    // controller.planSupply(req.)
  } catch (e) {
    
  }
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', function (req, res) {
    controller.test(req.body.name);
    res.redirect('/');
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
})



module.exports = router;
