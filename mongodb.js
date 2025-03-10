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

const getUserRecordCounts = async () => {
    const usersCol = await connDbCollection(usersCollection);

    return sendQuery(
        usersCol.aggregate([
            {
                $lookup: {
                    from: "data",
                    localField: "username",
                    foreignField: "userid",
                    as: "user_data"
                }
            },
            {
                $match: {
                    "user_data.0": { $exists: true } // Inner join: filters users without records
                }
            },
            {
                $project: {
                    username: 1,
                    users_records: { $size: "$user_data" },
                    _id: 0
                }
            }
        ]),
        true
    );
};


//const findOneUser = async (username) => 
// sendQuery(`SELECT * FROM users WHERE username = ?`, true, username);
const findOneUser = async (username) => {
    console.log(username)
    const usersCol = await connDbCollection (usersCollection)
    return sendQuery(usersCol.find( //find -> aggregate()
        {username}).project({
            username: "$username",
            password: "$password",
            _id: 0
        }), true)
}

// const getAllData = async () => 
//     sendQuery(`SELECT * FROM data`);
const getAllData = async () => {
    const dataCol = await connDbCollection (dataCollection)
    return sendQuery(dataCol.find({}).toArray(), true)
}

// const getDataById = async (id) =>
//     sendQuery(`SELECT * FROM data WHERE data.id = ?`, false, id);
const getDataById = async (id) => {
    const dataCol = await connDbCollection (dataCollection)
    return sendQuery(dataCol.findOne({id}), true)
}


//const getAllUsers = async () => 
//     sendQuery(`SELECT * FROM users`);
const getAllUsers = async () => {
    const usersCol = await connDbCollection (usersCollection)
    return sendQuery(usersCol.find({}), true)
}

// const addOneUser = async (username, password) => 
 //   sendQuery( `INSERT INTO users (username, password) VALUES (?, ?)`, false, username, password);

const addOneUser = async (username, password) => {
    const usersCol = await connDbCollection (usersCollection)
    return sendQuery(usersCol.insertOne({ username, password }), true)
}


// const addData = ({id, Firstname, Surname, userid}) =>
//    sendQuery(`INSERT INTO data (id, Firstname, Surname, userid) VALUES (?, ?, ?, ?)`, true, id, Firstname, Surname, userid);
const addData = async (id, Firstname, Surname, userid) => {
    const dataCol = await connDbCollection (dataCollection)
    return sendQuery(dataCol.insertOne({ id, Firstname, Surname, userid }), true)
}



// Connect to database when the application starts
const db = await openDbConn()

const closeDbConnection = async () => {
    try {
        await dbServer.close()
        console.log("Database conenction closed")
    } catch (error) {
        console.error("Failed to close the database connection", error)
    }
}

process.on("SIGINT", closeDbConnection)
process.on("SIGNTERM", closeDbConnection)

export {
    getUserRecordCounts,
    findOneUser,
    getAllData,
    logonUsers
}
