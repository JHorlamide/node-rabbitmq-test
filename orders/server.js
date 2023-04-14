import express from "express";
import cors from "cors";
import amqp from "amqplib";
import orderRoute from "./order.route.js";
import connectWithRetry from "./database.js";
import Order from "./order.model.js";

const app = express();
const PORT = process.env.PORT;

let channel;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,,PATCH",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.json({ extended: false }));
app.use(orderRoute);

function onError(error) {
  console.error(`Failed to start server:\n${error.stack}`);
  process.exit(1);
}

async function createOrder(products, userEmail) {
  let total = 0;

  for (let t = 0; t < products?.length; ++t) {
    total += +products[t].price;
  }

  products = products?.map((product) => {
    return product.id;
  });

  const newOrder = await Order.create({
    products,
    creator: userEmail,
    totalPrice: total,
  });

  return newOrder;
}

async function connect() {
  const amqpServer = process.env.RABBITMQ_URL;
  try {
    const connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("ORDER");
  } catch (error) {
    console.error("RabbitMQ Error: ", error);
  }
}

connect().then(() => {
  channel.consume("ORDER", (data) => {
    console.log("Consuming ORDER service");

    const { products, userEmail } = JSON.parse(data.content);

    createOrder(products, userEmail)
      .then((newOrder) => {
        channel.ack(data);
        channel.sendToQueue(
          "PRODUCT",
          Buffer.from(JSON.stringify({ newOrder }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

const main = async () => {
  try {
    await connectWithRetry();
  } catch (error) {
    onError(error);
  }
};

main();

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}...`);
});
