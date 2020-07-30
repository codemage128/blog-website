"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _passport = _interopRequireDefault(require("passport"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _mail2 = _interopRequireDefault(require("./_mail"));

var _crypto = _interopRequireDefault(require("crypto"));

var _users = _interopRequireDefault(require("../models/users"));

var LocalStrategy = require("passport-local").Strategy;

var FacebookStrategy = require("passport-facebook").Strategy;

var GoogleStrategy = require("passport-google-oauth20").Strategy;

var TwitterStrategy = require("passport-twitter").Strategy;

var VKontakteStrategy = require("passport-vkontakte").Strategy;

var set = new Promise(function (resolve, reject) {
  var data = _settings["default"].findOne();

  resolve(data);
}); //Serialize user

_passport["default"].serializeUser(function (user, done) {
  done(null, user.id);
}); //Deserialize user


_passport["default"].deserializeUser(function (id, done) {
  _users["default"].findById(id, function (err, user) {
    done(err, user);
  });
}); //Local Strategy


_passport["default"].use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
}, function (email, password, done) {
  _users["default"].findOne({
    email: email
  }, function (err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, {
      message: "Incorrect Username"
    });
    user.comparePassword(password, function (err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: "Incorrect password."
        });
      }
    });
  });
})); // Facebook Strategy


set.then(function (data) {
  _passport["default"].use(new FacebookStrategy({
    clientID: data != null ? data.socialLogin.facebook.appId !== undefined ? data.socialLogin.facebook.appId : " " : " ",
    clientSecret: data != null ? data.socialLogin.facebook.appSecret != undefined ? data.socialLogin.facebook.appSecret : " " : " ",
    callbackURL: "/auth/facebook/callback",
    profileFields: ["id", "displayName", "photos", "email"]
  }, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      _users["default"].findOne({
        email: profile.emails[0].value
      }, function (err, user) {
        if (err) return done(err);
        if (user) return done(null, user);else {
          var payload = {
            email: profile.emails[0].value,
            username: profile.displayName.split(" ").join("-").toLowerCase(),
            profilePicture: "https://graph.facebook.com/".concat(profile.id, "/picture?type=large"),
            active: true,
            provider: profile.provider,
            facebookId: profile.id,
            firstName: profile.displayName.split(" ").shift(),
            lastName: profile.displayName.split(" ").pop()
          };
          var newUser = new _users["default"](payload);
          newUser.save(function (err, user) {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    });
  })); // Google strategy


  _passport["default"].use(new GoogleStrategy({
    clientID: data != null ? data.socialLogin.google.clientId !== undefined ? data.socialLogin.google.clientId : " " : " ",
    clientSecret: data != null ? data.socialLogin.google.clientSecret !== undefined ? data.socialLogin.google.clientSecret : " " : " ",
    callbackURL: "https://dype.me/auth/google/callback"
  }, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      _users["default"].findOne({
        email: profile.emails[0].value
      }, /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(err, user) {
          var status, payload, payload_email, newUser;
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  status = "exist";

                  if (!err) {
                    _context.next = 3;
                    break;
                  }

                  return _context.abrupt("return", done(err));

                case 3:
                  if (!user) {
                    _context.next = 7;
                    break;
                  }

                  return _context.abrupt("return", done(null, user, status));

                case 7:
                  status = "create";
                  payload = {
                    email: profile.emails[0].value,
                    username: profile.displayName.split(" ").join("-").trim().toLowerCase(),
                    profilePicture: profile.photos[0].value,
                    active: true,
                    provider: profile.provider,
                    googleId: profile.id,
                    emailsend: true,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    signupProcess: "/enterinformation",
                    token: _crypto["default"].randomBytes(16).toString("hex")
                  };
                  payload_email = {
                    email: profile.emails[0].value,
                    username: profile.displayName.split(" ").join("-").trim().toLowerCase(),
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    siteLink: "https://dype.me",
                    token: _crypto["default"].randomBytes(16).toString("hex")
                  };
                  _context.next = 12;
                  return (0, _mail2["default"])("Verifizierung deiner E-Mail", profile.emails[0].value, "reg-email", payload_email, "https://dype.me", function (err, info) {
                    if (err) console.log(err);
                  });

                case 12:
                  newUser = new _users["default"](payload);
                  newUser.save(function (err, user) {
                    if (err) throw err;
                    return done(null, newUser, status);
                  });

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
    });
  })); // Twitter strategy


  _passport["default"].use(new TwitterStrategy({
    consumerKey: data != null ? data.socialLogin.twitter.consumerKey !== undefined ? data.socialLogin.twitter.consumerKey : " " : " ",
    consumerSecret: data != null ? data.socialLogin.twitter.consumerSecret !== undefined ? data.socialLogin.twitter.consumerSecret : " " : " ",
    callbackURL: "/auth/twitter/callback",
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
  }, function (token, tokenSecret, profile, done) {
    _users["default"].findOne({
      email: profile.emails[0].value
    }, function (err, user) {
      if (err) return done(err);
      if (user) return done(null, user);else {
        console.log(profile);
        var payload = {
          email: profile.emails[0].value,
          username: profile.username.split(" ").join("-").toLowerCase(),
          profilePicture: profile.photos[0].value.replace(/_normal\./, "_bigger."),
          active: true,
          provider: profile.provider,
          twitterId: profile.id,
          firstName: profile.displayName,
          lastName: profile.displayName,
          paid: 'free'
        };
        var newUser = new _users["default"](payload);
        newUser.save(function (err, user) {
          if (err) throw err;
          return done(null, newUser);
        });
      }
    });
  })); // VK strategy


  _passport["default"].use(new VKontakteStrategy({
    clientID: data != null ? data.socialLogin.vkon.clientId !== undefined ? data.socialLogin.vkon.clientId : " " : " ",
    clientSecret: data != null ? data.socialLogin.vkon.clientSecret !== undefined ? data.socialLogin.vkon.clientSecret : " " : " ",
    callbackURL: "/auth/vkontakte/callback"
  }, function (accessToken, refreshToken, params, profile, done) {
    if (!params.email) {
      return done(null, false, {
        message: "Email Access Not given"
      });
    } else {
      _users["default"].findOne({
        email: params.email
      }, function (err, user) {
        if (err) return done(err);
        if (user) return done(null, user);else {
          var payload = {
            email: params.email,
            username: profile.displayName.split(" ").join("-").toLowerCase(),
            profilePicture: profile.photos[0].value.replace(/_50\./, "_200."),
            active: true,
            provider: profile.provider,
            vkontakteId: profile.id,
            firstName: profile.displayName,
            lastName: profile.displayName
          };
          var newUser = new _users["default"](payload);
          newUser.save(function (err, user) {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    }
  }));
});
module.exports = _passport["default"];