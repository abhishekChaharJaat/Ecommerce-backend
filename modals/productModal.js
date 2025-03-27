import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Name of the product",
  },
  description: {
    type: String,
    default: "Detailed description of the product",
  },
  category: {
    type: String,
    default: "Main product category",
  },
  Size: {
    type: String,
    default: "",
  },
  subCategory: {
    type: String,
    default: "Subcategory of the product",
  },
  price: {
    type: Number,
    default: "Current selling price",
    minimum: 0,
  },
  originalPrice: {
    type: Number,
    default: "Original price before discount",
    minimum: 0,
  },
  discount: {
    type: String,
    default: "Discount percentage (e.g., '15%')",
    pattern: "^[0-9]+%$",
  },
  currency: {
    type: String,
    default: "Rs.",
  },
  stock: {
    type: Number,
    default: "Number of items in stock",
    minimum: 0,
  },
  isInStock: {
    type: Boolean,
    default: "Indicates if the product is in stock",
  },
  brand: {
    type: String,
    default: "Brand name",
  },
  images: {
    type: [String], 
    default: [], 
  },
  thumbnail: {
    type: String,
    default: "URL for the product thumbnail",
    format: "uri",
  },
  ratings: {
    type: Number,
    default: "Average rating out of 5",
    minimum: 0,
    maximum: 5,
  },
  reviewsCount: {
    type: Number,
    default: "Number of customer reviews",
    minimum: 0,
  },
  isFeatured: {
    type: Boolean,
    default: "Whether the product is featured",
  },
  seller: {
    type: String,
    default: "Name or ID of the seller",
  },
  returnPolicy: {
    type: String,
    default: "Return policy details",
  },
  warranty: {
    type: String,
    default: "Warranty information",
  },
});
export default mongoose.model("product", productSchema);

// images: {
//   type: "array",
//   default: "Array of image URLs",
//   items: {
//     type: String,
//     format: "uri",
//   },
//   minItems: 1,
// },
