const express = require("express");
const router = express.Router();

// @route  POST api/users-> this is end point
// @desc   Register user
// @access Public->access value means if you need specific token to access specific route
router.post("/", (req, res) => {
  console.log(req.body);
  res.send("User route");
});

module.exports = router;
