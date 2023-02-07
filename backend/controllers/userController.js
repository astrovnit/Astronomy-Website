const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const { Blog } = require("../models/blogModel");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
let secret = process.env.JWT_KEY;

exports.getUserInfo = (req, res) => {
  let token = req.query.token;
  jwt.verify(token, secret, (err, data) => {
    if (err) {
      res.send({
        isLoggedin: false,
        user: { isAdmin: false },
        message: "INVALID TOKEN",
      });
    } else {
      res.send({
        isLoggedin: true,
        user: data,
      });
    }
  });
};

exports.register = (req, res) => {
  let name = req.query.name;
  let username = req.query.username;
  let password = md5(req.query.password);
  let enrollment = req.query.enrollment.toUpperCase();

  let newUser = new User({
    isAdmin: false,
    name: name,
    username: username,
    password: password,
    enrollment: enrollment,
  });
  User.find(
    {
      username: username,
    },
    function (err, user) {
      if (err) {
        console.log(err);
        res.send({ message: 0 });
      } else {
        if (user.length > 0) {
          res.send({
            message: 4,
          });
        } else {
          newUser.save();
          res.send({
            message: 1,
          });
        }
      }
    }
  );
};

exports.login = (req, res) => {
  let username = req.query.username;
  let password = md5(req.query.password);
  User.find(
    {
      username: username,
      password: password,
    },
    function (err, user) {
      if (err) {
        console.log(err);
        res.send({
          message: 0,
          isLoggedin: false,
          user: { isAdmin: false },
        });
      } else {
        if (user.length > 0) {
          let currentUser = {
            isAdmin: user[0].isAdmin,
            name: user[0].name,
          };
          currentUser = currentUser.toJSON();
          const token = jwt.sign(currentUser, secret, { expiresIn: "5h" });
          res.send({
            message: 1, // Login Success
            isLoggedin: true,
            user: currentUser,
            token: token,
          });
        } else {
          res.send({
            message: 0,
            isLoggedin: false,
            user: { isAdmin: false },
          });
        }
      }
    }
  );
};

exports.resetPassword = (req, res) => {
  let username = req.query.username;
  let enrollment = req.query.enrollment.toUpperCase();
  let newPassword = md5(req.query.password);

  User.updateOne(
    { username: username, enrollment: enrollment },
    { password: newPassword },
    function (err, users) {
      if (err) {
        console.log(err);
        res.send({ message: 3 });
      } else {
        if (users.matchedCount == 1) {
          res.send({ message: 4 });
        } else {
          res.send({ message: 0 });
        }
      }
    }
  );
};

exports.myblogs = (req, res) => {
  let userid = req.query.userid;
  Blog.find({ userId: userid }, function (err, blogs) {
    if (err) {
      console.log(err);
      res.send({ message: 0 });
    } else {
      res.send({ data: blogs });
    }
  });
};
