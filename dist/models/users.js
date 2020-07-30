"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcryptNodejs = _interopRequireDefault(require("bcrypt-nodejs"));

var _crypto = _interopRequireDefault(require("crypto"));

var Schema = _mongoose["default"].Schema;
var userSchema = new Schema({
  username: String,
  usernameslug: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  profilePicture: {
    type: String,
    "default": "https://gravatar.com/avatar/?s=200&d=retro"
  },
  active: {
    type: Boolean,
    "default": false
  },
  closed: {
    type: Boolean,
    "default": false
  },
  emailsend: {
    type: Boolean,
    "default": true
  },
  canceled: {
    type: Boolean,
    "default": false
  },
  banned: {
    type: Boolean,
    "default": false
  },
  paid: {
    type: String,
    "enum": ["free", "paid"],
    "default": "free"
  },
  roleId: {
    type: String,
    "enum": ["admin", "user"],
    "default": "user"
  },
  about: String,
  firstName: String,
  lastName: String,
  lastLoggedIn: Date,
  token: String,
  passwordResetToken: String,
  passwordResetExpiryDate: Date,
  social: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  provider: String,
  facebookId: String,
  twitterId: String,
  instagramId: String,
  googleId: String,
  vkontakteId: String,
  appleId: String,
  following: [{
    date: Date,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  }],
  fromgoogle: String,
  fromfacebook: String,
  fromlinkedin: String,
  frominstagram: String,
  fromother: String,
  signupProcess: String,
  categoryList: Array,
  birthday: Date,
  phone: String,
  postenable: String,
  tax: String,
  viewers: [{
    ip: String,
    date: Date
  }],
  contentviews: Number,
  earning: [{
    balance: {
      type: Number,
      "default": 0
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    date: Date
  }]
}, {
  timestamps: true
}); //Hash password with bcrypt before saving

userSchema.pre("save", function (next) {
  var user = this;
  var SALT_FACTOR = 12;
  if (!user.isModified("password")) return next();

  _bcryptNodejs["default"].genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);

    _bcryptNodejs["default"].hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  _bcryptNodejs["default"].compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.gravatar = function (size, defaults) {
  if (!size) size = 200;
  if (!defaults) defaults = "retro";

  if (!this.email) {
    return "https://gravatar.com/avatar/?s=" + size + "&d=" + defaults;
  }

  var md5 = _crypto["default"].createHash("md5").update(this.email);

  return "https://gravatar.com/avatar/" + md5.digest("hex").toString() + "?s=" + size + "&d=" + defaults;
};

module.exports = _mongoose["default"].model("User", userSchema);