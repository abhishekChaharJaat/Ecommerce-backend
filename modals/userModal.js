import mongoose from "mongoose";

// Define the Order schema
const orderSchema = new mongoose.Schema(
  {
    order_id: { type: Number, required: true, default: 12 },
    order_date: { type: Date, required: true },
    total_amount: { type: Number, required: true, default: 100 },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Define the User schema with orderHistory
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    profilePicture: { type: String },
    pincode: { type: Number, default: 0 },
    role: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
