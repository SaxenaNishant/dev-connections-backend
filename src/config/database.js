const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect("mongodb+srv://nishant12:admin123@cluster0.701if.mongodb.net/devtinder");//process.env.MONGO_URI
};
module.exports = connectDb;
