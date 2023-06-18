require("dotenv").config(); // load .env variables
const { Router } = require("express"); // import router from express
const User = require("../models/User"); // import user model
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens

const router = Router(); // create router to create route bundle

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS
const {SECRET} = process.env;

// Signup route to create a new user
router.post("/signup", async (req, res) => {
  try {
    if(typeof req.body.username === "undefined" || typeof req.body.password === "undefined" || typeof req.body.email === "undefined")
      return res.status(404).json({error: "Please enter all inputs!"});
    // hash the password
    req.body.password = await bcrypt.hash(req.body.password, 10);
    // create a new user
    const user = await User.create(req.body);
    // send new user as response
    res.json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Login route to verify a user and get a token
router.post("/login", async (req, res) => {
  try {
    if(typeof req.body.username === "undefined" || typeof req.body.password === "undefined")
      return res.status(404).json({error: "Please enter all inputs!"});

    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        // sign token and send it in response
        const token = await jwt.sign({ username: user.username }, SECRET);
        return res.json({ token: token, user: user });
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "Invalid username or password!" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router