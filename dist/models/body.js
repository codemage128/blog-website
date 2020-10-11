"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var bodySchema = new Schema({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  },
  html: String
}, {
  timestamps: true
});

var _default = _mongoose["default"].model("body", bodySchema);

exports["default"] = _default;