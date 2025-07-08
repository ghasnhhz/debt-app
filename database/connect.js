const { MongoClient } = require("mongodb")
const mongoURI = process.env.MONGO_URI

const client = new MongoClient(mongoURI)

let db;

async function connectDB() {
  if (!db) {
    await client.connect()
    console.log("Connected to database")
    db = client.db("localStore")
  }
  return db
}

module.exports = connectDB