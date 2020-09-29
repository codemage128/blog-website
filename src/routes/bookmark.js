import express from "express";
import Bookmark from "../models/bookmark";
import Article from "../models/articles";
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
  let tagId = req.body.tagId;
  let url = req.body.url;
  let article = await Article.findOne({ _id: articleId });
  let textArray = [];
  let saveText = await SaveText.find({ articleId: articleId, userId: userId });
  let newParagraph = "";
  if (saveText.length == 0) {
    console.log("This is the create part");
    let articleBody = JSON.parse(article.body);
    let wholeText = articleBody[tagId].data.text;
    let newtext = '<mark class="cdx-marker">' + selectedString + '</mark>';
    newParagraph = wholeText.replace(selectedString, newtext);
    articleBody[tagId].data.text = newParagraph;
    textArray.push(newParagraph);
    let payload = {
      userId: userId,
      text: textArray,
      articleId: articleId,
      url: url,
      articleBody: JSON.stringify(articleBody)
    }
    await SaveText.create(payload);
  } else {
    console.log("This is the update part");
    let textArray = saveText[0].text;
    let articleBody = JSON.parse(saveText[0].articleBody);
    let wholeText = articleBody[tagId].data.text;
    let newtext = '<mark class="cdx-marker">' + selectedString + '</mark>';
    newParagraph = wholeText.replace(selectedString, newtext);
    textArray.push(newParagraph);
    articleBody[tagId].data.text = newParagraph;
    textArray.push(newParagraph);
    await SaveText.updateOne({ _id: saveText[0].id }, { $set: { text: textArray, articleBody: JSON.stringify(articleBody) } });
  }
  console.log(newParagraph);
  let returndata = { new: newParagraph }
  return res.json(newParagraph);
})
router.get('/savetext/delete', auth, async (req, res, next) => {
  console.log(req.query.markingId);
  await SaveText.deleteOne({ _id: req.query.markingId });
  req.flash("success_msg", "Marking has been removed from marking list");
  return res.redirect("back");
})
export default router;
