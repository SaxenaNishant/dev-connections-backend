const express = require("express");
const { userAuth } = require("../utils/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/userSchema");

const router = express.Router();

const USER_SAFE_DATA =
  "firstName lastName skills about emailId photoUrl age gender";

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userConnections = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser?._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser?._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = userConnections.map((k) => {
      if (k.fromUserId?._id.toString() === loggedInUser?._id.toString()) {
        return k.toUserId;
      }
      return k.fromUserId;
    });
    if (!userConnections.length) {
      return res.status(404).json({ message: "Pending requests not found" });
    }
    res.status(200).json({
      message:
        "All the connections of user " +
        loggedInUser?.firstName +
        " fetched successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const receivedConnectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser?._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    if (!receivedConnectionRequests.length) {
      return res.status(404).json({ message: "Pending requests not found" });
    }

    res.status(200).json({
      message:
        "All the pending requests of user " +
        loggedInUser?.firstName +
        " fetched successfully",
      data: receivedConnectionRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    let limit = parseInt(req.query?.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const data = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser?._id,
        },
        {
          fromUserId: loggedInUser?._id,
        },
      ],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    data.forEach((d) => {
      hideUsersFromFeed.add(d.toUserId.toString());
      hideUsersFromFeed.add(d.fromUserId.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUsersFromFeed) },
        },
        {
          _id: { $ne: loggedInUser?._id },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res
      .status(200)
      .json({ message: "Users feed successfully fetched", data: users });
    /*
        loggedInUser = req.user
        Two Colloections => 1. User   2. ConnectionRequest

        1. LoggedInUser should not be shown in the feed
        2. Users which are either interested, ignored, accepted should not be shown in the feed

  1.     Find unique ids in connectionRequests collection where the
         loggedInUserIds are  present in either fromUserId or toUserIds.

  2.     Then check those unique ids are not present in User collections.

  3.     And also check that users id should not be equal to loggedInUser itself.
    */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
