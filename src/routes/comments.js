import express from 'express';
import Comment from '../models/comment';
import auth from '../helpers/auth';
import crypto from 'crypto';
import Settings from '../models/settings';
const router = express.Router();

// Create a new comment
router.post('/comment', async (req, res, next) => {
	let set = await Settings.findOne();
	try {
		let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
			|| req.socket.remoteAddress ||
			(req.connection.socket ? req.connection.socket.remoteAddress : null);
		let payload = {
			name: req.body.name,
			email: req.body.email,
			comment: req.body.comment,
			articleId: req.body.articleId,
			upvoteCount: 0,
			profilePicture:req.body.profilePicture,
				// 'https://gravatar.com/avatar/' +
				// crypto
				// 	.createHash('md5')
				// 	.update(req.body.email)
				// 	.digest('hex')
				// 	.toString() +
				// '?s=200' +
				// '&d=retro',
		};
		Comment.create(payload)
			.then(done => {
				// res.send({data: done});
				res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});
// Upvote to a comment
router.post("/comment/upvote", async (req, res, next) => {
	let commentId = req.body.commentId;
	let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
		|| req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.socket.remoteAddress : null);
	let comment = await Comment.findOne({ _id: commentId });
	let indexof = -1;
	comment.upvote.forEach(element => {
		if(element.ip == ipAddress){
			indexof = 1;
		}
	});
	let payload = {
		ip: ipAddress
	}
	if(indexof == -1){
		await Comment.updateOne({_id: commentId}, { $push: { upvote: payload },  $inc: { upvoteCount: 1 } } );
		comment = await Comment.findOne({ _id: commentId });
	}
	res.json(comment.upvoteCount);
});

// Reply to a comment
router.post('/reply', (req, res, next) => {
	try {
		let payload = {
			name: req.body.name,
			email: req.body.email,
			reply: req.body.reply,
			profilePicture: req.body.profilePicture,
				// 'https://gravatar.com/avatar/' +
				// crypto
				// 	.createHash('md5')
				// 	.update(req.body.email)
				// 	.digest('hex')
				// 	.toString() +
				// '?s=200' +
				// '&d=retro',
		};
		Comment.updateOne({ _id: req.body.commentId }, { $push: { replies: payload } })
			.then(replied => {
				// res.status(200).send('Replied successfully');
				// res.send('Replied successfully');
				res.redirect('back');
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

router.post('/comment/deleteMany', auth, (req, res, next) => {
	try {
		Comment.deleteMany({ _id: req.body.ids })
			.then(deleted => {
				if (!req.body.ids) {
					req.flash('success_msg', 'Nothing was Deleted');
					return res.redirect('back');
				} else {
					req.flash('success_msg', 'Comment has been Deleted');
					return res.redirect('back');
				}
			})
			.catch(e => next(e));
	} catch (error) {
		next(error);
	}
});

module.exports = router;
