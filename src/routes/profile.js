const express = require("express");
const bcrypt = require("bcrypt");

const { userAuth } = require("../utils/auth");
const { validateEditProfileData } = require("../utils/validations");

const router = express.Router();

router.get("/profile", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    res
      .status(200)
      .json({ message: "User profile is successfully fetched", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/profile/edit", userAuth, async (req, res, next) => {
  try {
    const errors = validateEditProfileData(req);
    if (errors.length) {
      throw new Error("Following are the invalid data: " + errors);
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((k) => (loggedInUser[k] = req.body[k]));

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      loggedInUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/profile/password", userAuth, async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!validator.isStrongPassword(password)) {
      throw new Error("Please enter strong password");
    }

    const loggedInUser = req.user;

    const hashedPassword = await bcrypt.hash(password, 10);

    loggedInUser.password = hashedPassword;

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName}, your profile password has been updated successfully`,
      loggedInUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
