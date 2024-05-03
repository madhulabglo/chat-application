const mongoose = require("mongoose");
require("dotenv").config();


console.log(process?.env?.DB_USERNAME,"use name")

const DB = `mongodb+srv://madhumathilabglo:vCJGwQnVUdmPCkcn@cluster0.htqnfes.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const connectToDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true    });
    console.log("DB connected Successfully");
  } catch (error) {
    console.error(`DB connection error: ${error}`);
  }
};

module.exports = connectToDB;
