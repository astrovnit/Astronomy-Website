const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.JWT_KEY;

function authenticateLogin(req, res, next) {
  let token = req.query.token;
  jwt.verify(token, secret, (err, data) => {
    if (err) {
      res.send({ message: "LOGIN FIRST" });
    } else {
      next();
    }
  });
}

module.exports = { authenticateLogin };
