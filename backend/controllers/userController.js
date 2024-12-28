const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel")

const generateToken = (id) =>{
    return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: "30d" });
}

exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { username, email, password } = req.body;
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const user = await User.create({ username, email, password });
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user.id),
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user && user.password === password) {
        res.json({
          _id: user.id,
          username: user.username,
          email: user.email,
          token: generateToken(user.id),
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };