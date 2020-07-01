const mongoose = require("mongoose"); //bring in momgoose
const config = require("config"); //bring config package
const db = config.get("mongoURI"); // get the value mongoURI in the variable db. Byconfig.get we can get any value from json file

const connectDB = async () => {
  //async arrow function to connect
  try {
    // connection wrap up in try catch block so that if it does not connects then we can show error
    // as this returns a promise so we put await here
    await mongoose.connect(db, {
      useNewUrlParser: true, //warning gone after addng these two
      useUnifiedTopology: true,
      useCreateIndex: true, //warming gone
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    //exit process with failure
    process.exit(1);
  }
};
module.exports = connectDB;
