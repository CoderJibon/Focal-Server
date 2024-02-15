import mongoose from "mongoose";

// create Color schema
const ColorSchema = new mongoose.Schema(
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
    },
    colorCode: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// export Color schema
export default mongoose.models.Color || mongoose.model("Color", ColorSchema);
