import poolObj from './dbPool.js';
import { addRows } from "./database.js";
const { pool } = poolObj;

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

async function generateRowsExample() {
    try {
        const result = await addRows(10); // Calls the stored procedure with 10 rows
        console.log("Stored Procedure Output:", result);
    } catch (error) {
        console.error("Error calling addRows:", error);
    }
}

// Call the function
generateRowsExample();

// testConnection();
