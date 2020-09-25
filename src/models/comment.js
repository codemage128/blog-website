import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    slug: String,
    name: String,
    email: String,
    comment: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    articleId: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    },
    upvote: [
        {
            ip: String,
        }
    ],
    upvoteCount: Number,
    replies: [
        {
            name: String,
            email: String,
            reply: String,
            profilePicture: String,
            createdAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    profilePicture: {
        type: String,
    },
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);