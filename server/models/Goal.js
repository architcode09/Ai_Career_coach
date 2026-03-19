const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { _id: true }
);

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["skill", "job-search", "networking", "education", "project", "other"],
      default: "other",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed", "on-hold"],
      default: "not-started",
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    targetDate: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    milestones: { type: [milestoneSchema], default: [] },
    aiSuggested: { type: Boolean, default: false },
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
    strict: true,
    versionKey: false,
  }
);

goalSchema.pre("save", function preSave(next) {
  if (this.status === "completed" && !this.completedAt) {
    this.completedAt = new Date();
    this.progress = 100;
  }

  if (this.status !== "completed") {
    this.completedAt = null;
  }

  this.milestones = (this.milestones || []).map((milestone) => {
    if (milestone.completed && !milestone.completedAt) {
      return {
        ...milestone.toObject(),
        completedAt: new Date(),
      };
    }

    if (!milestone.completed) {
      return {
        ...milestone.toObject(),
        completedAt: null,
      };
    }

    return milestone;
  });

  return next();
});

goalSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model("Goal", goalSchema);
