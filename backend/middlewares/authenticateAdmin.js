const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.JWT_KEY;

function authenticateAdmin(req, res, next) {
  let token = req.cookies["authToken"];
  if (token == undefined) {
    res.send({
      message: "UNAUTHORIZED REQUEST",
    });
  } else {
    try {
      let decoded = jwt.verify(token, secret);
      if (decoded.isAdmin == true) {
        next();
      } else {
        res.send({ message: "REQUEST UNAUTHORIZED. REDIRECTING" });
      }
    } catch {
      res.send({ message: "INVALID ADMIN TOKEN" });
    }
  }
}

module.exports = { authenticateAdmin };
