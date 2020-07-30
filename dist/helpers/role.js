"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = permit;

function permit() {
  for (var _len = arguments.length, allowed = new Array(_len), _key = 0; _key < _len; _key++) {
    allowed[_key] = arguments[_key];
  }

  var isAllowed = function isAllowed(roleId) {
    return allowed.indexOf(roleId) > -1;
  };

  return function (req, res, next) {
    if (req.user && isAllowed(req.user.roleId)) next();else {
      res.render('404');
    }
  };
}

;