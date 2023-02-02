function authenticate(req, res, next) {
  // console.log("req on server");
  let user = req.session.user;
  if (user == undefined) {
    let method = req.method;
    let route = req._parsedUrl.pathname;
    if (method == "GET") {
      if (route == "/logout" || route == "/pending") {
        res.end("LOGIN FIRST");
        return;
      }
    } else if (method == "POST") {
      if (route == "/postexp" || route == "/approve" || route == "/reject") {
        res.end("LOGIN FIRST");
        return;
      }
    }
    next();
  } else {
    let method = req.method;
    let route = req._parsedUrl.pathname;

    if (method == "GET") {
      if (route == "/pending") {
        if (!req.session.user.isAdmin) {
          res.end("Access Denied");
          return;
        }
      }
    } else if (method == "POST") {
      if (route == "/approve" || route == "/reject") {
        if (!req.session.user.isAdmin) {
          res.end("Access Denied");
          return;
        }
      }
    }
    next();
  }
}

module.exports = authenticate;
