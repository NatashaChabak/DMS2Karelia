import { MongoClient, ObjectId } from 'mongodb'
const dbHost = "localhost:27017"
const dbUser = "jyri"
const dbPassword = "Salasana1"
const dbName = "testi"
const dataCollection = "data"
const usersCollection = "users"
const destConnString = `mongodb://${dbUser}:${dbPassword}@${dbHost}?authSource=${dbName}`
const dbServer = new MongoClient(destConnString)
let logonUsers = new Map();


// Method for connecting to the database
const openDbConn = async () => {
    try {
        await dbServer.connect();
        return dbServer.db(dbName)
    } catch (error) {
        console.error("Failed to conencto to the database", error)
        throw error;
    }
}

// Method for using a certain collection
const connDbCollection = async (collection) => {
    return db.collection(collection)
}

const db = await openDbConn()

const sendQuery = async (query, toArray = false) => {
    try {
        const result = await query
        if(toArray)
            return await result.toArray()
        else 
            console.log("should do something")
    } catch (err) {
        console.error("Query execution failed", err)
        throw err
    }
}

const getAllData = async () => {
  const dataCol = await connDbCollection (dataCollection)
  return sendQuery(dataCol.find({}).toArray(), true)
}

getAllData();
