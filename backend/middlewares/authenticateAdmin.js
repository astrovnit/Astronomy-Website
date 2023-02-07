const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.JWT_KEY;

function authenticateAdmin(req, res, next) {
  let token = req.query.token;
  jwt.verify(token, secret, (err, data) => {
    if (err) {
      res.send({ message: "LOGIN FIRST" });
    } else {
      if (data.isAdmin == true) {
        next();
      } else {
        res.send({ message: "ACCESS DENIED. ADMIN ONLY" });
      }
    }
  });
}

module.exports = { authenticateAdmin };
