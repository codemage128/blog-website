"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var subscriptionSchema = new Schema({
  stripesessionId: {
    type: Schema.Types.ObjectId,
    ref: "Stripesession"
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  startDate: Date,
  expireDate: Date
}, {
  timestamps: true
});

var _default = _mongoose["default"].model("Subscription", subscriptionSchema);

exports["default"] = _default;