"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _bookmark = _interopRequireDefault(require("../models/bookmark"));

var _savetext = _interopRequireDefault(require("../models/savetext"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var router = _express["default"].Router(); // Add a new article to reading list


router.get("/bookmark/create", _auth["default"], /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var check;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _bookmark["default"].findOne({
              articleId: req.query.articleId,
              userId: req.user.id
            });

          case 2:
            check = _context.sent;

            if (!check) {
              _context.next = 6;
              break;
            }

            req.flash("success_msg", "Article already exist in your reading list");
            return _context.abrupt("return", res.redirect("back"));

          case 6:
            _context.next = 8;
            return _bookmark["default"].create({
              articleId: req.query.articleId,
              userId: req.user.id
            });

          case 8:
            req.flash("success_msg", "Article has been added to reading list");
            return _context.abrupt("return", res.redirect("back"));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Remove an article from reading list

router.get("/bookmark/delete", _auth["default"], /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _bookmark["default"].deleteOne({
              _id: req.query.bookmarkId
            });

          case 2:
            req.flash("success_msg", "Article has been removed from reading list");
            return _context2.abrupt("return", res.redirect("back"));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.post("/savetext", _auth["default"], /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var userId, selectedString, articleId, saveText, textArray, payload, _textArray;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userId = req.body.userId;
            selectedString = req.body.text;
            articleId = req.body.articleId;
            _context3.next = 5;
            return _savetext["default"].find({
              articleId: articleId,
              userId: userId
            });

          case 5:
            saveText = _context3.sent;

            if (!(saveText.length == 0)) {
              _context3.next = 14;
              break;
            }

            textArray = [];
            textArray.push(selectedString);
            payload = {
              userId: userId,
              text: textArray,
              articleId: articleId
            };
            _context3.next = 12;
            return _savetext["default"].create(payload);

          case 12:
            _context3.next = 18;
            break;

          case 14:
            _textArray = saveText[0].text;

            _textArray.push(selectedString);

            _context3.next = 18;
            return _savetext["default"].updateOne({
              _id: saveText[0].id
            }, {
              text: _textArray
            });

          case 18:
            res.json("successful");

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.get('/savetext/delete', _auth["default"], /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log(req.query.markingId);
            _context4.next = 3;
            return _savetext["default"].deleteOne({
              _id: req.query.markingId
            });

          case 3:
            req.flash("success_msg", "Marking has been removed from marking list");
            return _context4.abrupt("return", res.redirect("back"));

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;