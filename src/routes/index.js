import express from 'express';
import crypto from "crypto";
import bcrypt from "bcrypt-nodejs";
import Article from '../models/articles';
import Category from '../models/category';
import Settings from '../models/settings';
import Comment from '../models/comment';
import Tags from '../models/tags';
import flash from 'express-flash';
import moment from 'moment';
import dotenv from 'dotenv';
import User from '../models/users';
import url from 'url';
import Ads from '../models/ads';
import install from '../helpers/install';
import Menu from '../models/menu';
import Bookmark from "../models/bookmark";
import SearchKey from "../models/searchkey";
import _mail from "../helpers/_mail";
import Media from "../models/media";
var suggest = require('suggestion');

var fs = require('fs');

const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')

const router = express.Router();

const SitemapGenerator = require('sitemap-generator');
// drowningsummer.228@gmail.com

dotenv.config({ path: './.env' });

router.use(flash());
router.use(async function (req, res, next) {
	let settingsInfo = await Settings.find({});
	res.locals.mainMenu = await Menu.find().sort({ position: 1 });
	res.locals.footercategory = await Category.find({}).sort({ name: 1 });
	res.locals.time = ev => {
		const wordsPerMinute = 260; // Average case.
		let result;
		let textLength = ev.split(/\s/g).length; // Split by words
		if (textLength > 0) {
			let value = Math.ceil(textLength / wordsPerMinute);
			result = value;
		}
		return result;
	};
	res.locals.getmonth = data => {
		switch (data) {
			case 0:
				return 'Jan';
				break;
			case 1:
				return 'Feb';
				break;
			case 2:
				return 'March';
				break;
			case 3:
				return 'Apr';
				break;
			case 4:
				return 'May';
				break;
			case 5:
				return 'Jun';
				break;
			case 6:
				return 'Jul';
				break;
			case 7:
				return 'Aug';
				break;
			case 8:
				return 'Sep';
				break;
			case 9:
				return 'Oct';
				break;
			case 10:
				return 'Nov';
				break;
			case 11:
				return 'Dec';
				break;
			default:
				break;
		}
	};
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	res.locals.siteTitle =
		settingsInfo == ''
			? 'Pls edit site title in the admin dashboard'
			: typeof settingsInfo[0].siteName == 'undefined'
				? 'Pls edit site title in the admin dashboard'
				: `${settingsInfo[0].siteName}`;
	res.locals.siteDescription =
		settingsInfo == ''
			? 'Edit site description in the admin dashboard'
			: typeof settingsInfo[0].siteDescription == 'undefined'
				? 'edit site title in the admin dashboard'
				: `${settingsInfo[0].siteDescription}`;
	res.locals.recent = await Article.find({
		slug: {
			$ne: url
				.parse(req.url)
				.path.split('/')
				.pop(),
		},
	})
		.populate('category')
		.populate('postedBy')
		.sort({ createdAt: -1 })
		.limit(5);
	res.locals.sidebarPop = await Article.find({
		slug: {
			$ne: url
				.parse(req.url)
				.path.split('/')
				.pop(),
		},
	})
		.populate('category')
		.populate('postedBy')
		.sort({ views: -1 })
		.limit(5);
	res.locals.comments = await Comment.aggregate([
		{
			$lookup: {
				from: 'articles',
				localField: 'articleId',
				foreignField: '_id',
				as: 'article',
			},
		},
		{
			$unwind: {
				path: '$article',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'article.postedBy',
				foreignField: '_id',
				as: 'postedBy',
			},
		},
		{
			$unwind: {
				path: '$postedBy',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: 'categories',
				localField: 'article.category',
				foreignField: '_id',
				as: 'category',
			},
		},
		{
			$unwind: {
				path: '$category',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
		{
			$limit: 5,
		},
	]);
	res.locals.tags = await Tags.find()
		.sort({ createdAt: -1 })
		.limit(12);
	res.locals.tags2 = await Tags.find().sort({ createdAt: -1 });
	res.locals.category = await Category.aggregate([
		{
			$sort: {
				createdAt: -1,
			},
		},
		{
			$limit: 7,
		},
		{
			$lookup: {
				from: 'articles',
				localField: '_id',
				foreignField: 'category',
				as: 'total',
			},
		},
	]);
	res.locals.hotCategory = await Category.aggregate([
		{
			$limit: 7,
		},
		{
			$lookup: {
				from: 'articles',
				localField: '_id',
				foreignField: 'category',
				as: 'total',
			},
		},
		{
			$sort: {
				total: -1,
			},
		},
	]);
	res.locals.category2 = await Category.aggregate([
		{
			$sort: {
				name: 1,
			},
		},
		{
			$lookup: {
				from: 'articles',
				localField: '_id',
				foreignField: 'category',
				as: 'total',
			},
		},
	]);
	res.locals.subCategory2 = await Category.aggregate([
		{
			$match: {
				parent: {
					$exists: false,
				},
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	]);
	res.locals.subCategory = await Category.aggregate([
		{
			$match: {
				parent: {
					$exists: true,
				},
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	]);
	res.locals.formatDate = function (arg) {
		return moment(arg).fromNow();
	};
	res.locals.strip = function (stringWithHTML) {
		let text = stringWithHTML
			.replace(/<!--[\s\S]*?(-->|$)/g, '')
			.replace(/<(script|style)[^>]*>[\s\S]*?(<\/\1>|$)/gi, '')
			.replace(/<\/?[a-z][\s\S]*?(>|$)/gi, '');
		return text;
	};
	res.locals.siteLink = `https://${req.headers.host}`;
	res.locals.facebook =
		settingsInfo == ''
			? 'https://facebook.com'
			: typeof settingsInfo[0].socialMedia.facebook == 'undefined'
				? 'https://facebook.com'
				: `${settingsInfo[0].socialMedia.facebook}`;
	res.locals.twitter =
		settingsInfo == ''
			? 'https://twitter.com'
			: typeof settingsInfo[0].socialMedia.twitter == 'undefined'
				? 'https://twitter.com'
				: `${settingsInfo[0].socialMedia.twitter}`;
	res.locals.instagram =
		settingsInfo == ''
			? 'https://instagram.com'
			: typeof settingsInfo[0].socialMedia.instagram == 'undefined'
				? 'https://instagram.com'
				: `${settingsInfo[0].socialMedia.instagram}`;
	res.locals.linkedin =
		settingsInfo == ''
			? 'https://linkedin.com'
			: typeof settingsInfo[0].socialMedia.linkedin == 'undefined'
				? 'https://linkedin.com'
				: `${settingsInfo[0].socialMedia.linkedin}`;
	res.locals.youtube =
		settingsInfo == ''
			? 'https://youtube.com'
			: typeof settingsInfo[0].socialMedia.youtube == 'undefined'
				? 'https://youtube.com'
				: `${settingsInfo[0].socialMedia.youtube}`;
	res.locals.pinterest =
		settingsInfo == ''
			? 'https://pinterest.com'
			: typeof settingsInfo[0].socialMedia.pinterest == 'undefined'
				? 'https://pinterest.com'
				: `${settingsInfo[0].socialMedia.pinterest}`;
	res.locals.textAsIcon = settingsInfo == '' ? false : settingsInfo[0].textAsIcon;
	res.locals.siteLogo =
		settingsInfo == ''
			? 'default.png'
			: typeof settingsInfo[0].siteLogo == 'undefined'
				? 'default.png'
				: settingsInfo[0].siteLogo;
	res.locals.favicon =
		settingsInfo == ''
			? 'default.png'
			: typeof settingsInfo[0].favicon == 'undefined'
				? 'default.png'
				: settingsInfo[0].favicon;
	res.locals.siteEmail =
		settingsInfo == ''
			? 'update site email in the admin dashboard'
			: typeof settingsInfo[0].contactInfo.email == 'undefined'
				? 'update site email in the admin dashboard'
				: settingsInfo[0].contactInfo.email;
	res.locals.siteNumber =
		settingsInfo == ''
			? 'update Phone number in the admin dashboard'
			: typeof settingsInfo[0].contactInfo.phoneNumber == 'undefined'
				? 'update phone number in the admin dashboard'
				: settingsInfo[0].contactInfo.phoneNumber;
	res.locals.otherInfo =
		settingsInfo == ''
			? 'update this in the admin dashboard'
			: typeof settingsInfo[0].contactInfo.otherInfo == 'undefined'
				? 'update this in the admin dashboard'
				: settingsInfo[0].contactInfo.otherInfo;
	res.locals.headerCategory = await Category.find()
		.populate('parent')
		.sort({ createdAt: -1 })
		.limit(3);
	res.locals.operatingSystem = process.platform;
	res.locals.myPost =
		typeof req.user !== 'undefined' ? await Article.countDocuments({ postedBy: req.user.id }) : null;
	res.locals.copyright = settingsInfo == '' ? `Copright ${new Date().getFullYear()}` : settingsInfo[0].copyright;
	res.locals.mainSettings = settingsInfo[0];
	res.locals.homepageFooter = await Ads.find({ location: 'homepageFooter' }).sort({ createdAt: -1 });
	res.locals.homepageSidebar = await Ads.find({ location: 'homepageSidebar' }).sort({ createdAt: -1 });
	res.locals.categoryFooter = await Ads.find({ location: 'categoryFooter' }).sort({ createdAt: -1 });
	res.locals.authorFooter = await Ads.find({ location: 'authorFooter' }).sort({ createdAt: -1 });
	res.locals.searchFooter = await Ads.find({ location: 'searchFooter' }).sort({ createdAt: -1 });
	res.locals.getCat = arg => {
		let promise = new Promise((resolve, reject) => {
			resolve(Category.findOne({ slug: arg.split('/').pop() }));
		});
		return promise.then(data => {
			return data.name;
		});
	};
	next();
});

// Disable post request in the demo
// router.post('*', (req, res, next) => {
// 	if (req.path == '/login') {
// 		return next();
// 	} else {
// 		req.flash('success_msg', 'Post request is disabled in demo');
// 		return res.redirect('back');
// 	}
// });


router.get('/blogger-werden', install.redirectToLogin, async (req, res, next) => {
	var categories = await Category.find({});
	let official = await Category.findOne({ slug: "official" });
	var articlelength = await Article.find({ "category": { $ne: official.id } }).populate('postedBy').populate('category');
	articlelength = articlelength.length;
	var r = Math.floor(Math.random() * articlelength);
	let random = await Article.find({ "category": { $ne: official.id } }).populate('postedBy').populate('category').limit(3).skip(r);
	res.render('index', {
		categories: categories,
		random: random
	});
});

let sitemap;
router.get('/sitemap.xml', async (req, res, next) => {
	res.header('Content-Type', 'application/xml');
	res.header('Content-Encoding', 'gzip');
	if (sitemap) {
		res.send(sitemap);
	}
	try {
		const smStream = new SitemapStream({ hostname: 'https://dype.me/' })
		const pipeline = smStream.pipe(createGzip())

		// pipe your entries or directly write them.
		smStream.write({ url: '', priority: 1.0 })
		smStream.write({ url: '/login', priority: 0.9 })
		smStream.write({ url: '/sign-up', priority: 0.9 })
		smStream.write({ url: '/aterlogin', priority: 0.9 })
		smStream.write({ url: '/blogrecent', priority: 0.9 })
		smStream.write({ url: '/enterinformation', priority: 0.9 })
		smStream.write({ url: '/membership', priority: 0.9 })
		smStream.write({ url: '/publisher', priority: 0.9 })
		smStream.write({ url: '/show-category-all', priority: 0.9 })
		smStream.write({ url: '/vision', priority: 0.9 })
		smStream.write({ url: '/forgot-password', priority: 0.9 })

		let articles = await Article.find({}).populate("category").populate('postedBy');
		articles.forEach(element => {
			let url = "";
			if (element.postedBy.roleId == "admin") {
				url = "/d/" + element.category.slug + "/" + element.slug;
			} else {
				url = "/p/" + element.category.slug + "/" + element.slug;
			}
			smStream.write({ url: url, priority: 0.9 })
		})
		let users = await User.find({});
		users.forEach(element => {
			let url = '/author/' + element.usernameslug;
			smStream.write({ url: url, priority: 0.9 })
		});

		smStream.end()
		// cache the response
		streamToPromise(pipeline).then(sm => sitemap = sm)
		// stream write the response
		pipeline.pipe(res).on('error', (e) => { throw e })
	} catch (e) {
		console.error(e)
		res.status(500).end()
	}
});

router.get('/lostpassword', install.redirectToLogin, async (req, res, next) => {
	res.render('lostpassword', {
		title: "Lost Passowrd"
	});
});

// payout table download as a pdf.
router.post('/payout/download', install.redirectToLogin, async (req, res, next) => {
	// console.log(req.user);
	let user = await User.findOne({ _id: req.user.id });
	res.redirect("back");
})

router.get('/paycontent', install.redirectToLogin, async (req, res, next) => {
	res.render('paycontent', {
		title: "Pay Content"
	});
});
router.post("/loadmore", async (req, res, next) => {
	let count = req.body.count;
	let official = await Category.findOne({ slug: "official" });
	let articles = await Article.find({ "category": { "$ne": official.id } }).populate('postedBy').populate("category");
	let randoms = await Article.find({ 'category': { "$ne": official.id } })
		.populate('category')
		.populate('postedBy').limit(6).skip(parseInt(count));
	let result = randoms;
	res.json(result);
})
router.get('/blogrecent', install.redirectToLogin, async (req, res, next) => {
	if (req.user) {
		let userId = req.user._id;
		let user = await User.findOne({ _id: userId });
		let official = await Category.findOne({ slug: "official" });
		let articles = await Article.find({ "category": { "$ne": official.id } }).populate('postedBy').populate("category");
		let category = await Category.find({});
		let usercategoryList = user.categoryList;
		let categories = [];
		category.forEach(element => {
			usercategoryList.forEach(item => {
				if (item == element.slug) {
					categories.push(element);
				}
			});
		});
		let feed = [];
		let editorsPickerArticle = [];
		articles.forEach(article => {
			categories.forEach(category => {
				if (article.category.slug == category.slug) {
					editorsPickerArticle.push(article);
				}
			});
		});
		switch (editorsPickerArticle.length) {
			case 0:
				var r0 = Math.floor(Math.random() * articles.length);
				let _editorsPicker = await Article.find({ "category": { $ne: official.id } }).populate('postedBy').populate('category').limit(3).skip(r0);
				feed = _editorsPicker;
				break;
			case 1:
				var r1 = Math.floor(Math.random() * articles.length);
				let _editorsPicker1 = await Article.find({ "category": { $ne: official.id } }).populate('postedBy').populate('category').limit(2).skip(r1);
				feed.push(_editorsPicker1);
				break;
			case 2:
				var r2 = Math.floor(Math.random() * articles.length);
				let _editorsPicker2 = await Article.find({ "category": { $ne: official.id } }).populate('postedBy').populate('category').limit(1).skip(r2);
				feed.push(_editorsPicker2);
				break;
			case 3:
				feed = editorsPickerArticle;
				break;
			default:
				for (var i = feed.length; i < 3; i++) {
					let r = Math.floor(Math.random() * editorsPickerArticle.length);
					feed.push(editorsPickerArticle[r]);
				}
				break;
		}
		let rtrend = Math.floor(Math.random() * articles.length);
		let trendings = await Article.find({ 'category': { "$ne": official.id } })
			.populate('category')
			.populate('postedBy')
			.sort({ views: -1 })
			.sort({ createdAt: -1 }).limit(6).skip(rtrend);
		let trends = trendings;
		// for (var i = 0; i < 6; i++) {
		// 	let r = Math.floor(Math.random() * editorsPickerArticle.length);
		// 	trends.push(editorsPickerArticle[r]);
		// }
		let followers = await User.find({
			"following.user": { $in: req.user.id }
		}).populate("following").sort({ createdAt: -1 });
		let authorarticle = [];
		for (var i in followers) {
			let art = await Article.find({
				postedBy: followers[i]._id
			}).populate('category')
				.populate('postedBy')
				.sort({ views: -1 })
				.sort({ createdAt: -1 });
			for (var j in art) {
				if (authorarticle.length > 5) {
					break;
				} else {
					authorarticle.push(art[j]);
				}
			}
		}
		let _newslength = await Article.find({ 'category': { "$ne": official.id } });
		_newslength = _newslength.length;
		let r = Math.floor(Math.random() * _newslength);
		let news = await Article.find({ 'category': { "$ne": official.id } })
			.sort({ createdAt: -1 })
			.populate('category')
			.populate('postedBy').limit(3).skip(r);
		let randoms = await Article.find({ 'category': { "$ne": official.id } })
			.populate('category')
			.populate('postedBy').limit(6).skip(Math.floor(Math.random() * articles.length));

		let favorites = [];
		let total_article = await Article.find({})
			.populate('category')
			.populate('postedBy').sort('create_at').limit(10);
		categories.forEach(element => {
			total_article.forEach(item => {
				if (item.category.slug == element.slug) {
					favorites.push(item);
				}
			});
		});
		console.log(randoms.length)
		res.render('blogrecent', {
			title: 'Blog recent',
			editorsPicker: feed,
			categories: categories,
			trendings: trends,
			authorarticle: authorarticle,
			news: feed,
			newest: news,
			random: randoms,
			favorites: favorites
		});
	} else {
		let official = await Category.findOne({ slug: "official" });
		var articlelength = await Article.find({ "category": { $ne: official.id } }).populate('postedBy').populate('category');
		articlelength = articlelength.length;
		var r = Math.floor(Math.random() * articlelength);
		let editorsPicker = await Article.find({ "category": { $ne: official.id } }).populate('postedBy').populate('category').limit(3).skip(r);
		var categorylength = await Category.find({ "slug": { "$ne": "official" } });
		categorylength = categorylength.length;
		r = Math.floor(Math.random() * categorylength);
		let categories = await Category.find({ "slug": { "$ne": "official" } }).limit(6).skip(r);
		r = Math.floor(Math.random() * articlelength);
		let trendings = await Article.find({}).populate('postedBy').populate('category').limit(6).skip(r);
		r = Math.floor(Math.random() * articlelength);
		let authorarticle = await Article.find({}).populate('postedBy').populate('category').limit(3).skip(r);
		let newest = await Article.find({})
			.sort({ createdAt: -1 })
			.populate('category')
			.populate('postedBy')
		let news = [];
		newest.forEach(element => {
			if (element.category.slug != "official") {
				if (news.length != 3) {
					news.push(element);
				}
			}
		})

		r = Math.floor(Math.random() * articlelength);
		let random = await Article.find({}).populate('postedBy').populate('category').limit(6).skip(r);
		res.render('blogrecent', {
			title: 'Blog recent',
			editorsPicker: editorsPicker,
			categories: categories,
			trendings: trendings,
			authorarticle: authorarticle,
			news: news,
			newest: news,
			random: random,
		});
	}
});

router.get('/ourwork', async (req, res, next) => {
	if (!req.user) {
		let favorites = await Article.find({}).limit(9);
		res.render('ourwork', {
			title: "Our Work",
			favorites: favorites
		});
	} else {
		let userId = req.user._id;
		let user = await User.findOne({ _id: userId });
		let category = await Category.find({});
		let usercategoryList = user.categoryList;
		let categories = [];
		category.forEach(element => {
			usercategoryList.forEach(item => {
				if (item == element.slug) {
					categories.push(element);
				}
			});
		});
		let favorites = [];
		let total_article = await Article.find({})
			.populate('category')
			.populate('postedBy').sort('create_at').limit(10);
		categories.forEach(element => {
			total_article.forEach(item => {
				if (item.category.slug == element.slug) {
					favorites.push(item);
				}
			});
		});
		res.render('ourwork', {
			title: "Our Work",
			favorites: favorites
		});
	}
});
router.post('/suggestion', async(req, res, next) =>{
	let term = req.body.term;
	console.log(req.body);
	suggest(term, function(err, suggestions){
		if (err) throw err;
		console.log(term);
		return res.json({'data': suggestions});
	})
});
// Get index page
router.get('/', install.redirectToLogin, async (req, res, next) => {
	
	/** This is the token of the user  */
	// let users = await User.find({});
	// users.forEach(async user => {
	// 	console.log(user.token);
	// 	let token = crypto.randomBytes(16).toString("hex");
	// 	await User.updateOne({_id: user._id}, {token: token});
	// });

	// let media = await Media.deleteMany({});
	/** This is the after login process initialize part */
	// let users = await User.find({});
	// users.forEach(async user => {
	// 	await User.updateOne({ _id: user._id }, { signupProcess: "/blogrecent" });
	// });

	try {
		let users = await User.find({});
		users.forEach(async element => {
			let username = element.username.toLowerCase().replace(" ", "");
			let array = username.split('');
			array.forEach((item, index) => {
				if (item == "ß") {
					array[index] = "ss";
				}
				if (item == "ö") { array[index] = "oe"; }
				if (item == "ä") { array[index] = "ae"; }
				if (item == "ü") { array[index] = "ue"; }
			});
			let usernameslug = array.join("");
			await User.updateOne(
				{ _id: element._id },
				{ usernameslug: usernameslug }
			);
		});

		var categories = await Category.find({});
		let official = await Category.findOne({ slug: "official" });
		var articlelength = await Article.find({ "category": { $ne: official.id } }).populate('postedBy').populate('category');
		articlelength = articlelength.length;
		var r = Math.floor(Math.random() * articlelength);
		let random = await Article.find({ "category": { $ne: official.id } }).populate('postedBy').populate('category').limit(3).skip(r);
		let articles = await Article.find({}).populate('postedBy').populate('category');
		let result = [];


		categories.forEach(category => {
			let category_articles = [];
			articles.forEach(article => {
				if (article.category.id == category.id) {
					category_articles.push(article);
				}
			});
			let object = {
				name: category.name,
				articles: category_articles
			}
			if (object.articles.length != 0) {
				result.push(object);
			}
		});
		res.render('publisher', {
			categories: result,
			random: random
		});

	} catch (error) {
		next(error);
	}
});

router.post('/api/article/read', async (req, res, next) => {
	let token = req.body.token;
	let articleslug = req.body.articleslug;
	let user = await User.findOne({ token: token });
	let article = await Article.findOne({ slug: articleslug });
	let payload = {};
	if (user.paid == "paid") {
		const check = await Bookmark.findOne({
			articleId: article.id,
			userId: user.id
		});
		if (check) {
			payload = {
				error: "This article Already saved!"
			}
		} else {
			await Bookmark.create({
				articleId: article.id,
				userId: user.id
			});
			payload = {
				error: "Article saved. You can read this article later!"
			};
		}
	} else {
		payload = {
			error: "You can't save the article because you are not premium member!"
		};
	}
	return res.json({ "data": payload });
})

router.post('/api/content', async (req, res, next) => {
	let categoryslug = req.body.categoryslug;
	let contentslug = req.body.contentslug;
	let article = await Article.findOne({ slug: contentslug }).populate('postedBy').populate('category');
	let payload = {
		article: article
	}
	return res.json({ "data": payload });
});

router.post('/api/search', async (req, res, next) => {
	let searchKey = req.body.key;
	let data = await Article.find({
		active: true,
		$or: [
			{ title: { $regex: searchKey, $options: '$i' } },
			{ tags: { $regex: searchKey, $options: '$i' } },
		],
	})
		.populate('postedBy')
		.populate('category');
	let payload = {
		articleList: data
	}
	return res.json({ "data": payload });
});

router.post('/api/contentlist', async (req, res, next) => {
	let categoryslug = req.body.categoryslug;
	let category = await Category.findOne({ slug: categoryslug });
	let articles = await Article.find({ category: category.id }).populate('postedBy').populate('category');
	let payload = {
		articleList: articles
	}
	return res.json({ "data": payload });
});

router.post('/api/upfollowlist', async (req, res, next) => {
	let token = req.body.token; // user token
	let user = await User.findOne({ token: token });
	const followers = await User.find({
		"following.user": { $in: user.id }
	}).populate("following").sort({ createdAt: -1 });
	let payload = {
		list: followers
	}
	return res.json({ "data": payload });
});
router.post('/api/savecategory', async (req, res, next) => {
	let token = req.body.token; // user token
	let user = await User.findOne({ token: token });
	let categoryList = req.body.categoryList;
	let newList = categoryList.split(",");
	await User.updateOne({ _id: user._id }, { $set: { categoryList: newList } }).then(element => {
		let payload = {
			successful: element
		}
		return res.json({ "data": payload });
	});
})
router.post('/api/categories', async (req, res, next) => {
	let token = req.body.token; // user token
	let user = await User.findOne({ token: token });
	let categories = await Category.find({});
	let payload = {
		categories: categories
	}
	return res.json({ "data": payload });
})
router.post('/api/home', async (req, res, next) => {
	let token = req.body.token; // user token
	let user = await User.findOne({ token: token });
	let usercatList = user.categoryList;
	let recentlyArticles = await Article.find({}).populate('category').populate('postedBy').sort('created_at').limit(3);
	let authorArcieles = await Article.find({}).populate('category').populate('postedBy').sort('created_at').limit(3);
	let trendingArticles = await Article.find({}).populate('category').populate('postedBy').sort('created_at').sort('views').limit(3);
	let categories = await Category.find({});
	let favoriteCategories = [];
	usercatList.forEach(element => {
		categories.forEach(item => {
			if (item.slug == element) {
				favoriteCategories.push(item);
			}
		});
	});
	let payload = {
		recently: recentlyArticles,
		authorArcieles: authorArcieles,
		trendings: trendingArticles,
		favoriteCategories: favoriteCategories
	}
	return res.json({ "data": payload });
});
router.get('/search', install.redirectToLogin, async (req, res, next) => {
	try {
		if (req.query.q) {
			let perPage = 3;
			let page = req.query.page || 1;
			let count = await Article.countDocuments({
				active: true,
				$or: [
					{ title: { $regex: req.query.q, $options: '$i' } },
					{ tags: { $regex: req.query.q, $options: '$i' } },
				],
			});
			let data = await Article.find({
				active: true,
				$or: [
					{ title: { $regex: req.query.q, $options: '$i' } },
					{ tags: { $regex: req.query.q, $options: '$i' } },
				],
			})
				.populate('postedBy')
				.populate('category')
				.skip(perPage * page - perPage)
				.limit(perPage)
				.sort({ createdAt: -1 });
			let datacategory = await Category.find({
				name: { $regex: req.query.q, $options: '$i' }
			})
				.skip(perPage * page - perPage)
				.limit(perPage)
				.sort({ createdAt: -1 });
			let datauser = await User.find({
				active: true,
				username: { $regex: req.query.q, $options: '$i' }
			})
				.skip(perPage * page - perPage)
				.limit(perPage)
				.sort({ createdAt: -1 });
			let random = await Article.aggregate([
				{
					$match: {
						active: true,
					},
				},
				{
					$sample: {
						size: 4,
					},
				},
				{
					$lookup: {
						from: 'users',
						localField: 'postedBy',
						foreignField: '_id',
						as: 'postedBy',
					},
				},
				{
					$unwind: '$postedBy',
				},
				{
					$lookup: {
						from: 'categories',
						localField: 'category',
						foreignField: '_id',
						as: 'category',
					},
				},
				{
					$unwind: '$category',
				},
			]);
			let popular = await Article.find({})
				.populate("category")
				.populate("postedBy")
				.sort({ views: -1 })
				.limit(3);

			let result_count = false;
			if (data.length == 0 && datacategory.length == 0 && datauser.length == 0) {
				result_count = true;
			}
			let search_payload = {
				keystring: req.query.q,
				count: 1,
				date: new Date(),
				noresult: result_count
			}
			let searchkey = await SearchKey.findOne({ keystring: req.query.q });
			if (searchkey) {
				let new_count = parseInt(searchkey.count) + 1;
				console.log(new_count);
				await SearchKey.updateOne({ _id: searchkey.id }, { count: new_count });
				res.render('search', {
					data: data,
					datacategory: datacategory,
					datauser: datauser,
					search: req.query.q,
					current: page,
					pages: Math.ceil(count / perPage),
					random: random,
					popular: popular
				});
			} else {
				SearchKey.create(search_payload).then(result => {
					res.render('search', {
						data: data,
						datacategory: datacategory,
						datauser: datauser,
						search: req.query.q,
						current: page,
						pages: Math.ceil(count / perPage),
						random: random,
						popular: popular
					});
				});
			}
		} else {
			res.render('404');
		}
	} catch (error) {
		next(error);
	}
});

router.get('/author/:usernameslug', install.redirectToLogin, async (req, res, next) => {
	// let users = await User.find({});
	// users.forEach(async item => {
	// 	let init = [];
	// 	await User.updateOne({ _id: item.id }, { $set: { following: [] } });
	// });
	// let articles = await Article.find({});
	// articles.forEach(async element => {
	// 	let init = {
	// 		count: 0,
	// 		users: []
	// 	}
	// 	await Article.updateOne({_id: element.id}, {$set: {viewers: [], upvote: init, views: 0}})
	// })

	let user = await User.findOne({ usernameslug: req.params.usernameslug });
	let featured = await Article.aggregate([
		{
			$match: {
				addToFeatured: true,
				active: true,
			},
		},
		{
			$lookup: {
				from: 'categories',
				localField: 'category',
				foreignField: '_id',
				as: 'category',
			},
		},
		{
			$unwind: {
				path: '$category',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'postedBy',
				foreignField: '_id',
				as: 'postedBy',
			},
		},
		{
			$unwind: {
				path: '$postedBy',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: 'comments',
				localField: '_id',
				foreignField: 'articleId',
				as: 'comments',
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
		{
			$limit: 4,
		},
	]);
	if (!user) res.render('404');
	else {
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
			{ _id: user.id },
			{ $push: { viewers: payload } }
		);
		let perPage = 9;
		let page = req.query.page || 1;
		let article = await Article.find({ active: true, postedBy: user._id })
			.populate('postedBy')
			.populate('category')
			.skip(perPage * page - perPage)
			.limit(perPage)
			.sort({ createdAt: -1 });
		let count = await Article.countDocuments({ active: true, postedBy: user._id });
		res.render('author', {
			author: user,
			article: article,
			featured: featured,
			current: page,
			pages: Math.ceil(count / perPage),
		});
	}
});

router.get('/vision', install.redirectToLogin, async (req, res, next) => {
	res.render('vision');
})

router.get('/membership', async (req, res, next) => {
	res.render('membership');
})

router.post('/reset-password', async (req, res, next) => {
	let user = await User.findOne({ email: req.body.email });
	if (!req.body.email) {
		req.flash("error_msg", "Please enter your email!");
	} else {
		if (user == null) {
			req.flash("error_msg", "I am sorry. User Doesn't exist!");
		} else {
			req.flash("success_msg", "Please check your email.");
			let payload = {
				username: user.firstName,
				siteLink: res.locals.siteLink,
				token: user.token
			}
			await _mail(
				"Passwort-Änderung erfolgreich",
				user.email,
				"reset-password-email",
				payload,
				req.headers.host,
				(err, info) => {
					if (err) console.log(err);
				}
			)
		}
	}
	res.redirect("back");
})

// This is the password - reset part.
// Currently password encryption is not working.
router.get('/password-reset', async (req, res, next) => {
	// user token
	let token = req.query.token;
	res.render('password-reset', {
		token: token
	});
});

router.post('/password-save', async (req, res, next) => {
	//console.log(req.body.token);

	let user = await User.findOne({ token: req.body.token });
	if (req.body.password !== req.body.conform) {
		req.flash("success_msg", "Password Does'nt match");
		return res.redirect('back');
	} else {
		let newpassword = "";
		bcrypt.genSalt(12, function (err, salt) {
			if (err) return next(err);

			bcrypt.hash(req.body.password, salt, null, function (err, hash) {
				if (err) return next(err);
				newpassword = hash;
				User.updateOne({ _id: user.id }, { password: newpassword }).then(result => {
					req.flash("success_msg", "Successful");
					res.redirect('/login');
				});

			});
		});
	}
})
module.exports = router;
