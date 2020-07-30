"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var countingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  },
  spentTime: Number,
  authorName: String
}, {
  timestamps: true
});

var _default = _mongoose["default"].model("counting", countingSchema);

exports["default"] = _default;