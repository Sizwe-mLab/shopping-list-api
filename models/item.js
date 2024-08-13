//This file defines the Mongoose schema for representing an item in your shopping list. It outlines the structure and data types of the item's properties.
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  notes: { type: String },
  category: { type: String },
  tags: [String],
  createdAt: { type: Date, default: Date.now() },
});

export default mongoose.model("Item", itemSchema)
