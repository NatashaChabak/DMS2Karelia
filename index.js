import { createPool } from "mariadb";

const sourceHost = "https://nataliau2207363.westeurope.cloudapp.azure.com";
const dbMariaUser = "jk";
const dbMariaPassword = "sala";
const dbMaria = "test2207363db";


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
