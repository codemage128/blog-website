"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _Schema;

var Schema = _mongoose["default"].Schema;
var stripe_sessionSchema = new Schema((_Schema = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  id: String,
  object: String,
  billing_address: String,
  cancel_url: String,
  client_reference_id: String,
  customer: String,
  customer_email: String,
  display_items: Array,
  livemode: Boolean,
  locale: String
}, (0, _defineProperty2["default"])(_Schema, "locale", String), (0, _defineProperty2["default"])(_Schema, "metadata", Object), (0, _defineProperty2["default"])(_Schema, "mode", String), (0, _defineProperty2["default"])(_Schema, "payment_intent", String), (0, _defineProperty2["default"])(_Schema, "payment_method_types", Array), (0, _defineProperty2["default"])(_Schema, "setup_intent", String), (0, _defineProperty2["default"])(_Schema, "shipping", String), (0, _defineProperty2["default"])(_Schema, "shipping_address_collection", String), (0, _defineProperty2["default"])(_Schema, "submit_type", String), (0, _defineProperty2["default"])(_Schema, "subscription", String), (0, _defineProperty2["default"])(_Schema, "success_url", String), (0, _defineProperty2["default"])(_Schema, "line_items", Array), _Schema), {
  timestamps: true
});

var _default = _mongoose["default"].model("Stripesession", stripe_sessionSchema);

exports["default"] = _default;