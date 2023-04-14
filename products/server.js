import express from "express";
import cors from "cors";
import productRoute from "./product.route.js";
import connectWithRetry from "./database.js";

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,,PATCH",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.json({ extended: false }));
app.use(productRoute);

function onError(error) {
  console.error(`Failed to start server:\n${error.stack}`);
  process.exit(1);
}

const main = async () => {
  try {
    await connectWithRetry();
  } catch (error) {
    onError(error);
  }
};

main();

app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}...`);
});
