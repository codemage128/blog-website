"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var commentSchema = new Schema({
  slug: String,
  name: String,
  email: String,
  comment: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  articleId: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  },
  upvote: [{
    ip: String
  }],
  upvoteCount: Number,
  replies: [{
    name: String,
    email: String,
    reply: String,
    profilePicture: String,
    createdAt: {
      type: Date,
      "default": Date.now()
    }
  }],
  profilePicture: {
    type: String
  }
}, {
  timestamps: true
});
module.exports = _mongoose["default"].model('Comment', commentSchema);