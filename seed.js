const { MongoClient } = require("mongodb");
const { password } = require("./db_password");
const uri = `mongodb+srv://emm-admin:${password}@cluster0.kv6vcn1.mongodb.net`;

const client = new MongoClient(uri);

const dbConnection = (req, res) => {
  return client.connect();
};

const closeConnection = (req, res) => {
  return client.close();
};

const testSeed = (data) => {
  const db = client.db("master-folder-test");
  return dbConnection()
    .then(() => {
      return db.collection("gigs-data").deleteMany({});
    })
    .then(() => {
      return db.collection("gigs-data").insertMany(data.gigsData);
    })
    .then(() => {
      return db.collection("videos-data").deleteMany({});
    })
    .then(() => {
      return db.collection("videos-data").insertMany(data.videosData);
    });
};

module.exports = { client, dbConnection, closeConnection, testSeed };