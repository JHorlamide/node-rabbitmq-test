import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error });
  }

  // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  //   if (err) {
  //     return res.status(401).json({ message: err });
  //   } else {
  //     req.user = user;
  //     next();
  //   }
  // });
};

export default isAuthenticated;
