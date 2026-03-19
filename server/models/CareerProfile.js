const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    issuer: { type: String, trim: true, default: "" },
    date: { type: Date, default: null },
    url: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, trim: true, default: "" },
    institution: { type: String, trim: true, default: "" },
    field: { type: String, trim: true, default: "" },
    startYear: { type: Number, default: null },
    endYear: { type: Number, default: null },
    gpa: { type: Number, default: null },
  },
  { timestamps: false }
);

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
    achievements: { type: [String], default: [] },
  },
  { timestamps: false }
);

const salaryExpectationSchema = new mongoose.Schema(
  {
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    currency: { type: String, default: "USD" },
  },
  { _id: false }
);

const salaryRangeSchema = new mongoose.Schema(
  {
    role: { type: String, trim: true, default: "" },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    median: { type: Number, default: 0 },
    location: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const industryInsightsSchema = new mongoose.Schema(
  {
    industry: { type: String, trim: true, default: "" },
    salaryRanges: { type: [salaryRangeSchema], default: [] },
    growthRate: { type: Number, default: 0 },
    demandLevel: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW", ""],
      default: "",
    },
    topSkills: { type: [String], default: [] },
    marketOutlook: {
      type: String,
      enum: ["POSITIVE", "NEUTRAL", "NEGATIVE", ""],
      default: "",
    },
    keyTrends: { type: [String], default: [] },
    recommendedSkills: { type: [String], default: [] },
    lastUpdated: { type: Date, default: null },
    nextUpdate: { type: Date, default: null },
  },
  { _id: false }
);

const coverLetterSchema = new mongoose.Schema(
  {
    companyName: { type: String, trim: true, required: true },
    jobTitle: { type: String, trim: true, required: true },
    jobDescription: { type: String, default: "" },
    content: { type: String, required: true },
    status: { type: String, default: "completed" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const careerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    targetRole: { type: String, trim: true, default: "" },
    targetIndustry: { type: String, trim: true, default: "" },
    careerStage: {
      type: String,
      enum: ["student", "entry", "mid", "senior", "executive"],
      default: "entry",
    },
    salaryExpectation: { type: salaryExpectationSchema, default: () => ({}) },
    workPreference: {
      type: String,
      enum: ["remote", "hybrid", "onsite"],
      default: "hybrid",
    },
    technicalSkills: { type: [String], default: [] },
    softSkills: { type: [String], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    aiSummary: { type: String, default: "" },
    completionScore: { type: Number, default: 0, min: 0, max: 100 },

    // Extra fields used by current frontend flows.
    resumeContent: { type: String, default: "" },
    coverLetters: { type: [coverLetterSchema], default: [] },
    industryInsights: { type: industryInsightsSchema, default: null },
    insightsUpdatedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    strict: true,
    versionKey: false,
  }
);

careerProfileSchema.pre("save", function preSave(next) {
  const checks = [
    Boolean(this.targetRole),
    Boolean(this.targetIndustry),
    Boolean(this.careerStage),
    Boolean(this.workPreference),
    Boolean(this.salaryExpectation?.min || this.salaryExpectation?.max),
    (this.technicalSkills || []).length > 0,
    (this.softSkills || []).length > 0,
    (this.certifications || []).length > 0,
    (this.education || []).length > 0,
    (this.experience || []).length > 0,
    Boolean(this.aiSummary),
  ];

  const completed = checks.filter(Boolean).length;
  this.completionScore = Math.round((completed / checks.length) * 100);

  return next();
});

careerProfileSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model("CareerProfile", careerProfileSchema);
