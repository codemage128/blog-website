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

var _articles = _interopRequireDefault(require("../models/articles"));

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
    var userId, selectedString, articleId, tagId, url, article, textArray, saveText, newParagraph, articleBody, wholeText, newtext, payload, _textArray, _articleBody, _wholeText, _newtext, returndata;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userId = req.body.userId;
            selectedString = req.body.text;
            articleId = req.body.articleId;
            tagId = req.body.tagId;
            url = req.body.url;
            _context3.next = 7;
            return _articles["default"].findOne({
              _id: articleId
            });

          case 7:
            article = _context3.sent;
            textArray = [];
            _context3.next = 11;
            return _savetext["default"].find({
              articleId: articleId,
              userId: userId
            });

          case 11:
            saveText = _context3.sent;
            newParagraph = "";

            if (!(saveText.length == 0)) {
              _context3.next = 26;
              break;
            }

            console.log("This is the create part");
            articleBody = JSON.parse(article.body);
            wholeText = articleBody[tagId].data.text;
            newtext = '<mark class="cdx-marker">' + selectedString + '</mark>';
            newParagraph = wholeText.replace(selectedString, newtext);
            articleBody[tagId].data.text = newParagraph;
            textArray.push(newParagraph);
            payload = {
              userId: userId,
              text: textArray,
              articleId: articleId,
              url: url,
              articleBody: JSON.stringify(articleBody)
            };
            _context3.next = 24;
            return _savetext["default"].create(payload);

          case 24:
            _context3.next = 35;
            break;

          case 26:
            _textArray = saveText[0].text;
            _articleBody = JSON.parse(saveText[0].articleBody);
            _wholeText = _articleBody[tagId].data.text;
            _newtext = '<mark class="cdx-marker">' + selectedString + '</mark>';
            newParagraph = _wholeText.replace(selectedString, _newtext);
            _articleBody[tagId].data.text = newParagraph;

            _textArray.push(newParagraph);

            _context3.next = 35;
            return _savetext["default"].updateOne({
              _id: saveText[0].id
            }, {
              $set: {
                text: _textArray,
                articleBody: JSON.stringify(_articleBody)
              }
            });

          case 35:
            console.log(newParagraph);
            returndata = {
              "new": newParagraph
            };
            return _context3.abrupt("return", res.json(newParagraph));

          case 38:
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