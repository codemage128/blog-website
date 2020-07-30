import mongoose from "mongoose";
const Schema = mongoose.Schema;
const subscriptionSchema = new Schema(
  {
    stripesessionId: {
      type: Schema.Types.ObjectId,
      ref: "Stripesession"
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    startDate: Date,
    expireDate: Date,
    
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
