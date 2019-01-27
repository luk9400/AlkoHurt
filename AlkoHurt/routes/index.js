const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

/* GET home page. */
router.get('/', function (req, res) {
  if (req.session.login) {
    res.render('index' + req.session.type, {
      nick: req.session.login,
      message: ''
    });
  } else {
    res.render('login');
  }
});

router.get('/add-supplier', function (req, res) {
  if (req.session.type === 'manager' || req.session.type === 'admin') {
    res.render('add-supplier');
  } else if (req.session.login) {
    res.render('index' + req.session.type, {
      nick: req.session.login,
      message: "You don't have permission to do that"
    })
  } else {
    res.redirect('/login');
  }
});

router.post('/add_supplier', function (req, res) {
  if (req.session.type === 'manager' || req.session.type === 'admin') {
    try {
      controller.addSupplier(req.body.name, req.body.nip, req.body.street, req.body.postal, req.body.city, req.body.phone, req.body.email);
      res.redirect('/');
    } catch (e) {
      console.log(e);
    }
  } else if (req.session.login) {
    res.render('index' + req.session.type, {
      nick: req.session.login,
      message: "You don't have permission to do that"
    })
  } else {
    res.redirect('/login');
  }
});

router.get('/add-client', function (req, res) {
  if (req.session.login) {
    res.render('add-client');
  } else {
    res.redirect('/login');
  }
});

router.post('/add_client', function (req, res) {
  if (req.session.login) {
    try {
      controller.addClient(req.body.name, req.body.nip, req.body.street, req.body.postal, req.body.city, req.body.phone, req.body.email);
      res.redirect('/');
    } catch (e) {
      console.log(e);
    }
  } else {
    res.redirect('/login');
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

router.get('/plan-sale', async function (req, res) {
  controller.getPlanSaleData()
    .then(e => {
      res.render('plan-sale', {data: e});
    }).catch(e => {
      console.log(e);
  })
});

router.post('/plan_sale', async function (req, res) {
  await controller.planSale(req.body)
    .then(() => {
      console.log("Sale planned");
      res.redirect('/');
    })
    .catch(e => {
      console.log(e);
      res.redirect('/');
    });
});

router.get('/plan-supply', async function (req, res) {
  controller.getNames()
    .then(e => {
      // console.log(e);
      res.render('plan-supply', {data: e});
    }).catch(e => {
    console.log(e);
    res.redirect('/');
  });
});

router.post('/plan_supply', async function (req, res) {
  // console.log(req.body);
  await controller.planSupply(req.body)
    .then(() => {
      console.log("Supply planned");
      res.redirect('/');
    })
    .catch(e => {
      console.log(e);
      res.redirect('/');
    });
});

router.get('/update-supply/', async function (req, res) {
  controller.getSupplies()
    .then(e => {
      console.log(e);
      res.render('update-supply', {data: e});
    });
});

router.post('/update_supply', async function (req, res) {
  controller.updateSupply(req.body.supplySelect);
  res.redirect('/');
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', async function (req, res) {
  try {
    req.session = await controller.login(req.body.login, req.body.password, req.body.type, req.session);
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

router.get('/add-user', function (req, res) {
  if (req.session.type === 'admin') {
    res.render('add-user');
  } else if (req.session.login) {
    res.render('indexAdmin', {
      nick: req.session.login,
      message: "You don't have permission to do that"
    })
  } else {
    res.redirect('/login');
  }
});

router.post('/add_user', async function (req, res) {
  if (req.session.type === 'admin') {
    try {
      await controller.addUser(req.body.login, req.body.password, req.body.type);
      res.redirect('/');
    } catch (e) {
      console.log(e);
    }
  } else if (req.session.login) {
    res.render('indexAdmin', {
      nick: req.session.login,
      message: "You don't have permission to do that"
    })
  } else {
    res.redirect('/login');
  }
});

router.get('/logout', function (req, res) {
  req.session.login = undefined;
  req.session.type = undefined;
  res.redirect('/login');
});

module.exports = router;
