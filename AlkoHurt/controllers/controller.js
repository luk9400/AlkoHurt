const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'password',
  database: 'alkohurt',
  connectionLimit: 5
});

async function asyncFunction() {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = await conn.query("SHOW TABLES;");
    console.log(query);
  } catch(err) {
    throw err;
  } finally {
    if (conn) {
      return conn.end();
    }
  }
}

function test(str) {
  console.log(str);
}

async function addSupplier(name, nip, street, postal, city, phone, email) {
  let conn;
  conn = await pool.getConnection();
  const query = 'INSERT INTO suppliers (name, nip, street_and_number, postal_code, city, phone_number, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
  await conn.query(query, [name, nip, street, postal, city, phone, email]);
  conn.end();
  return query;
}

async function addClient(name, nip, street, postal, city, phone, email) {
  let conn;
  conn = await pool.getConnection();
  const query = 'INSERT INTO client (name, nip, street_and_number, postal_code, city, phone_number, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
  await conn.query(query, [name, nip, street, postal, city, phone, email]);
  conn.end();
  return query;
}

async function addWine(name, color, abv, type, capacity, country_of_origin, price) {
  let conn;
  conn = await pool.getConnection();
  const query = 'CALL add_wine(?, ?, ?, ?, ?, ?, ?)';
  await conn.query(query, [name, color, abv, type, capacity, country_of_origin, price]);
  conn.end();
}

module.exports = {test, addSupplier, addClient, addWine};