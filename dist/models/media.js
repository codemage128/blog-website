"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var mediaSchema = new Schema({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  file: String // file_type: String,
  // file_size: Number,
  // file_extension: String,
  // postedBy: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'User'
  // }

}, {
  timestamps: true
});
module.exports = _mongoose["default"].model('Media', mediaSchema);