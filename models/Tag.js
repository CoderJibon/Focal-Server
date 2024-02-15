import mongoose from "mongoose";

// create tag schema
const TagSchema = mongoose.Schema(
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

// export tag schema
export default mongoose.models.Tag || mongoose.model("Tag", TagSchema);
