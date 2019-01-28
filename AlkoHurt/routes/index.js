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
    res.render('add-supplier', {
      nick: req.session.login
    });
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
      controller.addSupplier(req.session.type, req.body.name, req.body.nip, req.body.street, req.body.postal, req.body.city, req.body.phone, req.body.email);
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
    res.render('add-client', {
      nick: req.session.login
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/add_client', function (req, res) {
  if (req.session.login) {
    try {
      controller.addClient(req.session.type, req.body.name, req.body.nip, req.body.street, req.body.postal, req.body.city, req.body.phone, req.body.email);
      res.redirect('/');
    } catch (e) {
      console.log(e);
    }
  } else {
    res.redirect('/login');
  }
});

router.get('/add-wine', function (req, res) {
  if (req.session.type === 'manager' || req.session.type === 'admin') {
    res.render('add-wine', {
      nick: req.session.login
    });
  } else if (req.session.login) {
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

router.post('/add_wine', async function (req, res) {
  if (req.session.type === 'manager' || req.session.type === 'admin') {
    try {
      await controller.addWine(req.session.type, req.body.name, req.body.color, req.body.abv, req.body.type, req.body.capacity,
        req.body.country_of_origin, req.body.price);
      res.redirect('/')
    } catch (e) {
      console.log(e);
    }
  } else if (req.session.login) {
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

router.get('/add-beer', function (req, res) {
  if (req.session.type === 'manager' || req.session.type === 'admin') {
    res.render('add-beer', {
      nick: req.session.login
    });
  } else if (req.session.login) {
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

router.post('/add_beer', async function (req, res) {
  if (req.session.type === 'manager' || req.session.type === 'admin') {
    try {
      await controller.addBeer(req.session.type, req.body.name, req.body.brew, req.body.abv, req.body.type, req.body.capacity,
        req.body.container_type, req.body.price);
      res.redirect('/')
    } catch (e) {
      console.log(e);
    }
  } else if (req.session.login) {
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

router.get('/add-liquor', function (req, res) {
  if (req.session.type === 'manager' || req.session.type === 'admin') {
    res.render('add-liquor', {
      nick: req.session.login
    });
  } else if (req.session.login) {
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

router.post('/add_liquor', async function (req, res) {
  if (req.session.type === 'manager' || req.session.type === 'admin') {
    try {
      await controller.addLiquor(req.session.type, req.body.name, req.body.type, req.body.abv, req.body.capacity, req.body.price);
      res.redirect('/')
    } catch (e) {
      console.log(e);
    }
  } else if (req.session.login) {
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

router.get('/plan-sale', async function (req, res) {
  if (req.session.login) {
    controller.getPlanSaleData(req.session.type)
      .then(e => {
        res.render('plan-sale', {
          data: e,
          nick: req.session.login
        });
      }).catch(e => {
      console.log(e);
    })
  } else {
    res.redirect('/login');
  }
});

router.post('/plan_sale', async function (req, res) {
  if (req.session.login) {
    await controller.planSale(req.session.type, req.body)
      .then(() => {
        console.log("Sale planned");
        res.redirect('/');
      })
      .catch(e => {
        console.log(e);
        res.redirect('/');
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/update-sale', async function (req, res) {
  if (req.session.login) {
    controller.getSales(req.session.type)
      .then(e => {
        console.log(e);
        res.render('update-sale', {
          data: e,
          nick: req.session.login
        });
      });
  } else {
    res.redirect('/login');
  }
});

router.post('/update_sale', async function (req, res) {
  if (req.session.login) {
    controller.updateSale(req.session.type, req.body.saleSelect).then(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/plan-supply', async function (req, res) {
  if (req.session.login) {
    controller.getNames(req.session.type)
      .then(e => {
        // console.log(e);
        res.render('plan-supply', {
          data: e,
          nick: req.session.login
        });
      }).catch(e => {
      console.log(e);
      res.redirect('/');
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/plan_supply', async function (req, res) {
  if (req.session.login) {
    await controller.planSupply(req.session.type, req.body)
      .then(() => {
        console.log("Supply planned");
        res.redirect('/');
      })
      .catch(e => {
        console.log(e);
        res.redirect('/');
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/update-supply', async function (req, res) {
  if (req.session.login) {
    controller.getSupplies(req.session.type)
      .then(e => {
        console.log(e);
        res.render('update-supply', {
          data: e,
          nick: req.session.login
        });
      });
  } else {
    res.redirect('/login');
  }
});

router.post('/update_supply', async function (req, res) {
  if (req.session.login) {
    controller.updateSupply(req.session.type, req.body.supplySelect).then(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/show-quantity', async function (req, res) {
  if (req.session.login) {
    controller.getProducts(req.session.type)
      .then(e => {
        res.render('show-quantity', {
          data: e,
          nick: req.session.login
        });
      });
  } else {
    res.redirect('/login');
  }
});

router.post('/show_quantity', async function (req, res) {
  if (req.session.login) {
    controller.quantityOnDate(req.session.type, req.body.product_id, req.body.date)
      .then(e => {
        res.json({quantity: e});
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', async function (req, res) {
  try {
    req.session = await controller.login(req.body.login, req.body.password, req.session);
    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
});

router.get('/add-user', function (req, res) {
  if (req.session.type === 'admin') {
    res.render('add-user', {
      nick: req.session.login
    });
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
      await controller.addUser(req.session.type, req.body.login, req.body.password, req.body.type);
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

router.get('/backup', async function (req, res) {
  if (req.session.type === 'admin') {
    await controller.createBackup();
  }
  res.redirect('/');
});

router.get('/restore', function (req, res) {
  if (req.session.type === 'admin') {
    controller.getBackups()
      .then(e => {
        console.log(e);
        res.render('restore', {
          data: e,
          nick: req.session.login
        });
      });
  } else if (req.session.login) {
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

router.post('/restore', function (req, res) {
  if (req.session.type === 'admin') {

  } else if (req.session.login) {
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
