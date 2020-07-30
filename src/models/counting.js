import mongoose from "mongoose";
const Schema = mongoose.Schema;
const countingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    articleId : {
      type: Schema.Types.ObjectId,
      ref: "Article"
    },
    spentTime: Number,
    authorName: String,
  },
  { timestamps: true }
);

export default mongoose.model("counting", countingSchema);
