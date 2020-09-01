"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _crypto = _interopRequireDefault(require("crypto"));

var _bcryptNodejs = _interopRequireDefault(require("bcrypt-nodejs"));

var _articles = _interopRequireDefault(require("../models/articles"));

var _category = _interopRequireDefault(require("../models/category"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _comment = _interopRequireDefault(require("../models/comment"));

var _tags = _interopRequireDefault(require("../models/tags"));

var _expressFlash = _interopRequireDefault(require("express-flash"));

var _moment = _interopRequireDefault(require("moment"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _users = _interopRequireDefault(require("../models/users"));

var _url = _interopRequireDefault(require("url"));

var _ads = _interopRequireDefault(require("../models/ads"));

var _install = _interopRequireDefault(require("../helpers/install"));

var _menu = _interopRequireDefault(require("../models/menu"));

var _bookmark = _interopRequireDefault(require("../models/bookmark"));

var _searchkey = _interopRequireDefault(require("../models/searchkey"));

var _mail2 = _interopRequireDefault(require("../helpers/_mail"));

var _media = _interopRequireDefault(require("../models/media"));

var fs = require('fs');

var _require = require('sitemap'),
    SitemapStream = _require.SitemapStream,
    streamToPromise = _require.streamToPromise;

var _require2 = require('zlib'),
    createGzip = _require2.createGzip;

var router = _express["default"].Router();

var SitemapGenerator = require('sitemap-generator'); // drowningsummer.228@gmail.com


_dotenv["default"].config({
  path: './.env'
});

router.use((0, _expressFlash["default"])());
router.use( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var settingsInfo;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _settings["default"].find({});

          case 2:
            settingsInfo = _context.sent;
            _context.next = 5;
            return _menu["default"].find().sort({
              position: 1
            });

          case 5:
            res.locals.mainMenu = _context.sent;
            _context.next = 8;
            return _category["default"].find({}).sort({
              name: 1
            });

          case 8:
            res.locals.footercategory = _context.sent;

            res.locals.time = function (ev) {
              var wordsPerMinute = 260; // Average case.

              var result;
              var textLength = ev.split(/\s/g).length; // Split by words

              if (textLength > 0) {
                var value = Math.ceil(textLength / wordsPerMinute);
                result = value;
              }

              return result;
            };

            res.locals.getmonth = function (data) {
              switch (data) {
                case 0:
                  return 'Jan';
                  break;

                case 1:
                  return 'Feb';
                  break;

                case 2:
                  return 'March';
                  break;

                case 3:
                  return 'Apr';
                  break;

                case 4:
                  return 'May';
                  break;

                case 5:
                  return 'Jun';
                  break;

                case 6:
                  return 'Jul';
                  break;

                case 7:
                  return 'Aug';
                  break;

                case 8:
                  return 'Sep';
                  break;

                case 9:
                  return 'Oct';
                  break;

                case 10:
                  return 'Nov';
                  break;

                case 11:
                  return 'Dec';
                  break;

                default:
                  break;
              }
            };

            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            res.locals.error = req.flash('error');
            res.locals.user = req.user || null;
            res.locals.siteTitle = settingsInfo == '' ? 'Pls edit site title in the admin dashboard' : typeof settingsInfo[0].siteName == 'undefined' ? 'Pls edit site title in the admin dashboard' : "".concat(settingsInfo[0].siteName);
            res.locals.siteDescription = settingsInfo == '' ? 'Edit site description in the admin dashboard' : typeof settingsInfo[0].siteDescription == 'undefined' ? 'edit site title in the admin dashboard' : "".concat(settingsInfo[0].siteDescription);
            _context.next = 19;
            return _articles["default"].find({
              slug: {
                $ne: _url["default"].parse(req.url).path.split('/').pop()
              }
            }).populate('category').populate('postedBy').sort({
              createdAt: -1
            }).limit(5);

          case 19:
            res.locals.recent = _context.sent;
            _context.next = 22;
            return _articles["default"].find({
              slug: {
                $ne: _url["default"].parse(req.url).path.split('/').pop()
              }
            }).populate('category').populate('postedBy').sort({
              views: -1
            }).limit(5);

          case 22:
            res.locals.sidebarPop = _context.sent;
            _context.next = 25;
            return _comment["default"].aggregate([{
              $lookup: {
                from: 'articles',
                localField: 'articleId',
                foreignField: '_id',
                as: 'article'
              }
            }, {
              $unwind: {
                path: '$article',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'article.postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: {
                path: '$postedBy',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'categories',
                localField: 'article.category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 5
            }]);

          case 25:
            res.locals.comments = _context.sent;
            _context.next = 28;
            return _tags["default"].find().sort({
              createdAt: -1
            }).limit(12);

          case 28:
            res.locals.tags = _context.sent;
            _context.next = 31;
            return _tags["default"].find().sort({
              createdAt: -1
            });

          case 31:
            res.locals.tags2 = _context.sent;
            _context.next = 34;
            return _category["default"].aggregate([{
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 7
            }, {
              $lookup: {
                from: 'articles',
                localField: '_id',
                foreignField: 'category',
                as: 'total'
              }
            }]);

          case 34:
            res.locals.category = _context.sent;
            _context.next = 37;
            return _category["default"].aggregate([{
              $limit: 7
            }, {
              $lookup: {
                from: 'articles',
                localField: '_id',
                foreignField: 'category',
                as: 'total'
              }
            }, {
              $sort: {
                total: -1
              }
            }]);

          case 37:
            res.locals.hotCategory = _context.sent;
            _context.next = 40;
            return _category["default"].aggregate([{
              $sort: {
                name: 1
              }
            }, {
              $lookup: {
                from: 'articles',
                localField: '_id',
                foreignField: 'category',
                as: 'total'
              }
            }]);

          case 40:
            res.locals.category2 = _context.sent;
            _context.next = 43;
            return _category["default"].aggregate([{
              $match: {
                parent: {
                  $exists: false
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }]);

          case 43:
            res.locals.subCategory2 = _context.sent;
            _context.next = 46;
            return _category["default"].aggregate([{
              $match: {
                parent: {
                  $exists: true
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }]);

          case 46:
            res.locals.subCategory = _context.sent;

            res.locals.formatDate = function (arg) {
              return (0, _moment["default"])(arg).fromNow();
            };

            res.locals.strip = function (stringWithHTML) {
              var text = stringWithHTML.replace(/<!--[\s\S]*?(-->|$)/g, '').replace(/<(script|style)[^>]*>[\s\S]*?(<\/\1>|$)/gi, '').replace(/<\/?[a-z][\s\S]*?(>|$)/gi, '');
              return text;
            };

            res.locals.siteLink = "https://".concat(req.headers.host);
            res.locals.facebook = settingsInfo == '' ? 'https://facebook.com' : typeof settingsInfo[0].socialMedia.facebook == 'undefined' ? 'https://facebook.com' : "".concat(settingsInfo[0].socialMedia.facebook);
            res.locals.twitter = settingsInfo == '' ? 'https://twitter.com' : typeof settingsInfo[0].socialMedia.twitter == 'undefined' ? 'https://twitter.com' : "".concat(settingsInfo[0].socialMedia.twitter);
            res.locals.instagram = settingsInfo == '' ? 'https://instagram.com' : typeof settingsInfo[0].socialMedia.instagram == 'undefined' ? 'https://instagram.com' : "".concat(settingsInfo[0].socialMedia.instagram);
            res.locals.linkedin = settingsInfo == '' ? 'https://linkedin.com' : typeof settingsInfo[0].socialMedia.linkedin == 'undefined' ? 'https://linkedin.com' : "".concat(settingsInfo[0].socialMedia.linkedin);
            res.locals.youtube = settingsInfo == '' ? 'https://youtube.com' : typeof settingsInfo[0].socialMedia.youtube == 'undefined' ? 'https://youtube.com' : "".concat(settingsInfo[0].socialMedia.youtube);
            res.locals.pinterest = settingsInfo == '' ? 'https://pinterest.com' : typeof settingsInfo[0].socialMedia.pinterest == 'undefined' ? 'https://pinterest.com' : "".concat(settingsInfo[0].socialMedia.pinterest);
            res.locals.textAsIcon = settingsInfo == '' ? false : settingsInfo[0].textAsIcon;
            res.locals.siteLogo = settingsInfo == '' ? 'default.png' : typeof settingsInfo[0].siteLogo == 'undefined' ? 'default.png' : settingsInfo[0].siteLogo;
            res.locals.favicon = settingsInfo == '' ? 'default.png' : typeof settingsInfo[0].favicon == 'undefined' ? 'default.png' : settingsInfo[0].favicon;
            res.locals.siteEmail = settingsInfo == '' ? 'update site email in the admin dashboard' : typeof settingsInfo[0].contactInfo.email == 'undefined' ? 'update site email in the admin dashboard' : settingsInfo[0].contactInfo.email;
            res.locals.siteNumber = settingsInfo == '' ? 'update Phone number in the admin dashboard' : typeof settingsInfo[0].contactInfo.phoneNumber == 'undefined' ? 'update phone number in the admin dashboard' : settingsInfo[0].contactInfo.phoneNumber;
            res.locals.otherInfo = settingsInfo == '' ? 'update this in the admin dashboard' : typeof settingsInfo[0].contactInfo.otherInfo == 'undefined' ? 'update this in the admin dashboard' : settingsInfo[0].contactInfo.otherInfo;
            _context.next = 64;
            return _category["default"].find().populate('parent').sort({
              createdAt: -1
            }).limit(3);

          case 64:
            res.locals.headerCategory = _context.sent;
            res.locals.operatingSystem = process.platform;

            if (!(typeof req.user !== 'undefined')) {
              _context.next = 72;
              break;
            }

            _context.next = 69;
            return _articles["default"].countDocuments({
              postedBy: req.user.id
            });

          case 69:
            _context.t0 = _context.sent;
            _context.next = 73;
            break;

          case 72:
            _context.t0 = null;

          case 73:
            res.locals.myPost = _context.t0;
            res.locals.copyright = settingsInfo == '' ? "Copright ".concat(new Date().getFullYear()) : settingsInfo[0].copyright;
            res.locals.mainSettings = settingsInfo[0];
            _context.next = 78;
            return _ads["default"].find({
              location: 'homepageFooter'
            }).sort({
              createdAt: -1
            });

          case 78:
            res.locals.homepageFooter = _context.sent;
            _context.next = 81;
            return _ads["default"].find({
              location: 'homepageSidebar'
            }).sort({
              createdAt: -1
            });

          case 81:
            res.locals.homepageSidebar = _context.sent;
            _context.next = 84;
            return _ads["default"].find({
              location: 'categoryFooter'
            }).sort({
              createdAt: -1
            });

          case 84:
            res.locals.categoryFooter = _context.sent;
            _context.next = 87;
            return _ads["default"].find({
              location: 'authorFooter'
            }).sort({
              createdAt: -1
            });

          case 87:
            res.locals.authorFooter = _context.sent;
            _context.next = 90;
            return _ads["default"].find({
              location: 'searchFooter'
            }).sort({
              createdAt: -1
            });

          case 90:
            res.locals.searchFooter = _context.sent;

            res.locals.getCat = function (arg) {
              var promise = new Promise(function (resolve, reject) {
                resolve(_category["default"].findOne({
                  slug: arg.split('/').pop()
                }));
              });
              return promise.then(function (data) {
                return data.name;
              });
            };

            next();

          case 93:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()); // Disable post request in the demo
// router.post('*', (req, res, next) => {
// 	if (req.path == '/login') {
// 		return next();
// 	} else {
// 		req.flash('success_msg', 'Post request is disabled in demo');
// 		return res.redirect('back');
// 	}
// });

router.get('/blogger-werden', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var categories, official, articlelength, r, random;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _category["default"].find({});

          case 2:
            categories = _context2.sent;
            _context2.next = 5;
            return _category["default"].findOne({
              slug: "official"
            });

          case 5:
            official = _context2.sent;
            _context2.next = 8;
            return _articles["default"].find({
              "category": {
                $ne: official.id
              }
            }).populate('postedBy').populate('category');

          case 8:
            articlelength = _context2.sent;
            articlelength = articlelength.length;
            r = Math.floor(Math.random() * articlelength);
            _context2.next = 13;
            return _articles["default"].find({
              "category": {
                $ne: official.id
              }
            }).populate('postedBy').populate('category').limit(3).skip(r);

          case 13:
            random = _context2.sent;
            res.render('index', {
              categories: categories,
              random: random
            });

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
var sitemap;
router.get('/sitemap.xml', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var smStream, pipeline, articles, users;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            res.header('Content-Type', 'application/xml');
            res.header('Content-Encoding', 'gzip');

            if (sitemap) {
              res.send(sitemap);
            }

            _context3.prev = 3;
            smStream = new SitemapStream({
              hostname: 'https://dype.me/'
            });
            pipeline = smStream.pipe(createGzip()); // pipe your entries or directly write them.

            smStream.write({
              url: '',
              priority: 1.0
            });
            smStream.write({
              url: '/login',
              priority: 0.9
            });
            smStream.write({
              url: '/sign-up',
              priority: 0.9
            });
            smStream.write({
              url: '/aterlogin',
              priority: 0.9
            });
            smStream.write({
              url: '/blogrecent',
              priority: 0.9
            });
            smStream.write({
              url: '/enterinformation',
              priority: 0.9
            });
            smStream.write({
              url: '/membership',
              priority: 0.9
            });
            smStream.write({
              url: '/publisher',
              priority: 0.9
            });
            smStream.write({
              url: '/show-category-all',
              priority: 0.9
            });
            smStream.write({
              url: '/vision',
              priority: 0.9
            });
            smStream.write({
              url: '/forgot-password',
              priority: 0.9
            });
            _context3.next = 19;
            return _articles["default"].find({}).populate("category").populate('postedBy');

          case 19:
            articles = _context3.sent;
            articles.forEach(function (element) {
              var url = "";

              if (element.postedBy.roleId == "admin") {
                url = "/d/" + element.category.slug + "/" + element.slug;
              } else {
                url = "/p/" + element.category.slug + "/" + element.slug;
              }

              smStream.write({
                url: url,
                priority: 0.9
              });
            });
            _context3.next = 23;
            return _users["default"].find({});

          case 23:
            users = _context3.sent;
            users.forEach(function (element) {
              var url = '/author/' + element.usernameslug;
              smStream.write({
                url: url,
                priority: 0.9
              });
            });
            smStream.end(); // cache the response

            streamToPromise(pipeline).then(function (sm) {
              return sitemap = sm;
            }); // stream write the response

            pipeline.pipe(res).on('error', function (e) {
              throw e;
            });
            _context3.next = 34;
            break;

          case 30:
            _context3.prev = 30;
            _context3.t0 = _context3["catch"](3);
            console.error(_context3.t0);
            res.status(500).end();

          case 34:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 30]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.get('/lostpassword', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            res.render('lostpassword', {
              title: "Lost Passowrd"
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
}()); // payout table download as a pdf.

router.post('/payout/download', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var user;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _users["default"].findOne({
              _id: req.user.id
            });

          case 2:
            user = _context5.sent;
            res.redirect("back");

          case 4:
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
router.get('/paycontent', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            res.render('paycontent', {
              title: "Pay Content"
            });

          case 1:
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
router.post("/loadmore", /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var count, official, articles, randoms, result;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            count = req.body.count;
            _context7.next = 3;
            return _category["default"].findOne({
              slug: "official"
            });

          case 3:
            official = _context7.sent;
            _context7.next = 6;
            return _articles["default"].find({
              "category": {
                "$ne": official.id
              }
            }).populate('postedBy').populate("category");

          case 6:
            articles = _context7.sent;
            _context7.next = 9;
            return _articles["default"].find({
              'category': {
                "$ne": official.id
              }
            }).populate('category').populate('postedBy').limit(6).skip(parseInt(count));

          case 9:
            randoms = _context7.sent;
            result = randoms;
            res.json(result);

          case 12:
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
router.get('/blogrecent', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var userId, user, official, articles, category, usercategoryList, categories, feed, editorsPickerArticle, r0, _editorsPicker, r1, _editorsPicker1, r2, _editorsPicker2, i, _r2, rtrend, trendings, trends, followers, authorarticle, art, j, _newslength, _r, news, randoms, favorites, total_article, _official, articlelength, r, editorsPicker, categorylength, _categories, _trendings, _authorarticle, newest, _news, random;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (!req.user) {
              _context8.next = 92;
              break;
            }

            userId = req.user._id;
            _context8.next = 4;
            return _users["default"].findOne({
              _id: userId
            });

          case 4:
            user = _context8.sent;
            _context8.next = 7;
            return _category["default"].findOne({
              slug: "official"
            });

          case 7:
            official = _context8.sent;
            _context8.next = 10;
            return _articles["default"].find({
              "category": {
                "$ne": official.id
              }
            }).populate('postedBy').populate("category");

          case 10:
            articles = _context8.sent;
            _context8.next = 13;
            return _category["default"].find({});

          case 13:
            category = _context8.sent;
            usercategoryList = user.categoryList;
            categories = [];
            category.forEach(function (element) {
              usercategoryList.forEach(function (item) {
                if (item == element.slug) {
                  categories.push(element);
                }
              });
            });
            feed = [];
            editorsPickerArticle = [];
            articles.forEach(function (article) {
              categories.forEach(function (category) {
                if (article.category.slug == category.slug) {
                  editorsPickerArticle.push(article);
                }
              });
            });
            _context8.t0 = editorsPickerArticle.length;
            _context8.next = _context8.t0 === 0 ? 23 : _context8.t0 === 1 ? 29 : _context8.t0 === 2 ? 35 : _context8.t0 === 3 ? 41 : 43;
            break;

          case 23:
            r0 = Math.floor(Math.random() * articles.length);
            _context8.next = 26;
            return _articles["default"].find({
              "category": {
                $ne: official.id
              }
            }).populate('postedBy').populate('category').limit(3).skip(r0);

          case 26:
            _editorsPicker = _context8.sent;
            feed = _editorsPicker;
            return _context8.abrupt("break", 45);

          case 29:
            r1 = Math.floor(Math.random() * articles.length);
            _context8.next = 32;
            return _articles["default"].find({
              "category": {
                $ne: official.id
              }
            }).populate('postedBy').populate('category').limit(2).skip(r1);

          case 32:
            _editorsPicker1 = _context8.sent;
            feed.push(_editorsPicker1);
            return _context8.abrupt("break", 45);

          case 35:
            r2 = Math.floor(Math.random() * articles.length);
            _context8.next = 38;
            return _articles["default"].find({
              "category": {
                $ne: official.id
              }
            }).populate('postedBy').populate('category').limit(1).skip(r2);

          case 38:
            _editorsPicker2 = _context8.sent;
            feed.push(_editorsPicker2);
            return _context8.abrupt("break", 45);

          case 41:
            feed = editorsPickerArticle;
            return _context8.abrupt("break", 45);

          case 43:
            for (i = feed.length; i < 3; i++) {
              _r2 = Math.floor(Math.random() * editorsPickerArticle.length);
              feed.push(editorsPickerArticle[_r2]);
            }

            return _context8.abrupt("break", 45);

          case 45:
            rtrend = Math.floor(Math.random() * articles.length);
            _context8.next = 48;
            return _articles["default"].find({
              'category': {
                "$ne": official.id
              }
            }).populate('category').populate('postedBy').sort({
              views: -1
            }).sort({
              createdAt: -1
            }).limit(6).skip(rtrend);

          case 48:
            trendings = _context8.sent;
            trends = trendings; // for (var i = 0; i < 6; i++) {
            // 	let r = Math.floor(Math.random() * editorsPickerArticle.length);
            // 	trends.push(editorsPickerArticle[r]);
            // }

            _context8.next = 52;
            return _users["default"].find({
              "following.user": {
                $in: req.user.id
              }
            }).populate("following").sort({
              createdAt: -1
            });

          case 52:
            followers = _context8.sent;
            authorarticle = [];
            _context8.t1 = _regenerator["default"].keys(followers);

          case 55:
            if ((_context8.t2 = _context8.t1()).done) {
              _context8.next = 72;
              break;
            }

            i = _context8.t2.value;
            _context8.next = 59;
            return _articles["default"].find({
              postedBy: followers[i]._id
            }).populate('category').populate('postedBy').sort({
              views: -1
            }).sort({
              createdAt: -1
            });

          case 59:
            art = _context8.sent;
            _context8.t3 = _regenerator["default"].keys(art);

          case 61:
            if ((_context8.t4 = _context8.t3()).done) {
              _context8.next = 70;
              break;
            }

            j = _context8.t4.value;

            if (!(authorarticle.length > 5)) {
              _context8.next = 67;
              break;
            }

            return _context8.abrupt("break", 70);

          case 67:
            authorarticle.push(art[j]);

          case 68:
            _context8.next = 61;
            break;

          case 70:
            _context8.next = 55;
            break;

          case 72:
            _context8.next = 74;
            return _articles["default"].find({
              'category': {
                "$ne": official.id
              }
            });

          case 74:
            _newslength = _context8.sent;
            _newslength = _newslength.length;
            _r = Math.floor(Math.random() * _newslength);
            _context8.next = 79;
            return _articles["default"].find({
              'category': {
                "$ne": official.id
              }
            }).sort({
              createdAt: -1
            }).populate('category').populate('postedBy').limit(3).skip(_r);

          case 79:
            news = _context8.sent;
            _context8.next = 82;
            return _articles["default"].find({
              'category': {
                "$ne": official.id
              }
            }).populate('category').populate('postedBy').limit(6).skip(Math.floor(Math.random() * articles.length));

          case 82:
            randoms = _context8.sent;
            favorites = [];
            _context8.next = 86;
            return _articles["default"].find({}).populate('category').populate('postedBy').sort('create_at').limit(10);

          case 86:
            total_article = _context8.sent;
            categories.forEach(function (element) {
              total_article.forEach(function (item) {
                if (item.category.slug == element.slug) {
                  favorites.push(item);
                }
              });
            });
            console.log(randoms.length);
            res.render('blogrecent', {
              title: 'Blog recent',
              editorsPicker: feed,
              categories: categories,
              trendings: trends,
              authorarticle: authorarticle,
              news: feed,
              newest: news,
              random: randoms,
              favorites: favorites
            });
            _context8.next = 129;
            break;

          case 92:
            _context8.next = 94;
            return _category["default"].findOne({
              slug: "official"
            });

          case 94:
            _official = _context8.sent;
            _context8.next = 97;
            return _articles["default"].find({
              "category": {
                $ne: _official.id
              }
            }).populate('postedBy').populate('category');

          case 97:
            articlelength = _context8.sent;
            articlelength = articlelength.length;
            r = Math.floor(Math.random() * articlelength);
            _context8.next = 102;
            return _articles["default"].find({
              "category": {
                $ne: _official.id
              }
            }).populate('postedBy').populate('category').limit(3).skip(r);

          case 102:
            editorsPicker = _context8.sent;
            _context8.next = 105;
            return _category["default"].find({
              "slug": {
                "$ne": "official"
              }
            });

          case 105:
            categorylength = _context8.sent;
            categorylength = categorylength.length;
            r = Math.floor(Math.random() * categorylength);
            _context8.next = 110;
            return _category["default"].find({
              "slug": {
                "$ne": "official"
              }
            }).limit(6).skip(r);

          case 110:
            _categories = _context8.sent;
            r = Math.floor(Math.random() * articlelength);
            _context8.next = 114;
            return _articles["default"].find({}).populate('postedBy').populate('category').limit(6).skip(r);

          case 114:
            _trendings = _context8.sent;
            r = Math.floor(Math.random() * articlelength);
            _context8.next = 118;
            return _articles["default"].find({}).populate('postedBy').populate('category').limit(3).skip(r);

          case 118:
            _authorarticle = _context8.sent;
            _context8.next = 121;
            return _articles["default"].find({}).sort({
              createdAt: -1
            }).populate('category').populate('postedBy');

          case 121:
            newest = _context8.sent;
            _news = [];
            newest.forEach(function (element) {
              if (element.category.slug != "official") {
                if (_news.length != 3) {
                  _news.push(element);
                }
              }
            });
            r = Math.floor(Math.random() * articlelength);
            _context8.next = 127;
            return _articles["default"].find({}).populate('postedBy').populate('category').limit(6).skip(r);

          case 127:
            random = _context8.sent;
            res.render('blogrecent', {
              title: 'Blog recent',
              editorsPicker: editorsPicker,
              categories: _categories,
              trendings: _trendings,
              authorarticle: _authorarticle,
              news: _news,
              newest: _news,
              random: random
            });

          case 129:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}());
router.get('/ourwork', /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var favorites, userId, user, category, usercategoryList, categories, _favorites, total_article;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (req.user) {
              _context9.next = 7;
              break;
            }

            _context9.next = 3;
            return _articles["default"].find({}).limit(9);

          case 3:
            favorites = _context9.sent;
            res.render('ourwork', {
              title: "Our Work",
              favorites: favorites
            });
            _context9.next = 23;
            break;

          case 7:
            userId = req.user._id;
            _context9.next = 10;
            return _users["default"].findOne({
              _id: userId
            });

          case 10:
            user = _context9.sent;
            _context9.next = 13;
            return _category["default"].find({});

          case 13:
            category = _context9.sent;
            usercategoryList = user.categoryList;
            categories = [];
            category.forEach(function (element) {
              usercategoryList.forEach(function (item) {
                if (item == element.slug) {
                  categories.push(element);
                }
              });
            });
            _favorites = [];
            _context9.next = 20;
            return _articles["default"].find({}).populate('category').populate('postedBy').sort('create_at').limit(10);

          case 20:
            total_article = _context9.sent;
            categories.forEach(function (element) {
              total_article.forEach(function (item) {
                if (item.category.slug == element.slug) {
                  _favorites.push(item);
                }
              });
            });
            res.render('ourwork', {
              title: "Our Work",
              favorites: _favorites
            });

          case 23:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}()); // Get index page

router.get('/', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var users, categories, official, articlelength, r, random, articles, result;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return _users["default"].find({});

          case 3:
            users = _context11.sent;
            users.forEach( /*#__PURE__*/function () {
              var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(element) {
                var username, array, usernameslug;
                return _regenerator["default"].wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        username = element.username.toLowerCase().replace(" ", "");
                        array = username.split('');
                        array.forEach(function (item, index) {
                          if (item == "ß") {
                            array[index] = "ss";
                          }

                          if (item == "ö") {
                            array[index] = "oe";
                          }

                          if (item == "ä") {
                            array[index] = "ae";
                          }

                          if (item == "ü") {
                            array[index] = "ue";
                          }
                        });
                        usernameslug = array.join("");
                        _context10.next = 6;
                        return _users["default"].updateOne({
                          _id: element._id
                        }, {
                          usernameslug: usernameslug
                        });

                      case 6:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              }));

              return function (_x31) {
                return _ref11.apply(this, arguments);
              };
            }());
            _context11.next = 7;
            return _category["default"].find({});

          case 7:
            categories = _context11.sent;
            _context11.next = 10;
            return _category["default"].findOne({
              slug: "official"
            });

          case 10:
            official = _context11.sent;
            _context11.next = 13;
            return _articles["default"].find({
              "category": {
                $ne: official.id
              }
            }).populate('postedBy').populate('category');

          case 13:
            articlelength = _context11.sent;
            articlelength = articlelength.length;
            r = Math.floor(Math.random() * articlelength);
            _context11.next = 18;
            return _articles["default"].find({
              "category": {
                $ne: official.id
              }
            }).populate('postedBy').populate('category').limit(3).skip(r);

          case 18:
            random = _context11.sent;
            _context11.next = 21;
            return _articles["default"].find({}).populate('postedBy').populate('category');

          case 21:
            articles = _context11.sent;
            result = [];
            categories.forEach(function (category) {
              var category_articles = [];
              articles.forEach(function (article) {
                if (article.category.id == category.id) {
                  category_articles.push(article);
                }
              });
              var object = {
                name: category.name,
                articles: category_articles
              };

              if (object.articles.length != 0) {
                result.push(object);
              }
            });
            res.render('publisher', {
              categories: result,
              random: random
            });
            _context11.next = 30;
            break;

          case 27:
            _context11.prev = 27;
            _context11.t0 = _context11["catch"](0);
            next(_context11.t0);

          case 30:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 27]]);
  }));

  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}());
router.post('/api/article/read', /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var token, articleslug, user, article, payload, check;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            token = req.body.token;
            articleslug = req.body.articleslug;
            _context12.next = 4;
            return _users["default"].findOne({
              token: token
            });

          case 4:
            user = _context12.sent;
            _context12.next = 7;
            return _articles["default"].findOne({
              slug: articleslug
            });

          case 7:
            article = _context12.sent;
            payload = {};

            if (!(user.paid == "paid")) {
              _context12.next = 22;
              break;
            }

            _context12.next = 12;
            return _bookmark["default"].findOne({
              articleId: article.id,
              userId: user.id
            });

          case 12:
            check = _context12.sent;

            if (!check) {
              _context12.next = 17;
              break;
            }

            payload = {
              error: "This article Already saved!"
            };
            _context12.next = 20;
            break;

          case 17:
            _context12.next = 19;
            return _bookmark["default"].create({
              articleId: article.id,
              userId: user.id
            });

          case 19:
            payload = {
              error: "Article saved. You can read this article later!"
            };

          case 20:
            _context12.next = 23;
            break;

          case 22:
            payload = {
              error: "You can't save the article because you are not premium member!"
            };

          case 23:
            return _context12.abrupt("return", res.json({
              "data": payload
            }));

          case 24:
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
router.post('/api/content', /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var categoryslug, contentslug, article, payload;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            categoryslug = req.body.categoryslug;
            contentslug = req.body.contentslug;
            _context13.next = 4;
            return _articles["default"].findOne({
              slug: contentslug
            }).populate('postedBy').populate('category');

          case 4:
            article = _context13.sent;
            payload = {
              article: article
            };
            return _context13.abrupt("return", res.json({
              "data": payload
            }));

          case 7:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x35, _x36, _x37) {
    return _ref13.apply(this, arguments);
  };
}());
router.post('/api/search', /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    var searchKey, data, payload;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            searchKey = req.body.key;
            _context14.next = 3;
            return _articles["default"].find({
              active: true,
              $or: [{
                title: {
                  $regex: searchKey,
                  $options: '$i'
                }
              }, {
                tags: {
                  $regex: searchKey,
                  $options: '$i'
                }
              }]
            }).populate('postedBy').populate('category');

          case 3:
            data = _context14.sent;
            payload = {
              articleList: data
            };
            return _context14.abrupt("return", res.json({
              "data": payload
            }));

          case 6:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x38, _x39, _x40) {
    return _ref14.apply(this, arguments);
  };
}());
router.post('/api/contentlist', /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
    var categoryslug, category, articles, payload;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            categoryslug = req.body.categoryslug;
            _context15.next = 3;
            return _category["default"].findOne({
              slug: categoryslug
            });

          case 3:
            category = _context15.sent;
            _context15.next = 6;
            return _articles["default"].find({
              category: category.id
            }).populate('postedBy').populate('category');

          case 6:
            articles = _context15.sent;
            payload = {
              articleList: articles
            };
            return _context15.abrupt("return", res.json({
              "data": payload
            }));

          case 9:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x41, _x42, _x43) {
    return _ref15.apply(this, arguments);
  };
}());
router.post('/api/upfollowlist', /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res, next) {
    var token, user, followers, payload;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            token = req.body.token; // user token

            _context16.next = 3;
            return _users["default"].findOne({
              token: token
            });

          case 3:
            user = _context16.sent;
            _context16.next = 6;
            return _users["default"].find({
              "following.user": {
                $in: user.id
              }
            }).populate("following").sort({
              createdAt: -1
            });

          case 6:
            followers = _context16.sent;
            payload = {
              list: followers
            };
            return _context16.abrupt("return", res.json({
              "data": payload
            }));

          case 9:
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
router.post('/api/savecategory', /*#__PURE__*/function () {
  var _ref17 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(req, res, next) {
    var token, user, categoryList, newList;
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            token = req.body.token; // user token

            _context17.next = 3;
            return _users["default"].findOne({
              token: token
            });

          case 3:
            user = _context17.sent;
            categoryList = req.body.categoryList;
            newList = categoryList.split(",");
            _context17.next = 8;
            return _users["default"].updateOne({
              _id: user._id
            }, {
              $set: {
                categoryList: newList
              }
            }).then(function (element) {
              var payload = {
                successful: element
              };
              return res.json({
                "data": payload
              });
            });

          case 8:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function (_x47, _x48, _x49) {
    return _ref17.apply(this, arguments);
  };
}());
router.post('/api/categories', /*#__PURE__*/function () {
  var _ref18 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(req, res, next) {
    var token, user, categories, payload;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            token = req.body.token; // user token

            _context18.next = 3;
            return _users["default"].findOne({
              token: token
            });

          case 3:
            user = _context18.sent;
            _context18.next = 6;
            return _category["default"].find({});

          case 6:
            categories = _context18.sent;
            payload = {
              categories: categories
            };
            return _context18.abrupt("return", res.json({
              "data": payload
            }));

          case 9:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function (_x50, _x51, _x52) {
    return _ref18.apply(this, arguments);
  };
}());
router.post('/api/home', /*#__PURE__*/function () {
  var _ref19 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(req, res, next) {
    var token, user, usercatList, recentlyArticles, authorArcieles, trendingArticles, categories, favoriteCategories, payload;
    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            token = req.body.token; // user token

            _context19.next = 3;
            return _users["default"].findOne({
              token: token
            });

          case 3:
            user = _context19.sent;
            usercatList = user.categoryList;
            _context19.next = 7;
            return _articles["default"].find({}).populate('category').populate('postedBy').sort('created_at').limit(3);

          case 7:
            recentlyArticles = _context19.sent;
            _context19.next = 10;
            return _articles["default"].find({}).populate('category').populate('postedBy').sort('created_at').limit(3);

          case 10:
            authorArcieles = _context19.sent;
            _context19.next = 13;
            return _articles["default"].find({}).populate('category').populate('postedBy').sort('created_at').sort('views').limit(3);

          case 13:
            trendingArticles = _context19.sent;
            _context19.next = 16;
            return _category["default"].find({});

          case 16:
            categories = _context19.sent;
            favoriteCategories = [];
            usercatList.forEach(function (element) {
              categories.forEach(function (item) {
                if (item.slug == element) {
                  favoriteCategories.push(item);
                }
              });
            });
            payload = {
              recently: recentlyArticles,
              authorArcieles: authorArcieles,
              trendings: trendingArticles,
              favoriteCategories: favoriteCategories
            };
            return _context19.abrupt("return", res.json({
              "data": payload
            }));

          case 21:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));

  return function (_x53, _x54, _x55) {
    return _ref19.apply(this, arguments);
  };
}());
router.get('/search', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(req, res, next) {
    var perPage, page, count, data, datacategory, datauser, random, popular, result_count, search_payload, searchkey, new_count;
    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.prev = 0;

            if (!req.query.q) {
              _context20.next = 39;
              break;
            }

            perPage = 3;
            page = req.query.page || 1;
            _context20.next = 6;
            return _articles["default"].countDocuments({
              active: true,
              $or: [{
                title: {
                  $regex: req.query.q,
                  $options: '$i'
                }
              }, {
                tags: {
                  $regex: req.query.q,
                  $options: '$i'
                }
              }]
            });

          case 6:
            count = _context20.sent;
            _context20.next = 9;
            return _articles["default"].find({
              active: true,
              $or: [{
                title: {
                  $regex: req.query.q,
                  $options: '$i'
                }
              }, {
                tags: {
                  $regex: req.query.q,
                  $options: '$i'
                }
              }]
            }).populate('postedBy').populate('category').skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 9:
            data = _context20.sent;
            _context20.next = 12;
            return _category["default"].find({
              name: {
                $regex: req.query.q,
                $options: '$i'
              }
            }).skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 12:
            datacategory = _context20.sent;
            _context20.next = 15;
            return _users["default"].find({
              active: true,
              username: {
                $regex: req.query.q,
                $options: '$i'
              }
            }).skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 15:
            datauser = _context20.sent;
            _context20.next = 18;
            return _articles["default"].aggregate([{
              $match: {
                active: true
              }
            }, {
              $sample: {
                size: 4
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: '$postedBy'
            }, {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: '$category'
            }]);

          case 18:
            random = _context20.sent;
            _context20.next = 21;
            return _articles["default"].find({}).populate("category").populate("postedBy").sort({
              views: -1
            }).limit(3);

          case 21:
            popular = _context20.sent;
            result_count = false;

            if (data.length == 0 && datacategory.length == 0 && datauser.length == 0) {
              result_count = true;
            }

            search_payload = {
              keystring: req.query.q,
              count: 1,
              date: new Date(),
              noresult: result_count
            };
            _context20.next = 27;
            return _searchkey["default"].findOne({
              keystring: req.query.q
            });

          case 27:
            searchkey = _context20.sent;

            if (!searchkey) {
              _context20.next = 36;
              break;
            }

            new_count = parseInt(searchkey.count) + 1;
            console.log(new_count);
            _context20.next = 33;
            return _searchkey["default"].updateOne({
              _id: searchkey.id
            }, {
              count: new_count
            });

          case 33:
            res.render('search', {
              data: data,
              datacategory: datacategory,
              datauser: datauser,
              search: req.query.q,
              current: page,
              pages: Math.ceil(count / perPage),
              random: random,
              popular: popular
            });
            _context20.next = 37;
            break;

          case 36:
            _searchkey["default"].create(search_payload).then(function (result) {
              res.render('search', {
                data: data,
                datacategory: datacategory,
                datauser: datauser,
                search: req.query.q,
                current: page,
                pages: Math.ceil(count / perPage),
                random: random,
                popular: popular
              });
            });

          case 37:
            _context20.next = 40;
            break;

          case 39:
            res.render('404');

          case 40:
            _context20.next = 45;
            break;

          case 42:
            _context20.prev = 42;
            _context20.t0 = _context20["catch"](0);
            next(_context20.t0);

          case 45:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, null, [[0, 42]]);
  }));

  return function (_x56, _x57, _x58) {
    return _ref20.apply(this, arguments);
  };
}());
router.get('/author/:usernameslug', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref21 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(req, res, next) {
    var user, featured, ip, payload, perPage, page, article, count;
    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.next = 2;
            return _users["default"].findOne({
              usernameslug: req.params.usernameslug
            });

          case 2:
            user = _context21.sent;
            _context21.next = 5;
            return _articles["default"].aggregate([{
              $match: {
                addToFeatured: true,
                active: true
              }
            }, {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            }, {
              $unwind: {
                path: '$postedBy',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'articleId',
                as: 'comments'
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, {
              $limit: 4
            }]);

          case 5:
            featured = _context21.sent;

            if (user) {
              _context21.next = 10;
              break;
            }

            res.render('404');
            _context21.next = 23;
            break;

          case 10:
            ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            payload = {
              ip: ip,
              date: new Date()
            };
            _context21.next = 14;
            return _users["default"].updateOne({
              _id: user.id
            }, {
              $push: {
                viewers: payload
              }
            });

          case 14:
            perPage = 9;
            page = req.query.page || 1;
            _context21.next = 18;
            return _articles["default"].find({
              active: true,
              postedBy: user._id
            }).populate('postedBy').populate('category').skip(perPage * page - perPage).limit(perPage).sort({
              createdAt: -1
            });

          case 18:
            article = _context21.sent;
            _context21.next = 21;
            return _articles["default"].countDocuments({
              active: true,
              postedBy: user._id
            });

          case 21:
            count = _context21.sent;
            res.render('author', {
              author: user,
              article: article,
              featured: featured,
              current: page,
              pages: Math.ceil(count / perPage)
            });

          case 23:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));

  return function (_x59, _x60, _x61) {
    return _ref21.apply(this, arguments);
  };
}());
router.get('/vision', _install["default"].redirectToLogin, /*#__PURE__*/function () {
  var _ref22 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(req, res, next) {
    return _regenerator["default"].wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            res.render('vision');

          case 1:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));

  return function (_x62, _x63, _x64) {
    return _ref22.apply(this, arguments);
  };
}());
router.get('/membership', /*#__PURE__*/function () {
  var _ref23 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23(req, res, next) {
    return _regenerator["default"].wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            res.render('membership');

          case 1:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23);
  }));

  return function (_x65, _x66, _x67) {
    return _ref23.apply(this, arguments);
  };
}());
router.post('/reset-password', /*#__PURE__*/function () {
  var _ref24 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24(req, res, next) {
    var user, payload;
    return _regenerator["default"].wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.next = 2;
            return _users["default"].findOne({
              email: req.body.email
            });

          case 2:
            user = _context24.sent;

            if (req.body.email) {
              _context24.next = 7;
              break;
            }

            req.flash("error_msg", "Please enter your email!");
            _context24.next = 15;
            break;

          case 7:
            if (!(user == null)) {
              _context24.next = 11;
              break;
            }

            req.flash("error_msg", "I am sorry. User Doesn't exist!");
            _context24.next = 15;
            break;

          case 11:
            req.flash("success_msg", "Please check your email.");
            payload = {
              username: user.firstName,
              siteLink: res.locals.siteLink,
              token: user.token
            };
            _context24.next = 15;
            return (0, _mail2["default"])("Passwort-Änderung erfolgreich", user.email, "reset-password-email", payload, req.headers.host, function (err, info) {
              if (err) console.log(err);
            });

          case 15:
            res.redirect("back");

          case 16:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24);
  }));

  return function (_x68, _x69, _x70) {
    return _ref24.apply(this, arguments);
  };
}()); // This is the password - reset part.
// Currently password encryption is not working.

router.get('/password-reset', /*#__PURE__*/function () {
  var _ref25 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25(req, res, next) {
    var token;
    return _regenerator["default"].wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            // user token
            token = req.query.token;
            res.render('password-reset', {
              token: token
            });

          case 2:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25);
  }));

  return function (_x71, _x72, _x73) {
    return _ref25.apply(this, arguments);
  };
}());
router.post('/password-save', /*#__PURE__*/function () {
  var _ref26 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26(req, res, next) {
    var user, newpassword;
    return _regenerator["default"].wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            _context26.next = 2;
            return _users["default"].findOne({
              token: req.body.token
            });

          case 2:
            user = _context26.sent;

            if (!(req.body.password !== req.body.conform)) {
              _context26.next = 8;
              break;
            }

            req.flash("success_msg", "Password Does'nt match");
            return _context26.abrupt("return", res.redirect('back'));

          case 8:
            newpassword = "";

            _bcryptNodejs["default"].genSalt(12, function (err, salt) {
              if (err) return next(err);

              _bcryptNodejs["default"].hash(req.body.password, salt, null, function (err, hash) {
                if (err) return next(err);
                newpassword = hash;

                _users["default"].updateOne({
                  _id: user.id
                }, {
                  password: newpassword
                }).then(function (result) {
                  req.flash("success_msg", "Successful");
                  res.redirect('/login');
                });
              });
            });

          case 10:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26);
  }));

  return function (_x74, _x75, _x76) {
    return _ref26.apply(this, arguments);
  };
}());
module.exports = router;