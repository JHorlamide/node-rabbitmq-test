import express from "express";
import Order from "./order.model.js";

const router = express.Router();

router.get("/api/orders", async (req, res) => {
  const results = await Order.find({}).exec();

  res.status(200).json(results);
});

export default router;
