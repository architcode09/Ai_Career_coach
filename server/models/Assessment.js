const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    correct: { type: String, default: "" },
    user: { type: String, default: "" },
    isCorrect: { type: Boolean, default: false },
    explanation: { type: String, default: "" },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    id: { type: String, default: "" },
    question: { type: String, required: true, trim: true },
    type: { type: String, default: "multiple-choice", trim: true },
    options: { type: [String], default: [] },
    answer: { type: answerSchema, default: () => ({}) },
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["skills", "personality", "career-fit", "interview-readiness"],
      required: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    questions: { type: [questionSchema], default: [] },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 100 },
    aiAnalysis: { type: String, default: "" },
    recommendations: { type: [String], default: [] },
    strengths: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
    completedAt: { type: Date, default: null },
    timeSpent: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    strict: true,
    versionKey: false,
  }
);

assessmentSchema.pre("save", function preSave(next) {
  if (this.status === "completed" && !this.completedAt) {
    this.completedAt = new Date();
  }

  if (this.status !== "completed") {
    this.completedAt = null;
  }

  this.score = Number(this.score || 0);
  this.maxScore = Number(this.maxScore || 100);
  this.timeSpent = Number(this.timeSpent || 0);

  return next();
});

assessmentSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model("Assessment", assessmentSchema);
