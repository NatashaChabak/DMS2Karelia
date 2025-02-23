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

// Function to test INNER JOIN query
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

// Run the function
getUserRecordCounts()
    .then(() => process.exit(0)) // Exit after execution
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
