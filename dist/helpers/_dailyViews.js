"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _views = _interopRequireDefault(require("../models/views"));

function _default(_x, _x2, _x3) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var ip, date, _view;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ip = req.headers['x-fowarded-for'] || req.connection.remoteAddress;

            Date.prototype.getWeek = function () {
              var dt = new Date(this.getFullYear(), 0, 1);
              return Math.ceil(((this - dt) / 86400000 + dt.getDay() + 1) / 7);
            };

            date = new Date().toLocaleDateString().split('/').join('-');
            _context.next = 5;
            return _views["default"].findOne({
              viewerIp: ip,
              date: date
            });

          case 5:
            _view = _context.sent;

            if (_view) {
              _context.next = 12;
              break;
            }

            _context.next = 9;
            return _views["default"].create({
              viewerIp: ip,
              date: date,
              week: new Date().getWeek(),
              month: new Date().getMonth(),
              year: new Date().getFullYear()
            });

          case 9:
            return _context.abrupt("return", next());

          case 12:
            return _context.abrupt("return", next());

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ref.apply(this, arguments);
}

;