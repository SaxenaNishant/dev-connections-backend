const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ messgae: "Unathorised, you're not logged in !!" });
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id } = decodedToken;

    const user = await User.findById(id);

    if (!user) {
      throw new Error("User is not found");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { userAuth };
