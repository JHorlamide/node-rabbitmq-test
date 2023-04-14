import express from "express";
import amqp from "amqplib";
import Product from "./product.model.js";
import isAuthenticated from "./isAuthenticated.js";

const router = express.Router();

let channel;

async function connect() {
  const amqpServer = process.env.RABBITMQ_URL;

  try {
    const connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("PRODUCT");
  } catch (error) {
    console.error("RabbitMQ Error: ", error);
  }
}

connect();

router.get("/api/products", async (req, res) => {
  const products = await Product.find({}).exec();
  res.status(200).json(products);
});

router.post("/api/products", isAuthenticated, async (req, res) => {
  try {
    const { name, price, description, imageURL } = req.body;

    const newProduct = await Product.create({
      name,
      price,
      description,
      imageURL,
      creator: req.user.email,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error message: ", error);
  }
});

router.post("/api/products/buy", isAuthenticated, async (req, res) => {
  const { id } = req.body;
  let order;

  try {
    const products = await Product.find({ id }).exec();

    channel.sendToQueue(
      "ORDER",
      Buffer.from(
        JSON.stringify({
          products,
          userEmail: req.user.email,
        })
      )
    );

    await channel.consume("PRODUCT", (data) => {
      order = JSON.parse(data.content);
    });

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error message: ", error);
  }
});

export default router;
