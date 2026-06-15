const Message = require("../models/Message");
const User = require("../models/User");

exports.getChatHistory = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Use MongoDB Aggregation for maximum efficiency
    const orderedUsers = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: currentUserId }, { receiver: currentUserId }],
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort all messages by newest first
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", currentUserId] },
              "$receiver",
              "$sender",
            ],
          },
          lastMessageDate: { $first: "$createdAt" },
        },
      },
      {
        $sort: { lastMessageDate: -1 }, // Sort the grouped users by the date of their newest message
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: "$userDetails._id",
          username: "$userDetails.username",
          profileImage: "$userDetails.profileImage",
        },
      },
    ]);

    res.json(orderedUsers);
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
    res.status(500).json({ msg: "Failed to fetch chat history" });
  }
};


