const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userProfileSchema = new mongoose.Schema(
  {
    currentRole: { type: String, default: "" },
    industry: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    linkedIn: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
      default: "",
      select: false,
    },
    profile: {
      type: userProfileSchema,
      default: () => ({}),
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    strict: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
