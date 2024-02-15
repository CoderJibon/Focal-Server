import mongoose from "mongoose";

// create Product category schema

const productCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
      default: null,
    },
    icon: {
      type: String,
      default: null,
      trim: true,
    },
    photo: {
      type: Object,
      default: null,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: null,
      trim: true,
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

// export
export default mongoose.models.ProductCategory ||
  mongoose.model("ProductCategory", productCategorySchema);
