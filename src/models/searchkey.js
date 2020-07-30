import mongoose from "mongoose";
const Schema = mongoose.Schema;
const searchkey = new Schema(
  {
    keystring: String,
    count: String,
    date: Date,
    noresult: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("searchkey", searchkey);
