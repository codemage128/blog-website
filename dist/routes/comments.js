"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _comment = _interopRequireDefault(require("../models/comment"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _crypto = _interopRequireDefault(require("crypto"));

var _settings = _interopRequireDefault(require("../models/settings"));

var router = _express["default"].Router(); // Create a new comment


router.post('/comment', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var set, ipAddress, payload;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _settings["default"].findOne();

          case 2:
            set = _context.sent;

            try {
              ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
              payload = {
                name: req.body.name,
                email: req.body.email,
                comment: req.body.comment,
                articleId: req.body.articleId,
                userId: req.body.userId,
                upvoteCount: 0,
                profilePicture: req.body.profilePicture // 'https://gravatar.com/avatar/' +
                // crypto
                // 	.createHash('md5')
                // 	.update(req.body.email)
                // 	.digest('hex')
                // 	.toString() +
                // '?s=200' +
                // '&d=retro',

              };

              _comment["default"].create(payload).then(function (done) {
                // res.send({data: done});
                res.redirect('back');
              })["catch"](function (e) {
                return next(e);
              });
            } catch (error) {
              next(error);
            }

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Upvote to a comment

router.post("/comment/upvote", /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var commentId, ipAddress, comment, indexof, payload;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            commentId = req.body.commentId;
            ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            _context2.next = 4;
            return _comment["default"].findOne({
              _id: commentId
            });

          case 4:
            comment = _context2.sent;
            indexof = -1;
            comment.upvote.forEach(function (element) {
              if (element.ip == ipAddress) {
                indexof = 1;
              }
            });
            payload = {
              ip: ipAddress
            };

            if (!(indexof == -1)) {
              _context2.next = 14;
              break;
            }

            _context2.next = 11;
            return _comment["default"].updateOne({
              _id: commentId
            }, {
              $push: {
                upvote: payload
              },
              $inc: {
                upvoteCount: 1
              }
            });

          case 11:
            _context2.next = 13;
            return _comment["default"].findOne({
              _id: commentId
            });

          case 13:
            comment = _context2.sent;

          case 14:
            res.json(comment.upvoteCount);

          case 15:
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
router.post('/delete', function (req, res, next) {
  var commentId = req.body.commentId;

  _comment["default"].deleteOne({
    _id: commentId
  }).then(function (result) {
    res.json(true);
  });
}); // Reply to a comment

router.post('/reply', function (req, res, next) {
  try {
    var payload = {
      name: req.body.name,
      email: req.body.email,
      reply: req.body.reply,
      profilePicture: req.body.profilePicture // 'https://gravatar.com/avatar/' +
      // crypto
      // 	.createHash('md5')
      // 	.update(req.body.email)
      // 	.digest('hex')
      // 	.toString() +
      // '?s=200' +
      // '&d=retro',

    };

    _comment["default"].updateOne({
      _id: req.body.commentId
    }, {
      $push: {
        replies: payload
      }
    }).then(function (replied) {
      // res.status(200).send('Replied successfully');
      // res.send('Replied successfully');
      res.redirect('back');
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
});
router.post('/comment/deleteMany', _auth["default"], function (req, res, next) {
  try {
    _comment["default"].deleteMany({
      _id: req.body.ids
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash('success_msg', 'Nothing was Deleted');
        return res.redirect('back');
      } else {
        req.flash('success_msg', 'Comment has been Deleted');
        return res.redirect('back');
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;