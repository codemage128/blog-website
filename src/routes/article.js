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
import { json } from "body-parser";
const edjsHTML = require("editorjs-html");
const edjsParser = edjsHTML();
const router = express.Router();
// Create a new article
router.post(
  "/article/create",
  install.redirectToLogin,
  auth,
  async (req, res, next) => {
    let article_header = req.body.article_header;
    let receive = JSON.parse(req.body.data);
    let data = receive.blocks;
    let user = await User.findById({ _id: req.user.id });
    let article_title = "";
    data.forEach(block => {
      switch (block.type) {
        case "header":
          console.log(block.data.level);
          if (block.data.level == 1) {
            article_title = block.data.text;
          }
          break;
      }
    });
    if (article_title == "") {
      req.flash(
        "success_msg",
        "You have to create the title!"
      );
      if (user.roleId == "user") {
        return res.redirect("/user/all-posts");
      } else {
        return res.redirect("/admin/all-posts");
      }
    }
    let search = await Article.find({ title: article_title });
    let real = search !== "" ? article_title
      .trim()
      .toLowerCase()
      .split("?")
      .join("")
      .split(" ")
      .join("-")
      .replace(new RegExp("/", "g"), "-") +
      "-" +
      search.length
      : article_title
        .trim()
        .toLowerCase()
        .split("?")
        .join("")
        .split(" ")
        .join("-")
        .replace(new RegExp("/", "g"), "-");
    console.log(real);
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
    console.log(articleslug);
    let meta_title = "";
    let meta_description = "";
    if (req.user.roleId == "admin") {
      let _real = search !== ""
        ? req.body.slug
          .trim()
          .toLowerCase()
          .split("?")
          .join("")
          .split(" ")
          .join("-")
          .replace(new RegExp("/", "g"), "-") +
        "-" +
        search.length
        : req.body.slug
          .trim()
          .toLowerCase()
          .split("?")
          .join("")
          .split(" ")
          .join("-")
          .replace(new RegExp("/", "g"), "-");
      let _array = _real.split('');
      _array.forEach((element, index) => {
        if (element == "ß") {
          _array[index] = "ss";
        }
        if (element == "ö") { _array[index] = "oe"; }
        if (element == "ä") { _array[index] = "ae"; }
        if (element == "ü") { _array[index] = "ue"; }
      });
      console.log(articleslug);
      let _articleslug = _array.join("");
      console.log(_articleslug);
      articleslug = req.body.slug ? _articleslug : articleslug;
      meta_description = req.body.meta_description;
      meta_title = req.body.meta_title;
    }
    // let content = req.body.body;
    // let textLength = content.split(/\s/g).length;
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
    let parse = edjsParser.parse(receive);
    let html = "";
    parse.forEach(element => {
      html = html + element;
    })
    let payload1 = {
      week: `${newDate.getWeek()}`,
      month: `${months[newDate.getMonth()]}`,
      year: `${newDate.getFullYear()}`,
      title: article_title,
      body: JSON.stringify(data),
      summary: req.body.summary.trim(),
      short: htmlToText.fromString(html, {
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
    Article.create(payload1)
      .then(created => {
        console.log(user.roleId);
        req.flash(
          "success_msg",
          "New article has been posted successfully"
        );
        if (user.roleId == "user") {
          return res.redirect("/user/all-posts");
        } else {
          return res.redirect("/dashboard/all-posts");
        }
      })
      .catch(e => next(e));
  }
);

// Edit an Article
router.post(
  "/article/edit",
  install.redirectToLogin,
  auth, async (req, res, next) => {
    try {

      let receive = JSON.parse(req.body.data);
      let data = receive.blocks;
      let user = await User.findById({ _id: req.user.id });
      let article_title;
      data.forEach(block => {
        switch (block.type) {
          case "header":
            if (block.data.level == 1) {
              article_title = block.data.text;
            }
            break;
        }
      });
      let search = await Article.find({ title: article_title });
      // let slug = await Article.findOne({ slug: req.body.slug });

      // if (slug) {
      //   req.flash(
      //     "success_msg",
      //     "That slug has been used, pls used another slug or just leave the field empty"
      //   );
      //   console.log('asdfsfd');
      //   return res.redirect("back");
      // }
      let articelslug = req.body.article_slug;
      // let content = req.body.body;
      // let textLength = content.split(/\s/g).length;
      // if (textLength < 200) {
      //   req.flash(
      //     "success_msg",
      //     "Das sieht doch garnicht mal so schlecht aus! Dennoch solltest du mindestens 200 Wörter schreiben, um deinen Lesern einen Mehrwert zu bieten"
      //   );
      //   return res.redirect("back");
      // }
      let meta_title = "";
      let meta_description = "";
      if (req.user.roleId == "admin") {
        let _articleslug = req.body.article_slug
          .trim()
          .toLowerCase()
          .split("?")
          .join("")
          .split(" ")
          .join("-")
          .replace(new RegExp("/", "g"), "-");
        articelslug = req.body.slug ? articelslug : _articleslug;
        meta_description = req.body.meta_description;
        meta_title = req.body.meta_title;
      }
      let parse = edjsParser.parse(receive);
      let html = "";
      parse.forEach(element => {
        html = html + element;
      })
      let body = JSON.stringify(data);
      let short = htmlToText.fromString(html, {
        wordwrap: false
      });
      // if (req.user.roleId == "admin") {
      //   req.body.active = !req.body.status
      //     ? true
      //     : req.body.status == "activate"
      //       ? true
      //       : false;
      // } else {
      //   // req.body.active = set.approveUpdatedUserPost == false ? false : true;
      //   req.body.active = true;
      // }
      let date = new Date();
      let article = await Article.findOne({ _id: req.body.articleId });
      let article_header = req.body.article_header ? req.body.article_header : article.file;
      Article.updateOne({ _id: req.body.articleId.trim() }, { $set: { title: article_title, slug: articelslug, short: short, body: body, updatedAt: date, category: req.body.category, summary: req.body.summary, file: article_header, metatitle: meta_title, metadescription: meta_description } })
        .then(updated => {
          req.flash("success_msg", "Article has been updated successfully");
          if (req.user.roleId == "admin") {
            return res.redirect(`/dashboard/all-posts/`);
          } else {
            return res.redirect(`/user/all-posts/`);
          }
        })
        .catch(e => next(e));
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

function changeTohtml(data) {
  let _data = JSON.parse(data);
  let idList = [];

  let body_content_element = "";

  _data.forEach((element, index) => {
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
        console.log(code)
        _template = '<pre>' + code + '</pre>';
        break;
      case "embed":
        _template = '<div class="text-center" style="margin-top:10px;"><iframe src="' + element.data.embed + '" width="' + element.data.width + '" height="' + element.data.height + '" frameborder="0" allowfullscreen></iframe></div>';
        break;
      case "table":
        var content = element.data.content;
        _template = '<table class="table table-bordered table-hover" style="width:85%;margin: auto;margin-bottom: 10px;">';
        content.forEach((element, index) => {
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
        _template = '<blockquote><p class="quotation-mark">“' + element.data.text + '“</p><h3 class="text-right">--- ' + element.data.caption + ' ---</h3></blockquote>'
        break;
      case "list":
        var type = element.data.style.charAt(0);
        _template = '<div><' + type + 'l>';
        element.data.items.forEach(item => {
          _template += '<li>' + item + '</li>';
        })
        _template += '</' + type + 'l></div>';
        break;
    }
    body_content_element = body_content_element + _template;
  });
  var table_content_element = '<ol class="table-content"><h2>Inhalt</h2>';
  var table_element = [];
  _data.forEach(element => {
    if (element.type == "header") {
      if (element.data.level != 1) {
        table_element.push(element);
      }
    }
  });
  var _string = "";
  table_element.forEach((item, index) => {
    var template = '<li><a href="#' + idList[index] + '">' + item.data.text + '</a></li>';
    _string = _string + template;
  });
  table_content_element = table_content_element + _string + '</ol>';
  let returnData = {
    article: body_content_element,
    table_content: table_content_element
  }
  return returnData;
}

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
        active: true,
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
        let view_article = await Article.findOne({ slug: req.params.slug.trim() }).populate("postedBy").populate('category');
        let comments = await Comment.find({ articleId: view_article._id }).sort({ upvotecount: -1 });
        var article_body = view_article.body;
        var _res = changeTohtml(article_body);

        console.log(_res.table_content);

        res.render("single", {
          articleCount: articleCount,
          title: article[0].title,
          article: view_article,
          article_body: _res.article,
          article_table_content: _res.table_content,
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
        let view_article = await Article.findOne({ slug: req.params.slug.trim() }).populate("postedBy").populate('category');
        let comments = await Comment.find({ articleId: view_article._id }).sort({ upvotecount: -1 });
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
          bookmarkId: bookmark == null ? null : bookmark._id,
          comments: comments
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
router.post('/kategory-ajax', async (req, res, next) => {
  let page = req.body.page;
  let slug = req.body.slug;
  let cat = await Category.findOne({ slug: slug });

  let articles = await Article.find({ active: true, category: cat._id }).populate("category").populate("postedBy").sort({ createdAt: -1 });
  let length = articles.length;
  let totalsize = Math.floor(length / 6) + 1;
  let r = 6 * page;
  let return_article = await Article.find({ active: true, category: cat._id }).populate("category").populate("postedBy").sort({ createdAt: -1 }).limit(6).skip(r);
  return res.json({ 'data': return_article, 'page': page, 'total': totalsize });
});
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
        let featured = await Article.find({ active: true, addToFeatured: true })
          .populate("category")
          .sort({ createdAt: -1 })
          .limit(5);

        res.render("category", {
          title: cat.name,
          cat: cat.name,
          background: cat.background,
          category: cat,
          post: post,
          current: page,
          pages: Math.ceil(count / perPage),
          featured: featured,
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