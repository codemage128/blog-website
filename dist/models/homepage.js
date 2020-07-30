"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var homePageSchema = new Schema({
  firstsection_title: String,
  firstsection_content: String,
  nutshell_title: String,
  nutshell_content: String,
  focus_title: String,
  focus_content: String,
  knowledge_title: String,
  knowledge_content: String,
  last_title: String,
  last_content: String
}, {
  timestamps: true
});
module.exports = _mongoose["default"].model('Homepage', homePageSchema);