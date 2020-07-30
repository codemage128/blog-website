import express from "express";
import Bookmark from "../models/bookmark";
import SaveText from "../models/savetext";
import auth from "../helpers/auth";
const router = express.Router();

// Add a new article to reading list
router.get("/bookmark/create", auth, async (req, res, next) => {
  const check = await Bookmark.findOne({
    articleId: req.query.articleId,
    userId: req.user.id
  });
  if (check) {
    req.flash("success_msg", "Article already exist in your reading list");
    return res.redirect("back");
  }

  await Bookmark.create({
    articleId: req.query.articleId,
    userId: req.user.id
  });
  req.flash("success_msg", "Article has been added to reading list");
  return res.redirect("back");
});

// Remove an article from reading list
router.get("/bookmark/delete", auth, async (req, res, next) => {
  await Bookmark.deleteOne({ _id: req.query.bookmarkId });
  req.flash("success_msg", "Article has been removed from reading list");
  return res.redirect("back");
});

router.post("/savetext", auth, async (req, res, next) => {
  let userId = req.body.userId;
  let selectedString = req.body.text;
  let articleId = req.body.articleId;
  let saveText = await SaveText.find({ articleId: articleId , userId: userId });
  if (saveText.length == 0) {
    let textArray = [];
    textArray.push(selectedString);
    let payload = {
      userId: userId,
      text: textArray,
      articleId: articleId
    }
    await SaveText.create(payload);
  } else {
    let textArray = saveText[0].text;
    textArray.push(selectedString);
    await SaveText.updateOne({ _id: saveText[0].id }, {text: textArray});
  }
  res.json("successful");
})
router.get('/savetext/delete', auth, async (req, res, next) => {
  console.log(req.query.markingId);
  await SaveText.deleteOne({ _id: req.query.markingId });
  req.flash("success_msg", "Marking has been removed from marking list");
  return res.redirect("back");
})
export default router;
