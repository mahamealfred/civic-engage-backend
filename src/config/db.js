const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectionString = process.env.MONGO_URI;
const dbConnect = async (next) => {
  const connect = await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`mongodb connected on: ${connect.connection.host}`);
};
module.exports = dbConnect;