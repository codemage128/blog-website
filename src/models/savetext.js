import mongoose from "mongoose";
const Schema = mongoose.Schema;
const savetextSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    articleId : {
      type: Schema.Types.ObjectId,
      ref: "Article"
    },
    text: Array,
    url: String
  },
  { timestamps: true }
);

export default mongoose.model("Textsave", savetextSchema);
