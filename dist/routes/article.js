"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _users = _interopRequireDefault(require("../models/users"));

var _articles = _interopRequireDefault(require("../models/articles"));

var _category = _interopRequireDefault(require("../models/category"));

var _comment = _interopRequireDefault(require("../models/comment"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _htmlToText = _interopRequireDefault(require("html-to-text"));

var _install = _interopRequireDefault(require("../helpers/install"));

var _flag = _interopRequireDefault(require("../models/flag"));

var _bookmark = _interopRequireDefault(require("../models/bookmark"));

var _bodyParser = require("body-parser");

var edjsHTML = require("editorjs-html");

var edjsParser = edjsHTML();

var router = _express["default"].Router(); // Create a new article


router.post("/article/create", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var article_header, receive, data, user, article_title, search, real, array, articleslug, meta_title, meta_description, set, newDate, months, parse, html, payload1;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            article_header = req.body.article_header;
            receive = JSON.parse(req.body.data);
            data = receive.blocks;
            _context.next = 5;
            return _users["default"].findById({
              _id: req.user.id
            });

          case 5:
            user = _context.sent;
            article_title = "";
            data.forEach(function (block) {
              switch (block.type) {
                case "header":
                  console.log(block.data.level);

                  if (block.data.level == 1) {
                    article_title = block.data.text;
                  }

                  break;
              }
            });

            if (!(article_title == "")) {
              _context.next = 15;
              break;
            }

            req.flash("success_msg", "You have to create the title!");

            if (!(user.roleId == "user")) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("return", res.redirect("/user/all-posts"));

          case 14:
            return _context.abrupt("return", res.redirect("/admin/all-posts"));

          case 15:
            _context.next = 17;
            return _articles["default"].find({
              title: article_title
            });

          case 17:
            search = _context.sent;
            real = search !== "" ? article_title.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-") + "-" + search.length : article_title.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-");
            array = real.split('');
            array.forEach(function (element, index) {
              if (element == "ß") {
                array[index] = "ss";
              }

              if (element == "ö") {
                array[index] = "oe";
              }

              if (element == "ä") {
                array[index] = "ae";
              }

              if (element == "ü") {
                array[index] = "ue";
              }
            });
            articleslug = array.join("");
            meta_title = "";
            meta_description = "";

            if (req.user.roleId == "admin") {
              articleslug = req.body.slug ? req.body.slug : articleslug;
              meta_description = req.body.meta_description;
              meta_title = req.body.meta_title;
            } // let content = req.body.body;
            // let textLength = content.split(/\s/g).length;


            _context.next = 27;
            return _settings["default"].findOne();

          case 27:
            set = _context.sent;

            Date.prototype.getWeek = function () {
              var dt = new Date(this.getFullYear(), 0, 1);
              return Math.ceil(((this - dt) / 86400000 + dt.getDay() + 1) / 7);
            };

            newDate = new Date(); //List months cos js months starts from zero to 11

            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            try {
              parse = edjsParser.parse(receive);
              html = "";
              parse.forEach(function (element) {
                html = html + element;
              });
              payload1 = {
                week: "".concat(newDate.getWeek()),
                month: "".concat(months[newDate.getMonth()]),
                year: "".concat(newDate.getFullYear()),
                title: article_title,
                body: JSON.stringify(data),
                summary: req.body.summary.trim(),
                "short": _htmlToText["default"].fromString(html, {
                  wordwrap: false
                }),
                slug: articleslug,
                category: req.body.category,
                file: article_header,
                postedBy: req.user.id,
                postType: "post",
                metatitle: meta_title,
                metadescription: meta_description
              };
              payload1.active = true;

              _articles["default"].create(payload1).then(function (created) {
                console.log(user.roleId);
                req.flash("success_msg", "New article has been posted successfully");

                if (user.roleId == "user") {
                  return res.redirect("/user/all-posts");
                } else {
                  return res.redirect("/dashboard/all-posts");
                }
              })["catch"](function (e) {
                return next(e);
              });
            } catch (error) {
              next(error);
            }

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Edit an Article

router.post("/article/edit", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var receive, data, user, article_title, search, slug, real, array, articleslug, meta_title, meta_description, parse, html, body, _short, date, article, article_header;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            receive = JSON.parse(req.body.data);
            data = receive.blocks;
            _context2.next = 5;
            return _users["default"].findById({
              _id: req.user.id
            });

          case 5:
            user = _context2.sent;
            data.forEach(function (block) {
              switch (block.type) {
                case "header":
                  if (block.data.level == 1) {
                    article_title = block.data.text;
                  }

                  break;
              }
            });
            _context2.next = 9;
            return _articles["default"].find({
              title: article_title
            });

          case 9:
            search = _context2.sent;
            console.log(slug);
            _context2.next = 13;
            return _articles["default"].findOne({
              slug: req.body.slug
            });

          case 13:
            slug = _context2.sent;

            if (!slug) {
              _context2.next = 18;
              break;
            }

            req.flash("success_msg", "That slug has been used, pls used another slug or just leave the field empty");
            console.log('asdfsfd');
            return _context2.abrupt("return", res.redirect("back"));

          case 18:
            real = search !== "" ? article_title.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-") + "-" + search.length : article_title.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-");
            array = real.split('');
            array.forEach(function (element, index) {
              if (element == "ß") {
                array[index] = "ss";
              }

              if (element == "ö") {
                array[index] = "oe";
              }

              if (element == "ä") {
                array[index] = "ae";
              }

              if (element == "ü") {
                array[index] = "ue";
              }
            });
            articleslug = array.join(""); // let content = req.body.body;
            // let textLength = content.split(/\s/g).length;
            // if (textLength < 200) {
            //   req.flash(
            //     "success_msg",
            //     "Das sieht doch garnicht mal so schlecht aus! Dennoch solltest du mindestens 200 Wörter schreiben, um deinen Lesern einen Mehrwert zu bieten"
            //   );
            //   return res.redirect("back");
            // }

            meta_title = "";
            meta_description = "";

            if (req.user.roleId == "admin") {
              articleslug = req.body.slug ? req.body.slug : articleslug;
              meta_description = req.body.meta_description;
              meta_title = req.body.meta_title;
            }

            parse = edjsParser.parse(receive);
            html = "";
            parse.forEach(function (element) {
              html = html + element;
            });
            body = JSON.stringify(data);
            _short = _htmlToText["default"].fromString(html, {
              wordwrap: false
            }); // if (req.user.roleId == "admin") {
            //   req.body.active = !req.body.status
            //     ? true
            //     : req.body.status == "activate"
            //       ? true
            //       : false;
            // } else {
            //   // req.body.active = set.approveUpdatedUserPost == false ? false : true;
            //   req.body.active = true;
            // }

            date = new Date();
            _context2.next = 33;
            return _articles["default"].findOne({
              _id: req.body.articleId
            });

          case 33:
            article = _context2.sent;
            article_header = req.body.article_header ? req.body.article_header : article.file;

            _articles["default"].updateOne({
              _id: req.body.articleId.trim()
            }, {
              $set: {
                title: article_title,
                slug: articleslug,
                "short": _short,
                body: body,
                updatedAt: date,
                category: req.body.category,
                summary: req.body.summary,
                file: article_header,
                metatitle: meta_title,
                metadescription: meta_description
              }
            }).then(function (updated) {
              req.flash("success_msg", "Article has been updated successfully");

              if (req.user.roleId == "admin") {
                return res.redirect("/dashboard/all-posts/");
              } else {
                return res.redirect("/user/all-posts/");
              }
            })["catch"](function (e) {
              return next(e);
            });

            _context2.next = 41;
            break;

          case 38:
            _context2.prev = 38;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 41:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 38]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()); // Delete an Article

router.post("/article/delete", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var article;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _articles["default"].findById(req.body.articleId);

          case 3:
            article = _context3.sent;

            _comment["default"].deleteMany({
              slug: article.slug
            }).then(function (deleted) {
              _articles["default"].deleteOne({
                _id: req.body.articleId.trim()
              }).then(function (deleted) {
                req.flash("success_msg", "Article has been Deleted");
              })["catch"](function (e) {
                return next(e);
              });
            })["catch"](function (e) {
              return next(e);
            });

            _comment["default"].deleteMany({});

            _context3.next = 11;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 8]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}()); // Delete Many Articles

router.post("/article/deletemany", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _comment["default"].deleteMany({
              articleId: req.body.ids
            });

          case 3:
            _context4.next = 5;
            return _articles["default"].deleteMany({
              _id: req.body.ids
            });

          case 5:
            if (req.body.ids) {
              _context4.next = 10;
              break;
            }

            req.flash("success_msg", "Nothing Has Been Deleted");
            return _context4.abrupt("return", res.redirect('back'));

          case 10:
            req.flash("success_msg", "Posts Has Been Deleted");
            return _context4.abrupt("return", res.redirect('back'));

          case 12:
            _context4.next = 17;
            break;

          case 14:
            _context4.prev = 14;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 14]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}()); // Activate Many Articles

router.post("/article/activateMany", _install["default"].redirectToLogin, _auth["default"], function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        active: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Has Been Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Published");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Deactivate Many Articles

router.post("/article/deactivateMany", _install["default"].redirectToLogin, _auth["default"], function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        active: false
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Has Been Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Saved to Draft");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
});
router.get("/p/:category/:slug", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var settings, user, slug, category, article, nextarticle, previousarticle, bookmark, book, art, _next, previous, featured, popular, recommended, _length, r, related, d, customDate, ips, articleCount, indexof, view_article, ip, payload, _view_article;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _settings["default"].findOne();

          case 3:
            settings = _context5.sent;
            user = req.params.user;
            slug = req.params.slug;
            category = req.params.category;
            _context5.next = 9;
            return _articles["default"].aggregate([{
              $match: {
                active: true,
                slug: req.params.slug
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
                from: "categories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subCategory"
              }
            }, {
              $unwind: {
                path: "$subCategory",
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
            }, {
              $lookup: {
                from: "comments",
                "let": {
                  indicator_id: "$_id"
                },
                as: "comments",
                pipeline: [{
                  $match: {
                    $expr: {
                      $eq: ["$articleId", "$$indicator_id"]
                    },
                    active: true
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }]
              }
            }]);

          case 9:
            article = _context5.sent;

            if (!(article == "")) {
              _context5.next = 14;
              break;
            }

            res.render("404");
            _context5.next = 89;
            break;

          case 14:
            nextarticle = [];
            previousarticle = [];

            if (!(typeof req.user !== "undefined")) {
              _context5.next = 22;
              break;
            }

            _context5.next = 19;
            return _bookmark["default"].findOne({
              userId: req.user.id,
              articleId: article[0]._id
            });

          case 19:
            _context5.t0 = _context5.sent;
            _context5.next = 23;
            break;

          case 22:
            _context5.t0 = false;

          case 23:
            bookmark = _context5.t0;
            book = bookmark ? true : false;
            _context5.next = 27;
            return _articles["default"].findOne({
              slug: req.params.slug,
              active: true
            });

          case 27:
            art = _context5.sent;
            _context5.next = 30;
            return _articles["default"].find({
              active: true,
              _id: {
                $gt: article[0]._id
              },
              category: article[0].category._id,
              postedBy: article[0].postedBy._id
            }).populate("category").populate("postedBy").sort({
              createdAt: 1
            });

          case 30:
            _next = _context5.sent;

            _next.forEach(function (item) {
              if (item.category.slug != "official") {
                nextarticle.push(item);
              }
            });

            if (!(_next.length == 0)) {
              _context5.next = 37;
              break;
            }

            _context5.next = 35;
            return _articles["default"].find({
              active: true
            }).populate("category").populate("postedBy").sort({
              createdAt: 1
            });

          case 35:
            _next = _context5.sent;

            _next.forEach(function (item) {
              if (item.category.slug != "official") {
                nextarticle.push(item);
              }
            });

          case 37:
            _context5.next = 39;
            return _articles["default"].find({
              active: true,
              _id: {
                $lt: article[0]._id
              },
              category: article[0].category._id,
              postedBy: article[0].postedBy._id
            }).populate("category").populate('postedBy').sort({
              createdAt: 1
            });

          case 39:
            previous = _context5.sent;
            previous.forEach(function (item) {
              if (item.category.slug != "official") {
                previousarticle.push(item);
              }
            });

            if (!(previous.length == 0)) {
              _context5.next = 46;
              break;
            }

            _context5.next = 44;
            return _articles["default"].find({
              active: true
            }).populate("category").populate("postedBy").sort({
              createdAt: 1
            });

          case 44:
            previous = _context5.sent;
            previous.forEach(function (item) {
              if (item.category.slug != "official") {
                previousarticle.push(item);
              }
            });

          case 46:
            _context5.next = 48;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              },
              addToFeatured: true
            }).populate("category").sort({
              createdAt: -1
            }).limit(5);

          case 48:
            featured = _context5.sent;
            _context5.next = 51;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            }).sort({
              views: -1
            }).limit(3);

          case 51:
            popular = _context5.sent;
            _context5.next = 54;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              },
              addToRecommended: true
            }).populate("category").sort({
              createdAt: -1
            }).limit(12);

          case 54:
            recommended = _context5.sent;
            _context5.next = 57;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            });

          case 57:
            _length = _context5.sent;
            r = Math.floor(Math.random() * _length.length);
            _context5.next = 61;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            }).populate("postedBy").populate("category").sort({
              createdAt: -1
            }).limit(3).skip(r);

          case 61:
            related = _context5.sent;
            d = new Date();
            customDate = "".concat(d.getDate(), "/").concat(d.getMonth(), "/").concat(d.getFullYear());
            ips = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            _context5.next = 67;
            return _articles["default"].countDocuments();

          case 67:
            articleCount = _context5.sent;
            indexof = -1;
            art.viewers.forEach(function (element) {
              if (element.ip == ips) {
                indexof = 1;
              }
            });

            if (!(indexof !== -1)) {
              _context5.next = 77;
              break;
            }

            _context5.next = 73;
            return _articles["default"].findOne({
              slug: req.params.slug.trim()
            }).populate("postedBy").populate('category');

          case 73:
            view_article = _context5.sent;
            res.render("single", {
              articleCount: articleCount,
              title: article[0].title,
              article: view_article,
              settings: settings,
              previous: previousarticle[0],
              next: nextarticle[0],
              featured: featured,
              popular: popular,
              recommended: recommended,
              related: related,
              bookmark: book,
              bookmarkId: bookmark == null ? null : bookmark._id
            });
            _context5.next = 89;
            break;

          case 77:
            ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            payload = {
              ip: ip,
              date: new Date()
            };
            _context5.next = 81;
            return _users["default"].updateOne({
              _id: art.postedBy
            }, {
              $inc: {
                contentviews: 1
              }
            });

          case 81:
            _context5.next = 83;
            return _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $push: {
                viewers: payload
              }
            });

          case 83:
            _context5.next = 85;
            return _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $inc: {
                views: 1
              }
            });

          case 85:
            _context5.next = 87;
            return _articles["default"].findOne({
              slug: req.params.slug.trim()
            }).populate("postedBy").populate('category');

          case 87:
            _view_article = _context5.sent;
            res.render("single", {
              articleCount: articleCount,
              title: article[0].title,
              article: _view_article,
              settings: settings,
              previous: previousarticle[0],
              next: nextarticle[0],
              featured: featured,
              popular: popular,
              recommended: recommended,
              related: related,
              bookmark: book,
              bookmarkId: bookmark == null ? null : bookmark._id
            }); // Article.updateOne(
            //   { slug: req.params.slug.trim() },
            //   { $inc: { views: 1 } }
            // ).then(views => {
            //   res.render("single", {
            //     articleCount: articleCount,
            //     title: article[0].title,
            //     article: article[0],
            //     settings: settings,
            //     previous: previousarticle[0],
            //     next: nextarticle[0],
            //     featured: featured,
            //     popular: popular,
            //     recommended: recommended,
            //     related: related,
            //     bookmark: book,
            //     bookmarkId: bookmark == null ? null : bookmark._id
            //   });
            // })
            //   .catch(err => next(err));

          case 89:
            _context5.next = 94;
            break;

          case 91:
            _context5.prev = 91;
            _context5.t1 = _context5["catch"](0);
            next(_context5.t1);

          case 94:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 91]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}()); // Get single article page

router.get("/d/:category/:slug", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var settings, article, bookmark, book, art, _next2, index, previous, _index, featured, popular, recommended, related, d, customDate, ips, articleCount, indexof, ip, payload;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return _settings["default"].findOne();

          case 3:
            settings = _context6.sent;
            _context6.next = 6;
            return _articles["default"].aggregate([{
              $match: {
                active: true,
                slug: req.params.slug
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
                from: "categories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subCategory"
              }
            }, {
              $unwind: {
                path: "$subCategory",
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
            }, {
              $lookup: {
                from: "comments",
                "let": {
                  indicator_id: "$_id"
                },
                as: "comments",
                pipeline: [{
                  $match: {
                    $expr: {
                      $eq: ["$articleId", "$$indicator_id"]
                    },
                    active: true
                  }
                }, {
                  $sort: {
                    createdAt: -1
                  }
                }]
              }
            }]);

          case 6:
            article = _context6.sent;

            if (!(article == "")) {
              _context6.next = 11;
              break;
            }

            res.render("404");
            _context6.next = 68;
            break;

          case 11:
            if (!(typeof req.user !== "undefined")) {
              _context6.next = 17;
              break;
            }

            _context6.next = 14;
            return _bookmark["default"].findOne({
              userId: req.user.id,
              articleId: article[0]._id
            });

          case 14:
            _context6.t0 = _context6.sent;
            _context6.next = 18;
            break;

          case 17:
            _context6.t0 = false;

          case 18:
            bookmark = _context6.t0;
            book = bookmark ? true : false;
            _context6.next = 22;
            return _articles["default"].findOne({
              slug: req.params.slug,
              active: true
            });

          case 22:
            art = _context6.sent;
            _context6.next = 25;
            return _articles["default"].find({
              active: true,
              _id: {
                $gt: article[0]._id
              },
              category: article[0].category._id,
              postedBy: article[0].postedBy._id
            }).populate("category").populate("postedBy").sort({
              _id: 1
            }).limit(1);

          case 25:
            _next2 = _context6.sent;

            if (!(_next2.length == 0)) {
              _context6.next = 31;
              break;
            }

            index = Math.floor(Math.random() * 100 % 28);
            _context6.next = 30;
            return _articles["default"].find({
              active: true
            }).populate("category").populate("postedBy").sort({
              _id: 1
            }).limit(1).skip(index);

          case 30:
            _next2 = _context6.sent;

          case 31:
            _context6.next = 33;
            return _articles["default"].find({
              active: true,
              _id: {
                $lt: article[0]._id
              },
              category: article[0].category._id,
              postedBy: article[0].postedBy._id
            }).populate("category").populate('postedBy').sort({
              _id: 1
            }).limit(1);

          case 33:
            previous = _context6.sent;

            if (!(previous.length == 0)) {
              _context6.next = 39;
              break;
            }

            _index = Math.floor(Math.random() * 100 % 28);
            _context6.next = 38;
            return _articles["default"].find({
              active: true
            }).populate("category").populate("postedBy").sort({
              _id: 1
            }).limit(1).skip(_index);

          case 38:
            previous = _context6.sent;

          case 39:
            _context6.next = 41;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              },
              addToFeatured: true
            }).populate("category").sort({
              createdAt: -1
            }).limit(5);

          case 41:
            featured = _context6.sent;
            _context6.next = 44;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            }).sort({
              views: -1
            }).limit(3);

          case 44:
            popular = _context6.sent;
            _context6.next = 47;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              },
              addToRecommended: true
            }).populate("category").sort({
              createdAt: -1
            }).limit(12);

          case 47:
            recommended = _context6.sent;
            _context6.next = 50;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            }).populate("postedBy").populate("category").sort({
              createdAt: -1
            }).limit(3);

          case 50:
            related = _context6.sent;
            d = new Date();
            customDate = "".concat(d.getDate(), "/").concat(d.getMonth(), "/").concat(d.getFullYear());
            ips = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            _context6.next = 56;
            return _articles["default"].countDocuments();

          case 56:
            articleCount = _context6.sent;
            indexof = -1;
            art.viewers.forEach(function (element) {
              if (element.ip == ips) {
                indexof = 1;
              }
            });

            if (!(indexof !== -1)) {
              _context6.next = 63;
              break;
            }

            res.render("single", {
              articleCount: articleCount,
              title: article[0].title,
              article: article[0],
              settings: settings,
              previous: previous[0],
              next: _next2[0],
              featured: featured,
              popular: popular,
              recommended: recommended,
              related: related,
              bookmark: book,
              bookmarkId: bookmark == null ? null : bookmark._id
            });
            _context6.next = 68;
            break;

          case 63:
            ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            payload = {
              ip: ip,
              date: new Date()
            };
            _context6.next = 67;
            return _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $push: {
                viewers: payload
              }
            });

          case 67:
            _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $inc: {
                views: 1
              }
            }).then(function (views) {
              res.render("single", {
                articleCount: articleCount,
                title: article[0].title,
                article: article[0],
                settings: settings,
                previous: previous[0],
                next: _next2[0],
                featured: featured,
                popular: popular,
                recommended: recommended,
                related: related,
                bookmark: book,
                bookmarkId: bookmark == null ? null : bookmark._id
              });
            })["catch"](function (err) {
              return _next2(err);
            });

          case 68:
            _context6.next = 73;
            break;

          case 70:
            _context6.prev = 70;
            _context6.t1 = _context6["catch"](0);
            next(_context6.t1);

          case 73:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 70]]);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}()); // Get article based on a category

router.get("/all-post", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var perPage, page;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            perPage = 7;
            page = req.query.page || 1;
            _context8.prev = 2;
            _context8.next = 5;
            return _category["default"].findOne({
              name: req.query.category
            }).then( /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(category) {
                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        if (category) {
                          _context7.next = 4;
                          break;
                        }

                        res.status(404).render("404");
                        _context7.next = 6;
                        break;

                      case 4:
                        _context7.next = 6;
                        return _articles["default"].find({
                          category: category._id
                        }).populate("postedBy").sort({
                          createdAt: -1
                        }).skip(perPage * page - perPage).limit(perPage).exec(function (err, post) {
                          _articles["default"].countDocuments({
                            category: category._id
                          }).exec(function (err, count) {
                            if (err) return next(err);
                            res.render("category", {
                              post: post,
                              current: page,
                              pages: Math.ceil(count / perPage),
                              cat: req.query.category
                            });
                          });
                        });

                      case 6:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x22) {
                return _ref8.apply(this, arguments);
              };
            }())["catch"](function (e) {
              return next(e);
            });

          case 5:
            _context8.next = 10;
            break;

          case 7:
            _context8.prev = 7;
            _context8.t0 = _context8["catch"](2);
            next(_context8.t0);

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[2, 7]]);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}());
router.post('/api/kategorie', /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var slug, category, articles;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            slug = req.body.slug;
            _context9.next = 3;
            return _category["default"].findOne({
              slug: slug
            });

          case 3:
            category = _context9.sent;
            _context9.next = 6;
            return _articles["default"].find({
              category: category.id
            }).sort({
              createdAt: -1
            }).limit(10);

          case 6:
            articles = _context9.sent;
            return _context9.abrupt("return", res.json({
              "data": articles
            }));

          case 8:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x23, _x24, _x25) {
    return _ref9.apply(this, arguments);
  };
}()); // Get all the posts in a category

router.post('/kategory-ajax', /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var page, slug, cat, articles, length, totalsize, r, return_article;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            page = req.body.page;
            slug = req.body.slug;
            _context10.next = 4;
            return _category["default"].findOne({
              slug: slug
            });

          case 4:
            cat = _context10.sent;
            _context10.next = 7;
            return _articles["default"].find({
              active: true,
              category: cat._id
            }).populate("category").populate("postedBy").sort({
              createdAt: -1
            });

          case 7:
            articles = _context10.sent;
            length = articles.length;
            totalsize = Math.floor(length / 6) + 1;
            r = 6 * page;
            _context10.next = 13;
            return _articles["default"].find({
              active: true,
              category: cat._id
            }).populate("category").populate("postedBy").sort({
              createdAt: -1
            }).limit(6).skip(r);

          case 13:
            return_article = _context10.sent;
            return _context10.abrupt("return", res.json({
              'data': return_article,
              'page': page,
              'total': totalsize
            }));

          case 15:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x26, _x27, _x28) {
    return _ref10.apply(this, arguments);
  };
}());
router.get("/kategorie/:slug", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var perPage, page, cat, post, count, featured;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            perPage = 6;
            page = req.query.page || 1;
            _context11.next = 5;
            return _category["default"].findOne({
              slug: req.params.slug
            });

          case 5:
            cat = _context11.sent;

            if (cat) {
              _context11.next = 10;
              break;
            }

            res.render("404");
            _context11.next = 20;
            break;

          case 10:
            _context11.next = 12;
            return _articles["default"].find({
              active: true,
              category: cat._id
            }).populate("category").populate("postedBy").populate("subCategory").skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 12:
            post = _context11.sent;
            _context11.next = 15;
            return _articles["default"].countDocuments({
              active: true,
              category: cat._id
            });

          case 15:
            count = _context11.sent;
            _context11.next = 18;
            return _articles["default"].find({
              active: true,
              addToFeatured: true
            }).populate("category").sort({
              createdAt: -1
            }).limit(5);

          case 18:
            featured = _context11.sent;
            res.render("category", {
              title: cat.name,
              cat: cat.name,
              background: cat.background,
              category: cat,
              post: post,
              current: page,
              pages: Math.ceil(count / perPage),
              featured: featured
            });

          case 20:
            _context11.next = 25;
            break;

          case 22:
            _context11.prev = 22;
            _context11.t0 = _context11["catch"](0);
            next(_context11.t0);

          case 25:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 22]]);
  }));

  return function (_x29, _x30, _x31) {
    return _ref11.apply(this, arguments);
  };
}()); // Add to slider

router.post("/article/add-to-slider", function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        showPostOnSlider: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Updated Successfully");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Add to recommended

router.post("/article/add-to-recommended", function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        addToRecommended: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Updated Successfully");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Add to featured

router.post("/article/add-to-featured", function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        addToFeatured: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Updated Successfully");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Add to breaking

router.post("/article/add-to-breaking", function (req, res, next) {
  try {
    _articles["default"].updateMany({
      _id: req.body.ids
    }, {
      $set: {
        addToBreaking: true
      }
    }).then(function (deleted) {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Was Updated");
        return res.redirect("/dashboard/all-posts");
      } else {
        req.flash("success_msg", "Articles Has Been Updated Successfully");
        return res.redirect("/dashboard/all-posts");
      }
    })["catch"](function (e) {
      return next(e);
    });
  } catch (error) {
    next(error);
  }
}); // Upvote a post

router.post("/article/upvote", _auth["default"], /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            return _context12.abrupt("return", res.redirect("back"));

          case 1:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x32, _x33, _x34) {
    return _ref12.apply(this, arguments);
  };
}());
router.post('/article/upvote-ajax', /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var date, articleId, userId, payload, article_origin, indexof, article, upvotecount, result;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            date = new Date();
            articleId = req.body.articleId;
            userId = req.body.userId;
            payload = {
              date: date,
              user: req.user.id
            };
            _context13.next = 6;
            return _articles["default"].findOne({
              _id: articleId
            });

          case 6:
            article_origin = _context13.sent;
            indexof = -1;
            article_origin.upvote.users.forEach(function (element) {
              if (element.user == req.user.id) {
                indexof = 1;
              }
            });

            if (!(indexof == -1 && articleId != userId)) {
              _context13.next = 12;
              break;
            }

            _context13.next = 12;
            return _articles["default"].updateOne({
              _id: req.body.articleId
            }, {
              $push: {
                "upvote.users": payload
              },
              $inc: {
                "upvote.count": 1
              }
            });

          case 12:
            _context13.next = 14;
            return _articles["default"].findOne({
              _id: articleId
            });

          case 14:
            article = _context13.sent;
            upvotecount = article.upvote.count;
            result = {
              upvotecount: upvotecount,
              success: true
            };
            res.json(result);

          case 18:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x35, _x36, _x37) {
    return _ref13.apply(this, arguments);
  };
}()); // Downvote a post

router.post("/article/downvote", _auth["default"], /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return _articles["default"].updateOne({
              _id: req.body.articleId
            }, {
              $push: {
                "update.users": req.user.id
              },
              $inc: {
                "upvote.count": -1
              }
            });

          case 2:
            res.status(200).send("Post Has been Downvoted");

          case 3:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x38, _x39, _x40) {
    return _ref14.apply(this, arguments);
  };
}()); // Flag an article

router.post("/article/flag", /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return _flag["default"].create({
              articleId: req.body.articleId,
              reason: req.body.reason.trim(),
              userId: req.user.id != undefined ? req.user.id : undefined
            });

          case 2:
            res.status(200).send("Post has been flagged, Admin will look into it anytime soon.");

          case 3:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x41, _x42, _x43) {
    return _ref15.apply(this, arguments);
  };
}()); // Clap under an article

router.post("/article/clap", /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res, next) {
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return _articles["default"].updateOne({
              _id: req.body.articleId
            }, {
              $inc: {
                claps: 1
              }
            });

          case 2:
            res.status(200).send("Clapped under post");

          case 3:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function (_x44, _x45, _x46) {
    return _ref16.apply(this, arguments);
  };
}());
module.exports = router;