import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a product name"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
  },
  stock: {
    type: Number,
    required: [true, "Please provide stock quantity"],
    default: 0,
  },
  category: {
    type: String,
    required: [true, "Please select a category"],
  },
  images: {
    type: [String], // Array of image URLs from Cloudinary
    default: [],
  },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);