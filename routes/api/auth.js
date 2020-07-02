const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/Users");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");
const bcrypt = require("bcryptjs");

// @route  GET api/auth
// @desc   Test route
// @access Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/auth-> this is end point
// @desc   Authenticate  user & get token
// @access Public->access value means if you need specific token to access specific route
router.post(
  "/",
  [
    // name is not required to login
    check("email", "Please put a valid email").isEmail(),
    check("password", "Please is required").exists(), //just want toc check if it exists
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // extract so that don't have to do req.body. ... again and again
    const { email, password } = req.body;
    try {
      // See if the user exits then send error
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }
      //no need of avatar
      // match the password from plain text typed by user and encrypted password
      const isMatch = await bcrypt.compare(password, user.password); //compare returns a promise so await

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      //return the jsonwebtoken(this is because when in the front end user logs in ,if he has webtoken and it gets logged in right away)
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); //sending back the token
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);

module.exports = router;
