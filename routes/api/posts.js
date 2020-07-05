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

// @route  PUT api/posts/like/:id
// @desc   like a post
// @access Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //included in url
    //check if post has not liked by this user already
    //filter is high order array method
    //likes is an array
    //filter takes a function
    // compare the current iteration with the user who is loggedin
    // 'req.user.id' is in string format
    // only returns spmething when it matches
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    // if not liked already add it. 'unshift' puts in the beginning
    post.likes.unshift({ user: req.user.id });
    // save it back to DB
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  PUT api/posts/unlike/:id
// @desc   unlike a post
// @access Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    // save it back to DB
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/posts/comment/:id
// @desc   Create a comment on a post
// @access Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // don't want password
      const user = await Users.findById(req.user.id).select("-password");

      const post = await Post.findById(req.params.id);

      //create a new comment
      //new comment is just an object,we are not making a collection
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Delete a comment on a post
// @access Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    //get the post by its ID
    const post = await Post.findById(req.params.id);
    //pull out the comment by its id
    // find takes function like foreach,map,filter etc
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    //Make sure comments exits
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    // make sure the user deleting the comment is the one who is making the comment
    if (comment.user.toString() != req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    // Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    // save it back to DB
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
