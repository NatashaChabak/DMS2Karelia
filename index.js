// for MariaDB
import {createPool} from "mariadb"
const sourceHost = "maria.northeurope.cloudapp.azure.com"
const dbMariaUser = "testi"
const dbMariaPassword = "mariadb1"
const dbMaria = "adbms"

// for MongoDB
import {MongoClient, ObjectId} from "mongodb"
const destHost = 'localhost:27017'
const dbAdmin = "mongoAdmin"
const dbAdminPassword = "Salasana1"
const authDb = "admin"
const destConnString = `mongodb://${dbAdmin}:${dbAdminPassword}@${destHost}?authSource=${authDb}`
const dbMongo = "testi"
const dbMongoUser = "jyri"
const dbMongoPassword = "Salasana1"
const dataCollection = "data"
const usersCollection = "user"

const copyDataFromMariaToMongo = async () => {
    const pool = createPool({
        host: sourceHost,
        user: dbMariaUser,
        password: dbMariaPassword,
        database: dbMaria
    })

    let conn
    try {
        conn = await pool.getConnection()
        const users = await conn.query("SELECT * FROM users")
        const data = await conn.query("SELECT * FROM data")

        createCollections(users, data)
    } catch (err) {
        throw err
    } finally {
        if(conn) await conn.close()
        await pool.end()
    }
}

const createCollections = async (usersData, dataData) => {
    const dbServer = new MongoClient(destConnString)

    try {
        await dbServer.connect()
        const db = dbServer.db(dbMongo)

        const dbs = await db.admin().listDatabases()
        if(dbs.databases.find(d => d.name === dbMongo))
            await db.dropDatabase()

        const users = db.collection( usersCollection, {
            validator: {
                $jsonSchema: {
                    bsonType: "Object",
                    required: ["username", "password"],
                    properties: {
                        username: {
                            bsonType: "string",
                            description: "must be a string and it is required"
                        },
                        password: {
                            bsonType: "string",
                            decription: "must be a string and it is required"
                        }
                    }
                }
            }
        })
        users.createIndex({"username": 1}, {unique: true})

        let result = await users.insertMany(usersData)
        console.log(`${result.insertedCount} users were inserted`)


    } catch (e) {
        console.log(e)
    } finally {
        await dbServer.close()
    }

}

copyDataFromMariaToMongo()
