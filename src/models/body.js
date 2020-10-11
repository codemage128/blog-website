import mongoose from "mongoose";
const Schema = mongoose.Schema;
const bodySchema = new Schema(
  {
    articleId : {
      type: Schema.Types.ObjectId,
      ref: "Article"
    },
    html: String
  },
  { timestamps: true }
);

export default mongoose.model("body", bodySchema);
