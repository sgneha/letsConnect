const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String, // name of the user,if user deletes the account then to it shows how has posted
  },
  avatar: {
    type: String, // if user deletes the account then to it shows how has posted
  },
  likes: [
    //array of likes
    {
      user: {
        // we know which likes came from which user. A singlr user can like only once
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  comments: [
    {
      user: {
        // we know which comment came from which user
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String, // name of the user,if user deletes the account then to it shows how has commented
      },
      avatar: {
        type: String, // if user deletes the account then to it shows how has commented
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Post = mongoose.model("Post", PostSchema);
