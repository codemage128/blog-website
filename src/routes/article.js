import express from "express";
import User from "../models/users";
import Article from "../models/articles";
import Category from "../models/category";
import Comment from "../models/comment";
import Settings from "../models/settings";
import auth from "../helpers/auth";
import htmlToText from "html-to-text";
import install from "../helpers/install";
import Flag from "../models/flag";
import Bookmark from "../models/bookmark";
const router = express.Router();
// Create a new article
router.post(
  "/article/create",
  install.redirectToLogin,
  auth,
  async (req, res, next) => {
    let search = await Article.find({ title: req.body.title });
    let slug = await Article.findOne({ slug: req.body.slug });
    let content = req.body.body;
    let textLength = content.split(/\s/g).length;
    let set = await Settings.findOne();
    Date.prototype.getWeek = function () {
      let dt = new Date(this.getFullYear(), 0, 1);
      return Math.ceil(((this - dt) / 86400000 + dt.getDay() + 1) / 7);
    };
    let newDate = new Date();
    //List months cos js months starts from zero to 11
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    try {
      switch (req.body.postType) {
        case "post":
          req.assert("title", "Title Field cannot be left blank").notEmpty();
          req.assert("category", "Please select a category").notEmpty();
          const errors = req.validationErrors();

          let summary = req.body.summary.trim();
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (re.test(summary)) {
            req.flash("success_msg", `Summary can't include the email address`);
            return res.redirect(`back`);
          }
          var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
          if (expression.test(summary)) {
            req.flash("success_msg", `Summary can't include the Link`);
            return res.redirect(`back`);
          }
          if (errors) {
            req.flash("success_msg", `${errors[0].msg}`);
            return res.redirect(`back`);
          }
          if (slug) {
            req.flash(
              "success_msg",
              "That slug has been used, pls used another slug or just leave the field empty"
            );
            return res.redirect("back");
          }
          if (textLength < 200) {
            req.flash(
              "success_msg",
              "Das sieht doch garnicht mal so schlecht aus! Dennoch solltest du mindestens 200 Wörter schreiben, um deinen Lesern einen Mehrwert zu bieten"
            );
            return res.redirect("back");
          }

          let real = req.body.slug
            ? req.body.slug
              .trim()
              .toLowerCase()
              .split("?")
              .join("")
              .split(" ")
              .join("-")
              .replace(new RegExp("/", "g"), "-")
            : search !== ""
              ? req.body.title
                .trim()
                .toLowerCase()
                .split("?")
                .join("")
                .split(" ")
                .join("-")
                .replace(new RegExp("/", "g"), "-") +
              "-" +
              search.length
              : req.body.title
                .trim()
                .toLowerCase()
                .split("?")
                .join("")
                .split(" ")
                .join("-")
                .replace(new RegExp("/", "g"), "-");


          let array = real.split('');
          array.forEach((element, index) => {
            if (element == "ß") {
              array[index] = "ss";
            }
            if (element == "ö") { array[index] = "oe"; }
            if (element == "ä") { array[index] = "ae"; }
            if (element == "ü") { array[index] = "ue"; }
          });
          let articleslug = array.join("");


          let payload1 = {
            week: `${newDate.getWeek()}`,
            month: `${months[newDate.getMonth()]}`,
            year: `${newDate.getFullYear()}`,
            title: req.body.title.trim(),
            metatitle: req.body.metatitle,
            metadescription: req.body.metadescription,
            body: req.body.body.trim(),
            summary: req.body.summary.trim(),
            keywords: "",
            short: htmlToText.fromString(req.body.body, {
              wordwrap: false
            }),
            slug: articleslug,
            tags: !req.body.tags ? undefined : req.body.tags.split(","),
            category: req.body.category,
            subCategory: req.body.subCategory,
            file: req.body.file,
            postedBy: req.user.id,
            postType: req.body.postType,
            showPostOnSlider: !req.body.showPostOnSlider
              ? false
              : req.body.showPostOnSlider
                ? true
                : false,
            addToNoIndex: !req.body.addToNoIndex
              ? false
              : req.body.addToNoIndex
                ? true
                : false,
            addToFeatured: !req.body.addToFeatured
              ? false
              : req.body.addToFeatured
                ? true
                : false,
            addToBreaking: !req.body.addToBreaking
              ? true
              : req.body.addToBreaking
                ? true
                : false,
            addToRecommended: !req.body.addToRecommended ? false : true,
            showOnlyToRegisteredUsers: !req.body.showOnlyToRegisteredUsers
              ? false
              : true
          };
          payload1.active = !req.body.status
            ? true
            : req.body.status == "activate"
              ? true
              : false;
          // if (req.user.roleId == "admin") {
          // } else {
          //   payload1.active = set.approveAddedUserPost == false ? false : true;
          // }
          Article.create(payload1)
            .then(created => {
              req.flash(
                "success_msg",
                "New article has been posted successfully"
              );
              console.log(user.roleId);
              return res.redirect("back");
            })
            .catch(e => next(e));
          break;
        case "audio":
          req.assert("title", "Title Field cannot be left blank").notEmpty();
          req.assert("category", "Please select a category").notEmpty();
          const errors2 = req.validationErrors();
          if (errors2) {
            req.flash("success_msg", `${errors2[0].msg}`);
            return res.redirect(`back`);
          }
          if (slug) {
            req.flash(
              "success_msg",
              "That slug has been used, pls used another slug or just leave the field empty"
            );
            return res.redirect("back");
          }
          let payload = {
            week: `${newDate.getWeek()}`,
            month: `${months[newDate.getMonth()]}`,
            year: `${newDate.getFullYear()}`,
            title: req.body.title.trim(),
            body: req.body.body.trim(),
            summary: req.body.summary.trim(),
            keywords: req.body.keywords.trim(),
            short: htmlToText.fromString(req.body.body, {
              wordwrap: false
            }),
            slug: req.body.slug
              ? req.body.slug
                .trim()
                .toLowerCase()
                .split("?")
                .join("")
                .split(" ")
                .join("-")
                .replace(new RegExp("/", "g"), "-")
              : search !== ""
                ? req.body.title
                  .trim()
                  .toLowerCase()
                  .split("?")
                  .join("")
                  .split(" ")
                  .join("-")
                  .replace(new RegExp("/", "g"), "-") +
                "-" +
                search.length
                : req.body.title
                  .trim()
                  .toLowerCase()
                  .split("?")
                  .join("")
                  .split(" ")
                  .join("-")
                  .replace(new RegExp("/", "g"), "-"),
            tags: !req.body.tags ? undefined : req.body.tags.split(","),
            category: req.body.category,
            subCategory: req.body.subCategory,
            file: req.body.file,
            postedBy: req.user.id,
            postType: req.body.postType,
            active: !req.body.status
              ? true
              : req.body.status == "activate"
                ? true
                : false,
            showPostOnSlider: !req.body.showPostOnSlider
              ? true
              : req.body.showPostOnSlider
                ? true
                : false,
            addToFeatured: !req.body.addToFeatured
              ? false
              : req.body.addToFeatured
                ? true
                : false,
            addToBreaking: !req.body.addToBreaking
              ? true
              : req.body.addToBreaking
                ? true
                : false,
            addToRecommended: !req.body.addToRecommended ? false : true,
            showOnlyToRegisteredUsers: !req.body.showOnlyToRegisteredUsers
              ? false
              : true,
            audioFile: req.body.audioFile,
            download: req.body.download ? true : false
          };
          if (req.user.roleId == "admin") {
            payload.active = !req.body.status
              ? true
              : req.body.status == "activate"
                ? true
                : false;
          } else {
            payload.active = set.approveAddedUserPost == false ? false : true;
          }
          Article.create(payload)
            .then(created => {
              req.flash(
                "success_msg",
                "New Audio has been posted successfully"
              );
              return res.redirect("back");
            })
            .catch(e => next(e));
          break;
        case "video":
          req.assert("title", "Title Field cannot be left blank").notEmpty();
          req.assert("category", "Please select a category").notEmpty();
          const errors3 = req.validationErrors();
          if (errors3) {
            req.flash("success_msg", `${errors3[0].msg}`);
            return res.redirect(`back`);
          }
          if (slug) {
            req.flash(
              "success_msg",
              "That slug has been used, pls used another slug or just leave the field empty"
            );
            return res.redirect("back");
          }
          let payload2 = {
            week: `${newDate.getWeek()}`,
            month: `${months[newDate.getMonth()]}`,
            year: `${newDate.getFullYear()}`,
            title: req.body.title.trim(),
            body: req.body.body.trim(),
            summary: req.body.summary.trim(),
            keywords: req.body.keywords.trim(),
            short: htmlToText.fromString(req.body.body, {
              wordwrap: false
            }),
            slug: req.body.slug
              ? req.body.slug
                .trim()
                .toLowerCase()
                .split("?")
                .join("")
                .split(" ")
                .join("-")
                .replace(new RegExp("/", "g"), "-")
              : search !== ""
                ? req.body.title
                  .trim()
                  .toLowerCase()
                  .split("?")
                  .join("")
                  .split(" ")
                  .join("-")
                  .replace(new RegExp("/", "g"), "-") +
                "-" +
                search.length
                : req.body.title
                  .trim()
                  .toLowerCase()
                  .split("?")
                  .join("")
                  .split(" ")
                  .join("-")
                  .replace(new RegExp("/", "g"), "-"),
            tags: !req.body.tags ? undefined : req.body.tags.split(","),
            category: req.body.category,
            subCategory: req.body.subCategory,
            file: req.body.file,
            postedBy: req.user.id,
            postType: req.body.postType,
            active: !req.body.status
              ? true
              : req.body.status == "activate"
                ? true
                : false,
            showPostOnSlider: !req.body.showPostOnSlider
              ? true
              : req.body.showPostOnSlider
                ? true
                : false,
            addToFeatured: !req.body.addToFeatured
              ? false
              : req.body.addToFeatured
                ? true
                : false,
            addToBreaking: !req.body.addToBreaking
              ? true
              : req.body.addToBreaking
                ? true
                : false,
            addToRecommended: !req.body.addToRecommended ? false : true,
            showOnlyToRegisteredUsers: !req.body.showOnlyToRegisteredUsers
              ? false
              : true,
            videoFile: req.body.videoFile,
            videoType: req.body.videoType
          };
          if (req.user.roleId == "admin") {
            payload2.active = !req.body.status
              ? true
              : req.body.status == "activate"
                ? true
                : false;
          } else {
            payload2.active = set.approveAddedUserPost == false ? false : true;
          }
          Article.create(payload2)
            .then(created => {
              req.flash(
                "success_msg",
                "New Video has been posted successfully"
              );
              return res.redirect("back");
            })
            .catch(e => next(e));
          break;
        default:
          break;
      }
    } catch (error) {
      next(error);
    }
  }
);

// Edit an Article
router.post(
  "/article/edit",
  install.redirectToLogin,
  auth,
  (req, res, next) => {
    try {
      let content = req.body.body;
      let textLength = content.split(/\s/g).length;
      if (textLength < 200) {
        req.flash(
          "success_msg",
          "Das sieht doch garnicht mal so schlecht aus! Dennoch solltest du mindestens 200 Wörter schreiben, um deinen Lesern einen Mehrwert zu bieten"
        );
        return res.redirect("back");
      }
      req.body.tags ? (req.body.tags = req.body.tags.split(",")) : undefined;
      req.body.showPostOnSlider = req.body.showPostOnSlider ? true : false;
      req.body.addToNoIndex = req.body.addToNoIndex ? true : false;
      req.body.addToFeatured = req.body.addToFeatured ? true : false;
      req.body.addToBreaking = req.body.addToBreaking ? true : false;
      req.body.addToRecommended = !req.body.addToRecommended ? false : true;
      req.body.short = htmlToText.fromString(req.body.body, {
        wordwrap: false
      });
      req.body.showOnlyToRegisteredUsers = !req.body.showOnlyToRegisteredUsers
        ? false
        : true;
      req.body.postType == "audio"
        ? (req.body.download = req.body.download ? true : false)
        : undefined;
      req.body.postType == "audio"
        ? (req.body.audioFile = req.body.audioFile)
        : undefined;
      req.body.slug = req.body.slug
        .trim()
        .toLowerCase()
        .split("?")
        .join("")
        .split(" ")
        .join("-")
        .replace(new RegExp("/", "g"), "-");
      if (req.user.roleId == "admin") {
        req.body.active = !req.body.status
          ? true
          : req.body.status == "activate"
            ? true
            : false;
      } else {
        // req.body.active = set.approveUpdatedUserPost == false ? false : true;
        req.body.active = true;
      }
      switch (req.body.postType) {
        case "post":
          let date = new Date();
          Article.updateOne({ _id: req.body.articleId.trim() }, req.body, { updatedAt: date })
            .then(updated => {
              req.flash("success_msg", "Article has been updated successfully");
              if (req.user.roleId == "admin") {
                return res.redirect(`/dashboard/all-posts/edit/${req.body.slug}`);
              } else {
                return res.redirect(`/user/all-posts/edit/${req.body.slug}`);
              }
            })
            .catch(e => next(e));
          break;
        case "audio":
          Article.updateOne({ _id: req.body.articleId.trim() }, req.body)
            .then(updated => {
              req.flash("success_msg", "Audio has been updated successfully");
              return res.redirect(`/dashboard/all-posts/edit/${req.body.slug}`);
            })
            .catch(e => next(e));
          break;
        case "video":
          Article.updateOne({ _id: req.body.articleId.trim() }, req.body)
            .then(updated => {
              req.flash("success_msg", "Video has been updated successfully");
              return res.redirect(`/dashboard/all-posts/edit/${req.body.slug}`);
            })
            .catch(e => next(e));
        default:
          false;
      }
    } catch (error) {
      next(error);
    }
  }
);

// Delete an Article
router.post(
  "/article/delete",
  install.redirectToLogin,
  auth,
  async (req, res, next) => {
    try {
      let article = await Article.findById(req.body.articleId);
      Comment.deleteMany({ slug: article.slug })
        .then(deleted => {
          Article.deleteOne({ _id: req.body.articleId.trim() })
            .then(deleted => {
              req.flash("success_msg", "Article has been Deleted");
            })
            .catch(e => next(e));
        })
        .catch(e => next(e));
      Comment.deleteMany({});
    } catch (error) {
      next(error);
    }
  }
);

// Delete Many Articles
router.post(
  "/article/deletemany",
  install.redirectToLogin,
  auth,
  async (req, res, next) => {
    try {
      await Comment.deleteMany({ articleId: req.body.ids });
      await Article.deleteMany({ _id: req.body.ids });
      if (!req.body.ids) {
        req.flash("success_msg", "Nothing Has Been Deleted");
        return res.redirect('back');
      } else {
        req.flash("success_msg", "Posts Has Been Deleted");
        return res.redirect('back');
      }
    } catch (error) {
      next(error);
    }
  }
);

// Activate Many Articles
router.post(
  "/article/activateMany",
  install.redirectToLogin,
  auth,
  (req, res, next) => {
    try {
      Article.updateMany({ _id: req.body.ids }, { $set: { active: true } })
        .then(deleted => {
          if (!req.body.ids) {
            req.flash("success_msg", "Nothing Has Been Updated");
            return res.redirect("/dashboard/all-posts");
          } else {
            req.flash("success_msg", "Articles Has Been Published");
            return res.redirect("/dashboard/all-posts");
          }
        })
        .catch(e => next(e));
    } catch (error) {
      next(error);
    }
  }
);

// Deactivate Many Articles
router.post(
  "/article/deactivateMany",
  install.redirectToLogin,
  auth,
  (req, res, next) => {
    try {
      Article.updateMany({ _id: req.body.ids }, { $set: { active: false } })
        .then(deleted => {
          if (!req.body.ids) {
            req.flash("success_msg", "Nothing Has Been Updated");
            return res.redirect("/dashboard/all-posts");
          } else {
            req.flash("success_msg", "Articles Has Been Saved to Draft");
            return res.redirect("/dashboard/all-posts");
          }
        })
        .catch(e => next(e));
    } catch (error) {
      next(error);
    }
  }
);
router.get("/p/:category/:slug", install.redirectToLogin, async (req, res, next) => {
  
  try {
    let settings = await Settings.findOne();
    let user = req.params.user;
    let slug = req.params.slug;
    let category = req.params.category;
    let article = await Article.aggregate([
      {
        $match: {
          active: true,
          slug: req.params.slug
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategory"
        }
      },
      {
        $unwind: {
          path: "$subCategory",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "postedBy"
        }
      },
      {
        $unwind: {
          path: "$postedBy",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "comments",
          let: { indicator_id: "$_id" },
          as: "comments",
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$articleId", "$$indicator_id"] },
                active: true
              }
            },
            {
              $sort: {
                createdAt: -1
              }
            }
          ]
        }
      }
    ]);
    if (article == "") res.render("404");
    else {
      let nextarticle = [];
      let previousarticle = [];
      let bookmark = typeof req.user !== "undefined" ? await Bookmark.findOne({ userId: req.user.id, articleId: article[0]._id }) : false;
      let book = bookmark ? true : false;
      let art = await Article.findOne({ slug: req.params.slug, active: true });
      let next = await Article.find({
        active: true,
        _id: { $gt: article[0]._id },
        category: article[0].category._id,
        postedBy: article[0].postedBy._id
      }).populate("category").populate("postedBy").sort({ createdAt: 1 });
      next.forEach(item => {
        if (item.category.slug != "official") {
          nextarticle.push(item);
        }
      });
      if (next.length == 0) {
        next = await Article.find({
          active: true,
        }).populate("category").populate("postedBy").sort({ createdAt: 1 });
        next.forEach(item => {
          if (item.category.slug != "official") {
            nextarticle.push(item);
          }
        });
      }
      let previous = await Article.find({
        active: true,
        _id: { $lt: article[0]._id },
        category: article[0].category._id,
        postedBy: article[0].postedBy._id
      }).populate(
        "category"
      ).populate('postedBy')
        .sort({ createdAt: 1 });
      previous.forEach(item => {
        if (item.category.slug != "official") {
          previousarticle.push(item);
        }
      });
      if (previous.length == 0) {
        previous = await Article.find({
          active: true,
        }).populate("category").populate("postedBy").sort({ createdAt: 1 });
        previous.forEach(item => {
          if (item.category.slug != "official") {
            previousarticle.push(item);
          }
        });
      }
      let featured = await Article.find({
        active: true,
        slug: { $ne: article[0].slug },
        addToFeatured: true
      })
        .populate("category")
        .sort({ createdAt: -1 })
        .limit(5);
      let popular = await Article.find({
        active: true,
        slug: { $ne: article[0].slug }
      })
        .sort({ views: -1 })
        .limit(3);
      let recommended = await Article.find({
        active: true,
        slug: { $ne: article[0].slug },
        addToRecommended: true
      })
        .populate("category")
        .sort({ createdAt: -1 })
        .limit(12);
      var _length = await Article.find({
        active:true,
        slug: { $ne: article[0].slug }
      });
      var r = Math.floor(Math.random() * _length.length);
      let related = await Article.find({
        active: true,
        slug: { $ne: article[0].slug },
      })
        .populate("postedBy")
        .populate("category")
        .sort({ createdAt: -1 })
        .limit(3).skip(r);
      let d = new Date();
      let customDate = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
      let ips =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
      let articleCount = await Article.countDocuments();
      let indexof = -1;
      art.viewers.forEach(element => {
        if (element.ip == ips) {
          indexof = 1;
        }
      })
      if (indexof !== -1) {
        let view_article = await Article.findOne({slug: req.params.slug.trim()}).populate("postedBy").populate('category');
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
      } else {
        let ip =
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          (req.connection.socket ? req.connection.socket.remoteAddress : null);
        let payload = {
          ip: ip,
          date: new Date()
        }
        await User.updateOne(
          { _id: art.postedBy },
          { $inc: { contentviews: 1 } }
        );
        await Article.updateOne(
          { slug: req.params.slug.trim() },
          { $push: { viewers: payload } }
        );
        await Article.updateOne({ slug: req.params.slug.trim() }, { $inc: { views: 1 } });
        let view_article = await Article.findOne({slug: req.params.slug.trim()}).populate("postedBy").populate('category');
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
        // Article.updateOne(
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
      }
    }
  } catch (error) {
    next(error);
  }
});
// Get single article page
router.get("/d/:category/:slug", install.redirectToLogin, async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    let article = await Article.aggregate([
      {
        $match: {
          active: true,
          slug: req.params.slug
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategory"
        }
      },
      {
        $unwind: {
          path: "$subCategory",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "postedBy"
        }
      },
      {
        $unwind: {
          path: "$postedBy",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "comments",
          let: { indicator_id: "$_id" },
          as: "comments",
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$articleId", "$$indicator_id"] },
                active: true
              }
            },
            {
              $sort: {
                createdAt: -1
              }
            }
          ]
        }
      }
    ]);
    if (article == "") res.render("404");
    else {
      let bookmark = typeof req.user !== "undefined" ? await Bookmark.findOne({ userId: req.user.id, articleId: article[0]._id }) : false;
      let book = bookmark ? true : false;
      let art = await Article.findOne({ slug: req.params.slug, active: true });
      let next = await Article.find({
        active: true,
        _id: { $gt: article[0]._id },
        category: article[0].category._id,
        postedBy: article[0].postedBy._id
      }).populate(
        "category"
      ).populate("postedBy").sort({ _id: 1 })
        .limit(1);
      if (next.length == 0) {
        let index = Math.floor(Math.random() * 100 % 28);
        next = await Article.find({
          active: true,
        }).populate("category").populate("postedBy").sort({ _id: 1 }).limit(1).skip(index);
      }
      let previous = await Article.find({
        active: true,
        _id: { $lt: article[0]._id },
        category: article[0].category._id,
        postedBy: article[0].postedBy._id
      }).populate(
        "category"
      ).populate('postedBy')
        .sort({ _id: 1 })
        .limit(1);
      if (previous.length == 0) {
        let index = Math.floor(Math.random() * 100 % 28);
        previous = await Article.find({
          active: true,
        }).populate("category").populate("postedBy").sort({ _id: 1 }).limit(1).skip(index);
      }
      let featured = await Article.find({
        active: true,
        slug: { $ne: article[0].slug },
        addToFeatured: true
      })
        .populate("category")
        .sort({ createdAt: -1 })
        .limit(5);
      let popular = await Article.find({
        active: true,
        slug: { $ne: article[0].slug }
      })
        .sort({ views: -1 })
        .limit(3);
      let recommended = await Article.find({
        active: true,
        slug: { $ne: article[0].slug },
        addToRecommended: true
      })
        .populate("category")
        .sort({ createdAt: -1 })
        .limit(12);
      let related = await Article.find({
        active: true,
        slug: { $ne: article[0].slug }
      })
        .populate("postedBy")
        .populate("category")
        .sort({ createdAt: -1 })
        .limit(3);
      let d = new Date();
      let customDate = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
      let ips =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
      let articleCount = await Article.countDocuments();
      let indexof = -1;
      art.viewers.forEach(element => {
        if (element.ip == ips) {
          indexof = 1;
        }
      })
      if (indexof !== -1) {
        res.render("single", {
          articleCount: articleCount,
          title: article[0].title,
          article: article[0],
          settings: settings,
          previous: previous[0],
          next: next[0],
          featured: featured,
          popular: popular,
          recommended: recommended,
          related: related,
          bookmark: book,
          bookmarkId: bookmark == null ? null : bookmark._id
        });
      } else {
        let ip =
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          (req.connection.socket ? req.connection.socket.remoteAddress : null);
        let payload = {
          ip: ip,
          date: new Date()
        }
        await Article.updateOne(
          { slug: req.params.slug.trim() },
          { $push: { viewers: payload } }
        );
        Article.updateOne(
          { slug: req.params.slug.trim() },
          { $inc: { views: 1 } }
        )
          .then(views => {
            res.render("single", {
              articleCount: articleCount,
              title: article[0].title,
              article: article[0],
              settings: settings,
              previous: previous[0],
              next: next[0],
              featured: featured,
              popular: popular,
              recommended: recommended,
              related: related,
              bookmark: book,
              bookmarkId: bookmark == null ? null : bookmark._id
            });
          })
          .catch(err => next(err));
      }
    }
  } catch (error) {
    next(error);
  }
});

// Get article based on a category
router.get("/all-post", install.redirectToLogin, async (req, res, next) => {
  let perPage = 7;
  let page = req.query.page || 1;
  try {
    await Category.findOne({ name: req.query.category })
      .then(async category => {
        if (!category) res.status(404).render("404");
        else {
          await Article.find({ category: category._id })
            .populate("postedBy")
            .sort({ createdAt: -1 })
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec((err, post) => {
              Article.countDocuments({ category: category._id }).exec(
                (err, count) => {
                  if (err) return next(err);
                  res.render("category", {
                    post: post,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    cat: req.query.category
                  });
                }
              );
            });
        }
      })
      .catch(e => next(e));
  } catch (error) {
    next(error);
  }
});

router.post('/api/kategorie', async (req, res, next) => {
  let slug = req.body.slug;
  let category = await Category.findOne({ slug: slug });
  let articles = await Article.find({ category: category.id }).sort({ createdAt: -1 }).limit(10);
  return res.json({ "data": articles });
});

// Get all the posts in a category
router.get(
  "/kategorie/:slug",
  install.redirectToLogin,
  async (req, res, next) => {
    try {
      let perPage = 6;
      let page = req.query.page || 1;
      let cat = await Category.findOne({ slug: req.params.slug });
      if (!cat) res.render("404");
      else {
        let post = await Article.find({ active: true, category: cat._id })
          .populate("category")
          .populate("postedBy")
          .populate("subCategory")
          .skip(perPage * page - perPage)
          .limit(perPage)
          .sort({ createdAt: -1 });
        let count = await Article.countDocuments({
          active: true,
          category: cat._id
        });
        let recent = [];
        let recentdata = await Article.find({
          active: true,
          category: { $ne: cat._id }
        })
          .sort({ createdAt: -1 })
          .populate("category")
          .populate("postedBy")
          .limit(5);
        recentdata.forEach(item => {
          if (item.category.slug != "official") {
            recent.push(item);
          }
        })
        let featured = await Article.find({ active: true, addToFeatured: true })
          .populate("category")
          .sort({ createdAt: -1 })
          .limit(5);
        let popular = await Article.find({ active: true, category: cat._id })
          .populate("category")
          .populate("postedBy")
          .sort({ views: -1 })
          .limit(3);
        res.render("category", {
          title: cat.name,
          cat: cat.name,
          background: cat.background,
          category: cat,
          post: post,
          current: page,
          pages: Math.ceil(count / perPage),
          recent: recent,
          featured: featured,
          popular: popular
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

// Add to slider
router.post("/article/add-to-slider", (req, res, next) => {
  try {
    Article.updateMany(
      { _id: req.body.ids },
      { $set: { showPostOnSlider: true } }
    )
      .then(deleted => {
        if (!req.body.ids) {
          req.flash("success_msg", "Nothing Was Updated");
          return res.redirect("/dashboard/all-posts");
        } else {
          req.flash("success_msg", "Articles Has Been Updated Successfully");
          return res.redirect("/dashboard/all-posts");
        }
      })
      .catch(e => next(e));
  } catch (error) {
    next(error);
  }
});
// Add to recommended
router.post("/article/add-to-recommended", (req, res, next) => {
  try {
    Article.updateMany(
      { _id: req.body.ids },
      { $set: { addToRecommended: true } }
    )
      .then(deleted => {
        if (!req.body.ids) {
          req.flash("success_msg", "Nothing Was Updated");
          return res.redirect("/dashboard/all-posts");
        } else {
          req.flash("success_msg", "Articles Has Been Updated Successfully");
          return res.redirect("/dashboard/all-posts");
        }
      })
      .catch(e => next(e));
  } catch (error) {
    next(error);
  }
});

// Add to featured
router.post("/article/add-to-featured", (req, res, next) => {
  try {
    Article.updateMany({ _id: req.body.ids }, { $set: { addToFeatured: true } })
      .then(deleted => {
        if (!req.body.ids) {
          req.flash("success_msg", "Nothing Was Updated");
          return res.redirect("/dashboard/all-posts");
        } else {
          req.flash("success_msg", "Articles Has Been Updated Successfully");
          return res.redirect("/dashboard/all-posts");
        }
      })
      .catch(e => next(e));
  } catch (error) {
    next(error);
  }
});

// Add to breaking
router.post("/article/add-to-breaking", (req, res, next) => {
  try {
    Article.updateMany({ _id: req.body.ids }, { $set: { addToBreaking: true } })
      .then(deleted => {
        if (!req.body.ids) {
          req.flash("success_msg", "Nothing Was Updated");
          return res.redirect("/dashboard/all-posts");
        } else {
          req.flash("success_msg", "Articles Has Been Updated Successfully");
          return res.redirect("/dashboard/all-posts");
        }
      })
      .catch(e => next(e));
  } catch (error) {
    next(error);
  }
});

// Upvote a post
router.post("/article/upvote", auth, async (req, res, next) => {
  // let payload = {
  //   date: date,
  //   user: req.user.id
  // }
  // await Article.updateOne(
  //   { _id: req.body.articleId },
  //   { $push: { "upvote.user": payload }, $inc: { "upvote.count": 1 } }
  // );
  // // res.status(200).send("Post Has been Upvoted");
  return res.redirect(`back`);
});
router.post('/article/upvote-ajax', async (req, res, next) => {
  let date = new Date();
  let articleId = req.body.articleId;
  let userId = req.body.userId;
  let payload = {
    date: date,
    user: req.user.id
  }
  let article_origin = await Article.findOne({ _id: articleId });
  let indexof = -1;
  article_origin.upvote.users.forEach(element => {
    if (element.user == req.user.id) {
      indexof = 1;
    }
  })
  if (indexof == -1 && articleId != userId) {
    await Article.updateOne(
      { _id: req.body.articleId },
      { $push: { "upvote.users": payload }, $inc: { "upvote.count": 1 } }
    );
  }
  let article = await Article.findOne({ _id: articleId });
  let upvotecount = article.upvote.count;
  let result = {
    upvotecount: upvotecount,
    success: true
  }
  res.json(result);
});
// Downvote a post
router.post("/article/downvote", auth, async (req, res, next) => {
  await Article.updateOne(
    { _id: req.body.articleId },
    { $push: { "update.users": req.user.id }, $inc: { "upvote.count": -1 } }
  );
  res.status(200).send("Post Has been Downvoted");
});

// Flag an article
router.post("/article/flag", async (req, res, next) => {
  await Flag.create({
    articleId: req.body.articleId,
    reason: req.body.reason.trim(),
    userId: req.user.id != undefined ? req.user.id : undefined
  });
  res
    .status(200)
    .send("Post has been flagged, Admin will look into it anytime soon.");
});
// Clap under an article
router.post("/article/clap", async (req, res, next) => {
  await Article.updateOne({ _id: req.body.articleId }, { $inc: { claps: 1 } });
  res.status(200).send("Clapped under post");
});
module.exports = router;