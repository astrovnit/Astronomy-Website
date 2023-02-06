const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.JWT_KEY;

function authenticateLogin(req, res, next) {
  let token = req.query.token;
  if (token == "undefined") {
    res.send({
      message: "ACCESS DENIED LOGIN FIRST",
    });
  } else {
    try {
      let decoded = jwt.verify(token, secret);
      next();
    } catch {
      res.send({ message: "INVALID TOKEN" });
    }
  }
}

module.exports = { authenticateLogin };
