const { User, Blog } = require("./database/db");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const md5 = require("md5");
const nodemailer = require("nodemailer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
dotenv.config();
let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: "astronomyclub@vnit.ac.in",
    pass: process.env.EMAILPASS,
  },
});
const PORT = process.env.PORT || 5000;
const secret = process.env.JWT_KEY;
app.use(
  cors({
    origin: "*",
  })
);
app.use(cookieParser());

app.post("/login", (req, res) => {
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
        });
      } else {
        if (user.length > 0) {
          let currentUser = user[0].toJSON();
          const token = jwt.sign(currentUser, secret);
          res.cookie("authToken", token, { maxAge: 86400000, httpOnly: true });
          res.send({
            message: 1, // Login Success
            isLoggedin: true,
            user: currentUser,
          });
        } else {
          res.send({
            message: 0,
          });
        }
      }
    }
  );
});

app.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.send({
    message: 1,
    isLoggedin: false,
    user: { isAdmin: false },
  });
});

app.get("/getUserInfo", (req, res) => {
  let token = req.cookies["authToken"];
  if (token == undefined) {
    res.send({
      isLoggedin: false,
      user: { isAdmin: false },
    });
  } else {
    try {
      let decoded = jwt.verify(token, secret);
      res.send({
        isLoggedin: true,
        user: decoded,
      });
    } catch {
      res.send({
        isLoggedin: false,
        user: { isAdmin: false },
        message: "INVALID TOKEN",
      });
    }
  }
});

app.post("/postexp", (req, res) => {
  data = req.query;
  let date = new Date();
  let month = date.getMonth() + 1;
  switch (month) {
    case 1:
      month = "January";
      break;
    case 2:
      month = "February";
      break;
    case 3:
      month = "March";
      break;
    case 4:
      month = "April";
      break;
    case 5:
      month = "May";
      break;
    case 6:
      month = "June";
      break;
    case 7:
      month = "July";
      break;
    case 8:
      month = "August";
      break;
    case 9:
      month = "September";
      break;
    case 10:
      month = "October";
      break;
    case 11:
      month = "November";
      break;
    case 12:
      month = "December";
      break;
  }
  let dateNow =
    date.getDate().toString() +
    " " +
    month +
    " " +
    date.getFullYear().toString();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let timeNow = hours + ":" + minutes + " " + ampm;
  let newBlog = new Blog({
    isApproved: false,
    name: data.name,
    title: data.title,
    blog: data.blog,
    date: dateNow,
    time: timeNow,
  });
  newBlog
    .save()
    .then(() => {
      res.send({
        message: 1,
      });
    })
    .catch((err) => {
      if (err) {
        res.send({
          message: 2,
        });
      }
    });
});
app.get("/blogs", (req, res) => {
  Blog.find({ isApproved: true }, function (err, exp) {
    if (err) {
      console.log(err);
      res.send({ message: 0 });
    } else {
      res.send({ message: 1, data: exp });
    }
  });
});
app.post("/contact", (req, res) => {
  console.log(req.query);
  let mailOptions = {
    from: req.query.email,
    to: "astronomyclub@vnit.ac.in",
    subject: "From Astronomy Website",
    text: req.query.name + " " + req.query.email + " " + req.query.text,
  };

  transport.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
      res.send({ message: 0 });
    } else {
      console.log("Email sent successfully");
      res.send({ message: 1 });
    }
  });
});
app.get("/pending", (req, res) => {
  Blog.find(
    {
      isApproved: false,
    },
    function (err, data) {
      if (err) {
        console.log(err);
        res.send({ message: 0 });
      } else {
        res.send({ message: 1, data: data });
      }
    }
  );
});
app.post("/approve", (req, res) => {
  Blog.updateOne(
    {
      _id: req.query.id,
    },
    {
      isApproved: true,
    },
    function (err) {
      Blog.find(
        {
          isApproved: false,
        },
        function (err, data) {
          if (err) {
            console.log(err);
            res.send({ message: 0 });
          } else {
            res.send({ message: 1, data: data });
          }
        }
      );
    }
  );
});
app.post("/reject", (req, res) => {
  Blog.deleteOne(
    {
      _id: req.query.id,
    },
    function (err) {
      Blog.find(
        {
          isApproved: false,
        },
        function (err, data) {
          if (err) {
            console.log(err);
            res.send({ message: 0 });
          } else {
            res.send({ message: 2, data: data });
          }
        }
      );
    }
  );
});

app.get("/getData", (req, res) => {
  let id = req.query.id;
  Blog.find(
    {
      _id: id,
    },
    function (err, exp) {
      if (err) {
        console.log(err);
        res.send({ message: 0 });
      } else {
        res.send(exp);
      }
    }
  );
});

app.listen(PORT, (req, res) => {
  console.log(`Server initialised on PORT ${PORT}`);
});
