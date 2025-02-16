import { addRows } from "./database.js";

async function generateRowsExample() {
    try {
        const result = await addRows(10); // Calls the stored procedure with 10 rows
        console.log("Stored Procedure Output:", result);
    } catch (error) {
        console.error("Error calling addRows:", error);
    }
}

generateRowsExample();
