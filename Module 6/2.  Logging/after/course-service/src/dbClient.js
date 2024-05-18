const mongoose = require("mongoose");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const logger = require('./logger');

const uri = process.env.DB_ConnetionString;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Set the timeout for selecting a server
  socketTimeoutMS: 45000,
  autoIndex: true,
};

async function connect() {
  try {
    await mongoose.connect(uri, options);
  } catch (err) {
    logger.error(err);
  }
}

async function disconnect() {
  try {
    await mongoose.disconnect();
  } catch (err) {
    logger.error(err);
  }
}

module.exports = { connect, disconnect };
