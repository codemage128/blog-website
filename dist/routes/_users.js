"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _articles = _interopRequireDefault(require("../models/articles"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _role = _interopRequireDefault(require("../helpers/role"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _category = _interopRequireDefault(require("../models/category"));

var _users = _interopRequireDefault(require("../models/users"));

var _bookmark = _interopRequireDefault(require("../models/bookmark"));

var _savetext = _interopRequireDefault(require("../models/savetext"));

var router = _express["default"].Router();

router.get("/user/dashboard", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var totalPost, pendingPost;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _articles["default"].countDocuments({
              postedBy: req.user.id
            });

          case 3:
            totalPost = _context.sent;
            _context.next = 6;
            return _articles["default"].countDocuments({
              postedBy: req.user.id,
              active: false
            });

          case 6:
            pendingPost = _context.sent;
            res.render("./user/index", {
              title: "Dashboard",
              totalPost: totalPost,
              pendingPost: pendingPost
            });
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get("/user/posts/add-new", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var categories;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _category["default"].find({});

          case 2:
            categories = _context2.sent;

            try {
              res.render("./user/add-new-post", {
                title: "Article - Add new post",
                categories: categories
              });
            } catch (error) {
              next(error);
            }

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
router.get("/user/posts/add-new-audio", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            res.render("./user/add-new-audio", {
              title: "Audio - Add new Audio"
            });

          case 1:
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
router.get("/user/posts/add-new-video", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            res.render("./user/add-new-video", {
              title: "Video - Add new Video"
            });

          case 1:
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
router.get("/user/update-posts", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var perPage, page, category, article, coun, count, _perPage, _page, _article, _coun, _count, _perPage2, _page2, _article2, Updatearticle, _count2;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!req.query.category) {
              _context5.next = 16;
              break;
            }

            perPage = 10;
            page = req.query.page || 1;
            _context5.next = 5;
            return _category["default"].findOne({
              name: req.query.category
            });

          case 5:
            category = _context5.sent;
            _context5.next = 8;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
                $or: [{
                  category: _mongoose["default"].Types.ObjectId(category._id)
                }, {
                  subCategory: _mongoose["default"].Types.ObjectId(category._id)
                }]
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: perPage * page - perPage
            }, {
              $limit: perPage
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 8:
            article = _context5.sent;
            _context5.next = 11;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
                category: _mongoose["default"].Types.ObjectId(category._id)
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 11:
            coun = _context5.sent;
            count = coun.length;
            res.render("./user/update-post", {
              title: "Dashboard - Update Posts",
              article: article,
              current: page,
              pages: Math.ceil(count / perPage),
              query: "yes",
              searchName: req.query.category
            });
            _context5.next = 40;
            break;

          case 16:
            if (!req.query.q) {
              _context5.next = 29;
              break;
            }

            _perPage = 10;
            _page = req.query.page || 1;
            _context5.next = 21;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
                title: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: _perPage * _page - _perPage
            }, {
              $limit: _perPage
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 21:
            _article = _context5.sent;
            _context5.next = 24;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
                title: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 24:
            _coun = _context5.sent;
            _count = _coun.length;
            res.render("./user/update-post", {
              title: "Dashboard - update Posts",
              article: _article,
              current: _page,
              pages: Math.ceil(_count / _perPage),
              query: true,
              searchName: req.query.q
            });
            _context5.next = 40;
            break;

          case 29:
            _perPage2 = 10;
            _page2 = req.query.page || 1;
            _context5.next = 33;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id)
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: _perPage2 * _page2 - _perPage2
            }, {
              $limit: _perPage2
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, // Am not preserving comments because i need it to be an array to be able to get the length
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 33:
            _article2 = _context5.sent;
            Updatearticle = [];

            _article2.forEach(function (element) {
              var date = new Date();
              var seconds = Math.floor((date - element.createdAt) / 1000);
              var minutes = Math.floor(seconds / 60);
              var hours = Math.floor(minutes / 60);
              var days = Math.floor(hours / 24);

              if (days > 90) {
                Updatearticle.push(element);
              }
            });

            _context5.next = 38;
            return _articles["default"].countDocuments({
              postedBy: req.user.id
            });

          case 38:
            _count2 = _context5.sent;
            res.render("./user/update-post", {
              title: "All Posts",
              article: Updatearticle,
              current: _page2,
              pages: Math.ceil(_count2 / _perPage2),
              query: "no"
            });

          case 40:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}());
router.get("/user/all-posts", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var perPage, page, category, article, coun, count, _perPage3, _page3, _article3, _coun2, _count3, _perPage4, _page4, _article4, _count4;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!req.query.category) {
              _context6.next = 16;
              break;
            }

            perPage = 10;
            page = req.query.page || 1;
            _context6.next = 5;
            return _category["default"].findOne({
              name: req.query.category
            });

          case 5:
            category = _context6.sent;
            _context6.next = 8;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
                $or: [{
                  category: _mongoose["default"].Types.ObjectId(category._id)
                }, {
                  subCategory: _mongoose["default"].Types.ObjectId(category._id)
                }]
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: perPage * page - perPage
            }, {
              $limit: perPage
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 8:
            article = _context6.sent;
            _context6.next = 11;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
                category: _mongoose["default"].Types.ObjectId(category._id)
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 11:
            coun = _context6.sent;
            count = coun.length;
            res.render("./user/all-post", {
              title: "Dashboard - All Posts",
              article: article,
              current: page,
              pages: Math.ceil(count / perPage),
              query: "yes",
              searchName: req.query.category
            });
            _context6.next = 38;
            break;

          case 16:
            if (!req.query.q) {
              _context6.next = 29;
              break;
            }

            _perPage3 = 10;
            _page3 = req.query.page || 1;
            _context6.next = 21;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
                title: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: _perPage3 * _page3 - _perPage3
            }, {
              $limit: _perPage3
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 21:
            _article3 = _context6.sent;
            _context6.next = 24;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
                title: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 24:
            _coun2 = _context6.sent;
            _count3 = _coun2.length;
            res.render("./user/all-post", {
              title: "Dashboard - All Posts",
              article: _article3,
              current: _page3,
              pages: Math.ceil(_count3 / _perPage3),
              query: true,
              searchName: req.query.q
            });
            _context6.next = 38;
            break;

          case 29:
            _perPage4 = 10;
            _page4 = req.query.page || 1;
            _context6.next = 33;
            return _articles["default"].aggregate([{
              $match: {
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id)
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: _perPage4 * _page4 - _perPage4
            }, {
              $limit: _perPage4
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, // Am not preserving comments because i need it to be an array to be able to get the length
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 33:
            _article4 = _context6.sent;
            _context6.next = 36;
            return _articles["default"].countDocuments({
              postedBy: req.user.id
            });

          case 36:
            _count4 = _context6.sent;
            res.render("./user/all-post", {
              title: "All Posts",
              article: _article4,
              current: _page4,
              pages: Math.ceil(_count4 / _perPage4),
              query: "no"
            });

          case 38:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}());
router.get("/user/useful", _auth["default"], (0, _role["default"])('admin', 'user'), /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            res.render('./user/useful', {
              title: "Useful Tips"
            });

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}());
router.get("/user/all-posts/edit/:slug", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var article, articles;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return _articles["default"].findOne({
              postedBy: req.user.id,
              slug: req.params.slug
            }).populate("category");

          case 3:
            article = _context8.sent;
            if (!article) res.render("404");
            _context8.next = 7;
            return _articles["default"].find({
              postedBy: req.user._id
            });

          case 7:
            articles = _context8.sent;
            _context8.t0 = article.postType;
            _context8.next = _context8.t0 === "post" ? 11 : 13;
            break;

          case 11:
            res.render("./user/edit-post", {
              title: "Edit Post - ".concat(article.title),
              article: article,
              articleCount: articles.length
            });
            return _context8.abrupt("break", 14);

          case 13:
            return _context8.abrupt("break", 14);

          case 14:
            _context8.next = 19;
            break;

          case 16:
            _context8.prev = 16;
            _context8.t1 = _context8["catch"](0);
            next(_context8.t1);

          case 19:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 16]]);
  }));

  return function (_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}());
router.get("/user/pending-posts", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var perPage, page, category, article, coun, count, _perPage5, _page5, _article5, _coun3, _count5, _perPage6, _page6, _article6, _count6;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (!req.query.category) {
              _context9.next = 16;
              break;
            }

            perPage = 10;
            page = req.query.page || 1;
            _context9.next = 5;
            return _category["default"].findOne({
              name: req.query.category
            });

          case 5:
            category = _context9.sent;
            _context9.next = 8;
            return _articles["default"].aggregate([{
              $match: {
                active: false,
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
                $or: [{
                  category: _mongoose["default"].Types.ObjectId(category._id)
                }, {
                  subCategory: _mongoose["default"].Types.ObjectId(category._id)
                }]
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: perPage * page - perPage
            }, {
              $limit: perPage
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 8:
            article = _context9.sent;
            _context9.next = 11;
            return _articles["default"].aggregate([{
              $match: {
                active: false,
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
                category: _mongoose["default"].Types.ObjectId(category._id)
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 11:
            coun = _context9.sent;
            count = coun.length;
            res.render("./user/pending-post", {
              title: "Pending Posts",
              article: article,
              current: page,
              pages: Math.ceil(count / perPage),
              query: "yes",
              searchName: req.query.category
            });
            _context9.next = 38;
            break;

          case 16:
            if (!req.query.q) {
              _context9.next = 29;
              break;
            }

            _perPage5 = 10;
            _page5 = req.query.page || 1;
            _context9.next = 21;
            return _articles["default"].aggregate([{
              $match: {
                active: false,
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
                title: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: _perPage5 * _page5 - _perPage5
            }, {
              $limit: _perPage5
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 21:
            _article5 = _context9.sent;
            _context9.next = 24;
            return _articles["default"].aggregate([{
              $match: {
                active: false,
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id),
                title: {
                  $regex: req.query.q,
                  $options: "$i"
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 24:
            _coun3 = _context9.sent;
            _count5 = _coun3.length;
            res.render("./user/pending-post", {
              title: "Pending Posts",
              article: _article5,
              current: _page5,
              pages: Math.ceil(_count5 / _perPage5),
              query: true,
              searchName: req.query.q
            });
            _context9.next = 38;
            break;

          case 29:
            _perPage6 = 10;
            _page6 = req.query.page || 1;
            _context9.next = 33;
            return _articles["default"].aggregate([{
              $match: {
                active: false,
                postedBy: _mongoose["default"].Types.ObjectId(req.user.id)
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $skip: _perPage6 * _page6 - _perPage6
            }, {
              $limit: _perPage6
            }, {
              $lookup: {
                from: "comments",
                localField: "slug",
                foreignField: "slug",
                as: "comments"
              }
            }, // Am not preserving comments because i need it to be an array to be able to get the length
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            }, {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "users",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy"
              }
            }, {
              $unwind: {
                path: "$postedBy",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 33:
            _article6 = _context9.sent;
            _context9.next = 36;
            return _articles["default"].countDocuments({
              active: false,
              postedBy: req.user.id
            });

          case 36:
            _count6 = _context9.sent;
            res.render("./user/pending-post", {
              title: "Pending Posts",
              article: _article6,
              current: _page6,
              pages: Math.ceil(_count6 / _perPage6),
              query: "no"
            });

          case 38:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}());
router.get("/user/profile", _auth["default"], (0, _role["default"])("admin", "user"), function (req, res, next) {
  res.render("./user/profile", {
    title: "My Profile"
  });
});
router.get("/user/followers", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var user, user_following, following;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return _users["default"].findById(req.user.id);

          case 2:
            user = _context10.sent;
            user_following = user.following;
            following = [];
            user_following.forEach(function (element) {
              _users["default"].findById(element.user, function (error, user) {
                following.push(user);

                if (following.length == user_following.length) {
                  res.render("./user/followers", {
                    title: "Followers",
                    following: following
                  });
                }
              });
            });

          case 6:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}());
router.get("/user/following", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var followers;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return _users["default"].find({
              "following.user": {
                $in: req.user.id
              }
            }).populate("following").sort({
              createdAt: -1
            });

          case 2:
            followers = _context11.sent;
            res.render("./user/followings", {
              title: "Followings",
              followers: followers
            });

          case 4:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}());
router.get('/user/authorstatus', _auth["default"], /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var filter, _date, currentMonth, limitViews, lastMonthContentViews, thisMonthContentViews, increaseContenViews, upvote_lastmonth, upvote_thismonth, upvote_increase, userArticles, profile_lastmonth, profile_thismonth, profile_increase, follow_lastmonth, follow_thismonth, follow_increase, totalusers, statusCounts, filterdate, currentmonth, thismonthrank, lastmonthrank, _views, user, authorrank, upvotesCount, veiwsCount, articles, followers;

    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            filter = req.query.filter;
            _date = new Date(filter); // var date = new Date();
            // var currentMonth = date.getMonth();

            currentMonth = _date.getMonth() + 1;
            limitViews = 99999999;

            if (!req.query.filter) {
              currentMonth = new Date().getMonth();
            } //content views


            lastMonthContentViews = 0;
            thisMonthContentViews = 0;
            increaseContenViews = 0;
            upvote_lastmonth = 0;
            upvote_thismonth = 0;
            upvote_increase = 0;
            _context12.next = 13;
            return _articles["default"].find({
              postedBy: req.user.id
            });

          case 13:
            userArticles = _context12.sent;
            userArticles.forEach(function (element) {
              element.viewers.forEach(function (item) {
                var viewMonth = item.date.getMonth() + 1;

                if (currentMonth == viewMonth) {
                  thisMonthContentViews++;
                } else if (viewMonth + 1 == currentMonth) {
                  lastMonthContentViews++;
                }
              });
              element.upvote.users.forEach(function (item) {
                var viewMonth = item.date.getMonth() + 1;

                if (currentMonth == viewMonth) {
                  upvote_thismonth++;
                } else if (viewMonth + 1 == currentMonth) {
                  upvote_lastmonth++;
                }
              });
            });

            if (lastMonthContentViews == 0) {
              increaseContenViews = ((thisMonthContentViews + limitViews) / limitViews * 100).toFixed(2);
            } else {
              increaseContenViews = ((thisMonthContentViews - lastMonthContentViews) / lastMonthContentViews * 100).toFixed(2);
            }

            if (upvote_lastmonth == 0) {
              upvote_increase = ((upvote_thismonth + limitViews) / limitViews * 100).toFixed(2);
            } else {
              upvote_increase = ((upvote_thismonth - upvote_lastmonth) / upvote_lastmonth * 100).toFixed(2);
            } // profile views


            profile_lastmonth = 0;
            profile_thismonth = 0;
            profile_increase = 0;
            follow_lastmonth = 0;
            follow_thismonth = 0;
            follow_increase = 0;
            _context12.next = 25;
            return _users["default"].find({
              _id: req.user.id
            });

          case 25:
            totalusers = _context12.sent;
            totalusers.forEach(function (element) {
              element.viewers.forEach(function (item) {
                var viewMonth = item.date.getMonth() + 1;

                if (currentMonth == viewMonth) {
                  profile_thismonth++;
                } else if (viewMonth + 1 == currentMonth) {
                  profile_lastmonth++;
                }
              });
              element.following.forEach(function (item) {
                var viewMonth = item.date.getMonth() + 1;

                if (currentMonth == viewMonth) {
                  follow_thismonth++;
                } else if (viewMonth + 1 == currentMonth) {
                  follow_lastmonth++;
                }
              });
            });

            if (profile_lastmonth == 0) {
              profile_increase = ((profile_thismonth + limitViews) / limitViews * 100).toFixed(2);
            } else {
              profile_increase = ((profile_thismonth - profile_lastmonth) / profile_lastmonth * 100).toFixed(2);
            }

            if (follow_thismonth == 0) {
              follow_increase = ((follow_thismonth + limitViews) / limitViews * 100).toFixed(2);
            } else {
              follow_increase = ((follow_thismonth - follow_lastmonth) / follow_lastmonth * 100).toFixed(2);
            }

            follow_increase = follow_thismonth - follow_lastmonth;
            statusCounts = {
              contentView: {
                count: thisMonthContentViews,
                increase: increaseContenViews
              },
              profileView: {
                count: profile_thismonth,
                increase: profile_increase
              },
              upvote: {
                count: upvote_thismonth,
                increase: upvote_increase
              },
              follow: {
                count: follow_thismonth,
                increase: follow_increase
              }
            };
            filterdate = new Date(req.query.filter);
            currentmonth = filterdate.getMonth() + 1;
            thismonthrank = -1;
            lastmonthrank = -1;
            _views = 0;
            _context12.next = 38;
            return _users["default"].find({}).sort({
              contentviews: -1
            });

          case 38:
            user = _context12.sent;
            authorrank = -1;
            user.forEach(function (element, index) {
              if (element.id == req.user.id) {
                authorrank = index + 1;
              }
            });
            upvotesCount = 0;
            veiwsCount = 0;
            _context12.next = 45;
            return _articles["default"].find({
              postedBy: req.user.id
            });

          case 45:
            articles = _context12.sent;
            articles.forEach(function (element) {
              upvotesCount = element.upvote.count;
              veiwsCount = element.views;
            });
            _context12.next = 49;
            return _users["default"].countDocuments({
              _id: req.user.id
            }).populate("following").sort({
              createdAt: -1
            });

          case 49:
            followers = _context12.sent;
            res.render("./user/author", {
              title: "Dashboard",
              statusCounts: statusCounts,
              authorrank: authorrank
            });

          case 51:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}());
router.get('/user/payout', /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var user, earningList, result, total, i, reader, payload;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _users["default"].findOne({
              _id: req.user.id
            });

          case 2:
            user = _context13.sent;
            earningList = user.earning;
            result = [];
            total = 0;
            i = 0;

          case 7:
            if (!(i < earningList.length)) {
              _context13.next = 17;
              break;
            }

            _context13.next = 10;
            return _users["default"].findOne({
              _id: earningList[i].user
            });

          case 10:
            reader = _context13.sent;
            payload = {
              reader: reader,
              balance: earningList[i].balance,
              date: earningList[i].date
            };
            total = total + earningList[i].balance;
            result.push(payload);

          case 14:
            i++;
            _context13.next = 7;
            break;

          case 17:
            res.render("./user/payout", {
              title: "User-Payout",
              earningList: result,
              total: total
            });

          case 18:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x37, _x38, _x39) {
    return _ref13.apply(this, arguments);
  };
}());
router.get("/user/bookmarks", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    var bookmark;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return _bookmark["default"].find({
              userId: req.user.id
            }).populate({
              path: "articleId",
              populate: {
                path: "postedBy category"
              }
            }).sort({
              createdAt: -1
            });

          case 2:
            bookmark = _context14.sent;
            res.render("./user/bookmark", {
              title: "Reading List",
              bookmark: bookmark
            });

          case 4:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x40, _x41, _x42) {
    return _ref14.apply(this, arguments);
  };
}());
router.get("/user/marking", _auth["default"], (0, _role["default"])("admin", "user"), /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
    var marking;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return _savetext["default"].find({
              userId: req.user.id
            }).populate({
              path: "articleId"
            }).sort({
              createdAt: -1
            });

          case 2:
            marking = _context15.sent;
            res.render("./user/marking", {
              title: "Marking List",
              marking: marking
            });

          case 4:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x43, _x44, _x45) {
    return _ref15.apply(this, arguments);
  };
}());
module.exports = router;