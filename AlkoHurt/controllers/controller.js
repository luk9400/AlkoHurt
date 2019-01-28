const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');
const {exec} = require('child_process');
const fs = require('fs');

const poolApp = mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'app',
  password: 'apppassword',
  database: 'alkohurt',
  dateStrings: true,
  connectionLimit: 5
});

const poolAdmin = mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'admin',
  password: 'adminpassword',
  database: 'alkohurt',
  dateStrings: true,
  connectionLimit: 5
});

const poolManager = mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'manager',
  password: 'managerpassword',
  database: 'alkohurt',
  dateStrings: true,
  connectionLimit: 5
});

const poolWorker = mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'worker',
  password: 'workerpassword',
  database: 'alkohurt',
  dateStrings: true,
  connectionLimit: 5
});

const pool = {
  app: poolApp,
  admin: poolAdmin,
  manager: poolManager,
  worker: poolWorker
};

async function addSupplier(type, name, nip, street, postal, city, phone, email) {
  const conn = await pool[type].getConnection();
  const query = 'INSERT INTO suppliers (name, nip, street_and_number, postal_code, city, phone_number, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
  await conn.query(query, [name, nip, street, postal, city, phone, email]);
  conn.end();
  return query;
}

async function addClient(type, name, nip, street, postal, city, phone, email) {
  const conn = await pool[type].getConnection();
  const query = 'INSERT INTO clients (name, nip, street_and_number, postal_code, city, phone_number, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
  await conn.query(query, [name, nip, street, postal, city, phone, email]);
  conn.end();
  return query;
}

async function addWine(userType, name, color, abv, type, capacity, country_of_origin, price) {
  const conn = await pool[userType].getConnection();
  const query = 'CALL add_wine(?, ?, ?, ?, ?, ?, ?)';
  await conn.query(query, [name, color, abv, type, capacity, country_of_origin, price]);
  conn.end();
}

async function addBeer(userType, name, brewery, abv, type, capacity, container_type, price) {
  console.log(name, brewery, abv, type, capacity, container_type, price);
  const conn = await pool[userType].getConnection();
  const query = 'CALL add_beer(?, ?, ?, ?, ?, ?, ?)';
  await conn.query(query, [name, brewery, abv, type, capacity, container_type, price]);
  conn.end();
}

async function addLiquor(userType, name, type, abv, capacity, price) {
  const conn = await pool[userType].getConnection();
  const query = 'CALL add_liquor(?, ?, ?, ?, ?)';
  await conn.query(query, [name, type, abv, capacity, price]);
  conn.end();
}

async function getNames(type) {
  const conn = await pool[type].getConnection();
  const types = ['beers', 'wines', 'liquors'];
  let productsData = [];
  let suppliers = [];
  try {
    await conn.query('SELECT supplier_id, name FROM suppliers')
      .then(result => {
        for (let el of result) {
          if (el !== 'meta') {
            suppliers.push(el);
          }
        }
      });
  } catch (e) {
    console.log(e);
  }
  console.log(suppliers);

  for (type of types) {
    try {
      productsData.push({
        name: type,
        data: (await conn.query(`SELECT product_id, name, capacity FROM ${type}`))
      });
    } catch (e) {
      console.log(e);
    }
  }
  console.log(productsData);
  conn.end();

  return {
    suppliers: suppliers,
    productsData: productsData
  };
}

async function getPlanSaleData(type) {
  const conn = await pool[type].getConnection();
  const types = ['beers', 'wines', 'liquors'];
  let productsData = [];
  let clients = [];

  try {
    await conn.query('SELECT client_id, name, nip FROM clients')
      .then(result => {
        for (let el of result) {
          if (el !== 'meta') {
            clients.push(el);
          }
        }
      });
  } catch (e) {
    console.log(e);
  }
  console.log(clients);

  for (type of types) {
    const sql = `SELECT t.product_id, t.name, t.capacity, quantity FROM ${type} t JOIN products p on t.product_id = p.product_id`;
    try {
      productsData.push({
        name: type,
        data: (await conn.query(sql))
      });
    } catch (e) {
      console.log(e);
    }
  }
  console.log(productsData);
  conn.end();

  return {
    clients: clients,
    productsData: productsData
  };
}

async function planSale(type, saleData) {
  const conn = await pool[type].getConnection();
  const client_id = saleData.client;
  const date = saleData.date;
  const products = saleData.products;

  console.log(client_id, date, products);

  await conn.beginTransaction()
    .then(async () => {
      const newSale =
        'INSERT INTO sales(sale_date, client_id, done) VALUES (?, ?, ?)';

      await conn.query(newSale, [date, client_id, false])
        .then(async (e) => {
          const lastId = e.insertId;
          console.log('last insert id: ' + lastId);

          for (let product of products) {
            conn.query('INSERT INTO sales_info(product_id, sale_id, quantity) VALUES (?, ?, ?)',
              [product.product_id, lastId, product.quantity]);
          }

          console.log("Inserted");
        });
      conn.commit();
    }).catch(e => {
      console.log(e);
    });

  conn.end();
}

async function planSupply(type, supplyData) {
  const conn = await pool[type].getConnection();
  const supplier_id = supplyData.supplier;
  const date = supplyData.date;
  const products = supplyData.products;

  console.log(supplier_id, date, products);

  await conn.beginTransaction()
    .then(async () => {
      const newSupply =
        'INSERT INTO supplies(supply_date, supplier_id, done) VALUES (?, ?, ?)';

      await conn.query(newSupply, [date, supplier_id, false])
        .then(async (e) => {
          const lastid = e.insertId;
          console.log('last insert id: ' + lastid);

          for (let product of products) {
            conn.query('INSERT INTO supplies_info(product_id, supply_id, quantity) VALUES (?, ?, ?)',
              [product.product_id, lastid, product.quantity]);
          }

          console.log("Inserted");
        });
      conn.commit();
    }).catch(e => {
      console.log(e);
    });

  conn.end();
}

async function addUser(userType, login, password, type) {
  const conn = await pool[userType].getConnection();
  await bcrypt.hash(password, 10, async function (err, hashPassword) {
    const query = 'INSERT INTO users (login, password, type) VALUES (?, ?, ?)';
    await conn.query(query, [login, hashPassword, type]);
  });
  conn.end();
}

async function login(login, password, session) {
  const conn = await pool['app'].getConnection();
  const query = 'SELECT password, type FROM users WHERE login = ?';
  const result = await conn.query(query, [login]);
  conn.end();

  let response = await bcrypt.compare(password, result[0].password);

  if (response) {
    session.login = login;
    session.type = result[0].type;
  }

  return session;
}

async function getSupplies(type) {
  const conn = await pool[type].getConnection();

  let supplies = [];

  let supplies_ids = (await conn.query('SELECT supply_id FROM supplies WHERE done = 0')).map(e => e.supply_id);

  console.log(supplies_ids);

  for (let supply_id of supplies_ids) {
    try {
      supplies.push({
        supply_id: supply_id,
        date: (await conn.query('SELECT supply_date FROM supplies WHERE supply_id = ?', [supply_id]))[0].supply_date,
        supplier: (await conn.query(
          'SELECT name FROM supplies JOIN suppliers ON supplies.supplier_id = suppliers.supplier_id WHERE supply_id = ?',
          [supply_id]
        ))[0].name,
        products: (await conn.query('SELECT name, capacity, s.quantity' +
          ' FROM supplies_info s JOIN products p on s.product_id = p.product_id ' +
          ' WHERE supply_id = ?', [supply_id]))
      });
    } catch (e) {
      console.log(e);
    }
  }

  conn.end();

  return supplies;
}

async function updateSupply(type, supply_id) {
  const conn = await pool[type].getConnection();

  await conn.query('CALL update_supply(?)', [supply_id])
    .then(e => {
      console.log(e);
      console.log('Supply made done :)')
    });

  conn.end();
}

async function getSales(type) {
  const conn = await pool[type].getConnection();

  let sales = [];

  let sales_ids = (await conn.query('SELECT sale_id FROM sales WHERE done = 0')).map(e => e.sale_id);

  console.log(sales_ids);

  for (let sale_id of sales_ids) {
    try {
      sales.push({
        sale_id: sale_id,
        date: (await conn.query('SELECT sale_date FROM sales WHERE sale_id = ?', [sale_id]))[0].sale_date,
        client: (await conn.query(
          'SELECT name FROM sales JOIN clients ON sales.client_id = clients.client_id WHERE sale_id = ?',
          [sale_id]
        ))[0].name,
        products: (await conn.query('SELECT name, capacity, s.quantity' +
          ' FROM sales_info s JOIN products p on s.product_id = p.product_id ' +
          ' WHERE sale_id = ?', [sale_id]))
      });
    } catch (e) {
      console.log(e);
    }
  }

  conn.end();

  return sales;
}

async function updateSale(type, sale_id) {
  const conn = await pool[type].getConnection();

  await conn.query('CALL update_sale(?)', [sale_id])
    .then(e => {
      console.log(e);
      console.log('Sale made done :)')
    });

  conn.end();
}

async function getProducts(type) {
  const conn = await pool[type].getConnection();
  const types = ['beers', 'wines', 'liquors'];
  let productsData = [];

  for (type of types) {
    try {
      productsData.push({
        name: type,
        data: (await conn.query(`SELECT product_id, name, capacity FROM ${type}`))
      });
    } catch (e) {
      console.log(e);
    }
  }
  console.log(productsData);
  conn.end();

  return {
    productsData
  };
}

async function quantityOnDate(type, product_id, date) {
  const conn = await pool[type].getConnection();
  let quantity = null;

  await conn.query('SELECT quantity_on_date(?, ?) as quantity', [product_id, date])
    .then(e => {
      quantity = e[0].quantity;
    }).catch(e => {
      console.log(e);
    });

  conn.end();
  return quantity;
}

function createBackup() {
  const date = new Date();
  exec('mysqldump -u admin -padminpassword alkohurt', (error, stdout, stderr) => {
    if (error) {
      console.log(error);
    }
    fs.writeFile(`./backups/d${date.getTime()}.sql`, stdout, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
  console.log('Done');
}

async function getBackups() {
  const date = new Date();
  console.log(date.toUTCString());
  const result = await fs.readdirSync('./backups') || [];
  console.log(result);
  return result;
}

function restore(backupName) {
  exec(`mysql -u admin -padminpassword < ./backups/${backupName}`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = {
  addSupplier, addClient, addWine, addBeer, addLiquor, addUser, login,
  getNames, planSupply, getSupplies, updateSupply, getPlanSaleData, planSale,
  getSales, updateSale, getProducts, quantityOnDate, createBackup, getBackups, restore
};
