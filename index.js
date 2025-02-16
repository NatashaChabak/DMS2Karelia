import { createPool } from "mariadb";

const sourceHost = "maria.northeurope.cloudapp.azure.com";
const dbMariaUser = "testi";
const dbMariaPassword = "mariadb1";
const dbMaria = "adbms";


const pool = createPool({
  host: sourceHost,
  user: dbMariaUser,
  password: dbMariaPassword,
  database: dbMaria
});

async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("Connected to MariaDB!");
  } catch (err) {
    console.error("Error connecting to MariaDB:", err);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

testConnection();
