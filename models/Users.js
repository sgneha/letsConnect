const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  //takes object
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    //putting it here so that when user is created avatar is available right away.Becuase making profile is later stage. gravatar attaches picture with your email
    type: String,
  },
  date: {
    type: Date,
    default: Date.now, //so that puts automatically
  },
});

module.exports = User = mongoose.model("user", UserSchema); //takes two things user(name of the model)and UserSchema (which we created now)
