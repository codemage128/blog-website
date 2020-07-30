import express from "express";
import Article from "../models/articles";
import auth from "../helpers/auth";
import role from "../helpers/role";
import mongoose from "mongoose";
import Category from "../models/category";
import User from "../models/users";
import Bookmark from "../models/bookmark";
import SaveText from "../models/savetext";
const router = express.Router();

router.get(
  "/user/dashboard",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    try {
      let totalPost = await Article.countDocuments({ postedBy: req.user.id });
      let pendingPost = await Article.countDocuments({
        postedBy: req.user.id,
        active: false
      });
      res.render("./user/index", {
        title: "Dashboard",
        totalPost: totalPost,
        pendingPost: pendingPost
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/user/posts/add-new",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    try {
      res.render("./user/add-new-post", {
        title: "Article - Add new post"
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/user/posts/add-new-audio",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    res.render("./user/add-new-audio", {
      title: "Audio - Add new Audio"
    });
  }
);

router.get(
  "/user/posts/add-new-video",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    res.render("./user/add-new-video", {
      title: "Video - Add new Video"
    });
  }
);
router.get(
  "/user/update-posts",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    // let article = await Article.find({});
    // article.forEach(async item => {
    //   await Article.updateOne({_id: item.id}, {qualify: "message"});
    // });

    if (req.query.category) {
      let perPage = 10;
      let page = req.query.page || 1;
      let category = await Category.findOne({ name: req.query.category });
      let article = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id),
            $or: [
              { category: mongoose.Types.ObjectId(category._id) },
              { subCategory: mongoose.Types.ObjectId(category._id) }
            ]
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
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
        }
      ]);
      let coun = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id),
            category: mongoose.Types.ObjectId(category._id)
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
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
        }
      ]);
      let count = coun.length;
      res.render("./user/update-post", {
        title: "Dashboard - Update Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: "yes",
        searchName: req.query.category
      });
    } else if (req.query.q) {
      let perPage = 10;
      let page = req.query.page || 1;
      let article = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id),
            title: { $regex: req.query.q, $options: "$i" }
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
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
        }
      ]);
      let coun = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id),
            title: { $regex: req.query.q, $options: "$i" }
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
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
        }
      ]);
      let count = coun.length;
      res.render("./user/update-post", {
        title: "Dashboard - update Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: true,
        searchName: req.query.q
      });
    } else {
      let perPage = 10;
      let page = req.query.page || 1;
      let article = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id),
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
          }
        }, // Am not preserving comments because i need it to be an array to be able to get the length
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
        }
      ]);
      let Updatearticle = [];
      article.forEach(element => {
        let date = new Date();
        var seconds = Math.floor((date - (element.createdAt)) / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        if (days > 90) {
          Updatearticle.push(element);
        }
      })
      let count = await Article.countDocuments({ postedBy: req.user.id });
      res.render("./user/update-post", {
        title: "All Posts",
        article: Updatearticle,
        current: page,
        pages: Math.ceil(count / perPage),
        query: "no"
      });
    }
  }
);

router.get(
  "/user/all-posts",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    // let article = await Article.find({});
    // article.forEach(async item => {
    //   await Article.updateOne({_id: item.id}, {qualify: "message"});
    // });

    if (req.query.category) {
      let perPage = 10;
      let page = req.query.page || 1;
      let category = await Category.findOne({ name: req.query.category });
      let article = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id),
            $or: [
              { category: mongoose.Types.ObjectId(category._id) },
              { subCategory: mongoose.Types.ObjectId(category._id) }
            ]
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
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
        }
      ]);
      let coun = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id),
            category: mongoose.Types.ObjectId(category._id)
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
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
        }
      ]);
      let count = coun.length;
      res.render("./user/all-post", {
        title: "Dashboard - All Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: "yes",
        searchName: req.query.category
      });
    } else if (req.query.q) {
      let perPage = 10;
      let page = req.query.page || 1;
      let article = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id),
            title: { $regex: req.query.q, $options: "$i" }
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
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
        }
      ]);
      let coun = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id),
            title: { $regex: req.query.q, $options: "$i" }
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
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
        }
      ]);
      let count = coun.length;
      res.render("./user/all-post", {
        title: "Dashboard - All Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: true,
        searchName: req.query.q
      });
    } else {
      let perPage = 10;
      let page = req.query.page || 1;
      let article = await Article.aggregate([
        {
          $match: {
            postedBy: mongoose.Types.ObjectId(req.user.id)
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
          }
        }, // Am not preserving comments because i need it to be an array to be able to get the length
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
        }
      ]);
      let count = await Article.countDocuments({ postedBy: req.user.id });
      res.render("./user/all-post", {
        title: "All Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: "no"
      });
    }
  }
);

router.get("/user/useful", auth, role('admin', 'user'), async (req, res, next) => {
  res.render('./user/useful', {
    title: "Useful Tips"
  });
});

router.get(
  "/user/all-posts/edit/:slug",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    try {
      let article = await Article.findOne({
        postedBy: req.user.id,
        slug: req.params.slug
      }).populate("category");
      if (!article) res.render("404");
      let articles = await Article.find({ postedBy: req.user._id });

      switch (article.postType) {
        case "post":
          res.render("./user/edit-post", {
            title: `Edit Post - ${article.title}`,
            article: article,
            articleCount: articles.length
          });
          break;
        // case "audio":
        //   res.render("./user/edit-audio", {
        //     title: `Edit Audio - ${article.title}`,
        //     article: article
        //   });
        //   break;
        // case "video":
        //   res.render("./user/edit-video", {
        //     title: `Edit Video - ${article.title}`,
        //     article: article
        //   });
        //   break;
        default:
          break;
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/user/pending-posts",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    if (req.query.category) {
      let perPage = 10;
      let page = req.query.page || 1;
      let category = await Category.findOne({ name: req.query.category });
      let article = await Article.aggregate([
        {
          $match: {
            active: false,
            postedBy: mongoose.Types.ObjectId(req.user.id),
            $or: [
              { category: mongoose.Types.ObjectId(category._id) },
              { subCategory: mongoose.Types.ObjectId(category._id) }
            ]
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
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
        }
      ]);
      let coun = await Article.aggregate([
        {
          $match: {
            active: false,
            postedBy: mongoose.Types.ObjectId(req.user.id),
            category: mongoose.Types.ObjectId(category._id)
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
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
        }
      ]);
      let count = coun.length;
      res.render("./user/pending-post", {
        title: "Pending Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: "yes",
        searchName: req.query.category
      });
    } else if (req.query.q) {
      let perPage = 10;
      let page = req.query.page || 1;
      let article = await Article.aggregate([
        {
          $match: {
            active: false,
            postedBy: mongoose.Types.ObjectId(req.user.id),
            title: { $regex: req.query.q, $options: "$i" }
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
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
        }
      ]);
      let coun = await Article.aggregate([
        {
          $match: {
            active: false,
            postedBy: mongoose.Types.ObjectId(req.user.id),
            title: { $regex: req.query.q, $options: "$i" }
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
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
        }
      ]);
      let count = coun.length;
      res.render("./user/pending-post", {
        title: "Pending Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: true,
        searchName: req.query.q
      });
    } else {
      let perPage = 10;
      let page = req.query.page || 1;
      let article = await Article.aggregate([
        {
          $match: {
            active: false,
            postedBy: mongoose.Types.ObjectId(req.user.id)
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $skip: perPage * page - perPage
        },
        {
          $limit: perPage
        },
        {
          $lookup: {
            from: "comments",
            localField: "slug",
            foreignField: "slug",
            as: "comments"
          }
        }, // Am not preserving comments because i need it to be an array to be able to get the length
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
        }
      ]);
      let count = await Article.countDocuments({
        active: false,
        postedBy: req.user.id
      });
      res.render("./user/pending-post", {
        title: "Pending Posts",
        article: article,
        current: page,
        pages: Math.ceil(count / perPage),
        query: "no"
      });
    }
  }
);

router.get("/user/profile", auth, role("admin", "user"), (req, res, next) => {
  res.render("./user/profile", {
    title: "My Profile"
  });
});

router.get(
  "/user/followers",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    const following = await User.findById(req.user.id).populate("following").sort({ createdAt: -1 });
    res.render("./user/followers", { title: "Followers", following });
  }
);

router.get(
  "/user/following",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    const followers = await User.find({
      "following.user": { $in: req.user.id }
    }).populate("following").sort({ createdAt: -1 });
    res.render("./user/followings", { title: "Followings", followers });
  }
);

router.get('/user/authorstatus', async (req, res, next) => {
  let filter = req.query.filter;
  let _date = new Date(filter);
  // var date = new Date();
  // var currentMonth = date.getMonth();

  var currentMonth = _date.getMonth() + 1;
  let limitViews = 99999999;
  if (!req.query.filter) {
    currentMonth = new Date().getMonth()
  }
  //content views
  let lastMonthContentViews = 0;
  let thisMonthContentViews = 0;
  let increaseContenViews = 0;
  let upvote_lastmonth = 0;
  let upvote_thismonth = 0;
  let upvote_increase = 0;
  let userArticles = await Article.find({ postedBy: req.user.id });
  userArticles.forEach(element => {
    element.viewers.forEach(item => {
      let viewMonth = item.date.getMonth();
      if (currentMonth == viewMonth) {
        thisMonthContentViews++;
      } else if ((viewMonth + 1) == currentMonth) {
        lastMonthContentViews++;
      }
    });
    element.upvote.users.forEach(item => {
      let viewMonth = item.date.getMonth();
      if (currentMonth == viewMonth) {
        upvote_thismonth++;
      } else if ((viewMonth + 1) == currentMonth) {
        upvote_lastmonth++;
      }
    })
  });

  if (lastMonthContentViews == 0) {
    increaseContenViews = ((thisMonthContentViews + limitViews) / limitViews * 100).toFixed(2);
  } else {
    increaseContenViews = ((thisMonthContentViews - lastMonthContentViews) / lastMonthContentViews * 100).toFixed(2);
  }
  if (upvote_lastmonth == 0) {
    upvote_increase = ((upvote_thismonth + limitViews) / limitViews * 100).toFixed(2);
  } else {
    upvote_increase = ((upvote_thismonth - upvote_lastmonth) / upvote_lastmonth * 100).toFixed(2);
  }
  // profile views
  let profile_lastmonth = 0;
  let profile_thismonth = 0;
  let profile_increase = 0;
  let follow_lastmonth = 0;
  let follow_thismonth = 0;
  let follow_increase = 0;

  let totalusers = await User.find({ _id: req.user.id });
  totalusers.forEach(element => {
    element.viewers.forEach(item => {
      let viewMonth = item.date.getMonth();
      if (currentMonth == viewMonth) {
        profile_thismonth++;
      } else if ((viewMonth + 1) == currentMonth) {
        profile_lastmonth++;
      }
    });
    element.following.forEach(item => {
      let viewMonth = item.date.getMonth();
      if (currentMonth == viewMonth) {
        follow_thismonth++;
      } else if ((viewMonth + 1) == currentMonth) {
        follow_lastmonth++;
      }
    })
  })

  if (profile_lastmonth == 0) {
    profile_increase = ((profile_thismonth + limitViews) / limitViews * 100).toFixed(2);
  } else {
    profile_increase = ((profile_thismonth - profile_lastmonth) / profile_lastmonth * 100).toFixed(2);
  }
  if (follow_thismonth == 0) {
    follow_increase = ((follow_thismonth + limitViews) / limitViews * 100).toFixed(2);
  } else {
    follow_increase = ((follow_thismonth - follow_lastmonth) / follow_lastmonth * 100).toFixed(2);
  }
  follow_increase = follow_thismonth - follow_lastmonth;

  let statusCounts = {
    contentView: {
      count: thisMonthContentViews,
      increase: increaseContenViews
    },
    profileView: {
      count: profile_thismonth,
      increase: profile_increase
    },
    upvote: {
      count: upvote_thismonth,
      increase: upvote_increase
    },
    follow: {
      count: follow_thismonth,
      increase: follow_increase
    }
  }
  let filterdate = new Date(req.query.filter);
  let currentmonth = filterdate.getMonth() + 1;
  let thismonthrank = -1;
  let lastmonthrank = -1;
  let _views = 0;
  let user = await User.find({}).sort({ contentviews: -1 });
  let authorrank = -1;
  user.forEach((element, index) => {
    if(element.id == req.user.id){
      authorrank = index + 1;
    } 
  })
  let upvotesCount = 0;
  let veiwsCount = 0;
  let articles = await Article.find({ postedBy: req.user.id });
  articles.forEach(element => {
    upvotesCount = element.upvote.count;
    veiwsCount = element.views;
  });
  const followers = await User.countDocuments({ _id: req.user.id }).populate("following").sort({ createdAt: -1 });

  res.render("./user/author", {
    title: "Dashboard",
    statusCounts: statusCounts,
    authorrank: authorrank
  });
});

router.get('/user/payout', async (req, res, next) => {
  let user = await User.findOne({ _id: req.user.id });
  let earningList = user.earning;
  let result = [];
  let total = 0;
  for (var i = 0; i < earningList.length; i++) {
    let reader = await User.findOne({ _id: earningList[i].user });
    let payload = {
      reader: reader,
      balance: earningList[i].balance,
      date: earningList[i].date
    }
    total = total + earningList[i].balance;
    result.push(payload);
  }

  res.render("./user/payout", {
    title: "User-Payout",
    earningList: result,
    total: total
  });
});

router.get(
  "/user/bookmarks",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    const bookmark = await Bookmark.find({ userId: req.user.id }).populate({
      path: "articleId",
      populate: { path: "postedBy category" }
    }).sort({ createdAt: -1 });
    res.render("./user/bookmark", { title: "Reading List", bookmark });
  }
);
router.get(
  "/user/marking",
  auth,
  role("admin", "user"),
  async (req, res, next) => {
    const marking = await SaveText.find({ userId: req.user.id }).populate({
      path: "articleId",
    }).sort({ createdAt: -1 });
    res.render("./user/marking", { title: "Marking List", marking });
  }
);
module.exports = router;
