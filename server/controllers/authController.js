const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const CareerProfile = require("../models/CareerProfile");
const {
  generateAccessToken,
  generateRefreshToken,
  setRefreshCookie,
} = require("../utils/generateToken");

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

const sendValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
    return true;
  }
  return false;
};

const register = async (req, res, next) => {
  try {
    if (sendValidationErrors(req, res)) return;

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    await CareerProfile.create({ user: user._id });

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      message: "Registration successful",
      accessToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    if (sendValidationErrors(req, res)) return;

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password +refreshToken"
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.lastLogin = new Date();

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const careerProfile = await CareerProfile.findOne({ user: user._id });
    if (!careerProfile) {
      await CareerProfile.create({ user: user._id });
    }

    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies.refreshToken;

    if (!tokenFromCookie) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const decoded = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId).select("+refreshToken");
    if (!user || !user.refreshToken || user.refreshToken !== tokenFromCookie) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);

    return res.status(200).json({
      message: "Token refreshed",
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

const logout = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies.refreshToken;

    if (tokenFromCookie) {
      try {
        const decoded = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId).select("+refreshToken");
        if (user) {
          user.refreshToken = "";
          await user.save({ validateBeforeSave: false });
        }
      } catch (error) {
        // If token is invalid, continue clearing cookie anyway.
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
};
