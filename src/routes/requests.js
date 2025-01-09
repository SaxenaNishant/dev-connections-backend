const express = require("express");

const { userAuth } = require("../utils/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/userSchema");

const router = express.Router();

router.post("/request/send/:status/:userId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user?._id;
    const { userId: toUserId, status } = req.params;

    if (!["ignored", "interested"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status type: " + status });
    }

    const existingToUser = await User.findById(toUserId);

    if (!existingToUser) {
      return res.status(400).json({ message: "User not found!" });
    }

    const exisitingConnection = await User.findOne({
      $or: [
        {
          toUserId,
          fromUserId,
        },
        {
          toUserId: fromUserId,
          fromUserId: toUserId,
        },
      ],
    });

    if (exisitingConnection) {
      return res
        .status(400)
        .json({ message: "Connection request already exists!" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.status(200).json({
      message:
        user.firstName + " is " + status + " in " + existingToUser.firstName,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/request/review/:status/:requestedId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { requestedId, status } = req.params;

      if (!["accepted", "rejected"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestedId,
        status: "interested",
        toUserId: loggedInUser?._id,
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json({ message: "Connection request " + status, data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
