const User = require("../models/User");
const CareerProfile = require("../models/CareerProfile");
const Goal = require("../models/Goal");
const Assessment = require("../models/Assessment");

const sanitizeUser = (userDoc) => ({
  id: userDoc._id.toString(),
  name: userDoc.name,
  email: userDoc.email,
  role: userDoc.role,
  profile: userDoc.profile,
  lastLogin: userDoc.lastLogin,
  isActive: userDoc.isActive,
  avatar: userDoc.avatar,
  createdAt: userDoc.createdAt,
  updatedAt: userDoc.updatedAt,
});

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allowedRoot = ["name", "avatar"];
    const allowedProfile = [
      "currentRole",
      "industry",
      "experience",
      "location",
      "bio",
      "skills",
      "linkedIn",
      "github",
      "portfolio",
    ];

    allowedRoot.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    allowedProfile.forEach((field) => {
      if (req.body[field] !== undefined) {
        user.profile[field] = req.body[field];
      }
    });

    if (req.body.skills !== undefined) {
      user.profile.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : String(req.body.skills)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Promise.all([
      User.findByIdAndDelete(userId),
      CareerProfile.findOneAndDelete({ user: userId }),
      Goal.deleteMany({ user: userId }),
      Assessment.deleteMany({ user: userId }),
    ]);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
};
