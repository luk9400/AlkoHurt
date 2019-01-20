const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'localhost',
  port: '3307',
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

asyncFunction();
