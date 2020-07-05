const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Users = require("../../models/Users");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

// @route  POST api/posts
// @desc   Create a post
// @access Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // don't want password
      const user = await Users.findById(req.user.id).select("-password");

      //create a new post
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
// @route  GET api/posts
// @desc   Get all posts
// @access Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // most recent first
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  GET api/posts/:id
// @desc   Get post by id
// @access Private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check to see if there is post with that id
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    // check whether the error object 'err' has the property called kind is equal to 'objectid'
    // will send the same response as above if the userID is same format as userid but its not a valid one
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route  DELETE api/posts/:id
// @desc   Delete a post by id
// @access Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check to see if there is post with that id
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // make sure that the user that deletes the post owns the post,check on the user
    if (post.user.toString() != req.user.id) {
      //convert to string
      res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();
    res.json({ msg: "Post Removed" });
  } catch (err) {
    console.error(err.message);
    // check whether the error object 'err' has the property called kind is equal to 'objectid'
    // will send the same response as above if the ID is same format as id but its not a valid one
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});
module.exports = router;
