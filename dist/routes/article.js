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
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var articles, article_header, receive, data, user, article_title, search, real, array, articleslug, meta_title, meta_description, _real, _array, _articleslug, set, newDate, months, parse, html, result, payload1;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _articles["default"].find({});

          case 2:
            articles = _context2.sent;
            articles.forEach( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(article) {
                var data, result;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        data = article.body;
                        result = changeTohtml(data);

                        _articles["default"].updateOne({
                          _id: article._id
                        }, {
                          $set: {
                            articleTablecontent: result.table_content,
                            articleBody: result.article
                          }
                        }).then(function (data) {})["catch"](function (error) {
                          console.log(error);
                        });

                      case 3:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }());
            article_header = req.body.article_header;
            receive = JSON.parse(req.body.data);
            data = receive.blocks;
            _context2.next = 9;
            return _users["default"].findById({
              _id: req.user.id
            });

          case 9:
            user = _context2.sent;
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
              _context2.next = 19;
              break;
            }

            req.flash("success_msg", "You have to create the title!");

            if (!(user.roleId == "user")) {
              _context2.next = 18;
              break;
            }

            return _context2.abrupt("return", res.redirect("/user/all-posts"));

          case 18:
            return _context2.abrupt("return", res.redirect("/admin/all-posts"));

          case 19:
            _context2.next = 21;
            return _articles["default"].find({
              title: article_title
            });

          case 21:
            search = _context2.sent;
            real = search !== "" ? article_title.trim().toLowerCase().split("?").join("").split("(").join("").split(")").join("").split(" ").join("-").split("&nbsp;").join("").trim().replace(new RegExp("/", "g"), "-") + "-" + search.length : article_title.trim().toLowerCase().split("?").join("").split("(").join("").split(")").join("").split(" ").join("-").split("&nbsp;").join("").trim().replace(new RegExp("/", "g"), "-");
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
            console.log(articleslug);
            meta_title = "";
            meta_description = "";

            if (req.user.roleId == "admin") {
              _real = search !== "" ? req.body.slug.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-") + "-" + search.length : req.body.slug.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-");
              _array = _real.split('');

              _array.forEach(function (element, index) {
                if (element == "ß") {
                  _array[index] = "ss";
                }

                if (element == "ö") {
                  _array[index] = "oe";
                }

                if (element == "ä") {
                  _array[index] = "ae";
                }

                if (element == "ü") {
                  _array[index] = "ue";
                }
              });

              _articleslug = _array.join("");
              articleslug = req.body.slug ? _articleslug : articleslug;
              meta_description = req.body.meta_description;
              meta_title = req.body.meta_title;
            } // let content = req.body.body;
            // let textLength = content.split(/\s/g).length;


            _context2.next = 32;
            return _settings["default"].findOne();

          case 32:
            set = _context2.sent;

            Date.prototype.getWeek = function () {
              var dt = new Date(this.getFullYear(), 0, 1);
              return Math.ceil(((this - dt) / 86400000 + dt.getDay() + 1) / 7);
            };

            newDate = new Date(); //List months cos js months starts from zero to 11

            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            parse = edjsParser.parse(receive);
            html = "";
            parse.forEach(function (element) {
              html = html + element;
            });
            result = changeTohtml(JSON.stringify(data));
            payload1 = {
              articleTablecontent: result.table_content,
              articleBody: result.article,
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

            if (req.body.saveflag == "true") {
              payload1.active = false;
            } else {
              payload1.active = true;
            }

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

          case 43:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Edit an Article

router.post("/article/edit", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var receive, data, user, article_title, search, articelslug, meta_title, meta_description, _articleslug, parse, html, body, _short, date, article, article_header, active_flag, result;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            receive = JSON.parse(req.body.data);
            data = receive.blocks;
            _context3.next = 5;
            return _users["default"].findById({
              _id: req.user.id
            });

          case 5:
            user = _context3.sent;
            data.forEach(function (block) {
              switch (block.type) {
                case "header":
                  if (block.data.level == 1) {
                    article_title = block.data.text;
                  }

                  break;
              }
            });
            _context3.next = 9;
            return _articles["default"].find({
              title: article_title
            });

          case 9:
            search = _context3.sent;
            // let slug = await Article.findOne({ slug: req.body.slug });
            // if (slug) {
            //   req.flash(
            //     "success_msg",
            //     "That slug has been used, pls used another slug or just leave the field empty"
            //   );
            //   console.log('asdfsfd');
            //   return res.redirect("back");
            // }
            articelslug = req.body.article_slug; // let content = req.body.body;
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
              _articleslug = req.body.article_slug.trim().toLowerCase().split("?").join("").split(" ").join("-").replace(new RegExp("/", "g"), "-");
              articelslug = req.body.slug ? articelslug : _articleslug;
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
            _context3.next = 22;
            return _articles["default"].findOne({
              _id: req.body.articleId
            });

          case 22:
            article = _context3.sent;
            article_header = req.body.article_header ? req.body.article_header : article.file;
            active_flag = false;

            if (req.body.saveflag == "true") {
              active_flag = false;
            } else {
              active_flag = true;
            }

            result = changeTohtml(JSON.stringify(data));

            _articles["default"].updateOne({
              _id: req.body.articleId.trim()
            }, {
              $set: {
                title: article_title,
                slug: articelslug,
                "short": _short,
                body: body,
                updatedAt: date,
                category: req.body.category,
                summary: req.body.summary,
                file: article_header,
                metatitle: meta_title,
                metadescription: meta_description,
                active: active_flag,
                articleTablecontent: result.table_content,
                articleBody: result.article
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

            _context3.next = 33;
            break;

          case 30:
            _context3.prev = 30;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 33:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 30]]);
  }));

  return function (_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}()); // Delete an Article

router.post("/article/delete", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var article;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _articles["default"].findById(req.body.articleId);

          case 3:
            article = _context4.sent;

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

            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 8]]);
  }));

  return function (_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}()); // Delete Many Articles

router.post("/article/deletemany", _install["default"].redirectToLogin, _auth["default"], /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _comment["default"].deleteMany({
              articleId: req.body.ids
            });

          case 3:
            _context5.next = 5;
            return _articles["default"].deleteMany({
              _id: req.body.ids
            });

          case 5:
            if (req.body.ids) {
              _context5.next = 10;
              break;
            }

            req.flash("success_msg", "Nothing Has Been Deleted");
            return _context5.abrupt("return", res.redirect('back'));

          case 10:
            req.flash("success_msg", "Posts Has Been Deleted");
            return _context5.abrupt("return", res.redirect('back'));

          case 12:
            _context5.next = 17;
            break;

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5["catch"](0);
            next(_context5.t0);

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 14]]);
  }));

  return function (_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
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
    f;

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

function changeTohtml(data) {
  var _data = JSON.parse(data);

  var idList = [];
  var body_content_element = "";

  _data.forEach(function (element, index) {
    var _template = "";

    switch (element.type) {
      case "header":
        if (element.data.level != 1) {
          idList.push(index);
          _template = '<h' + element.data.level + ' id="' + index + '">' + element.data.text + '</h' + element.data.level + '>';
        }

        break;

      case "paragraph":
        _template = '<p>' + element.data.text + '</p>';
        break;

      case "image":
        _template = '<img src=' + element.data.url + ' alt=' + element.data.caption + '/>';
        break;

      case "code":
        var code = element.data.code;
        code = code.replace(/</g, "&lt;");
        code = code.replace(/>/g, "&gt;");
        console.log(code);
        _template = '<pre>' + code + '</pre>';
        break;

      case "embed":
        _template = '<div class="text-center" style="margin-top:10px;"><iframe src="' + element.data.embed + '" width="' + element.data.width + '" height="' + element.data.height + '" frameborder="0" allowfullscreen></iframe></div>';
        break;

      case "table":
        var content = element.data.content;
        _template = '<table class="table table-bordered table-hover" style="width:85%;margin: auto;margin-bottom: 10px;">';
        content.forEach(function (element, index) {
          var length = element.length;
          var tr_template = "<tr class='text-center'>";

          for (var i = 0; i < length; i++) {
            var td_template = '<td>';
            td_template = td_template + element[i] + '</td>';
            tr_template += td_template;
          }

          tr_template += '</tr>';
          _template += tr_template;
        });
        _template = _template + "</table>";
        break;

      case "quote":
        _template = '<blockquote><p class="quotation-mark">“' + element.data.text + '“</p><h3 class="text-right">--- ' + element.data.caption + ' ---</h3></blockquote>';
        break;

      case "list":
        var type = element.data.style.charAt(0);
        _template = '<div><' + type + 'l>';
        element.data.items.forEach(function (item) {
          _template += '<li>' + item + '</li>';
        });
        _template += '</' + type + 'l></div>';
        break;
    }

    body_content_element = body_content_element + _template;
  });

  var table_content_element = '<ol class="table-content"><h2>Inhalt</h2>';
  var table_element = [];

  _data.forEach(function (element) {
    if (element.type == "header") {
      if (element.data.level != 1) {
        table_element.push(element);
      }
    }
  });

  var _string = "";
  table_element.forEach(function (item, index) {
    var template = '<li><a style="font-size: 1.2em" href="#' + idList[index] + '">' + item.data.text + '</a></li>';
    _string = _string + template;
  });
  table_content_element = table_content_element + _string + '</ol>';
  var returnData = {
    article: body_content_element,
    table_content: table_content_element
  };
  return returnData;
}

router.get("/p/:category/:slug", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var settings, user, slug, category, article, nextarticle, previousarticle, bookmark, book, art, _next, previous, featured, popular, recommended, _length, r, related, d, customDate, ips, articleCount, indexof, _view_article, comments, ip, payload, _view_article2, _comments, article_body;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return _settings["default"].findOne();

          case 3:
            settings = _context6.sent;
            user = req.params.user;
            slug = req.params.slug;
            category = req.params.category;
            _context6.next = 9;
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
            article = _context6.sent;

            if (!(article == "")) {
              _context6.next = 14;
              break;
            }

            res.render("404");
            _context6.next = 96;
            break;

          case 14:
            nextarticle = [];
            previousarticle = [];

            if (!(typeof req.user !== "undefined")) {
              _context6.next = 22;
              break;
            }

            _context6.next = 19;
            return _bookmark["default"].findOne({
              userId: req.user.id,
              articleId: article[0]._id
            });

          case 19:
            _context6.t0 = _context6.sent;
            _context6.next = 23;
            break;

          case 22:
            _context6.t0 = false;

          case 23:
            bookmark = _context6.t0;
            book = bookmark ? true : false;
            _context6.next = 27;
            return _articles["default"].findOne({
              slug: req.params.slug,
              active: true
            });

          case 27:
            art = _context6.sent;
            _context6.next = 30;
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
            _next = _context6.sent;

            _next.forEach(function (item) {
              if (item.category.slug != "official") {
                nextarticle.push(item);
              }
            });

            if (!(_next.length == 0)) {
              _context6.next = 37;
              break;
            }

            _context6.next = 35;
            return _articles["default"].find({
              active: true
            }).populate("category").populate("postedBy").sort({
              createdAt: 1
            });

          case 35:
            _next = _context6.sent;

            _next.forEach(function (item) {
              if (item.category.slug != "official") {
                nextarticle.push(item);
              }
            });

          case 37:
            _context6.next = 39;
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
            previous = _context6.sent;
            previous.forEach(function (item) {
              if (item.category.slug != "official") {
                previousarticle.push(item);
              }
            });

            if (!(previous.length == 0)) {
              _context6.next = 46;
              break;
            }

            _context6.next = 44;
            return _articles["default"].find({
              active: true
            }).populate("category").populate("postedBy").sort({
              createdAt: 1
            });

          case 44:
            previous = _context6.sent;
            previous.forEach(function (item) {
              if (item.category.slug != "official") {
                previousarticle.push(item);
              }
            });

          case 46:
            _context6.next = 48;
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
            featured = _context6.sent;
            _context6.next = 51;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            }).sort({
              views: -1
            }).limit(3);

          case 51:
            popular = _context6.sent;
            _context6.next = 54;
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
            recommended = _context6.sent;
            _context6.next = 57;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            });

          case 57:
            _length = _context6.sent;
            r = Math.floor(Math.random() * _length.length);
            _context6.next = 61;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            }).populate("postedBy").populate("category").sort({
              createdAt: -1
            }).limit(3).skip(r);

          case 61:
            related = _context6.sent;
            d = new Date();
            customDate = "".concat(d.getDate(), "/").concat(d.getMonth(), "/").concat(d.getFullYear());
            ips = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            _context6.next = 67;
            return _articles["default"].countDocuments();

          case 67:
            articleCount = _context6.sent;
            indexof = -1;
            art.viewers.forEach(function (element) {
              if (element.ip == ips) {
                indexof = 1;
              }
            });

            if (!(indexof !== -1)) {
              _context6.next = 80;
              break;
            }

            _context6.next = 73;
            return _articles["default"].findOne({
              slug: req.params.slug.trim()
            }).populate("postedBy").populate('category');

          case 73:
            _view_article = _context6.sent;
            _context6.next = 76;
            return _comment["default"].find({
              articleId: _view_article._id
            }).sort({
              upvotecount: -1
            });

          case 76:
            comments = _context6.sent;
            // var article_body = view_article.body;
            // var _res = changeTohtml(article_body);
            res.render("single", {
              articleCount: articleCount,
              title: article[0].title,
              article: _view_article,
              // article_body: _res.article,
              // article_table_content: _res.table_content,
              settings: settings,
              previous: previousarticle[0],
              next: nextarticle[0],
              featured: featured,
              popular: popular,
              recommended: recommended,
              related: related,
              bookmark: book,
              bookmarkId: bookmark == null ? null : bookmark._id,
              comments: comments
            });
            _context6.next = 96;
            break;

          case 80:
            ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            payload = {
              ip: ip,
              date: new Date()
            };
            _context6.next = 84;
            return _users["default"].updateOne({
              _id: art.postedBy
            }, {
              $inc: {
                contentviews: 1
              }
            });

          case 84:
            _context6.next = 86;
            return _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $push: {
                viewers: payload
              }
            });

          case 86:
            _context6.next = 88;
            return _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $inc: {
                views: 1
              }
            });

          case 88:
            _context6.next = 90;
            return _articles["default"].findOne({
              slug: req.params.slug.trim()
            }).populate("postedBy").populate('category');

          case 90:
            _view_article2 = _context6.sent;
            _context6.next = 93;
            return _comment["default"].find({
              articleId: _view_article2._id
            }).sort({
              upvotecount: -1
            });

          case 93:
            _comments = _context6.sent;
            article_body = _view_article2.body; // var _res = changeTohtml(article_body);

            res.render("single", {
              articleCount: articleCount,
              title: article[0].title,
              article: _view_article2,
              // article_body: _res.article,
              // article_table_content: _res.table_content,
              settings: settings,
              previous: previousarticle[0],
              next: nextarticle[0],
              featured: featured,
              popular: popular,
              recommended: recommended,
              related: related,
              bookmark: book,
              bookmarkId: bookmark == null ? null : bookmark._id,
              comments: _comments
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

          case 96:
            _context6.next = 101;
            break;

          case 98:
            _context6.prev = 98;
            _context6.t1 = _context6["catch"](0);
            next(_context6.t1);

          case 101:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 98]]);
  }));

  return function (_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}()); // Get single article page

router.get("/d/:category/:slug", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var settings, article, bookmark, book, art, _next2, index, previous, _index, featured, popular, recommended, related, d, customDate, ips, articleCount, indexof, article_body, _res, ip, payload;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return _settings["default"].findOne();

          case 3:
            settings = _context7.sent;
            _context7.next = 6;
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
            article = _context7.sent;

            if (!(article == "")) {
              _context7.next = 11;
              break;
            }

            res.render("404");
            _context7.next = 70;
            break;

          case 11:
            if (!(typeof req.user !== "undefined")) {
              _context7.next = 17;
              break;
            }

            _context7.next = 14;
            return _bookmark["default"].findOne({
              userId: req.user.id,
              articleId: article[0]._id
            });

          case 14:
            _context7.t0 = _context7.sent;
            _context7.next = 18;
            break;

          case 17:
            _context7.t0 = false;

          case 18:
            bookmark = _context7.t0;
            book = bookmark ? true : false;
            _context7.next = 22;
            return _articles["default"].findOne({
              slug: req.params.slug,
              active: true
            });

          case 22:
            art = _context7.sent;
            _context7.next = 25;
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
            _next2 = _context7.sent;

            if (!(_next2.length == 0)) {
              _context7.next = 31;
              break;
            }

            index = Math.floor(Math.random() * 100 % 28);
            _context7.next = 30;
            return _articles["default"].find({
              active: true
            }).populate("category").populate("postedBy").sort({
              _id: 1
            }).limit(1).skip(index);

          case 30:
            _next2 = _context7.sent;

          case 31:
            _context7.next = 33;
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
            previous = _context7.sent;

            if (!(previous.length == 0)) {
              _context7.next = 39;
              break;
            }

            _index = Math.floor(Math.random() * 100 % 28);
            _context7.next = 38;
            return _articles["default"].find({
              active: true
            }).populate("category").populate("postedBy").sort({
              _id: 1
            }).limit(1).skip(_index);

          case 38:
            previous = _context7.sent;

          case 39:
            _context7.next = 41;
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
            featured = _context7.sent;
            _context7.next = 44;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            }).sort({
              views: -1
            }).limit(3);

          case 44:
            popular = _context7.sent;
            _context7.next = 47;
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
            recommended = _context7.sent;
            _context7.next = 50;
            return _articles["default"].find({
              active: true,
              slug: {
                $ne: article[0].slug
              }
            }).populate("postedBy").populate("category").sort({
              createdAt: -1
            }).limit(3);

          case 50:
            related = _context7.sent;
            d = new Date();
            customDate = "".concat(d.getDate(), "/").concat(d.getMonth(), "/").concat(d.getFullYear());
            ips = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            _context7.next = 56;
            return _articles["default"].countDocuments();

          case 56:
            articleCount = _context7.sent;
            indexof = -1;
            art.viewers.forEach(function (element) {
              if (element.ip == ips) {
                indexof = 1;
              }
            });

            if (!(indexof !== -1)) {
              _context7.next = 65;
              break;
            }

            article_body = article[0].body;
            _res = changeTohtml(article_body);
            res.render("single", {
              articleCount: articleCount,
              title: article[0].title,
              article: article[0],
              article_body: _res.article,
              article_table_content: _res.table_content,
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
            _context7.next = 70;
            break;

          case 65:
            ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            payload = {
              ip: ip,
              date: new Date()
            };
            _context7.next = 69;
            return _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $push: {
                viewers: payload
              }
            });

          case 69:
            _articles["default"].updateOne({
              slug: req.params.slug.trim()
            }, {
              $inc: {
                views: 1
              }
            }).then(function (views) {
              var article_body = view_article.body;

              var _res = changeTohtml(article_body);

              res.render("single", {
                articleCount: articleCount,
                title: article[0].title,
                article: article[0],
                article_body: _res.article,
                article_table_content: _res.table_content,
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

          case 70:
            _context7.next = 75;
            break;

          case 72:
            _context7.prev = 72;
            _context7.t1 = _context7["catch"](0);
            next(_context7.t1);

          case 75:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 72]]);
  }));

  return function (_x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}()); // Get article based on a category

router.get("/all-post", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var perPage, page;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            perPage = 7;
            page = req.query.page || 1;
            _context9.prev = 2;
            _context9.next = 5;
            return _category["default"].findOne({
              name: req.query.category
            }).then( /*#__PURE__*/function () {
              var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(category) {
                return _regenerator["default"].wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        if (category) {
                          _context8.next = 4;
                          break;
                        }

                        res.status(404).render("404");
                        _context8.next = 6;
                        break;

                      case 4:
                        _context8.next = 6;
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
                        return _context8.stop();
                    }
                  }
                }, _callee8);
              }));

              return function (_x23) {
                return _ref9.apply(this, arguments);
              };
            }())["catch"](function (e) {
              return next(e);
            });

          case 5:
            _context9.next = 10;
            break;

          case 7:
            _context9.prev = 7;
            _context9.t0 = _context9["catch"](2);
            next(_context9.t0);

          case 10:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[2, 7]]);
  }));

  return function (_x20, _x21, _x22) {
    return _ref8.apply(this, arguments);
  };
}());
router.post('/api/kategorie', /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var slug, category, articles;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            slug = req.body.slug;
            _context10.next = 3;
            return _category["default"].findOne({
              slug: slug
            });

          case 3:
            category = _context10.sent;
            _context10.next = 6;
            return _articles["default"].find({
              category: category.id
            }).sort({
              createdAt: -1
            }).limit(10);

          case 6:
            articles = _context10.sent;
            return _context10.abrupt("return", res.json({
              "data": articles
            }));

          case 8:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x24, _x25, _x26) {
    return _ref10.apply(this, arguments);
  };
}()); // Get all the posts in a category

router.post('/kategory-ajax', /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var page, slug, cat, articles, length, totalsize, r, return_article;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            page = req.body.page;
            slug = req.body.slug;
            _context11.next = 4;
            return _category["default"].findOne({
              slug: slug
            });

          case 4:
            cat = _context11.sent;
            _context11.next = 7;
            return _articles["default"].find({
              active: true,
              category: cat._id
            }).populate("category").populate("postedBy").sort({
              createdAt: -1
            });

          case 7:
            articles = _context11.sent;
            length = articles.length;
            totalsize = Math.floor(length / 6) + 1;
            r = 6 * page;
            _context11.next = 13;
            return _articles["default"].find({
              active: true,
              category: cat._id
            }).populate("category").populate("postedBy").sort({
              createdAt: -1
            }).limit(6).skip(r);

          case 13:
            return_article = _context11.sent;
            return _context11.abrupt("return", res.json({
              'data': return_article,
              'page': page,
              'total': totalsize
            }));

          case 15:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x27, _x28, _x29) {
    return _ref11.apply(this, arguments);
  };
}());
router.get("/kategorie/:slug", _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var perPage, page, cat, post, count, featured;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            perPage = 6;
            page = req.query.page || 1;
            _context12.next = 5;
            return _category["default"].findOne({
              slug: req.params.slug
            });

          case 5:
            cat = _context12.sent;

            if (cat) {
              _context12.next = 10;
              break;
            }

            res.render("404");
            _context12.next = 20;
            break;

          case 10:
            _context12.next = 12;
            return _articles["default"].find({
              active: true,
              category: cat._id
            }).populate("category").populate("postedBy").populate("subCategory").skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 12:
            post = _context12.sent;
            _context12.next = 15;
            return _articles["default"].countDocuments({
              active: true,
              category: cat._id
            });

          case 15:
            count = _context12.sent;
            _context12.next = 18;
            return _articles["default"].find({
              active: true,
              addToFeatured: true
            }).populate("category").sort({
              createdAt: -1
            }).limit(5);

          case 18:
            featured = _context12.sent;
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
            _context12.next = 25;
            break;

          case 22:
            _context12.prev = 22;
            _context12.t0 = _context12["catch"](0);
            next(_context12.t0);

          case 25:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[0, 22]]);
  }));

  return function (_x30, _x31, _x32) {
    return _ref12.apply(this, arguments);
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
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            return _context13.abrupt("return", res.redirect("back"));

          case 1:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x33, _x34, _x35) {
    return _ref13.apply(this, arguments);
  };
}());
router.post('/article/upvote-ajax', /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    var date, articleId, userId, payload, article_origin, indexof, article, upvotecount, result;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            date = new Date();
            articleId = req.body.articleId;
            userId = req.body.userId;
            payload = {
              date: date,
              user: req.user.id
            };
            _context14.next = 6;
            return _articles["default"].findOne({
              _id: articleId
            });

          case 6:
            article_origin = _context14.sent;
            indexof = -1;
            article_origin.upvote.users.forEach(function (element) {
              if (element.user == req.user.id) {
                indexof = 1;
              }
            });

            if (!(indexof == -1 && articleId != userId)) {
              _context14.next = 12;
              break;
            }

            _context14.next = 12;
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
            _context14.next = 14;
            return _articles["default"].findOne({
              _id: articleId
            });

          case 14:
            article = _context14.sent;
            upvotecount = article.upvote.count;
            result = {
              upvotecount: upvotecount,
              success: true
            };
            res.json(result);

          case 18:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x36, _x37, _x38) {
    return _ref14.apply(this, arguments);
  };
}()); // Downvote a post

router.post("/article/downvote", _auth["default"], /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
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
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x39, _x40, _x41) {
    return _ref15.apply(this, arguments);
  };
}()); // Flag an article

router.post("/article/flag", /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res, next) {
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return _flag["default"].create({
              articleId: req.body.articleId,
              reason: req.body.reason.trim(),
              userId: req.user.id != undefined ? req.user.id : undefined
            });

          case 2:
            res.status(200).send("Post has been flagged, Admin will look into it anytime soon.");

          case 3:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function (_x42, _x43, _x44) {
    return _ref16.apply(this, arguments);
  };
}()); // Clap under an article

router.post("/article/clap", /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(req, res, next) {
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
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
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function (_x45, _x46, _x47) {
    return _ref17.apply(this, arguments);
  };
}());
module.exports = router;