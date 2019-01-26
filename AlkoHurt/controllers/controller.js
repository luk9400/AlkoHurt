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

async function planSupply(supplier, date, supplyData) {
  const conn = await pool.getConnection();
  console.log(supplier, date, supplyData);
  // try {
  //   await conn.beginTransaction();
  //   // for (let product of supplyData) {
  //   //   console.log(product.product_id);
  //   // }
  //   conn.commit();
  // } catch (e) {
  //   conn.rollback();
  //   console.log(e);
  // }

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

async function login(login, password, session) {
    const conn = await pool.getConnection();
    const query = 'SELECT password FROM users WHERE login = ?';
    const hashPassword = await conn.query(query, [login]);
    conn.end();

    let response = await bcrypt.compare(password, hashPassword[0].password);

    if (response) {
        session.login = login;
    }
    return session;
}

module.exports = {addSupplier, addClient, addWine, addBeer, addLiquor, addUser, login};
