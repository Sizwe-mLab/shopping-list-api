//This file defines the Mongoose schema for representing an item in your shopping list. It outlines the structure and data types of the item's properties.
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 3 }, // Enforce minimum length & ensuring leading or trailing whitespace characters will be removed from the string before it's saved to the database.
    quantity: { type: Number, required: true, min: 0 }, // Enforce non-negative quantity
    notes: { type: String },
    category: { type: String },
    tags: [String],
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
