const express = require("express");
const router = express.Router();
// @route  GET api/users-> this is end point
// @desc   Test route
// @access Public->access value means if you need specific token to access specific route
router.get("/", (req, res) => res.send("User route"));

module.exports = router;
