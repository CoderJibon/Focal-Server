import mongoose from "mongoose";

// create Coupon schema
const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    trash: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// export Coupon schema

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
