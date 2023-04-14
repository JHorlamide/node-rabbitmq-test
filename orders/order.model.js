import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [{ type: String }],
  totalPrice: { type: Number },
  creator: { type: String },
});

const Order = mongoose.model("orders", orderSchema);

export default Order;
