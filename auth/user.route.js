import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";

const router = express.Router();

router.get("/api/users", async (req, res) => {
  const users = await User.find({}).exec();
  res.status(200).json(users);
});

router.post("/api/signup", async (req, res) => {
  let { name, email, password } = req.body;

  password = await bcrypt.hash(password, 12);

  const newUser = new User({ name, email, password });

  const payload = {
    email,
    name,
  };

  jwt.sign(payload, process.env.JWT_SECRET, async (err, token) => {
    if (err) {
      console.log(err);
      return;
    }

    await newUser.save();

    res.status(200).json({ token, name, email });
  });
});

router.post("/api/signin", async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).exec();

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    console.log(isPasswordMatch);

    if (isPasswordMatch) {
      const payload = {
        email: user.email,
        name: user.name,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return res.status(200).json({
        token,
        name: user.name,
        email: req.body.email,
      });
    }

    res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    console.log(error);
  }
});

export default router;
