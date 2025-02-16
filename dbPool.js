import { createPool } from "mariadb"

const pool = createPool({
    host: "localhost",
    user: "Natasha",
    port: 3306,
    password: "4512",
    database: "test2207363db",
})

export default Object.freeze({
    pool: pool
})
