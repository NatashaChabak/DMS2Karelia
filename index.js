import { createPool } from "mariadb";

const pool = createPool({
  host: "maria.northeurope.cloudapp.azure.com",  // Change to your MariaDB host
  user: "testi", // Your DB username
  password: "mariadb1", // Your DB password
  database: "adbms", // Your database name
  connectionLimit: 5, // Number of connections
});

async function callStoredProcedure() {
  let conn;
  try {
    conn = await pool.getConnection();

    // Calling the stored procedure
    const rows = await conn.query("CALL GenerateRows(10)");

    console.log("Stored Procedure Result:", rows);
  } catch (err) {
    console.error("Error calling stored procedure:", err);
  } finally {
    if (conn) conn.release(); // Release the connection
  }
}

callStoredProcedure();
