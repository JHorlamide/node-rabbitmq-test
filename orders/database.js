import mongoose from "mongoose";

const connectWithRetry = async () => {
  const count = 0;

  try {
    await mongoose.connect("mongodb://root:1234@database:27017/");
    console.log("mongoDB connected...");
  } catch (error) {
    const retrySeconds = 5;
    console.log(
      `MongoDB connection unsuccessful (will retry in #${count} after ${retrySeconds} seconds)`,
      error
    );

    setTimeout(connectWithRetry, retrySeconds * 1000);
    process.exit(1);
  }
};

export default connectWithRetry;

// mongoose
//   .connect("mongo://root:1234@database/27017/")
//   .then(() => {
//     console.log("mongDB connected");
//   })
//   .catch((error) => {
//     const retrySeconds = 5;
//     console.log(
//       `MongoDB connection unsuccessful (will retry in #${count} after ${retrySeconds} seconds)`,
//       error
//     );

//     setTimeout(connectWithRetry, retrySeconds * 1000);
//     process.exit(1);
//   });
