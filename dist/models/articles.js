"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var articleSchema = new Schema({
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  addToNoIndex: Boolean,
  title: String,
  metatitle: String,
  metadescription: String,
  body: String,
  articleBody: {
    type: Schema.Types.ObjectId,
    ref: "Body"
  },
  articleTablecontent: String,
  file: String,
  slug: String,
  views: Number,
  dateViewed: Array,
  viewers: [{
    ip: String,
    date: Date
  }],
  tags: Array,
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "SubCategory"
  },
  active: {
    type: Boolean,
    "default": false
  },
  postType: {
    type: String,
    "enum": ["video", "audio", "post"]
  },
  summary: String,
  download: {
    type: Boolean
  },
  week: String,
  month: String,
  year: String,
  "short": String,
  qualify: {
    type: String,
    "default": "notqualify"
  },
  upvote: {
    count: {
      type: Number,
      "default": 0
    },
    users: [{
      date: Date,
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    }]
  } // downvote: {
  //   count: {
  //     type: Number,
  //     default: 0
  //   },
  //   users: [
  //     {
  //       type: Schema.Types.ObjectId,
  //       ref: "User"
  //     }
  //   ]
  // },

}, {
  timestamps: true
});
module.exports = _mongoose["default"].model("Article", articleSchema);