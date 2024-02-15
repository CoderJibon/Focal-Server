import mongoose from "mongoose";

// create a product schema for
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    shortDesc: {
      type: String,
      trim: true,
    },
    longDesc: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "ProductCategory",
      default: null,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },
    tag: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Tag",
      default: null,
    },
    collectionName: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    productThumbnails: {
      public_id: String,
      url: String,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    color: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Color",
      default: null,
    },
    size: {
      type: [String],
      default: null,
    },
    sort: {
      type: String,
      default: null,
    },
    ratings: [
      {
        star: Number,
        comment: String,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    totalRating: {
      type: String,
      default: 0,
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

// export product schema
export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
