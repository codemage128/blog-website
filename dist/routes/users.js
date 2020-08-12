"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _users = _interopRequireDefault(require("../models/users"));

var _subscription = _interopRequireDefault(require("../models/subscription"));

var _stripesession = _interopRequireDefault(require("../models/stripesession"));

var _category2 = _interopRequireDefault(require("../models/category"));

var _crypto = _interopRequireDefault(require("crypto"));

var _formidable = _interopRequireDefault(require("formidable"));

var _mail2 = _interopRequireDefault(require("../helpers/_mail"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _passport = _interopRequireDefault(require("../helpers/passport"));

var _fs = _interopRequireWildcard(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _awsSdk = _interopRequireWildcard(require("aws-sdk"));

var _cloudinary = require("cloudinary");

var _articles = _interopRequireDefault(require("../models/articles"));

var _counting = _interopRequireDefault(require("../models/counting"));

var _average = _interopRequireDefault(require("../models/average"));

var _install = _interopRequireDefault(require("../helpers/install"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _newsletter = _interopRequireDefault(require("../models/newsletter"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var router = _express["default"].Router();

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

_dotenv["default"].config({
  path: "./.env"
}); // Prevent logged in users from viewing the sign up and login page


function checkIfLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return res.redirect("back");else {
    next();
  }
} // Facebook Login auth


router.get("/auth/facebook", _install["default"].redirectToLogin, _passport["default"].authenticate("facebook", {
  scope: ["email"]
}));
router.get("/auth/facebook/callback", _passport["default"].authenticate("facebook", {
  failureRedirect: "/login",
  successRedirect: "/"
})); // Google login auth

router.get("/auth/google", _install["default"].redirectToLogin, _passport["default"].authenticate("google", {
  scope: ["profile", "email"],
  state: "signup"
}));
router.get("/auth/google/login", _install["default"].redirectToLogin, // passport.authenticate("google", { scope: ["profile", "email"], state: "login" })
_passport["default"].authenticate("google", {
  scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "openid"],
  state: "login"
}));
router.get("/auth/google/callback", _passport["default"].authenticate("google", {
  failureRedirect: "/sign-up"
}), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var signupProcess, state;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            signupProcess = req.user.signupProcess;
            state = req.query.state;

            if (!(state == 'login')) {
              _context.next = 13;
              break;
            }

            if (!(req.authInfo == 'exist')) {
              _context.next = 7;
              break;
            }

            res.redirect(signupProcess);
            _context.next = 11;
            break;

          case 7:
            if (!(req.authInfo == "create")) {
              _context.next = 11;
              break;
            }

            _context.next = 10;
            return _users["default"].deleteOne({
              _id: req.user._id
            });

          case 10:
            res.redirect('/sign-up');

          case 11:
            _context.next = 14;
            break;

          case 13:
            if (state == 'signup') {
              if (req.authInfo == 'exist') {
                res.redirect(signupProcess);
              } else if (req.authInfo == "create") {
                res.redirect('/enterinformation');
              }
            }

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/enterinformation', _install["default"].redirectToLogin, function (req, res, next) {
  res.render('enter-information');
});
router.post('/information-from', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var fromgoogle, fromfacebook, fromlinkedin, frominstagram, fromother;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            fromgoogle = req.body.fromgoogle;
            fromfacebook = req.body.fromfacebook;
            fromlinkedin = req.body.fromlinkedin;
            frominstagram = req.body.frominstagram;
            fromother = req.body.fromother;

            if (fromgoogle == "on" || fromfacebook == "on" || fromlinkedin == "on" || frominstagram == "on" || fromother == "on") {
              _context2.next = 8;
              break;
            }

            req.flash("error_msg", "Bitte wähle einen Punkt aus");
            return _context2.abrupt("return", res.redirect('back'));

          case 8:
            _context2.next = 10;
            return _users["default"].updateOne({
              _id: req.user.id
            }, req.body).then(function (user) {
              return res.redirect("/onboarding");
            })["catch"](function (err) {
              return next(err);
            });

          case 10:
            _context2.next = 12;
            return _users["default"].updateOne({
              _id: req.user.id
            }, {
              $set: {
                signupProcess: "/onboarding"
              }
            }).then(function (user) {
              return res.redirect("/onboarding");
            })["catch"](function (err) {
              return next(err);
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/show-category-all', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var categories;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _category2["default"].find({}).limit(20);

          case 3:
            categories = _context3.sent;
            res.render('showcategory', {
              categories: categories
            });
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function (_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());
router.post('/category/show-more', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var showCnt, categories;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            showCnt = req.body.categoryCount;
            _context4.next = 4;
            return _category2["default"].find({}).limit(20).skip(parseInt(showCnt));

          case 4:
            categories = _context4.sent;
            res.json(categories);
            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 8]]);
  }));

  return function (_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}());
router.get('/downgrade', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _users["default"].updateOne({
              _id: req.query.user
            }, {
              paid: "free",
              signupProcess: "/afterlogin"
            });

          case 2:
            // res.redirect('back');
            res.redirect('/onboarding');

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}());
router.get('/onboarding', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var redirect, categoryCount, stripeSession_id, session, stripesession, user, payload, categories, _user, _payload;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            redirect = req.query.redirect ? true : false;
            _context6.prev = 1;
            categoryCount = 2;
            stripeSession_id = req.query.session_id;

            if (!stripeSession_id) {
              _context6.next = 22;
              break;
            }

            _context6.next = 7;
            return stripe.checkout.sessions.retrieve(stripeSession_id);

          case 7:
            session = _context6.sent;
            _context6.next = 10;
            return _stripesession["default"].create(session);

          case 10:
            stripesession = _context6.sent;
            console.log(stripesession._id);
            categoryCount = 10;
            _context6.next = 15;
            return _users["default"].findOne({
              _id: req.user.id
            });

          case 15:
            user = _context6.sent;
            _context6.next = 18;
            return _users["default"].updateOne({
              _id: req.user.id
            }, {
              $set: {
                paid: "paid"
              }
            });

          case 18:
            if (!user.emailsend) {
              _context6.next = 22;
              break;
            }

            payload = {
              email: user.email.trim(),
              username: user.username.trim().toLowerCase(),
              firstName: user.firstName,
              lastName: user.lastName,
              siteLink: res.locals.siteLink
            };
            _context6.next = 22;
            return (0, _mail2["default"])("Nun bist du Premium-Member!", user.email, "paid-email", payload, req.headers.host, function (err, info) {
              if (err) console.log(err);
            });

          case 22:
            if (req.user.paid == "paid") {
              categoryCount = 10;
            }

            _context6.next = 25;
            return _category2["default"].find({}).limit(20);

          case 25:
            categories = _context6.sent;
            console.log(redirect);

            if (!(!redirect && !stripeSession_id)) {
              _context6.next = 36;
              break;
            }

            _context6.next = 30;
            return _users["default"].findOne({
              _id: req.user.id
            });

          case 30:
            _user = _context6.sent;
            console.log(_user.emailsend);

            if (!_user.emailsend) {
              _context6.next = 36;
              break;
            }

            _payload = {
              email: _user.email.trim(),
              username: _user.username.trim().toLowerCase(),
              firstName: _user.firstName,
              lastName: _user.lastName,
              siteLink: res.locals.siteLink
            };
            _context6.next = 36;
            return (0, _mail2["default"])("Herzlichen Glückwunsch", _user.email, "onboarding-email", _payload, req.headers.host, function (err, info) {
              if (err) console.log(err);
            });

          case 36:
            res.render('onboarding', {
              categoryCount: categoryCount,
              categories: categories,
              redirect: redirect
            });
            _context6.next = 42;
            break;

          case 39:
            _context6.prev = 39;
            _context6.t0 = _context6["catch"](1);
            next(_context6.t0);

          case 42:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[1, 39]]);
  }));

  return function (_x15, _x16, _x17) {
    return _ref6.apply(this, arguments);
  };
}());
router.post('/onboarding', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var categoryCount, categories;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return _users["default"].updateOne({
              _id: req.user._id
            }, {
              $set: {
                signupProcess: "/onboarding"
              }
            });

          case 3:
            categoryCount = req.body.categoryCount;

            if (!(categoryCount == 10)) {
              _context7.next = 7;
              break;
            }

            _context7.next = 7;
            return _users["default"].updateOne({
              _id: req.user._id
            }, {
              $set: {
                paid: "paid"
              }
            });

          case 7:
            _context7.next = 9;
            return _category2["default"].find({}).limit(20);

          case 9:
            categories = _context7.sent;
            res.render('onboarding', {
              categoryCount: categoryCount,
              categories: categories,
              redirect: false
            });
            _context7.next = 16;
            break;

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7["catch"](0);
            next(_context7.t0);

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 13]]);
  }));

  return function (_x18, _x19, _x20) {
    return _ref7.apply(this, arguments);
  };
}());
router.post('/choose-category', _install["default"].redirectToLogin, _auth["default"], (0, _role["default"])("user"), /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var categoryCount, listString, categoryList, paid;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            categoryCount = req.body.categoryCount;
            listString = req.body.categoryList;
            categoryList = listString.split(",");
            paid = "free";

            if (categoryCount == 10) {
              paid = 'paid';
            }

            _context8.next = 7;
            return _users["default"].updateOne({
              _id: req.user._id
            }, {
              $set: {
                paid: paid,
                categoryList: categoryList,
                signupProcess: "/afterlogin"
              }
            });

          case 7:
            if (!(req.body.redirect == "true")) {
              _context8.next = 11;
              break;
            }

            return _context8.abrupt("return", res.redirect('/user/profile'));

          case 11:
            if (!(categoryCount == 10)) {
              _context8.next = 15;
              break;
            }

            return _context8.abrupt("return", res.redirect('/blogrecent'));

          case 15:
            return _context8.abrupt("return", res.redirect('/afterlogin'));

          case 16:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x21, _x22, _x23) {
    return _ref8.apply(this, arguments);
  };
}()); // Twitter login auth

router.get("/auth/twitter", _install["default"].redirectToLogin, _passport["default"].authenticate("twitter"));
router.get("/auth/twitter/callback", _passport["default"].authenticate("twitter", {
  failureRedirect: "/login",
  successRedirect: "/"
})); // Vkontakte login auth

router.get("/auth/vkontakte", _install["default"].redirectToLogin, _passport["default"].authenticate("vkontakte", {
  scope: ["email"]
}));
router.get("/auth/vkontakte/callback", _passport["default"].authenticate("vkontakte", {
  failureRedirect: "/login",
  successRedirect: "/"
})); // Get sign up page

router.get("/sign-up", _install["default"].redirectToLogin, checkIfLoggedIn, function (req, res, next) {
  res.render("sign-up");
});
router.post("/api/sign-up", /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var message, set, username, array, usernameslug, token, payload, check, user;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            message = "";
            _context9.next = 3;
            return _settings["default"].findOne();

          case 3:
            set = _context9.sent;

            if (!(set.registrationSystem == true)) {
              _context9.next = 47;
              break;
            }

            username = req.body.username.trim().toLowerCase();
            array = username.split('');
            array.forEach(function (element, index) {
              if (element == "ß") {
                array[index] = "ss";
              }

              if (element == "ö") {
                array[index] = "oe";
              }

              if (element == "ä") {
                array[index] = "ae";
              }

              if (element == "ü") {
                array[index] = "ue";
              }
            });
            usernameslug = array.join("");
            token = _crypto["default"].randomBytes(16).toString("hex");
            payload = {};

            if (token) {
              payload = {
                email: req.body.email.trim(),
                password: req.body.password.trim(),
                token: token,
                username: req.body.username.trim().toLowerCase(),
                usernameslug: usernameslug,
                profilePicture: "https://gravatar.com/avatar/" + _crypto["default"].createHash("md5").update(req.body.email).digest("hex").toString() + "?s=200" + "&d=retro",
                active: typeof set.emailVerification == "undefined" ? true : set.emailVerification == true ? false : true,
                roleId: "user",
                firstName: "Not Specified",
                lastName: "Not Specified",
                siteLink: res.locals.siteLink,
                logo: res.locals.siteLogo,
                instagram: res.locals.instagram,
                facebook: res.locals.facebook,
                emailsend: true,
                twitter: res.locals.twitter,
                signupProcess: "/enterinformation"
              };
            }

            if (!(req.body.password !== req.body.cPassword)) {
              _context9.next = 17;
              break;
            }

            message = {
              "Error": "Password Doesn't match"
            };
            return _context9.abrupt("return", res.json(message));

          case 17:
            _context9.next = 19;
            return _users["default"].findOne({
              email: req.body.email
            });

          case 19:
            check = _context9.sent;

            if (!check) {
              _context9.next = 25;
              break;
            }

            message = {
              "Error": "Email has been used"
            };
            return _context9.abrupt("return", res.json(message));

          case 25:
            _context9.next = 27;
            return _users["default"].create(payload);

          case 27:
            user = _context9.sent;

            if (!(set.emailVerification == true)) {
              _context9.next = 33;
              break;
            }

            _context9.next = 31;
            return (0, _mail2["default"])("Verifizierung deiner E-Mail", req.body.email, "reg-email", payload, req.headers.host, function (err, info) {
              if (err) console.log(err);
            });

          case 31:
            _context9.next = 34;
            break;

          case 33:
            null;

          case 34:
            if (!(set.emailVerification == true)) {
              _context9.next = 39;
              break;
            }

            message = {
              "Error": "Registration Successfull, pls check your email for futher instrcutions"
            };
            return _context9.abrupt("return", res.json(message));

          case 39:
            if (!(set.autoLogin == true)) {
              _context9.next = 43;
              break;
            }

            req.logIn(user, function (err) {
              if (err) return next(err);

              if (user.roleId === "user") {//return res.redirect(`/user/dashboard`);
              } else if (user.roleId === "admin") {//return res.redirect(`/dashboard/index`);
              }
            });
            _context9.next = 45;
            break;

          case 43:
            message = {
              "Success": "Registration Successfull"
            };
            return _context9.abrupt("return", res.json(message));

          case 45:
            _context9.next = 49;
            break;

          case 47:
            message = {
              "ERROR": "not registersystem"
            };
            return _context9.abrupt("return", res.json(message));

          case 49:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x24, _x25, _x26) {
    return _ref9.apply(this, arguments);
  };
}()); // Create a new user

router.post("/sign-up", _install["default"].redirectToLogin, checkIfLoggedIn, /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var set, username, array, usernameslug, payload, check, user;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            if (req.body['g-recaptcha-response']) {
              _context10.next = 5;
              break;
            }

            req.flash("success_msg", "Captcha is required!");
            return _context10.abrupt("return", res.redirect("back"));

          case 5:
            _context10.prev = 5;
            _context10.next = 8;
            return _settings["default"].findOne();

          case 8:
            set = _context10.sent;

            if (!(set.registrationSystem == true)) {
              _context10.next = 50;
              break;
            }

            username = req.body.username.trim().toLowerCase();
            array = username.split('');
            array.forEach(function (element, index) {
              if (element == "ß") {
                array[index] = "ss";
              }

              if (element == "ö") {
                array[index] = "oe";
              }

              if (element == "ä") {
                array[index] = "ae";
              }

              if (element == "ü") {
                array[index] = "ue";
              }
            });
            usernameslug = array.join("");
            payload = {
              email: req.body.email.trim(),
              password: req.body.password.trim(),
              token: _crypto["default"].randomBytes(16).toString("hex"),
              username: req.body.username.trim().toLowerCase(),
              usernameslug: usernameslug,
              profilePicture: "https://gravatar.com/avatar/" + _crypto["default"].createHash("md5").update(req.body.email).digest("hex").toString() + "?s=200" + "&d=retro",
              active: typeof set.emailVerification == "undefined" ? true : set.emailVerification == true ? false : true,
              roleId: "user",
              firstName: "Not Specified",
              lastName: "Not Specified",
              siteLink: res.locals.siteLink,
              logo: res.locals.siteLogo,
              instagram: res.locals.instagram,
              facebook: res.locals.facebook,
              twitter: res.locals.twitter,
              emailsend: true,
              signupProcess: "/enterinformation"
            };

            if (!(req.body.password !== req.body.cPassword)) {
              _context10.next = 20;
              break;
            }

            req.flash("success_msg", "Password Does/'nt match");
            return _context10.abrupt("return", res.redirect("back"));

          case 20:
            _context10.next = 22;
            return _users["default"].findOne({
              email: req.body.email
            });

          case 22:
            check = _context10.sent;

            if (!check) {
              _context10.next = 28;
              break;
            }

            req.flash("success_msg", "Email has been used");
            return _context10.abrupt("return", res.redirect("back"));

          case 28:
            _context10.next = 30;
            return _users["default"].create(payload);

          case 30:
            user = _context10.sent;

            if (!(set.emailVerification == true)) {
              _context10.next = 36;
              break;
            }

            _context10.next = 34;
            return (0, _mail2["default"])("Verifizierung deiner E-Mail", req.body.email, "reg-email", payload, req.headers.host, function (err, info) {
              if (err) console.log(err);
            });

          case 34:
            _context10.next = 37;
            break;

          case 36:
            null;

          case 37:
            if (!(set.emailVerification == true)) {
              _context10.next = 42;
              break;
            }

            req.flash("success_msg", "Registration Successfull, pls check your email for futher instrcutions");
            return _context10.abrupt("return", res.redirect("back"));

          case 42:
            if (!(set.autoLogin == true)) {
              _context10.next = 46;
              break;
            }

            req.logIn(user, function (err) {
              if (err) return next(err);

              if (user.roleId === "user") {
                return res.redirect("/user/dashboard");
              } else if (user.roleId === "admin") {
                return res.redirect("/dashboard/index");
              }
            });
            _context10.next = 48;
            break;

          case 46:
            req.flash("success_msg", "Registration Successfull");
            return _context10.abrupt("return", res.redirect("/login"));

          case 48:
            _context10.next = 51;
            break;

          case 50:
            res.render("404");

          case 51:
            _context10.next = 56;
            break;

          case 53:
            _context10.prev = 53;
            _context10.t0 = _context10["catch"](5);
            next(_context10.t0);

          case 56:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[5, 53]]);
  }));

  return function (_x27, _x28, _x29) {
    return _ref10.apply(this, arguments);
  };
}()); // Create a new user manually

router.post("/user/create", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var check, username, payload;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            req.body.roleId = !req.body.roleId ? "user" : req.body.roleId;
            req.body.email = req.body.email.trim();
            req.body.password = req.body.password.trim();
            req.body.username = req.body.username.trim();
            req.body.active = true;
            req.body.firstName = req.body.firstName == "" ? "Not Specified" : req.body.firstName;
            req.body.lastName = req.body.lastName == "" ? "Not Specified" : req.body.lastName;
            req.body.profilePicture = "https://gravatar.com/avatar/" + _crypto["default"].createHash("md5").update(req.body.email).digest("hex").toString() + "?s=200" + "&d=retro";
            _context11.next = 11;
            return _users["default"].findOne({
              email: req.body.email
            });

          case 11:
            check = _context11.sent;
            _context11.next = 14;
            return _users["default"].findOne({
              username: req.body.username
            });

          case 14:
            username = _context11.sent;

            if (!(check || username)) {
              _context11.next = 20;
              break;
            }

            req.flash("success_msg", "".concat(check ? "Email" : "Username", " has been used"));
            return _context11.abrupt("return", res.redirect("back"));

          case 20:
            req.body.siteLink = res.locals.siteLink;
            req.body.logo = res.locals.siteLogo;
            req.body.instagram = res.locals.instagram;
            req.body.facebook = res.locals.facebook;
            req.body.twitter = res.locals.twitter;
            payload = req.body;
            _context11.next = 28;
            return _users["default"].create(req.body);

          case 28:
            _context11.next = 30;
            return (0, _mail2["default"])("Registration Successfull", req.body.email, "reg-email2", payload, req.headers.host, function (err, info) {
              if (err) console.log(err);
            });

          case 30:
            req.flash("success_msg", "User Created Successfully");
            return _context11.abrupt("return", res.redirect("back"));

          case 32:
            _context11.next = 37;
            break;

          case 34:
            _context11.prev = 34;
            _context11.t0 = _context11["catch"](0);
            next(_context11.t0);

          case 37:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 34]]);
  }));

  return function (_x30, _x31, _x32) {
    return _ref11.apply(this, arguments);
  };
}()); // Verify a user account route

router.get("/verify-account", _install["default"].redirectToLogin, checkIfLoggedIn, /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var set;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return _settings["default"].findOne();

          case 2:
            set = _context12.sent;

            try {
              if (req.query.token) {
                // check if the token exist
                _users["default"].findOne({
                  token: req.query.token
                }).then(function (user) {
                  if (!user) {
                    req.flash("success_msg", "The token is inavlid, pls check your mail again");
                    return res.redirect("back");
                  } else {
                    // user.token = undefined;
                    user.active = true;
                    user.verified = true;
                    user.save().then(function (user) {
                      if (set.autoLogin) {
                        req.logIn(user, function (err, user) {
                          if (err) return next(err);
                          return res.redirect('/enterinformation');
                        });
                      } else {
                        req.flash("success_msg", "Account Verified Successfully, you can now login.");
                        res.redirect("/login");
                      }
                    })["catch"](function (err) {
                      return next(err);
                    });
                  }
                });
              } else {
                res.render("404");
              }
            } catch (e) {
              next(e);
            }

          case 4:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x33, _x34, _x35) {
    return _ref12.apply(this, arguments);
  };
}()); // Get login route

router.get("/login", _install["default"].redirectToLogin, checkIfLoggedIn, function (req, res, next) {
  res.render("login", {
    title: res.locals.siteTitle
  });
});
router.get('/afterlogin', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var editorsPicker, a, i, usercategory, _category, article, b, followers, authorarticle, art, j, usercategoryList, popular, p, random, r, e, currentUser, favoriteCat, category, categories, _random, _r, _e, _editorsPicker, _categories;

    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            if (!req.user) {
              _context13.next = 77;
              break;
            }

            _context13.next = 3;
            return _articles["default"].find({
              addToBreaking: true
            }).populate('category').populate('postedBy').limit(3);

          case 3:
            editorsPicker = _context13.sent;

            if (!(editorsPicker.length == 0)) {
              _context13.next = 28;
              break;
            }

            a = [];
            i = 0;

          case 7:
            if (!(i < req.user.categoryList.length)) {
              _context13.next = 19;
              break;
            }

            usercategory = req.user.categoryList[i];
            _context13.next = 11;
            return _category2["default"].find({
              slug: usercategory
            });

          case 11:
            _category = _context13.sent;
            _context13.next = 14;
            return _articles["default"].find({
              category: _category[0]._id
            }).populate('category').populate('postedBy');

          case 14:
            article = _context13.sent;

            for (b in article) {
              if (article[b].category.slug != 'official') {
                a.push(article[b]);
              }
            }

          case 16:
            i++;
            _context13.next = 7;
            break;

          case 19:
            _context13.t0 = _regenerator["default"].keys(a);

          case 20:
            if ((_context13.t1 = _context13.t0()).done) {
              _context13.next = 28;
              break;
            }

            i = _context13.t1.value;

            if (!(a[i]["short"].split(' ').length > 900)) {
              _context13.next = 26;
              break;
            }

            if (!(editorsPicker.length > 2)) {
              _context13.next = 25;
              break;
            }

            return _context13.abrupt("break", 28);

          case 25:
            editorsPicker.push(a[i]);

          case 26:
            _context13.next = 20;
            break;

          case 28:
            _context13.next = 30;
            return _users["default"].find({
              "following.user": {
                $in: req.user.id
              }
            }).populate("following").sort({
              createdAt: -1
            });

          case 30:
            followers = _context13.sent;
            authorarticle = [];
            _context13.t2 = _regenerator["default"].keys(followers);

          case 33:
            if ((_context13.t3 = _context13.t2()).done) {
              _context13.next = 51;
              break;
            }

            i = _context13.t3.value;
            _context13.next = 37;
            return _articles["default"].find({
              postedBy: followers[i]._id
            }).populate('category').populate('postedBy').sort({
              createdAt: -1
            });

          case 37:
            art = _context13.sent;
            _context13.t4 = _regenerator["default"].keys(art);

          case 39:
            if ((_context13.t5 = _context13.t4()).done) {
              _context13.next = 49;
              break;
            }

            j = _context13.t5.value;

            if (!(art[j].category.slug != "official")) {
              _context13.next = 47;
              break;
            }

            if (!(authorarticle.length > 5)) {
              _context13.next = 46;
              break;
            }

            return _context13.abrupt("break", 49);

          case 46:
            authorarticle.push(art[j]);

          case 47:
            _context13.next = 39;
            break;

          case 49:
            _context13.next = 33;
            break;

          case 51:
            // let authorarticle = await Article.find({ postedBy: req.user.id }).populate('category');
            usercategoryList = req.user.categoryList;
            _context13.next = 54;
            return _articles["default"].find({
              active: true
            }).populate('category').sort({
              views: -1
            });

          case 54:
            popular = _context13.sent;
            p = [];
            usercategoryList.forEach(function (item) {
              popular.forEach(function (element) {
                if (element.category.slug != "official") {
                  if (item == element.category.slug) {
                    if (p.length < 6) {
                      p.push(element);
                    }
                  }
                }
              });
            });
            _context13.next = 59;
            return _articles["default"].find({}).populate('category').populate('postedBy');

          case 59:
            random = _context13.sent;
            r = [];
            random.forEach(function (element) {
              if (element.category.slug != "official") {
                if (r.length < 6) {
                  r.push(element);
                }
              }
            });
            e = [];
            editorsPicker.forEach(function (element) {
              if (element.category.slug != 'official') {
                e.push(element);
              }
            });
            editorsPicker = e;
            _context13.next = 67;
            return _users["default"].findOne({
              _id: req.user._id
            });

          case 67:
            currentUser = _context13.sent;
            favoriteCat = currentUser.categoryList;
            _context13.next = 71;
            return _category2["default"].find({});

          case 71:
            category = _context13.sent;
            categories = [];
            favoriteCat.forEach(function (element) {
              category.forEach(function (items) {
                if (element == items.slug) {
                  categories.push(items);
                }
              });
            });
            res.render('afterloginuser', {
              title: "After Login",
              editorsPicker: editorsPicker,
              authorarticle: authorarticle,
              popular: p,
              random: r,
              categories: categories
            });
            _context13.next = 90;
            break;

          case 77:
            _context13.next = 79;
            return _articles["default"].find({}).populate('category').populate('postedBy');

          case 79:
            _random = _context13.sent;
            _r = [];

            _random.forEach(function (element) {
              if (element.category.slug != "official") {
                if (_r.length < 6) {
                  _r.push(element);
                }
              }
            });

            _e = [];
            _editorsPicker = [];

            _random.forEach(function (element) {
              if (element.category.slug != 'official') {
                if (_e.length < 6) {
                  _e.push(element);
                }
              }
            });

            _editorsPicker = _e;
            _context13.next = 88;
            return _category2["default"].find({}).limit(6);

          case 88:
            _categories = _context13.sent;
            res.render('afterloginuser', {
              title: "After Login",
              editorsPicker: _editorsPicker,
              authorarticle: _r,
              popular: _r,
              random: _r,
              categories: _categories
            });

          case 90:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x36, _x37, _x38) {
    return _ref13.apply(this, arguments);
  };
}());
router.post("/api/login", function (req, res, next) {
  var message = "";
  console.log(req.body);

  _passport["default"].authenticate("local", function (err, user, info) {
    if (err) return next(err);

    if (!user) {
      message = {
        "Error": "Incorect Email or password"
      };
      return res.json(message);
    }

    if (typeof user.active == "boolean" && user.active === false) {
      message = {
        "Error": "Your account is not active, check your email to activate your account"
      };
      return res.json(message);
    }

    if (user.banned === true) {
      message = {
        "Error": "Your Account has been suspended, You can visit the contact page for help."
      };
      return res.json(message);
    }

    req.logIn(user, function (err) {
      if (err) return next(err);

      if (user.roleId === "user") {
        // return res.redirect(`/user/dashboard`);
        message = {
          "Success": user
        };
        return res.json(message);
      } else if (user.roleId === "admin") {
        return res.redirect("/dashboard/index");
      }
    });
  })(req, res, next);
});
router.get("/close", function (req, res, next) {
  res.render('closeaccount', {
    title: "Close Account"
  });
});
router.post("/close", /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    var user, payload;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return _users["default"].updateOne({
              _id: req.user.id
            }, {
              closed: true
            });

          case 2:
            _context14.next = 4;
            return _users["default"].findOne({
              _id: req.user.id
            });

          case 4:
            user = _context14.sent;

            if (!user.emailsend) {
              _context14.next = 9;
              break;
            }

            payload = {
              email: user.email.trim(),
              username: user.username.trim().toLowerCase(),
              firstName: user.firstName,
              lastName: user.lastName,
              siteLink: res.locals.siteLink
            };
            _context14.next = 9;
            return (0, _mail2["default"])("Löschung deines Accounts", user.email, "account-delete-email", payload, req.headers.host, function (err, info) {
              if (err) console.log(err);
            });

          case 9:
            _context14.next = 11;
            return _users["default"].deleteOne({
              _id: req.user.id
            });

          case 11:
            _context14.next = 13;
            return _articles["default"].deleteMany({
              postedBy: req.user.id
            });

          case 13:
            req.logout();
            res.redirect('/login');

          case 15:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x39, _x40, _x41) {
    return _ref14.apply(this, arguments);
  };
}());
router.get("/admin-close", /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
    var user, payload, articles;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return _users["default"].findOne({
              _id: req.query.user
            });

          case 2:
            user = _context15.sent;

            if (!user.emailsend) {
              _context15.next = 7;
              break;
            }

            payload = {
              email: user.email.trim(),
              username: user.username.trim().toLowerCase(),
              firstName: user.firstName,
              lastName: user.lastName,
              siteLink: res.locals.siteLink
            };
            _context15.next = 7;
            return (0, _mail2["default"])("Löschung deines Accounts", user.email, "account-delete-email", payload, req.headers.host, function (err, info) {
              if (err) console.log(err);
            });

          case 7:
            _context15.next = 9;
            return _users["default"].deleteOne({
              _id: req.query.user
            });

          case 9:
            _context15.next = 11;
            return _articles["default"].find({});

          case 11:
            articles = _context15.sent;
            articles.forEach(function (element) {
              if (element.postedBy == req.query.user) {
                _articles["default"].deleteOne({
                  _id: element._id
                }).then(function (deleted) {
                  res.redirect("/dashboard/users");
                });
              }
            });
            res.redirect("/dashboard/users");

          case 14:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x42, _x43, _x44) {
    return _ref15.apply(this, arguments);
  };
}());
router.post("/login", _install["default"].redirectToLogin, checkIfLoggedIn, function (req, res, next) {
  if (!req.body['g-recaptcha-response']) {
    req.flash("success_msg", "Captcha is required!");
    return res.redirect("back");
  } else {
    _passport["default"].authenticate("local", function (err, user, info) {
      if (err) return next(err);

      if (!user) {
        req.flash("success_msg", "Incorect Email or password");
        return res.redirect("back");
      }

      if (typeof user.active == "boolean" && user.active === false) {
        req.flash("success_msg", "Your account is not active, check your email to activate your account");
        return res.redirect("back");
      }

      if (user.closed === true) {
        req.flash("success_msg", "Your Account has been closed.");
        return res.redirect("back");
      }

      req.logIn(user, function (err) {
        if (err) return next(err);

        if (user.roleId === "user") {
          // return res.redirect(`/user/dashboard`);
          var signupProcess = user.signupProcess;
          return res.redirect(signupProcess);
        } else if (user.roleId === "admin") {
          return res.redirect("/dashboard/index");
        }
      });
    })(req, res, next);
  }
});
router.get('/user/qualify', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res, next) {
    var article;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return _articles["default"].update({
              _id: req.query.articleId
            }, {
              qualify: "waiting"
            });

          case 2:
            article = _context16.sent;
            req.flash("success_msg", "Es dauert bis zu 3 Tage, bis dein Artikel qualifiziert wirde. Unser Team meldet sich bei dir!");
            return _context16.abrupt("return", res.redirect("back"));

          case 5:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function (_x45, _x46, _x47) {
    return _ref16.apply(this, arguments);
  };
}()); // Get forgot password page

router.get("/forgot-password", _install["default"].redirectToLogin, checkIfLoggedIn, function (req, res, next) {
  res.render("lostpassword", {
    title: res.locals.siteTitle
  });
});
router.get("/google/signin", _install["default"].redirectToLogin, checkIfLoggedIn, function (req, res, next) {
  _passport["default"].authenticate('google', {
    failureRedirect: '/login'
  }), function (req, res) {
    res.redrect('/afterlogin');
  };
}); // Forgot password route

router.post("/forgot-password", _install["default"].redirectToLogin, function (req, res, next) {
  try {
    var token = _crypto["default"].randomBytes(20).toString("hex"); // Check the database if there's any user with the specified user


    _users["default"].findOne({
      email: req.body.email
    }).then(function (user) {
      if (!user) {
        // user does not exist
        req.flash("success_msg", "Email does not match with any account");
        return res.redirect("back");
      } else {
        user.passwordResetToken = token;
        user.passwordResetExpiryDate = Date.now() + 3600000; // 1 hour

        user.save().then(function (user) {
          var emailVariables = {
            email: user.email,
            token: user.passwordResetToken
          };
          (0, _mail2["default"])("Forgotten Passwird", user.email, "forgot-email", emailVariables, req.headers.host, function (err, info) {
            console.log(info.response);
          });
          req.flash("success_msg", "An email has been sent to your account with further instructions");
          return res.redirect("back");
        })["catch"](function (err) {
          return next(err);
        });
      }
    })["catch"](function (err) {
      return next(err);
    });
  } catch (e) {
    next(e);
  }
}); // Get resest password page

router.get("/reset/:token", _install["default"].redirectToLogin, function (req, res, next) {
  res.render("reset", {
    title: res.locals.siteTitle
  });
}); // Reset password route

router.post("/reset/:token", _install["default"].redirectToLogin, function (req, res, next) {
  try {
    _users["default"].findOne({
      passwordResetToken: req.params.token,
      passwordResetExpiryDate: {
        $gt: Date.now()
      }
    }).then(function (user) {
      if (!user) {
        req.flash("success_msg", "Token is invalid or it might has expired");
        return res.redirect("back");
      } else {
        user.passwordResetToken = undefined;
        user.passwordResetExpiryDate = undefined;
        user.password = req.body.password;
        user.save().then(function (user) {
          req.flash("success_msg", "Your password has been updated successfully, you can now login");
          return res.redirect("/login");
        })["catch"](function (err) {
          return next(err);
        });
      }
    });
  } catch (e) {
    next(e);
  }
}); // Update user info route

router.post("/user/dashboard/update/info", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(req, res, next) {
    var user, status, use;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.prev = 0;
            _context17.next = 3;
            return _users["default"].findById(req.user.id);

          case 3:
            user = _context17.sent;

            if (!(user.email == req.body.email)) {
              _context17.next = 20;
              break;
            }

            status = 0;

            if (req.body.firstname != 'Not Specified') {
              status = status + 10;
            }

            if (req.body.lastname != 'Not Specified') {
              status = status + 10;
            }

            if (req.body.email != '') {
              status = status + 10;
            }

            if (req.body.birthday != '') {
              status = status + 10;
            }

            if (req.body.phone != '') {
              status = status + 10;
            }

            if (req.body.about != '') {
              status = status + 10;
            }

            if (req.body['social.linkedin'] != "" || req.body['social.instagram'] != "" || req.body['social.twitter'] != "" || req.body['social.facebook'] != "") {
              status = status + 40;
            }

            req.body.postenable = "false";

            if (status == 100) {
              req.body.postenable = "true";
            }

            req.body.emailsend = !req.body.emailsend ? false : true;
            console.log(req.body.emailsend);

            _users["default"].updateOne({
              _id: req.user.id
            }, req.body).then(function (user) {
              req.flash("success_msg", "Your profile has been updated successfully");
              return res.redirect("back");
            })["catch"](function (err) {
              return next(err);
            });

            _context17.next = 29;
            break;

          case 20:
            _context17.next = 22;
            return _users["default"].findOne({
              email: req.body.email
            });

          case 22:
            use = _context17.sent;

            if (!use) {
              _context17.next = 28;
              break;
            }

            req.flash("success_msg", "The Email you provided has been used");
            return _context17.abrupt("return", res.redirect("back"));

          case 28:
            _users["default"].updateOne({
              _id: req.user.id
            }, req.body).then(function (user) {
              req.flash("success_msg", "Your profile has been updated successfully");
              return res.redirect("back");
            })["catch"](function (err) {
              return next(err);
            });

          case 29:
            _context17.next = 34;
            break;

          case 31:
            _context17.prev = 31;
            _context17.t0 = _context17["catch"](0);
            next(_context17.t0);

          case 34:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[0, 31]]);
  }));

  return function (_x48, _x49, _x50) {
    return _ref17.apply(this, arguments);
  };
}()); // Update user profile picture

/**
 * @TODO retructure how name is been saved
 */

router.post("/user/dashboard/update/profile-picture", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref18 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(req, res, next) {
    var set, form, s3, awsForm, cloudForm;
    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.prev = 0;
            _context21.next = 3;
            return _settings["default"].find();

          case 3:
            set = _context21.sent;
            _context21.t0 = set[0].media.provider;
            _context21.next = _context21.t0 === "local" ? 7 : _context21.t0 === "amazons3" ? 10 : _context21.t0 === "cloudinary" ? 15 : 20;
            break;

          case 7:
            form = new _formidable["default"].IncomingForm();
            form.parse(req, function (err, fields, files) {
              var fileUpload = files.profilePicture;
              var uploadedData = fields;
              var name = "".concat(_crypto["default"].randomBytes(20).toString("hex")).concat(Date.now().toString(), ".").concat(fileUpload.name.split(".").pop());
              var dest = "".concat(_path["default"].join(__dirname, "..", "public", "media", "".concat(name)));

              var data = _fs["default"].readFileSync(fileUpload.path);

              _fs["default"].writeFileSync(dest, data);

              _fs["default"].unlinkSync(fileUpload.path);

              uploadedData.profilePicture = "/media/".concat(name);

              _users["default"].updateOne({
                _id: req.user.id
              }, {
                $set: {
                  profilePicture: uploadedData.profilePicture
                }
              }).then(function (user) {
                req.flash("success_msg", "Profile Picture has been updated successfully");
                return res.redirect("back");
              })["catch"](function (err) {
                return next(err);
              });
            });
            return _context21.abrupt("break", 20);

          case 10:
            // AWS configuration
            s3 = new _awsSdk["default"].S3({
              accessKeyId: set[0].media.config.amazons3.accessKeyId,
              secretAccessKey: set[0].media.config.amazons3.secretAccessKey,
              bucket: set[0].media.config.amazons3.bucket
            });
            awsForm = new _formidable["default"].IncomingForm();
            awsForm.parse(req, function (err, fields, files) {});
            awsForm.on("end", function (fields, files) {
              for (var x in this.openedFiles) {
                var stream = _fs["default"].createReadStream(this.openedFiles[x].path);

                _fs["default"].unlinkSync(this.openedFiles[x].path);

                var params = {
                  Bucket: set[0].media.config.amazons3.bucket,
                  Key: this.openedFiles[x].name.split(".").shift() + "-" + _crypto["default"].randomBytes(2).toString("hex") + "." + this.openedFiles[x].name.split(".").pop(),
                  Body: stream,
                  ContentType: this.openedFiles[x].type,
                  ACL: "public-read",
                  processData: false
                };
                s3.upload(params, /*#__PURE__*/function () {
                  var _ref19 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(err, data) {
                    return _regenerator["default"].wrap(function _callee18$(_context18) {
                      while (1) {
                        switch (_context18.prev = _context18.next) {
                          case 0:
                            if (err) next(err);else {
                              _users["default"].updateOne({
                                _id: req.user.id
                              }, {
                                $set: {
                                  profilePicture: data.Location
                                }
                              }).then(function (user) {
                                req.flash("success_msg", "Profile Picture has been updated successfully");
                                return res.redirect("back");
                              })["catch"](function (err) {
                                return next(err);
                              });
                            }

                          case 1:
                          case "end":
                            return _context18.stop();
                        }
                      }
                    }, _callee18);
                  }));

                  return function (_x54, _x55) {
                    return _ref19.apply(this, arguments);
                  };
                }());
              }
            });
            return _context21.abrupt("break", 20);

          case 15:
            // Cloudinary configuration
            _cloudinary.v2.config({
              cloud_name: set[0].media.config.cloudinary.cloud_name,
              api_key: set[0].media.config.cloudinary.api_key,
              api_secret: set[0].media.config.cloudinary.api_secret
            });

            cloudForm = new _formidable["default"].IncomingForm();
            cloudForm.parse(req, function (err, fields, files) {});
            cloudForm.on("end", /*#__PURE__*/function () {
              var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(fields, files) {
                var _this = this;

                var _loop, x;

                return _regenerator["default"].wrap(function _callee20$(_context20) {
                  while (1) {
                    switch (_context20.prev = _context20.next) {
                      case 0:
                        _loop = function _loop(x) {
                          _cloudinary.v2.uploader.upload(_this.openedFiles[x].path, /*#__PURE__*/function () {
                            var _ref21 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(err, result) {
                              return _regenerator["default"].wrap(function _callee19$(_context19) {
                                while (1) {
                                  switch (_context19.prev = _context19.next) {
                                    case 0:
                                      _fs["default"].unlinkSync(_this.openedFiles[x].path);

                                      _users["default"].updateOne({
                                        _id: req.user.id
                                      }, {
                                        $set: {
                                          profilePicture: result.secure_url
                                        }
                                      }).then(function (user) {
                                        req.flash("success_msg", "Profile Picture has been updated successfully");
                                        return res.redirect("back");
                                      })["catch"](function (err) {
                                        return next(err);
                                      });

                                    case 2:
                                    case "end":
                                      return _context19.stop();
                                  }
                                }
                              }, _callee19);
                            }));

                            return function (_x58, _x59) {
                              return _ref21.apply(this, arguments);
                            };
                          }());
                        };

                        for (x in this.openedFiles) {
                          _loop(x);
                        }

                      case 2:
                      case "end":
                        return _context20.stop();
                    }
                  }
                }, _callee20, this);
              }));

              return function (_x56, _x57) {
                return _ref20.apply(this, arguments);
              };
            }());
            return _context21.abrupt("break", 20);

          case 20:
            _context21.next = 25;
            break;

          case 22:
            _context21.prev = 22;
            _context21.t1 = _context21["catch"](0);
            next(_context21.t1);

          case 25:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21, null, [[0, 22]]);
  }));

  return function (_x51, _x52, _x53) {
    return _ref18.apply(this, arguments);
  };
}()); // Update user password

router.post("/user/dashboard/update/password", _install["default"].redirectToLogin, _auth["default"], function (req, res, next) {
  try {
    _users["default"].findOne({
      _id: req.user.id
    }).then(function (user) {
      user.comparePassword(req.body.currentPassword, function (err, isMatch) {
        if (isMatch == true) {
          if (req.body.password.trim().length > 1) {
            user.password = req.body.password;
            user.save().then(function (user) {
              req.flash("success_msg", "Your password has been updated");
              return res.redirect("back");
            })["catch"](function (err) {
              return next(err);
            });
          } else {
            req.flash("success_msg", "password field cannot be empty or too short");
            return res.redirect("back");
          }
        } else {
          req.flash("success_msg", "The current password you provided is incorrect");
          return res.redirect("back");
        }
      });
    })["catch"](function (err) {
      return next(err);
    });
  } catch (e) {
    next(e);
  }
}); // Log out route

router.get("/log-out", function (req, res, next) {
  try {
    if (!req.user) res.redirect("/login");else {
      _users["default"].updateOne({
        _id: req.user.id
      }, {
        lastLoggedIn: Date.now()
      }).then(function (updated) {
        req.logout();
        req.flash("success_msg", "Du bist num abgemeldet");
        res.redirect("/login");
      });
    }
  } catch (error) {
    next(error);
  }
}); // Delete Many User

router.post("/user/dashboard/deleteMany", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref22 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(req, res, next) {
    return _regenerator["default"].wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _context22.prev = 0;
            _context22.next = 3;
            return _articles["default"].deleteMany({
              postedBy: req.body.ids
            });

          case 3:
            _users["default"].deleteMany({
              _id: req.body.ids
            }).then(function (deleted) {
              if (!req.body.ids) {
                req.flash("success_msg", "No User Was Deleted");
                return res.redirect("back");
              } else {
                req.flash("success_msg", "Users was Deleted Successfully");
                return res.redirect("back");
              }
            })["catch"](function (e) {
              return next(e);
            });

            _context22.next = 9;
            break;

          case 6:
            _context22.prev = 6;
            _context22.t0 = _context22["catch"](0);
            next(_context22.t0);

          case 9:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22, null, [[0, 6]]);
  }));

  return function (_x60, _x61, _x62) {
    return _ref22.apply(this, arguments);
  };
}()); // Update another user info

router.post("/user/edit", _auth["default"], /*#__PURE__*/function () {
  var _ref23 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23(req, res, next) {
    var user, use;
    return _regenerator["default"].wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.prev = 0;
            _context23.next = 3;
            return _users["default"].findById(req.body.userId);

          case 3:
            user = _context23.sent;

            if (!(user.email == req.body.email)) {
              _context23.next = 8;
              break;
            }

            _users["default"].updateOne({
              _id: req.body.userId
            }, req.body).then(function (user) {
              req.flash("success_msg", "User's profile has been updated successfully");
              return res.redirect("back");
            })["catch"](function (err) {
              return next(err);
            });

            _context23.next = 17;
            break;

          case 8:
            _context23.next = 10;
            return _users["default"].findOne({
              email: req.body.email
            });

          case 10:
            use = _context23.sent;

            if (!use) {
              _context23.next = 16;
              break;
            }

            req.flash("success_msg", "The Email you provided has been used");
            return _context23.abrupt("return", res.redirect("back"));

          case 16:
            _users["default"].updateOne({
              _id: req.body.userId
            }, req.body).then(function (user) {
              req.flash("success_msg", "User's profile has been updated successfully");
              return res.redirect("back");
            })["catch"](function (err) {
              return next(err);
            });

          case 17:
            _context23.next = 22;
            break;

          case 19:
            _context23.prev = 19;
            _context23.t0 = _context23["catch"](0);
            next(_context23.t0);

          case 22:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23, null, [[0, 19]]);
  }));

  return function (_x63, _x64, _x65) {
    return _ref23.apply(this, arguments);
  };
}()); // Update another user password

router.post("/user/password/edit", _auth["default"], function (req, res, next) {
  try {
    if (req.body.password !== req.body.repassword) {
      req.flash("success_msg", "Password doesn't match");
      return res.redirect("back");
    } else {
      _users["default"].findOne({
        _id: req.body.userId
      }).then(function (user) {
        user.password = req.body.password;
        user.save().then(function (saved) {
          req.flash("success_msg", "User password Updated Successfully");
          return res.redirect("back");
        })["catch"](function (e) {
          return next(e);
        });
      })["catch"](function (e) {
        return next(e);
      });
    }
  } catch (error) {
    next(error);
  }
}); // Confirm user email

router.post("/user/dashboard/confirm-user-email", _auth["default"], /*#__PURE__*/function () {
  var _ref24 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24(req, res, next) {
    return _regenerator["default"].wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.prev = 0;

            if (req.body.ids) {
              _context24.next = 4;
              break;
            }

            req.flash("success_msg", "Nothing was Updated");
            return _context24.abrupt("return", res.redirect("back"));

          case 4:
            _context24.next = 6;
            return _users["default"].updateOne({
              _id: req.body.ids
            }, {
              $set: {
                active: true
              }
            });

          case 6:
            req.flash("success_msg", "Users Email Activated successfully");
            return _context24.abrupt("return", res.redirect("back"));

          case 10:
            _context24.prev = 10;
            _context24.t0 = _context24["catch"](0);
            next(_context24.t0);

          case 13:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24, null, [[0, 10]]);
  }));

  return function (_x66, _x67, _x68) {
    return _ref24.apply(this, arguments);
  };
}()); // Ban user

router.post("/user/dashboard/ban-user", _auth["default"], (0, _role["default"])("admin"), /*#__PURE__*/function () {
  var _ref25 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25(req, res, next) {
    return _regenerator["default"].wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _context25.prev = 0;

            if (req.body.ids) {
              _context25.next = 4;
              break;
            }

            req.flash("success_msg", "Nothing was Updated");
            return _context25.abrupt("return", res.redirect("back"));

          case 4:
            _context25.next = 6;
            return _users["default"].updateOne({
              _id: req.body.ids
            }, {
              $set: {
                banned: true
              }
            });

          case 6:
            req.flash("success_msg", "Users has been banned successfully");
            return _context25.abrupt("return", res.redirect("back"));

          case 10:
            _context25.prev = 10;
            _context25.t0 = _context25["catch"](0);
            next(_context25.t0);

          case 13:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25, null, [[0, 10]]);
  }));

  return function (_x69, _x70, _x71) {
    return _ref25.apply(this, arguments);
  };
}()); // Follow a user

router.get("/follow-user", _auth["default"], /*#__PURE__*/function () {
  var _ref26 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26(req, res, next) {
    var date, payload;
    return _regenerator["default"].wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            date = new Date();
            payload = {
              date: date,
              user: req.user.id
            };
            _context26.next = 4;
            return _users["default"].updateOne({
              _id: req.query.followerId
            }, {
              $push: {
                following: payload
              }
            });

          case 4:
            return _context26.abrupt("return", res.redirect("back"));

          case 5:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26);
  }));

  return function (_x72, _x73, _x74) {
    return _ref26.apply(this, arguments);
  };
}()); // unfollow a user

router.get("/unfollow-user", _auth["default"], /*#__PURE__*/function () {
  var _ref27 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27(req, res, next) {
    var user, following, removefield;
    return _regenerator["default"].wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            _context27.next = 2;
            return _users["default"].findOne({
              _id: req.query.authorId
            });

          case 2:
            user = _context27.sent;
            following = user.following;
            removefield = 0;
            following.forEach(function (element) {
              if (element.user == req.user.id) {
                removefield = element._id;
              }
            });

            if (!req.query.authorId) {
              _context27.next = 11;
              break;
            }

            _context27.next = 9;
            return _users["default"].updateOne({
              _id: req.query.authorId
            }, {
              $pull: {
                following: {
                  user: req.user.id
                }
              }
            });

          case 9:
            _context27.next = 13;
            break;

          case 11:
            _context27.next = 13;
            return _users["default"].updateOne({
              _id: req.query.followerId
            }, {
              $pull: {
                following: req.user.id
              }
            });

          case 13:
            return _context27.abrupt("return", res.redirect('back'));

          case 14:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27);
  }));

  return function (_x75, _x76, _x77) {
    return _ref27.apply(this, arguments);
  };
}()); // Subscribe a user to a newsletter digest (Daily / Weekly)

router.post("/subscribe/digest", _auth["default"], /*#__PURE__*/function () {
  var _ref28 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28(req, res, next) {
    return _regenerator["default"].wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
          case "end":
            return _context28.stop();
        }
      }
    }, _callee28);
  }));

  return function (_x78, _x79, _x80) {
    return _ref28.apply(this, arguments);
  };
}());
router.get("/checkout-session", /*#__PURE__*/function () {
  var _ref29 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee29(req, res) {
    var sessionId, session;
    return _regenerator["default"].wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            sessionId = req.query.sessionId;
            _context29.next = 3;
            return stripe.checkout.sessions.retrieve(sessionId);

          case 3:
            session = _context29.sent;
            res.send(session);

          case 5:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29);
  }));

  return function (_x81, _x82) {
    return _ref29.apply(this, arguments);
  };
}());
router.post("/create-checkout-session", /*#__PURE__*/function () {
  var _ref30 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee30(req, res) {
    var planId, domainURL, session;
    return _regenerator["default"].wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            planId = process.env.SUBSCRIPTION_PLAN_ID;
            domainURL = process.env.DOMAIN;
            _context30.next = 4;
            return stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              subscription_data: {
                items: [{
                  plan: planId
                }]
              },
              success_url: "".concat(domainURL, "/onboarding?session_id={CHECKOUT_SESSION_ID}"),
              cancel_url: "".concat(domainURL, "/membership")
            });

          case 4:
            session = _context30.sent;
            res.send({
              checkoutSessionId: session.id
            });

          case 6:
          case "end":
            return _context30.stop();
        }
      }
    }, _callee30);
  }));

  return function (_x83, _x84) {
    return _ref30.apply(this, arguments);
  };
}());
router.get("/public-key", function (req, res) {
  res.send({
    publicKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});
router.post("/saveTime", /*#__PURE__*/function () {
  var _ref31 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee33(req, res) {
    var userId, articleId, spentTime, readingTime, message, article, user, payload, check, oldspentTime, newspentTime, id, averageold, averageInfo, totalCountings, totalSpentTime, countings, balanceTime, balance, author, earningList, earning, userlength;
    return _regenerator["default"].wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            userId = req.body.userId;
            articleId = req.body.articleId;
            spentTime = parseInt(req.body.time);
            readingTime = req.body.readingTime;
            message = "success";
            _context33.next = 7;
            return _articles["default"].findOne({
              _id: articleId
            }).populate('postedBy');

          case 7:
            article = _context33.sent;
            _context33.next = 10;
            return _users["default"].findOne({
              _id: userId
            });

          case 10:
            user = _context33.sent;

            if (spentTime % 60 > 30) {
              spentTime = parseInt(spentTime / 60) + 1;
            } else if (spentTime % 60 < 30) {
              spentTime = parseInt(spentTime / 60);
            }

            if (spentTime > readingTime / 60) {
              spentTime = readingTime / 60;
            }

            payload = {
              userId: userId,
              articleId: articleId,
              spentTime: spentTime,
              authorName: article.postedBy.username
            };
            _context33.next = 16;
            return _counting["default"].findOne({
              $and: [{
                articleId: articleId
              }, {
                userId: userId
              }]
            });

          case 16:
            check = _context33.sent;

            if (!check) {
              _context33.next = 34;
              break;
            }

            oldspentTime = check.spentTime;
            newspentTime = 0;

            if (!(oldspentTime < readingTime)) {
              _context33.next = 32;
              break;
            }

            id = check.id;
            newspentTime = parseInt(oldspentTime) + parseInt(spentTime);

            if (newspentTime > readingTime / 60) {
              newspentTime = readingTime / 60;
            }

            _context33.next = 26;
            return _counting["default"].updateOne({
              _id: id
            }, {
              spentTime: newspentTime
            });

          case 26:
            _context33.next = 28;
            return _average["default"].findOne({
              userId: userId
            });

          case 28:
            averageold = _context33.sent;
            averageInfo = {
              spentTime: averageold.spentTime + newspentTime,
              spentCount: averageold.spentCount + 1
            };
            _context33.next = 32;
            return _average["default"].updateOne({
              userId: userId
            }, averageInfo);

          case 32:
            _context33.next = 37;
            break;

          case 34:
            if (!(article.qualify == "qualify")) {
              _context33.next = 37;
              break;
            }

            _context33.next = 37;
            return _counting["default"].create(payload).then( /*#__PURE__*/function () {
              var _ref32 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee32(created) {
                var averageInfo, averageold, _averageInfo;

                return _regenerator["default"].wrap(function _callee32$(_context32) {
                  while (1) {
                    switch (_context32.prev = _context32.next) {
                      case 0:
                        averageInfo = {
                          userId: userId,
                          articleId: articleId,
                          spentTime: payload.spentTime,
                          spentCount: 1
                        };
                        _context32.next = 3;
                        return _average["default"].findOne({
                          userId: userId
                        });

                      case 3:
                        averageold = _context32.sent;

                        if (!averageold) {
                          _context32.next = 10;
                          break;
                        }

                        _averageInfo = {
                          spentTime: averageold.spentTime + spentTime,
                          spentCount: averageold.spentCount + 1
                        };
                        _context32.next = 8;
                        return _average["default"].updateOne({
                          userId: userId
                        }, _averageInfo);

                      case 8:
                        _context32.next = 12;
                        break;

                      case 10:
                        _context32.next = 12;
                        return _average["default"].create(averageInfo).then( /*#__PURE__*/function () {
                          var _ref33 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee31(result) {
                            return _regenerator["default"].wrap(function _callee31$(_context31) {
                              while (1) {
                                switch (_context31.prev = _context31.next) {
                                  case 0:
                                  case "end":
                                    return _context31.stop();
                                }
                              }
                            }, _callee31);
                          }));

                          return function (_x88) {
                            return _ref33.apply(this, arguments);
                          };
                        }());

                      case 12:
                      case "end":
                        return _context32.stop();
                    }
                  }
                }, _callee32);
              }));

              return function (_x87) {
                return _ref32.apply(this, arguments);
              };
            }())["catch"](function (e) {
              return next(e);
            });

          case 37:
            _context33.next = 39;
            return _counting["default"].find({
              userId: userId
            });

          case 39:
            totalCountings = _context33.sent;
            totalSpentTime = 0;
            totalCountings.forEach(function (item) {
              totalSpentTime = totalSpentTime + item.spentTime;
            });
            _context33.next = 44;
            return _counting["default"].find({
              userId: userId
            });

          case 44:
            countings = _context33.sent;
            balanceTime = 0;
            countings.forEach(function (element) {
              if (element.authorName == article.postedBy.username) {
                balanceTime = balanceTime + element.spentTime;
              }
            });
            balance = 0;

            if (totalSpentTime != 0) {
              balance = 3.02 * balanceTime / totalSpentTime;
            }

            _context33.next = 51;
            return _users["default"].findOne({
              _id: article.postedBy._id
            });

          case 51:
            author = _context33.sent;
            earningList = author.earning;
            earning = {
              balance: balance,
              user: userId,
              date: Date.now()
            };
            userlength = 0;
            earningList.forEach(function (element) {
              if (element.user == userId) {
                userlength = 1;
              }
            });

            if (!(userlength == 0)) {
              _context33.next = 62;
              break;
            }

            if (!(balance != 0)) {
              _context33.next = 60;
              break;
            }

            _context33.next = 60;
            return _users["default"].updateOne({
              _id: article.postedBy._id
            }, {
              $push: {
                "earning": earning
              }
            });

          case 60:
            _context33.next = 65;
            break;

          case 62:
            earningList.forEach(function (element, index) {
              if (element.user == userId) {
                earningList[index].balance = balance;
                earningList[index].date = Date.now();
              }
            });
            _context33.next = 65;
            return _users["default"].updateOne({
              _id: article.postedBy._id
            }, {
              earning: earningList
            });

          case 65:
            return _context33.abrupt("return", res.json(message));

          case 66:
          case "end":
            return _context33.stop();
        }
      }
    }, _callee33);
  }));

  return function (_x85, _x86) {
    return _ref31.apply(this, arguments);
  };
}());
module.exports = router;