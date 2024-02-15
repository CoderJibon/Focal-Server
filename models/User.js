import mongoose from "mongoose";
import Crypto from "crypto";

// create a User Schema
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      default: null,
    },
    photo: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: {
      type: String,
      default: null,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    trash: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
      trim: true,
    },
    passwordResetToken: {
      type: String,
      default: null,
      trim: true,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// mongoose models
export default mongoose.models.User || mongoose.model("User", UserSchema);
