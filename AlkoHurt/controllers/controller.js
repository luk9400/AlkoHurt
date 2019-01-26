const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');

const pool = mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'password',
  database: 'alkohurt',
  dateStrings: 'date',
  connectionLimit: 5
});

const poolApp = mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'app',
  password: 'apppassword',
  database: 'alkohurt',
  connectionLimit: 5
});

const poolAdmin =  mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'admin',
  password: 'adminpassword',
  database: 'alkohurt',
  connectionLimit: 5
});

const poolManager =  mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'manager',
  password: 'managerpassword',
  database: 'alkohurt',
  connectionLimit: 5
});

const poolWorker =  mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'worker',
  password: 'workerpassword',
  database: 'alkohurt',
  connectionLimit: 5
});

const pools = {
  app: poolApp,
  admin: poolAdmin,
  manager: poolManager,
  worker: poolWorker
};

async function addSupplier(name, nip, street, postal, city, phone, email) {
  const conn = await pool.getConnection();
  const query = 'INSERT INTO suppliers (name, nip, street_and_number, postal_code, city, phone_number, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
  await conn.query(query, [name, nip, street, postal, city, phone, email]);
  conn.end();
  return query;
}

async function addClient(name, nip, street, postal, city, phone, email) {
  const conn = await pool.getConnection();
  const query = 'INSERT INTO client (name, nip, street_and_number, postal_code, city, phone_number, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
  await conn.query(query, [name, nip, street, postal, city, phone, email]);
  conn.end();
  return query;
}

async function addWine(name, color, abv, type, capacity, country_of_origin, price) {
  const conn = await pool.getConnection();
  const query = 'CALL add_wine(?, ?, ?, ?, ?, ?, ?)';
  await conn.query(query, [name, color, abv, type, capacity, country_of_origin, price]);
  conn.end();
}

async function addBeer(name, brewery, abv, type, capacity, container_type, price) {
  console.log(name, brewery, abv, type, capacity, container_type, price);
  const conn = await pool.getConnection();
  const query = 'CALL add_beer(?, ?, ?, ?, ?, ?, ?)';
  await conn.query(query, [name, brewery, abv, type, capacity, container_type, price]);
  conn.end();
}

async function addLiquor(name, type, abv, capacity, price) {
  const conn = await pool.getConnection();
  const query = 'CALL add_liquor(?, ?, ?, ?, ?)';
  await conn.query(query, [name, type, abv, capacity, price]);
  conn.end();
}

async function getNames() {
  const conn = await pool.getConnection();
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

  let results = {
    suppliers: suppliers,
    productsData: productsData
  };

  return results;
}

async function planSupply(supplyData) {
  const conn = await pool.getConnection();
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

async function addUser(login, password, type) {
  const conn = await pool.getConnection();
  await bcrypt.hash(password, 10, async function (err, hashPassword) {
    const query = 'INSERT INTO users (login, password, type) VALUES (?, ?, ?)';
    await conn.query(query, [login, hashPassword, type]);
  });
  conn.end();
}

async function login(login, password, type, session) {
  const conn = await pool.getConnection();
  const query = 'SELECT password, type FROM users WHERE login = ?';
  const result = await conn.query(query, [login]);
  conn.end();

  let response = await bcrypt.compare(password, result[0].password);

  if (response) {
    console.log(result[0].type);
    session.login = login;
    session.type = result[0].type;
  }
  return session;
}

async function getSupplies() {
  const conn = await pool.getConnection();

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

async function updateSupply(supply_id) {
  const conn = await pool.getConnection();

  await conn.query('UPDATE supplies SET done = 1 WHERE supply_id = ?', [supply_id])
    .then(e => {
      console.log(e);
      console.log('Supply made done :)')
    });

  conn.end();
}
module.exports = {
  addSupplier, addClient, addWine, addBeer, addLiquor, addUser, login,
  getNames, planSupply, getSupplies, updateSupply
};
