const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const { Blog } = require("../models/blogModel");

exports.getBlogs = (req, res) => {
  Blog.find({ isApproved: true }, function (err, exp) {
    if (err) {
      console.log(err);
      res.send({ message: 0 });
    } else {
      res.send({ message: 1, data: exp });
    }
  });
};

exports.getData = (req, res) => {
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
};

exports.getBlogData = (req, res) => {
  let id = req.query.id;
  Blog.find({ _id: id }, function (err, blog) {
    if (err) {
      console.log(err);
      res.send({ data: [] });
    } else {
      res.send({ data: blog });
    }
  });
};

exports.updateBlog = (req, res) => {
  Blog.updateOne(
    {
      _id: req.query.blogid,
      isApproved: false,
    },
    {
      name: req.query.name,
      title: req.query.title,
      blog: req.query.blog,
    },
    function (err, data) {
      if (err) {
        console.log(err);
        res.send({ message: 2 });
      } else {
        if (data.matchedCount == 1) {
          res.send({ message: 1 });
        } else {
          res.send({ message: 2 });
        }
      }
    }
  );
};

exports.pending = (req, res) => {
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
};

exports.postblog = (req, res) => {
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
    userId: data.userId,
    message: undefined,
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
};

exports.approve = (req, res) => {
  Blog.updateOne(
    {
      _id: req.query.id,
    },
    {
      isApproved: true,
      message: req.query.message,
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
};

exports.reject = (req, res) => {
  Blog.updateOne(
    {
      _id: req.query.id,
    },
    {
        message:req.query.message
    },
    function (err,data) {
        if(err){
            console.log(err);
            res.send({message:0});
        }
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
};

exports.delete=(req,res)=>{
    Blog.deleteOne(
        {
          _id: req.query.id,
        },
        function (err,data) {
            if(err){
                console.log(err);
                res.send({message:0});
            }
          Blog.find(
            {
              isApproved: false,
            },
            function (err, data) {
              if (err) {
                console.log(err);
                res.send({ message: 0 });
              } else {
                res.send({ message: 3, data: data });
              }
            }
          );
        }
      );
}
