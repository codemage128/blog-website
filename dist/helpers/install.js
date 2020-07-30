"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _users = _interopRequireDefault(require("../models/users"));

var _settings = _interopRequireDefault(require("../models/settings"));

var _in = _interopRequireDefault(require("../models/in"));

var install = {};

install.checkStatus = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var active;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _in["default"].findOne({
              yes: true
            });

          case 2:
            active = _context.sent;

            if (active) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", res.redirect("/install"));

          case 7:
            //return res.send(`You havent verified your purchase code, go back to ${req.headers.host}/install to verify your purchase code`);
            next();

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

install.redirectToLogin = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var settings, user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _settings["default"].findOne();

          case 2:
            settings = _context2.sent;
            _context2.next = 5;
            return _users["default"].findOne({
              roleId: "admin"
            });

          case 5:
            user = _context2.sent;

            if (settings) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", res.redirect("/install"));

          case 10:
            if (user) {
              _context2.next = 14;
              break;
            }

            return _context2.abrupt("return", res.redirect("/install/admin"));

          case 14:
            next();

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
}();

install.redirectToAdmin = install.checkStatus, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _users["default"].findOne({
              roleId: "admin"
            });

          case 2:
            user = _context3.sent;
            if (user) res.render("404");else next();

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
install.disableInstallPage = install.checkStatus, /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var set, user, yes;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _settings["default"].findOne();

          case 2:
            set = _context4.sent;
            _context4.next = 5;
            return _users["default"].findOne({
              roleId: "admin"
            });

          case 5:
            user = _context4.sent;
            _context4.next = 8;
            return _in["default"].findOne({
              yes: true
            });

          case 8:
            yes = _context4.sent;
            if (set && user) res.render("404");else if (set && !user) {
              if (yes) {
                res.redirect("/install/admin");
              } else {
                res.render("install");
              }
            } else next();

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

install.redirect = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var set, user, yes;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _settings["default"].findOne();

          case 2:
            set = _context5.sent;
            _context5.next = 5;
            return _users["default"].findOne({
              roleId: "admin"
            });

          case 5:
            user = _context5.sent;
            _context5.next = 8;
            return _in["default"].findOne({
              yes: true
            });

          case 8:
            yes = _context5.sent;
            if (set && user) res.render("404");else if (set && !user) {
              if (yes) {
                res.redirect("/install/admin");
              } else res.render("install");
            } else next();

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

var _default = install;
exports["default"] = _default;