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

module.exports = {test, addSupplier};