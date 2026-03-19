import api, { clearAccessToken } from "@/src/services/api";
import {
  register,
  login,
  logout,
  initializeAuthSession,
} from "@/src/services/auth-service";
import {
  createAssessment,
  getAssessmentsApi,
} from "@/src/services/assessment-service";
import {
  generateCoverLetterWithAI,
  generateImprovementTipWithAI,
  generateIndustryInsightsWithAI,
  generateQuizWithAI,
  improveResumeContentWithAI,
} from "@/src/services/ai-service";

export const STORE_EVENT = "career-coach-auth-updated";

const emitAuthEvent = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(STORE_EVENT));
  }
};

const safeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const fallbackIndustryInsights = (industry) => {
  const now = new Date();
  return {
    industry,
    salaryRanges: [
      { role: "Software Engineer", min: 85000, max: 135000, median: 110000, location: "United States" },
      { role: "Data Analyst", min: 70000, max: 115000, median: 92000, location: "United States" },
      { role: "Product Manager", min: 95000, max: 155000, median: 125000, location: "United States" },
      { role: "DevOps Engineer", min: 90000, max: 145000, median: 118000, location: "United States" },
      { role: "QA Engineer", min: 65000, max: 105000, median: 84000, location: "United States" },
    ],
    growthRate: 8.5,
    demandLevel: "MEDIUM",
    topSkills: ["Problem Solving", "Communication", "System Design", "Cloud", "Automation"],
    marketOutlook: "NEUTRAL",
    keyTrends: ["AI adoption", "Automation", "Remote collaboration", "Data-driven decisions", "Security focus"],
    recommendedSkills: ["AI literacy", "System design", "Cloud fundamentals", "Stakeholder communication", "Testing"],
    lastUpdated: now.toISOString(),
    nextUpdate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
};

const fallbackQuiz = (industry, skills = []) => {
  const focus = skills[0] || "problem solving";
  return [
    {
      question: `In ${industry}, what is the best first step before implementing a solution?`,
      options: ["Define measurable goals", "Start coding immediately", "Skip requirement analysis", "Wait for blockers"],
      correctAnswer: "Define measurable goals",
      explanation: "Clear goals align technical decisions with measurable outcomes.",
    },
    {
      question: `Which practice most improves ${focus} outcomes over time?`,
      options: ["Iterative feedback", "One-time review", "No documentation", "Avoid testing"],
      correctAnswer: "Iterative feedback",
      explanation: "Frequent feedback loops improve quality and reduce rework.",
    },
    {
      question: "What should be prioritized when trade-offs are unclear?",
      options: ["Business impact and risk", "Most popular tool", "Fastest shortcut", "Personal preference"],
      correctAnswer: "Business impact and risk",
      explanation: "Prioritizing impact and risk yields stronger long-term decisions.",
    },
    {
      question: "How do high-performing teams communicate status best?",
      options: ["Outcomes, risks, next steps", "Raw tasks only", "No updates", "Only final results"],
      correctAnswer: "Outcomes, risks, next steps",
      explanation: "Context-rich updates improve alignment and unblock faster decisions.",
    },
    {
      question: "What is a reliable signal of delivery quality?",
      options: ["Low defect rate", "Frequent hotfixes", "No test coverage", "Untracked incidents"],
      correctAnswer: "Low defect rate",
      explanation: "Lower defect rates indicate healthier engineering and release practices.",
    },
    {
      question: "How should professionals keep skills current?",
      options: ["Continuous practice", "Avoid learning", "Rely on memory", "Ignore trends"],
      correctAnswer: "Continuous practice",
      explanation: "Consistent upskilling helps maintain relevance in changing markets.",
    },
    {
      question: "What improves handoffs across teams?",
      options: ["Clear documentation", "Verbal-only notes", "Single point of failure", "No ownership"],
      correctAnswer: "Clear documentation",
      explanation: "Documentation enables reliable transitions and operational continuity.",
    },
    {
      question: "Which interview approach performs best?",
      options: ["Explain trade-offs", "Memorize blindly", "Rush answers", "Avoid assumptions"],
      correctAnswer: "Explain trade-offs",
      explanation: "Interviewers evaluate reasoning depth, not just final answers.",
    },
    {
      question: "What should be done after a completed project?",
      options: ["Retrospective", "Immediate archive", "Skip lessons", "Assign blame"],
      correctAnswer: "Retrospective",
      explanation: "Retrospectives capture wins and gaps to improve the next cycle.",
    },
    {
      question: "What is the best way to prioritize competing tasks?",
      options: ["Impact, urgency, effort", "Random order", "Only easy tasks", "Newest task first"],
      correctAnswer: "Impact, urgency, effort",
      explanation: "Structured prioritization balances business value and delivery capacity.",
    },
  ];
};

const mapAssessmentToLegacy = (assessment) => {
  const mappedQuestions = (assessment.questions || []).map((item) => {
    const answerData =
      item.answer && typeof item.answer === "object" && !Array.isArray(item.answer)
        ? item.answer
        : {};

    return {
      question: item.question,
      answer: answerData.correct || "",
      userAnswer: answerData.user || "",
      isCorrect: Boolean(answerData.isCorrect),
      explanation: answerData.explanation || "",
      options: item.options || [],
    };
  });

  return {
    id: assessment._id || assessment.id,
    category: "Technical",
    quizScore: Number(assessment.score || 0),
    questions: mappedQuestions,
    improvementTip:
      assessment.aiAnalysis ||
      (assessment.recommendations && assessment.recommendations[0]) ||
      null,
    createdAt: assessment.createdAt,
    updatedAt: assessment.updatedAt,
  };
};

const getUserProfile = async () => {
  const response = await api.get("/user/profile");
  return response.data?.user || null;
};

const getCareerProfile = async () => {
  const response = await api.get("/career/profile");
  return response.data?.profile || null;
};

export async function getCurrentUser() {
  try {
    return await initializeAuthSession();
  } catch (error) {
    return null;
  }
}

export async function signUpUser({ name, email, password }) {
  const result = await register({ name, email, password });
  emitAuthEvent();
  return result.user;
}

export async function signInUser({ email, password }) {
  const result = await login({ email, password });
  emitAuthEvent();
  return result.user;
}

export async function signOutUser() {
  await logout();
  emitAuthEvent();
}

export async function getUserOnboardingStatus() {
  const user = await getUserProfile();
  return {
    isOnboarded: Boolean(user?.profile?.industry),
  };
}

export async function updateUser(data) {
  const skills = safeArray(data.skills);

  const userResponse = await api.put("/user/profile", {
    industry: data.industry,
    experience: Number(data.experience) || 0,
    bio: data.bio || "",
    skills,
  });

  await api.put("/career/profile", {
    targetIndustry: data.industry,
    technicalSkills: skills,
  });

  let industryInsight = null;
  try {
    industryInsight = await getIndustryInsights();
  } catch (error) {
    industryInsight = null;
  }

  return {
    success: true,
    updatedUser: userResponse.data?.user,
    industryInsight,
  };
}

export async function getIndustryInsights() {
  const user = await getUserProfile();
  const industry = user?.profile?.industry;

  if (!industry) {
    throw new Error("Please complete onboarding first");
  }

  const cachedResponse = await api.get("/career/insights");
  const cachedInsights = cachedResponse.data?.insights;

  if (cachedInsights?.nextUpdate) {
    const isExpired = new Date(cachedInsights.nextUpdate).getTime() <= Date.now();
    if (!isExpired) {
      return cachedInsights;
    }
  } else if (cachedInsights) {
    return cachedInsights;
  }

  let insights;
  try {
    insights = await generateIndustryInsightsWithAI(industry);
  } catch (error) {
    insights = fallbackIndustryInsights(industry);
  }

  await api.put("/career/insights", { insights });
  return insights;
}

export async function getResume() {
  const response = await api.get("/career/resume");
  const content = response.data?.content || "";

  return {
    content,
    updatedAt: response.data?.updatedAt,
  };
}

export async function saveResume(content) {
  const response = await api.put("/career/resume", { content });
  return {
    content: response.data?.content || "",
    updatedAt: response.data?.updatedAt,
  };
}

export async function improveWithAI({ current, type }) {
  const user = await getUserProfile();
  const industry = user?.profile?.industry || "technology";

  try {
    return await improveResumeContentWithAI({ current, type, industry });
  } catch (error) {
    return `${current} Delivered measurable outcomes and improved key metrics by 25%.`;
  }
}

export async function generateCoverLetter(data) {
  const user = await getUserProfile();

  let content;
  try {
    content = await generateCoverLetterWithAI({
      data,
      userProfile: user?.profile,
    });
  } catch (error) {
    content = `# Cover Letter\n\nDear Hiring Team at ${data.companyName},\n\nI am excited to apply for the ${data.jobTitle} role. My background and skills align strongly with your requirements.\n\n${data.jobDescription}\n\nSincerely,\n\n${user?.name || "Candidate"}`;
  }

  const response = await api.post("/career/cover-letters", {
    companyName: data.companyName,
    jobTitle: data.jobTitle,
    jobDescription: data.jobDescription,
    content,
    status: "completed",
  });

  return response.data?.letter;
}

export async function getCoverLetters() {
  const response = await api.get("/career/cover-letters");
  return response.data?.letters || [];
}

export async function getCoverLetter(id) {
  const response = await api.get(`/career/cover-letters/${id}`);
  return response.data?.letter || null;
}

export async function deleteCoverLetter(id) {
  await api.delete(`/career/cover-letters/${id}`);
  return getCoverLetters();
}

export async function generateQuiz() {
  const user = await getUserProfile();
  const industry = user?.profile?.industry || "technology";
  const skills = safeArray(user?.profile?.skills);

  try {
    return await generateQuizWithAI({ industry, skills });
  } catch (error) {
    return fallbackQuiz(industry, skills);
  }
}

export async function saveQuizResult(questions, answers, score) {
  const user = await getUserProfile();
  const industry = user?.profile?.industry || "technology";

  const questionResults = questions.map((question, index) => ({
    question: question.question,
    answer: question.correctAnswer,
    userAnswer: answers[index],
    isCorrect: question.correctAnswer === answers[index],
    explanation: question.explanation,
    options: question.options || [],
  }));

  const wrongAnswers = questionResults.filter((item) => !item.isCorrect);

  let improvementTip = null;
  if (wrongAnswers.length) {
    try {
      improvementTip = await generateImprovementTipWithAI({
        industry,
        wrongAnswers,
      });
    } catch (error) {
      improvementTip = "Focus on fundamentals and practice explaining your reasoning step-by-step.";
    }
  }

  const payload = {
    type: "interview-readiness",
    title: "Technical Interview Quiz",
    status: "completed",
    questions: questionResults.map((item, index) => ({
      id: String(index + 1),
      question: item.question,
      type: "multiple-choice",
      options: item.options,
      answer: {
        correct: item.answer,
        user: item.userAnswer,
        isCorrect: item.isCorrect,
        explanation: item.explanation,
      },
    })),
    score,
    maxScore: 100,
    aiAnalysis: improvementTip || "",
    recommendations: improvementTip ? [improvementTip] : [],
    strengths: questionResults
      .filter((item) => item.isCorrect)
      .map((item) => item.question)
      .slice(0, 5),
    improvements: wrongAnswers.map((item) => item.question).slice(0, 5),
  };

  const createdAssessment = await createAssessment(payload);

  return {
    ...mapAssessmentToLegacy(createdAssessment),
    questions: questionResults,
    improvementTip,
  };
}

export async function getAssessments() {
  const assessments = await getAssessmentsApi();
  return assessments.map(mapAssessmentToLegacy);
}

export async function clearAllAppData() {
  try {
    await logout();
  } finally {
    clearAccessToken();
    emitAuthEvent();
  }
}
