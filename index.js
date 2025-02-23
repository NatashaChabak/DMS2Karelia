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

const listDatabases = async () => {
  const dbServer = new MongoClient(destConnString)

  try {
      await dbServer.connect();
      
      const databases = await dbServer.db().admin().listDatabases();

      console.log("Databases:");
      databases.databases.forEach(db => console.log(`- ${db.name}`));

  } catch (err) {
      console.error("Error listing databases:", err);
  } finally {
      await dbServer.close(); // Close connection
  }
};


listDatabases();

