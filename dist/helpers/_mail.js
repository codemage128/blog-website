"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _ejs = _interopRequireDefault(require("ejs"));

var _fs = _interopRequireDefault(require("fs"));

var _settings = _interopRequireDefault(require("../models/settings"));

var readHTMLFile = function readHTMLFile(path, callback) {
  _fs["default"].readFile(path, {
    encoding: 'utf-8'
  }, function (err, html) {
    if (err) callback(err);else callback(null, html);
  });
};

module.exports = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(subject, to, html, replace, siteUrl, callback) {
    var set, gmailAuth, gmailSmtpTransport, sendgridSmtpTransport, smtpTransport, transporter;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _settings["default"].findOne();

          case 2:
            set = _context.sent;
            // Gmail Config
            gmailAuth = {
              type: 'oauth2',
              user: set.email.config.gmail.username,
              clientId: set.email.config.gmail.clientId,
              clientSecret: set.email.config.gmail.clientSecret,
              refreshToken: set.email.config.gmail.refreshToken
            };
            gmailSmtpTransport = _nodemailer["default"].createTransport({
              service: 'gmail',
              auth: gmailAuth
            }); // Sendgrid Config

            sendgridSmtpTransport = _nodemailer["default"].createTransport({
              service: 'sendgrid',
              auth: {
                user: set.email.config.sendgrid.username,
                pass: set.email.config.sendgrid.password
              },
              tls: {
                rejectUnauthorized: false
              }
            }); // SMTP config

            smtpTransport = _nodemailer["default"].createTransport({
              host: set.email.config.smtp.host,
              port: set.email.config.smtp.port,
              secure: true,
              tls: {
                rejectUnauthorized: false
              },
              auth: {
                user: set.email.config.smtp.username,
                pass: set.email.config.smtp.password
              }
            }); // Aws Config

            _awsSdk["default"].config.update({
              accessKeyId: set.email.config.aws.accessKeyId,
              secretAccessKey: set.email.config.aws.secretAccessKey,
              region: set.email.config.aws.region
            }); // create Nodemailer SES transporter


            transporter = _nodemailer["default"].createTransport({
              SES: new _awsSdk["default"].SES({
                apiVersion: '2010-12-01'
              })
            });
            _context.t0 = set.email.provider;
            _context.next = _context.t0 === 'gmail' ? 12 : _context.t0 === 'sendgrid' ? 14 : _context.t0 === 'smtp' ? 16 : _context.t0 === 'aws' ? 18 : 20;
            break;

          case 12:
            readHTMLFile(__dirname + "/../views/email-templates/".concat(html, ".html"), function (err, html) {
              var template = _ejs["default"].compile(html);

              var replacements = replace;
              var htmlToSend = template(replacements);
              var mailOptions = {
                to: to,
                from: "".concat(set.siteName, " no-reply@").concat(siteUrl),
                subject: subject,
                html: htmlToSend,
                sender: "no-reply@".concat(siteUrl),
                replyTo: "no-reply@".concat(siteUrl)
              };
              gmailSmtpTransport.sendMail(mailOptions, function (err, info) {
                if (err) callback(err);else callback(null, info);
              });
            });
            return _context.abrupt("break", 21);

          case 14:
            readHTMLFile(__dirname + "/../views/email-templates/".concat(html, ".html"), function (err, html) {
              var template = _ejs["default"].compile(html);

              var replacements = replace;
              var htmlToSend = template(replacements);
              var mailOptions = {
                to: to,
                from: "".concat(set.siteName, " <no-reply@").concat(siteUrl, ">"),
                // from: "dype",
                subject: subject,
                html: htmlToSend,
                sender: "no-reply@".concat(siteUrl),
                replyTo: "no-reply@".concat(siteUrl)
              };
              sendgridSmtpTransport.sendMail(mailOptions, function (err, info) {
                if (err) callback(err);else callback(null, info);
              });
            });
            return _context.abrupt("break", 21);

          case 16:
            readHTMLFile(__dirname + "/../views/email-templates/".concat(html, ".html"), function (err, html) {
              var template = _ejs["default"].compile(html);

              var replacements = replace;
              var htmlToSend = template(replacements);
              var mailOptions = {
                to: to,
                from: "".concat(set.siteName, " <no-reply@").concat(siteUrl, ">"),
                subject: subject,
                html: htmlToSend,
                sender: "no-reply@".concat(siteUrl),
                replyTo: "no-reply@".concat(siteUrl)
              };
              smtpTransport.sendMail(mailOptions, function (err, info) {
                if (err) callback(err);else callback(null, info);
              });
            });
            return _context.abrupt("break", 21);

          case 18:
            readHTMLFile(__dirname + "/../views/email-templates/".concat(html, ".html"), function (err, html) {
              var template = _ejs["default"].compile(html);

              var replacements = replace;
              var htmlToSend = template(replacements);
              var mailOptions = {
                to: to,
                from: "".concat(set.siteName, " <no-reply@").concat(siteUrl, ">"),
                subject: subject,
                html: htmlToSend,
                sender: "no-reply@".concat(siteUrl),
                replyTo: "no-reply@".concat(siteUrl)
              };
              transporter.sendMail(mailOptions, function (err, info) {
                if (err) callback(err);else callback(null, info);
              });
            });
            return _context.abrupt("break", 21);

          case 20:
            return _context.abrupt("break", 21);

          case 21:
            ;

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
}();