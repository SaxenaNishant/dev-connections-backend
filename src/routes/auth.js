const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");

const { validateSignUpData } = require("../utils/validations");
const User = require("../models/userSchema");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const user = req.body;

    validateSignUpData(user);

    console.log(user);

    const { password, firstName, lastName, email: emailId } = user;

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    const userSaved = await savedUser.save();
    const token = userSaved.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

    res
      .status(201)
      .json({ message: "User created successfully", user: userSaved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Enter valid email: " + email);
    }
    const user = await User.findOne({ emailId: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = await user.validatePassword(password);

    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }
    const token = user.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.status(200).json({ message: "User is successfully logged in", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/logout", async (req, res, next) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .status(200)
    .json({ message: "User is logout successfully" });
});

module.exports = router;
