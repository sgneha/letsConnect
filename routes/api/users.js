const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// @route  POST api/users-> this is end point
// @desc   Register user
// @access Public->access value means if you need specific token to access specific route
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please put a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("User route");
  }
);

module.exports = router;
