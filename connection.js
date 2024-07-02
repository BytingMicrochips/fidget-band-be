const { MongoClient } = require("mongodb");
const { password } = require("./db_password");
// const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "test";

require("dotenv").config({ path: `${__dirname}/.env.${ENV}` });

let uri = `mongodb+srv://emm-admin:${password}@cluster0.kv6vcn1.mongodb.net`;

const client = new MongoClient(uri);

const dbConnection = (req, res) => {
  return client.connect().then(() => {
    return client.db();
  });
};

// dbConnection();
// const pool = new Pool();

module.exports = {
  ENV,
  // pool,
  client
};
