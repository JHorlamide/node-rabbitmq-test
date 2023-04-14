import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String },
  price: { type: String },
  description: { type: String },
  imageURL: { type: String },
  creator: { type: String },
});

const Product = mongoose.model("products", productSchema);

export default Product;
