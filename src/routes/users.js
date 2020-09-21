"use strict";

import express from "express";
import User from "../models/users";
import Subscription from "../models/subscription";
import StripeSession from "../models/stripesession";
import Category from '../models/category';
import crypto from "crypto";
import formidable from "formidable";
import _mail from "../helpers/_mail";
import Settings from "../models/settings";
import passport from "../helpers/passport";
import fs, { stat } from "fs";
import path from "path";
import auth from "../helpers/auth";
import AWS, { Backup } from "aws-sdk";
import { v2 as cloudinary } from "cloudinary";
import Article from "../models/articles";
import Counting from "../models/counting";
import average from "../models/average";
const router = express.Router();
import install from "../helpers/install";
import role from "../helpers/role";
import Newsletter from "../models/newsletter";
import dotenv from "dotenv";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

dotenv.config({ path: "./.env" });
// Prevent logged in users from viewing the sign up and login page
function checkIfLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return res.redirect(`back`);
  else {
    next();
  }
}
// Facebook Login auth
router.get(
  "/auth/facebook",
  install.redirectToLogin,
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    successRedirect: "/"
  })
);
// Google login auth
router.get(
  "/auth/google",
  install.redirectToLogin,
  passport.authenticate("google", { scope: ["profile", "email"], state: "signup" })
);
router.get(
  "/auth/google/login",
  install.redirectToLogin,
  // passport.authenticate("google", { scope: ["profile", "email"], state: "login" })
  passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "openid"], state: "login" })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/sign-up",
  }), async (req, res) => {
    let signupProcess = req.user.signupProcess;
    var state = req.query.state;
    if (state == 'login') {
      if (req.authInfo == 'exist') {
        res.redirect(signupProcess);
      } else if (req.authInfo == "create") {
        await User.deleteOne({ _id: req.user._id });
        res.redirect('/sign-up');
      }
    } else if (state == 'signup') {
      if (req.authInfo == 'exist') {
        res.redirect(signupProcess);
      } else if (req.authInfo == "create") {
        res.redirect('/enterinformation');
      }
    }
  }
);

router.get(
  '/enterinformation',
  install.redirectToLogin,
  (req, res, next) => {
    res.render('enter-information');
  }
);

router.post(
  '/information-from',
  install.redirectToLogin,
  async (req, res, next) => {
    let fromgoogle = req.body.fromgoogle;
    let fromfacebook = req.body.fromfacebook;
    let fromlinkedin = req.body.fromlinkedin;
    let frominstagram = req.body.frominstagram;
    let fromother = req.body.fromother;
    if (!(fromgoogle == "on" || fromfacebook == "on" || fromlinkedin == "on" ||
      frominstagram == "on" || fromother == "on")) {
      req.flash("error_msg", "Bitte wähle einen Punkt aus");
      return res.redirect('back');
    }

    await User.updateOne({ _id: req.user.id }, req.body)
      .then(user => {
        return res.redirect("/onboarding");
      })
      .catch(err => next(err));
    await User.updateOne({ _id: req.user.id }, { $set: { signupProcess: "/onboarding" } })
      .then(user => {
        return res.redirect("/onboarding");
      })
      .catch(err => next(err));
  }
);

router.get('/show-category-all', async (req, res, next) => {
  try {
    var categories = await Category.find({}).limit(20);
    res.render('showcategory', {
      categories: categories,
    })
  } catch (error) {
    next(error);
  }
});

router.post('/category/show-more', install.redirectToLogin, async (req, res, next) => {
  try {
    let showCnt = req.body.categoryCount;
    let categories = await Category.find({}).limit(20).skip(parseInt(showCnt));
    res.json(categories);
  } catch (error) {
    next(error);
  }
});
router.get('/downgrade', install.redirectToLogin, async (req, res, next) => {
  await User.updateOne({ _id: req.query.user }, { paid: "free", signupProcess: "/blogrecent" });
  // res.redirect('back');
  res.redirect('/onboarding');
});
router.get('/onboarding', install.redirectToLogin, async (req, res, next) => {
  let redirect = req.query.redirect ? true : false;
  try {
    let categoryCount = 2;
    let stripeSession_id = req.query.session_id;
    if (stripeSession_id) {
      //paid account for paid account stripe connection successfully
      let session = await stripe.checkout.sessions.retrieve(stripeSession_id);
      let stripesession = await StripeSession.create(session);
      console.log(stripesession._id);
      categoryCount = 10
      let user = await User.findOne({ _id: req.user.id });
      await User.updateOne({ _id: req.user.id }, { $set: { paid: "paid" } });
      if (user.emailsend) {
        let payload = {
          email: user.email.trim(),
          username: user.username.trim().toLowerCase(),
          firstName: user.firstName,
          lastName: user.lastName,
          siteLink: res.locals.siteLink,
        };
        await _mail(
          "Nun bist du Premium-Member!",
          user.email,
          "paid-email",
          payload,
          req.headers.host,
          (err, info) => {
            if (err) console.log(err);
          }
        )
      }
    }
    if (req.user.paid == "paid") {
      categoryCount = 10;
    }
    var categories = await Category.find({}).limit(20);
    console.log(redirect);
    if (!redirect && !stripeSession_id) {
      let user = await User.findOne({ _id: req.user.id });
      console.log(user.emailsend);
      if (user.emailsend) {
        let payload = {
          email: user.email.trim(),
          username: user.username.trim().toLowerCase(),
          firstName: user.firstName,
          lastName: user.lastName,
          siteLink: res.locals.siteLink,
        };
        await _mail(
          "Herzlichen Glückwunsch",
          user.email,
          "onboarding-email",
          payload,
          req.headers.host,
          (err, info) => {
            if (err) console.log(err);
          }
        )
      }
    }
    res.render('onboarding', {
      categoryCount: categoryCount,
      categories: categories,
      redirect: redirect
    })
  } catch (error) {
    next(error);
  }
});

router.post('/onboarding', install.redirectToLogin, async (req, res, next) => {
  try {
    await User.updateOne({ _id: req.user._id }, { $set: { signupProcess: "/onboarding" } });
    var categoryCount = req.body.categoryCount;
    if (categoryCount == 10) {
      await User.updateOne({ _id: req.user._id }, { $set: { paid: "paid" } });
    }
    var categories = await Category.find({}).limit(20);
    res.render('onboarding', {
      categoryCount: categoryCount,
      categories: categories,
      redirect: false
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/choose-category',
  install.redirectToLogin,
  auth,
  role("user"),
  async (req, res, next) => {
    var categoryCount = req.body.categoryCount;
    let listString = req.body.categoryList;
    let categoryList = listString.split(",");
    var paid = "free";
    if (categoryCount == 10) {
      paid = 'paid';
    }
    await User.updateOne({ _id: req.user._id }, { $set: { paid: paid, categoryList: categoryList, signupProcess: "/blogrecent" } });
    if (req.body.redirect == "true") {
      return res.redirect('/user/profile');
    } else {
      return res.redirect('/blogrecent');
    }
  }
);

// Twitter login auth
router.get(
  "/auth/twitter",
  install.redirectToLogin,
  passport.authenticate("twitter")
);
router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/login",
    successRedirect: "/"
  })
);

// Vkontakte login auth
router.get(
  "/auth/vkontakte",
  install.redirectToLogin,
  passport.authenticate("vkontakte", { scope: ["email"] })
);
router.get(
  "/auth/vkontakte/callback",
  passport.authenticate("vkontakte", {
    failureRedirect: "/login",
    successRedirect: "/"
  })
);

// Get sign up page
router.get(
  "/sign-up",
  install.redirectToLogin,
  checkIfLoggedIn,
  (req, res, next) => {
    res.render("sign-up");
  }
);
router.post("/api/sign-up", async (req, res, next) => {
  let message = "";
  let set = await Settings.findOne();
  // SOLVED SETTINGS BUG, USED SET[0] INSTEAD OF SET
  if (set.registrationSystem == true) {
    let username = req.body.username.trim().toLowerCase();
    let array = username.split('');
    array.forEach((element, index) => {
      if (element == "ß") {
        array[index] = "ss";
      }
      if (element == "ö") { array[index] = "oe"; }
      if (element == "ä") { array[index] = "ae"; }
      if (element == "ü") { array[index] = "ue"; }
    });
    let usernameslug = array.join("");
    let token = crypto.randomBytes(16).toString("hex");
    let payload = {};
    if (token) {
      payload = {
        email: req.body.email.trim(),
        password: req.body.password.trim(),
        token: token,
        username: req.body.username.trim().toLowerCase(),
        usernameslug: usernameslug,
        profilePicture:
          "https://gravatar.com/avatar/" +
          crypto
            .createHash("md5")
            .update(req.body.email)
            .digest("hex")
            .toString() +
          "?s=200" +
          "&d=retro",
        active:
          typeof set.emailVerification == "undefined"
            ? true
            : set.emailVerification == true
              ? false
              : true,
        roleId: "user",
        firstName: "Not Specified",
        lastName: "Not Specified",
        siteLink: res.locals.siteLink,
        logo: res.locals.siteLogo,
        instagram: res.locals.instagram,
        facebook: res.locals.facebook,
        emailsend: true,
        twitter: res.locals.twitter,
        signupProcess: "/enterinformation"
      };
    }
    if (req.body.password !== req.body.cPassword) {
      message = { "Error": "Password Doesn't match" }
      return res.json(message);
    } else {
      let check = await User.findOne({ email: req.body.email });
      if (check) {
        message = { "Error": "Email has been used" }
        return res.json(message);
      } else {
        let user = await User.create(payload);
        // SOLVED SETTINGS BUG, USED SET[0] INSTEAD OF SET
        set.emailVerification == true
          ? await _mail(
            "Verifizierung deiner E-Mail",
            req.body.email,
            "reg-email",
            payload,
            req.headers.host,
            (err, info) => {
              if (err) console.log(err);
            }
          )
          : null;
        if (set.emailVerification == true) {
          message = { "Error": "Registrierung erfolgreich. Bitte prüfe deine Mails, um den Vorgang abzuschließen." }
          return res.json(message);
        } else {
          if (set.autoLogin == true) {
            req.logIn(user, function (err) {
              if (err) return next(err);
              if (user.roleId === "user") {
                //return res.redirect(`/user/dashboard`);
              } else if (user.roleId === "admin") {
                //return res.redirect(`/dashboard/index`);
              }
            });
          } else {
            message = { "Success": "Registration Successfull" }
            return res.json(message);
          }
        }
      }
    }
  } else {
    message = { "ERROR": "not registersystem" };
    return res.json(message);
  }
});

// Create a new user
router.post(
  "/sign-up",
  install.redirectToLogin,
  checkIfLoggedIn,
  async (req, res, next) => {
    if (!req.body['g-recaptcha-response']) {
      req.flash("success_msg", "Captcha is required!");
      return res.redirect("back");
    } else {
      try {
        let set = await Settings.findOne();
        // SOLVED SETTINGS BUG, USED SET[0] INSTEAD OF SET
        if (set.registrationSystem == true) {
          let username = req.body.username.trim().toLowerCase();
          let array = username.split('');
          array.forEach((element, index) => {
            if (element == "ß") {
              array[index] = "ss";
            }
            if (element == "ö") { array[index] = "oe"; }
            if (element == "ä") { array[index] = "ae"; }
            if (element == "ü") { array[index] = "ue"; }
          });
          let usernameslug = array.join("");
          let payload = {
            email: req.body.email.trim(),
            password: req.body.password.trim(),
            token: crypto.randomBytes(16).toString("hex"),
            username: req.body.username.trim().toLowerCase(),
            usernameslug: usernameslug,
            profilePicture:
              "https://gravatar.com/avatar/" +
              crypto
                .createHash("md5")
                .update(req.body.email)
                .digest("hex")
                .toString() +
              "?s=200" +
              "&d=retro",
            active:
              typeof set.emailVerification == "undefined"
                ? true
                : set.emailVerification == true
                  ? false
                  : true,
            roleId: "user",
            firstName: "Not Specified",
            lastName: "Not Specified",
            siteLink: res.locals.siteLink,
            logo: res.locals.siteLogo,
            instagram: res.locals.instagram,
            facebook: res.locals.facebook,
            twitter: res.locals.twitter,
            emailsend: true,
            signupProcess: "/enterinformation"
          };
          if (req.body.password !== req.body.cPassword) {
            req.flash("success_msg", "Password Does/'nt match");
            return res.redirect("back");
          } else {
            let check = await User.findOne({ email: req.body.email });
            if (check) {
              req.flash("success_msg", "Email has been used");
              return res.redirect("back");
            } else {
              let user = await User.create(payload);
              // SOLVED SETTINGS BUG, USED SET[0] INSTEAD OF SET
              set.emailVerification == true
                ? await _mail(
                  "Verifizierung deiner E-Mail",
                  req.body.email,
                  "reg-email",
                  payload,
                  req.headers.host,
                  (err, info) => {
                    if (err) console.log(err);
                  }
                )
                : null;
              if (set.emailVerification == true) {
                req.flash(
                  "success_msg",
                  "Registrierung erfolgreich. Bitte prüfe deine Mails, um den Vorgang abzuschließen."
                );
                return res.redirect("back");
              } else {
                if (set.autoLogin == true) {
                  req.logIn(user, function (err) {
                    if (err) return next(err);
                    if (user.roleId === "user") {
                      return res.redirect(`/user/dashboard`);
                    } else if (user.roleId === "admin") {
                      return res.redirect(`/dashboard/index`);
                    }
                  });
                } else {
                  req.flash("success_msg", "Registration Successfull");
                  return res.redirect("/login");
                }
              }
            }
          }
        } else {
          res.render("404");
        }
      } catch (e) {
        next(e);
      }
    }
  }
);

// Create a new user manually
router.post("/user/create", install.redirectToLogin, async (req, res, next) => {
  try {
    req.body.roleId = !req.body.roleId ? "user" : req.body.roleId;
    req.body.email = req.body.email.trim();
    req.body.password = req.body.password.trim();
    req.body.username = req.body.username.trim();
    req.body.active = true;
    req.body.firstName =
      req.body.firstName == "" ? "Not Specified" : req.body.firstName;
    req.body.lastName =
      req.body.lastName == "" ? "Not Specified" : req.body.lastName;
    req.body.profilePicture =
      "https://gravatar.com/avatar/" +
      crypto
        .createHash("md5")
        .update(req.body.email)
        .digest("hex")
        .toString() +
      "?s=200" +
      "&d=retro";
    req.body.signupProcess = "/enterinformation";
    let check = await User.findOne({ email: req.body.email });
    let username = await User.findOne({ username: req.body.username });
    if (check || username) {
      req.flash("success_msg", `${check ? "Email" : "Username"} has been used`);
      return res.redirect("back");
    } else {
      req.body.siteLink = res.locals.siteLink;
      req.body.logo = res.locals.siteLogo;
      req.body.instagram = res.locals.instagram;
      req.body.facebook = res.locals.facebook;
      req.body.twitter = res.locals.twitter;
      let payload = req.body;
      await User.create(req.body);
      await _mail(
        "Verifizierung deiner E-Mail",
        req.body.email,
        "reg-email",
        payload,
        req.headers.host,
        (err, info) => {
          if (err) console.log(err);
        }
      )
      req.flash("success_msg", "Registrierung erfolgreich. Bitte prüfe deine Mails, um den Vorgang abzuschließen.");
      return res.redirect("back");
    }
  } catch (e) {
    next(e);
  }
});

// Verify a user account route
router.get(
  "/verify-account",
  install.redirectToLogin,
  checkIfLoggedIn,
  async (req, res, next) => {
    let set = await Settings.findOne();
    try {
      if (req.query.token) {
        // check if the token exist
        User.findOne({ token: req.query.token }).then(user => {
          if (!user) {
            req.flash(
              "success_msg",
              "The token is inavlid, pls check your mail again"
            );
            return res.redirect("back");
          } else {
            // user.token = undefined;
            user.active = true;
            user.verified = true;
            user
              .save()
              .then(user => {
                if (set.autoLogin) {
                  req.logIn(user, (err, user) => {
                    if (err) return next(err);
                    return res.redirect('/enterinformation');
                  });
                } else {
                  req.flash(
                    "success_msg",
                    "Account Verified Successfully, you can now login."
                  );
                  res.redirect("/login");
                }
              })
              .catch(err => next(err));
          }
        });
      } else {
        res.render("404");
      }
    } catch (e) {
      next(e);
    }
  }
);
// Get login route
router.get(
  "/login",
  install.redirectToLogin,
  checkIfLoggedIn,
  (req, res, next) => {
    res.render("login", { title: res.locals.siteTitle });
  }
);
// router.get('/afterlogin', install.redirectToLogin, async (req, res, next) => {
//   if (req.user) {
//     let editorsPicker = await Article.find({
//       addToBreaking: true
//     }).populate('category').populate('postedBy').limit(3);

//     if (editorsPicker.length == 0) {
//       let a = [];
//       for (var i = 0; i < req.user.categoryList.length; i++) {
//         var usercategory = req.user.categoryList[i];
//         let _category = await Category.find({
//           slug: usercategory
//         });
//         let article = await Article.find({
//           category: _category[0]._id
//         }).populate('category').populate('postedBy');
//         for (var b in article) {
//           if (article[b].category.slug != 'official') {
//             a.push(article[b]);
//           }
//         }
//       }
//       for (var i in a) {
//         if (a[i].short.split(' ').length > 900) {
//           if (editorsPicker.length > 2) {
//             break;
//           }
//           editorsPicker.push(a[i]);
//         }
//       }
//     }
//     let followers = await User.find({
//       "following.user": { $in: req.user.id }
//     }).populate("following").sort({ createdAt: -1 });
//     let authorarticle = [];
//     for (var i in followers) {
//       let art = await Article.find({
//         postedBy: followers[i]._id
//       }).populate('category').populate('postedBy').sort({ createdAt: -1 });
//       for (var j in art) {
//         if (art[j].category.slug != "official") {
//           if (authorarticle.length > 5) {
//             break;
//           } else {
//             authorarticle.push(art[j]);
//           }
//         }
//       }
//     }

//     // let authorarticle = await Article.find({ postedBy: req.user.id }).populate('category');

//     let usercategoryList = req.user.categoryList;
//     let popular = await Article.find({
//       active: true,
//     }).populate('category')
//       .sort({ views: -1 })
//     let p = [];
//     usercategoryList.forEach(item => {
//       popular.forEach(element => {
//         if (element.category.slug != "official") {
//           if (item == element.category.slug) {
//             if (p.length < 6) {
//               p.push(element);
//             }
//           }
//         }
//       })
//     })
//     let random = await Article.find({}).populate('category').populate('postedBy');
//     let r = [];
//     random.forEach(element => {
//       if (element.category.slug != "official") {
//         if (r.length < 6) {
//           r.push(element);
//         }
//       }
//     });
//     let e = [];
//     editorsPicker.forEach(element => {
//       if (element.category.slug != 'official') {
//         e.push(element);
//       }
//     });
//     editorsPicker = e;
//     let currentUser = await User.findOne({ _id: req.user._id });
//     let favoriteCat = currentUser.categoryList;
//     let category = await Category.find({});
//     let categories = []
//     favoriteCat.forEach(element => {
//       category.forEach(items => {
//         if (element == items.slug) {
//           categories.push(items);
//         }
//       });
//     });
//     res.render('afterloginuser', {
//       title: "After Login",
//       editorsPicker: editorsPicker,
//       authorarticle: authorarticle,
//       popular: p,
//       random: r,
//       categories: categories
//     });
//   } else {
//     let random = await Article.find({}).populate('category').populate('postedBy');
//     let r = [];
//     random.forEach(element => {
//       if (element.category.slug != "official") {
//         if (r.length < 6) {
//           r.push(element);
//         }
//       }
//     });
//     let e = [];
//     let editorsPicker = [];
//     random.forEach(element => {
//       if (element.category.slug != 'official') {
//         if (e.length < 6) {
//           e.push(element);
//         }
//       }
//     });
//     editorsPicker = e;
//     let categories = await Category.find({}).limit(6);
//     res.render('afterloginuser', {
//       title: "After Login",
//       editorsPicker: editorsPicker,
//       authorarticle: r,
//       popular: r,
//       random: r,
//       categories: categories
//     });
//   }
// });

router.post("/api/login", (req, res, next) => {
  var message = "";
  console.log(req.body);

  passport.authenticate("local", function (err, user, info) {
    if (err) return next(err);
    if (!user) {
      message = { "Error": "Incorect Email or password" };
      return res.json(message);
    }
    if (typeof user.active == "boolean" && user.active === false) {
      message = { "Error": "Your account is not active, check your email to activate your account" };
      return res.json(message);
    }
    if (user.banned === true) {
      message = { "Error": "Your Account has been suspended, You can visit the contact page for help." };
      return res.json(message);
    }
    req.logIn(user, function (err) {
      if (err) return next(err);
      if (user.roleId === "user") {
        // return res.redirect(`/user/dashboard`);
        message = { "Success": user };
        return res.json(message);
      } else if (user.roleId === "admin") {
        return res.redirect(`/dashboard/index`);
      }
    });
  })(req, res, next);
});

router.get("/close", (req, res, next) => {
  res.render('closeaccount', {
    title: "Close Account",
  });
});

router.post("/close", async (req, res, next) => {
  await User.updateOne({ _id: req.user.id }, { closed: true });
  let user = await User.findOne({ _id: req.user.id });
  if (user.emailsend) {
    let payload = {
      email: user.email.trim(),
      username: user.username.trim().toLowerCase(),
      firstName: user.firstName,
      lastName: user.lastName,
      siteLink: res.locals.siteLink,
    };
    await _mail(
      "Löschung deines Accounts",
      user.email,
      "account-delete-email",
      payload,
      req.headers.host,
      (err, info) => {
        if (err) console.log(err);
      }
    )
  }
  await User.deleteOne({ _id: req.user.id });
  await Article.deleteMany({ postedBy: req.user.id });
  req.logout();
  res.redirect('/login');
});

router.get("/admin-close", async (req, res, next) => {
  let user = await User.findOne({ _id: req.query.user });
  if (user.emailsend) {
    let payload = {
      email: user.email.trim(),
      username: user.username.trim().toLowerCase(),
      firstName: user.firstName,
      lastName: user.lastName,
      siteLink: res.locals.siteLink,
    };
    await _mail(
      "Löschung deines Accounts",
      user.email,
      "account-delete-email",
      payload,
      req.headers.host,
      (err, info) => {
        if (err) console.log(err);
      }
    )
  }

  await User.deleteOne({ _id: req.query.user });
  let articles = await Article.find({});
  articles.forEach(element => {
    if (element.postedBy == req.query.user) {
      Article.deleteOne({ _id: element._id }).then(deleted => {
        res.redirect("/dashboard/users");
      })
    }
  })
  res.redirect("/dashboard/users");
});


router.post(
  "/login",
  install.redirectToLogin,
  checkIfLoggedIn, (req, res, next) => {
    if (!req.body['g-recaptcha-response']) {
      req.flash("success_msg", "Captcha is required!");
      return res.redirect("back");
    } else {
      passport.authenticate("local", function (err, user, info) {
        if (err) return next(err);
        if (!user) {
          req.flash("success_msg", "Incorect Email or password");
          return res.redirect("back");
        }
        if (typeof user.active == "boolean" && user.active === false) {
          req.flash(
            "success_msg",
            "Your account is not active, check your email to activate your account"
          );
          return res.redirect("back");
        }
        if (user.closed === true) {
          req.flash(
            "success_msg",
            "Your Account has been closed."
          );
          return res.redirect("back");
        }
        req.logIn(user, function (err) {
          if (err) return next(err);
          if (user.roleId === "user") {
            // return res.redirect(`/user/dashboard`);
            let signupProcess = user.signupProcess;
            return res.redirect(signupProcess);
          } else if (user.roleId === "admin") {
            return res.redirect(`/dashboard/index`);
          }
        });
      })(req, res, next);
    }
  }
);
router.get('/user/qualify', install.redirectToLogin, async (req, res, next) => {
  let article = await Article.update({ _id: req.query.articleId }, { qualify: "waiting" });
  req.flash("success_msg", "Es dauert bis zu 3 Tage, bis dein Artikel qualifiziert wirde. Unser Team meldet sich bei dir!");
  return res.redirect("back");
});
// Get forgot password page
router.get(
  "/forgot-password",
  install.redirectToLogin,
  checkIfLoggedIn,
  (req, res, next) => {
    res.render("lostpassword", { title: res.locals.siteTitle });
  }
);
router.get(
  "/google/signin",
  install.redirectToLogin,
  checkIfLoggedIn,
  (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/login' }),
      function (req, res) {
        res.redrect('/blogrecent');
      }
  }
);

// Forgot password route
router.post("/forgot-password", install.redirectToLogin, (req, res, next) => {
  try {
    const token = crypto.randomBytes(20).toString("hex");
    // Check the database if there's any user with the specified user
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          // user does not exist
          req.flash("success_msg", "Email does not match with any account");
          return res.redirect("back");
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpiryDate = Date.now() + 3600000; // 1 hour
          user
            .save()
            .then(user => {
              const emailVariables = {
                email: user.email,
                token: user.passwordResetToken
              };
              _mail(
                "Forgotten Passwird",
                user.email,
                "forgot-email",
                emailVariables,
                req.headers.host,
                (err, info) => {
                  console.log(info.response);
                }
              );
              req.flash(
                "success_msg",
                "An email has been sent to your account with further instructions"
              );
              return res.redirect("back");
            })
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));
  } catch (e) {
    next(e);
  }
});

// Get resest password page
router.get("/reset/:token", install.redirectToLogin, (req, res, next) => {
  res.render("reset", { title: res.locals.siteTitle });
});

// Reset password route
router.post("/reset/:token", install.redirectToLogin, (req, res, next) => {
  try {
    User.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpiryDate: { $gt: Date.now() }
    }).then(user => {
      if (!user) {
        req.flash("success_msg", "Token is invalid or it might has expired");
        return res.redirect("back");
      } else {
        user.passwordResetToken = undefined;
        user.passwordResetExpiryDate = undefined;
        user.password = req.body.password;
        user
          .save()
          .then(user => {
            req.flash(
              "success_msg",
              "Your password has been updated successfully, you can now login"
            );
            return res.redirect("/login");
          })
          .catch(err => next(err));
      }
    });
  } catch (e) {
    next(e);
  }
});
// Update user info route
router.post(
  "/user/dashboard/update/info",
  install.redirectToLogin,
  auth,
  async (req, res, next) => {
    try {
      let user = await User.findById(req.user.id);
      if (user.email == req.body.email) {
        var status = 0;
        if (req.body.firstname != 'Not Specified') { status = status + 20; }
        if (req.body.lastname != 'Not Specified') { status = status + 20; }
        if (req.body.email != '') { status = status + 20; }
        if (req.body.birthday != '') { status = status + 20; }
        if (req.body.about != '') { status = status + 20; }
        req.body.postenable = "false";
        if (status == 100) {
          req.body.postenable = "true";
        }
        req.body.emailsend = !req.body.emailsend ? false : true;
        console.log(req.body.emailsend)
        User.updateOne({ _id: req.user.id }, req.body)
          .then(user => {

            req.flash(
              "success_msg",
              "Your profile has been updated successfully"
            );
            return res.redirect("back");
          })
          .catch(err => next(err));
      } else {
        let use = await User.findOne({ email: req.body.email });
        if (use) {
          req.flash("success_msg", "The Email you provided has been used");
          return res.redirect("back");
        } else {
          User.updateOne({ _id: req.user.id }, req.body)
            .then(user => {
              req.flash(
                "success_msg",
                "Your profile has been updated successfully"
              );
              return res.redirect("back");
            })
            .catch(err => next(err));
        }
      }
    } catch (e) {
      next(e);
    }
  }
);

// Update user profile picture
/**
 * @TODO retructure how name is been saved
 */
router.post(
  "/user/dashboard/update/profile-picture",
  install.redirectToLogin,
  auth,
  async (req, res, next) => {
    try {
      let set = await Settings.find();
      switch (set[0].media.provider) {
        case "local":
          const form = new formidable.IncomingForm();
          form.parse(req, (err, fields, files) => {
            const fileUpload = files.profilePicture;
            const uploadedData = fields;
            const name = `${crypto
              .randomBytes(20)
              .toString("hex")}${Date.now().toString()}.${fileUpload.name
                .split(".")
                .pop()}`;
            const dest = `${path.join(
              __dirname,
              "..",
              "public",
              "media",
              `${name}`
            )}`;
            const data = fs.readFileSync(fileUpload.path);
            fs.writeFileSync(dest, data);
            fs.unlinkSync(fileUpload.path);
            uploadedData.profilePicture = `/media/${name}`;
            User.updateOne(
              { _id: req.user.id },
              { $set: { profilePicture: uploadedData.profilePicture } }
            )
              .then(user => {
                req.flash(
                  "success_msg",
                  "Profile Picture has been updated successfully"
                );
                return res.redirect("back");
              })
              .catch(err => next(err));
          });
          break;
        case "amazons3":
          // AWS configuration
          let s3 = new AWS.S3({
            accessKeyId: set[0].media.config.amazons3.accessKeyId,
            secretAccessKey: set[0].media.config.amazons3.secretAccessKey,
            bucket: set[0].media.config.amazons3.bucket
          });
          let awsForm = new formidable.IncomingForm();
          awsForm.parse(req, (err, fields, files) => { });
          awsForm.on("end", function (fields, files) {
            for (let x in this.openedFiles) {
              let stream = fs.createReadStream(this.openedFiles[x].path);
              fs.unlinkSync(this.openedFiles[x].path);
              let params = {
                Bucket: set[0].media.config.amazons3.bucket,
                Key:
                  this.openedFiles[x].name.split(".").shift() +
                  "-" +
                  crypto.randomBytes(2).toString("hex") +
                  "." +
                  this.openedFiles[x].name.split(".").pop(),
                Body: stream,
                ContentType: this.openedFiles[x].type,
                ACL: "public-read",
                processData: false
              };
              s3.upload(params, async function (err, data) {
                if (err) next(err);
                else {
                  User.updateOne(
                    { _id: req.user.id },
                    { $set: { profilePicture: data.Location } }
                  )
                    .then(user => {
                      req.flash(
                        "success_msg",
                        "Profile Picture has been updated successfully"
                      );
                      return res.redirect("back");
                    })
                    .catch(err => next(err));
                }
              });
            }
          });
          break;
        case "cloudinary":
          // Cloudinary configuration
          cloudinary.config({
            cloud_name: set[0].media.config.cloudinary.cloud_name,
            api_key: set[0].media.config.cloudinary.api_key,
            api_secret: set[0].media.config.cloudinary.api_secret
          });
          let cloudForm = new formidable.IncomingForm();
          cloudForm.parse(req, function (err, fields, files) { });
          cloudForm.on("end", async function (fields, files) {
            for (let x in this.openedFiles) {
              cloudinary.uploader.upload(
                this.openedFiles[x].path,
                async (err, result) => {
                  fs.unlinkSync(this.openedFiles[x].path);
                  User.updateOne(
                    { _id: req.user.id },
                    { $set: { profilePicture: result.secure_url } }
                  )
                    .then(user => {
                      req.flash(
                        "success_msg",
                        "Profile Picture has been updated successfully"
                      );
                      return res.redirect("back");
                    })
                    .catch(err => next(err));
                }
              );
            }
          });
          break;
      }
    } catch (e) {
      next(e);
    }
  }
);

// Update user password
router.post(
  "/user/dashboard/update/password",
  install.redirectToLogin,
  auth,
  (req, res, next) => {
    try {
      User.findOne({ _id: req.user.id })
        .then(user => {
          user.comparePassword(req.body.currentPassword, (err, isMatch) => {
            if (isMatch == true) {
              if (req.body.password.trim().length > 1) {
                user.password = req.body.password;
                user
                  .save()
                  .then(user => {
                    req.flash("success_msg", "Your password has been updated");
                    return res.redirect("back");
                  })
                  .catch(err => next(err));
              } else {
                req.flash(
                  "success_msg",
                  "password field cannot be empty or too short"
                );
                return res.redirect("back");
              }
            } else {
              req.flash(
                "success_msg",
                "The current password you provided is incorrect"
              );
              return res.redirect("back");
            }
          });
        })
        .catch(err => next(err));
    } catch (e) {
      next(e);
    }
  }
);

// Log out route
router.get("/log-out", (req, res, next) => {
  try {
    if (!req.user) res.redirect("/login");
    else {
      User.updateOne({ _id: req.user.id }, { lastLoggedIn: Date.now() }).then(
        updated => {
          req.logout();
          req.flash("success_msg", "Du bist nun abgemeldet");
          res.redirect("/login");
        }
      );
    }
  } catch (error) {
    next(error);
  }
});

// Delete Many User
router.post(
  "/user/dashboard/deleteMany",
  install.redirectToLogin,
  auth,
  async (req, res, next) => {
    try {
      await Article.deleteMany({ postedBy: req.body.ids });
      User.deleteMany({ _id: req.body.ids })
        .then(deleted => {
          if (!req.body.ids) {
            req.flash("success_msg", "No User Was Deleted");
            return res.redirect("back");
          } else {
            req.flash("success_msg", "Users was Deleted Successfully");
            return res.redirect("back");
          }
        })
        .catch(e => next(e));
    } catch (error) {
      next(error);
    }
  }
);

// Update another user info
router.post("/user/edit", auth, async (req, res, next) => {
  try {
    let user = await User.findById(req.body.userId);
    if (user.email == req.body.email) {
      User.updateOne({ _id: req.body.userId }, req.body)
        .then(user => {
          req.flash(
            "success_msg",
            "User's profile has been updated successfully"
          );
          return res.redirect("back");
        })
        .catch(err => next(err));
    } else {
      let use = await User.findOne({ email: req.body.email });
      if (use) {
        req.flash("success_msg", "The Email you provided has been used");
        return res.redirect("back");
      } else {
        User.updateOne({ _id: req.body.userId }, req.body)
          .then(user => {
            req.flash(
              "success_msg",
              "User's profile has been updated successfully"
            );
            return res.redirect("back");
          })
          .catch(err => next(err));
      }
    }
  } catch (e) {
    next(e);
  }
});

// Update another user password
router.post("/user/password/edit", auth, (req, res, next) => {
  try {
    if (req.body.password !== req.body.repassword) {
      req.flash("success_msg", "Password doesn't match");
      return res.redirect("back");
    } else {
      User.findOne({ _id: req.body.userId })
        .then(user => {
          user.password = req.body.password;
          user
            .save()
            .then(saved => {
              req.flash("success_msg", "User password Updated Successfully");
              return res.redirect("back");
            })
            .catch(e => next(e));
        })
        .catch(e => next(e));
    }
  } catch (error) {
    next(error);
  }
});

// Confirm user email
router.post(
  "/user/dashboard/confirm-user-email",
  auth,
  async (req, res, next) => {
    try {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing was Updated");
        return res.redirect("back");
      }
      await User.updateOne({ _id: req.body.ids }, { $set: { active: true } });
      req.flash("success_msg", "Users Email Activated successfully");
      return res.redirect("back");
    } catch (error) {
      next(error);
    }
  }
);

// Ban user
router.post(
  "/user/dashboard/ban-user",
  auth,
  role("admin"),
  async (req, res, next) => {
    try {
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing was Updated");
        return res.redirect("back");
      }
      await User.updateOne({ _id: req.body.ids }, { $set: { banned: true } });
      req.flash("success_msg", "Users has been banned successfully");
      return res.redirect("back");
    } catch (error) {
      next(error);
    }
  }
);

// Follow a user
router.get("/follow-user", auth, async (req, res, next) => {
  let date = new Date();
  let payload = {
    date: date,
    user: req.user.id
  }
  let user = await User.findById({ _id: req.user.id });
  let follower = await User.findById({ _id: req.query.followerId });
  await User.updateOne(
    { _id: req.query.followerId },
    { $push: { following: payload } }
  );

  let useremail = user.email;
  let followeremail = follower.email;

  let _payload = {
    user: user,
    follower: follower,
    siteLink: res.locals.siteLink,
  }
  console.log( res.locals.siteLink);
  await _mail(
    "Du hast einen neuen Follower",
    followeremail,
    "new-follower",
    _payload,
    req.headers.host,
    (err, info) => {
      if (err) console.log(err);
    }
  )
  return res.redirect("back");
});

// unfollow a user
router.get("/unfollow-user", auth, async (req, res, next) => {
  let user = await User.findOne({ _id: req.query.authorId });
  let following = user.following;
  let removefield = 0;
  following.forEach(element => {
    if (element.user == req.user.id) {
      removefield = element._id;
    }
  });
  if (req.query.authorId) {
    await User.updateOne(
      { _id: req.query.authorId },
      { $pull: { following: { user: req.user.id } } }
    );
  } else {
    await User.updateOne(
      { _id: req.query.followerId },
      { $pull: { following: req.user.id } }
    );
  }
  // req.flash("success_msg", "User unfollowed successfully");
  return res.redirect('back')
});

// Subscribe a user to a newsletter digest (Daily / Weekly)
router.post("/subscribe/digest", auth, async (req, res, next) => { });


router.get("/checkout-session", async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

router.post("/create-checkout-session", async (req, res) => {
  const planId = process.env.SUBSCRIPTION_PLAN_ID;
  const domainURL = process.env.DOMAIN;
  let session;
  // Customer is only signing up for a subscription
  session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    subscription_data: {
      items: [
        {
          plan: planId
        }
      ]
    },
    success_url: `${domainURL}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/membership`
  });
  res.send({
    checkoutSessionId: session.id
  });
});

router.get("/public-key", (req, res) => {
  res.send({
    publicKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});


router.post("/saveTime", async (req, res) => {
  let userId = req.body.userId;
  let articleId = req.body.articleId;
  let spentTime = parseInt(req.body.time);
  let readingTime = req.body.readingTime;
  var message = "success";
  let article = await Article.findOne({ _id: articleId }).populate('postedBy');
  let user = await User.findOne({ _id: userId });
  if ((spentTime % 60) > 30) {
    spentTime = parseInt(spentTime / 60) + 1;
  } else if ((spentTime % 60) < 30) {
    spentTime = parseInt(spentTime / 60);
  }
  if (spentTime > (readingTime / 60)) {
    spentTime = readingTime / 60;
  }
  let payload = {
    userId: userId,
    articleId: articleId,
    spentTime: spentTime,
    authorName: article.postedBy.username
  }
  let check = await Counting.findOne({ $and: [{ articleId: articleId }, { userId: userId }] });
  if (check) {
    let oldspentTime = check.spentTime;
    let newspentTime = 0;
    if (oldspentTime < readingTime) {
      let id = check.id;
      newspentTime = parseInt(oldspentTime) + parseInt(spentTime);
      if (newspentTime > (readingTime / 60)) {
        newspentTime = readingTime / 60;
      }
      await Counting.updateOne({ _id: id }, { spentTime: newspentTime });
      let averageold = await average.findOne({ userId: userId });
      let averageInfo = {
        spentTime: (averageold.spentTime + newspentTime),
        spentCount: (averageold.spentCount + 1)
      }
      await average.updateOne({ userId: userId }, averageInfo);
    }
  } else {
    if (article.qualify == "qualify") {
      await Counting.create(payload).then(async created => {
        let averageInfo = {
          userId: userId,
          articleId: articleId,
          spentTime: payload.spentTime,
          spentCount: 1
        }
        let averageold = await average.findOne({ userId: userId });
        if (averageold) {
          let averageInfo = {
            spentTime: (averageold.spentTime + spentTime),
            spentCount: (averageold.spentCount + 1)
          }
          await average.updateOne({ userId: userId }, averageInfo);
        } else {
          await average.create(averageInfo).then(async result => {
            // save the earning to the author wallet
            // return res.json(message);
          })
        }
      })
        .catch(e => next(e));
    }
  }

  //balance calculation part

  let totalCountings = await Counting.find({ userId: userId });
  let totalSpentTime = 0;
  totalCountings.forEach(item => {
    totalSpentTime = totalSpentTime + item.spentTime;
  });

  let countings = await Counting.find({ userId: userId });
  let balanceTime = 0;
  countings.forEach(element => {
    if (element.authorName == article.postedBy.username) {
      balanceTime = balanceTime + element.spentTime;
    }
  });
  let balance = 0;
  if (totalSpentTime != 0) {
    balance = 3.02 * balanceTime / totalSpentTime;
  }
  let author = await User.findOne({ _id: article.postedBy._id });
  let earningList = author.earning;
  let earning = {
    balance: balance,
    user: userId,
    date: Date.now()
  }
  let userlength = 0;
  earningList.forEach(element => {
    if (element.user == userId) {
      userlength = 1;
    }
  })

  if (userlength == 0) {
    if (balance != 0) {
      await User.updateOne(
        { _id: article.postedBy._id },
        { $push: { "earning": earning } });
    }
  } else {
    earningList.forEach((element, index) => {
      if (element.user == userId) {
        earningList[index].balance = balance;
        earningList[index].date = Date.now();
      }
    });
    await User.updateOne({ _id: article.postedBy._id }, { earning: earningList });
  }
  return res.json(message);
});

module.exports = router;
