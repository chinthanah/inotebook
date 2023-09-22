const mongoose = require("mongoose");

const mongoURI = "mongodb://127.0.0.1:27017";

const connectToMongo = async () => {
  try {
    mongoose.connect(mongoURI);
    console.log("connected to mongoose successfully");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
module.exports = connectToMongo;
