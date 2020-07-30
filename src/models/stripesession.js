import mongoose from "mongoose";
const Schema = mongoose.Schema;
const stripe_sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    id: String, 
    object: String,
    billing_address: String,
    cancel_url: String,
    client_reference_id: String,
    customer: String,
    customer_email: String,
    display_items: Array,
    livemode: Boolean,
    locale: String,
    locale: String,
    metadata: Object,
    mode: String,
    payment_intent: String,
    payment_method_types: Array,
    setup_intent: String,
    shipping: String,
    shipping_address_collection: String,
    submit_type: String,
    subscription: String,
    success_url: String,
    line_items: Array,
  },
  { timestamps: true }
);

export default mongoose.model("Stripesession", stripe_sessionSchema);
