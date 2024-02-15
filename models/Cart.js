import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
        size: String,
      },
    ],
    cartTotal: {
      type: Number,
    },
    totalAfterDiscount: {
      type: Number,
    },
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// export Cart schema

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
