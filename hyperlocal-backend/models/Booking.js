

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  services: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
],

  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if multiple
  address: String,
  phone: String,
  paymentMethod: { type: String, enum: ["razorpay", "cod"], required: true },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);
