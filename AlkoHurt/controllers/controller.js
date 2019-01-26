const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');

const pool = mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'password',
  database: 'alkohurt',
  connectionLimit: 5
});

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
  let result = [];

  for (type of types) {
    try {
      result.push({
        name: type,
        data: (await conn.query(`SELECT product_id, name, capacity FROM ${type}`))
      });
    } catch (e) {
      console.log(e);
    }
  }

  conn.end();
  return result;
}

async function planSupply(supplyData) {
  const conn = await pool.getConnection();
  const supplier = supplyData.supplier;
  const date = supplyData.date;
  const products = supplyData.products;

  console.log(supplier, date, products);

  await conn.beginTransaction()
    .then(async () => {
      await conn.query('SELECT supplier_id FROM suppliers WHERE name = ?', [supplier])
        .then(async e => {
          const supplier_id = e[0].supplier_id;
          console.log(supplier_id);
          const newSupply =
            'INSERT INTO supplies(supply_date, supplier_id, done) VALUES (?, ?, ?)';

          let supply_id;

          await conn.query(newSupply, [date, supplier_id, false])
            .then(async (e) => {
              const lastid = e.insertId
              console.log('last insert id: ' + lastid);

              for (let product of products) {
                conn.query('INSERT INTO supplies_info(product_id, supply_id, quantity) VALUES (?, ?, ?)',
                  [product.product_id, lastid, product.quantity]);
              }

              console.log("Inserted");
            });
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

module.exports = {
  addSupplier, addClient, addWine, addBeer, addLiquor, addUser, login,
  getNames, planSupply
};
