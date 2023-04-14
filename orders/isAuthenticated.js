import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: err });
    } else {
      req.user = user;
      next();
    }
  });
};

export default isAuthenticated;
