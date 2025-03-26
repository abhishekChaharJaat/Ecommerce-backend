import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Assuming you have a User schema
      required: true,
      default: null,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product", // Assuming you have a Product schema
      required: true,
      default: null,
    },
    color: {
      type: String,
      required: true,
      default: "black", // Default color
    },
    qty: {
      type: Number,
      required: true,
      default: 1, // Default quantity
    },
    size: {
      type: String,
      required: true,
      default: 1, // Default quantity
    },
    status: {
      type: String,
      default: "cart",
    },
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

export default mongoose.model("cart", cartSchema);
