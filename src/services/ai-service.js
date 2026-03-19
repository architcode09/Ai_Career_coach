import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const modelName = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: modelName }) : null;

const cleanJsonText = (text) => text.replace(/```(?:json)?\n?/g, "").trim();

const generateWithGemini = async (prompt) => {
  if (!model) {
    throw new Error("Gemini API key missing. Set VITE_GEMINI_API_KEY in frontend .env");
  }

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

export const generateIndustryInsightsWithAI = async (industry) => {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "HIGH" | "MEDIUM" | "LOW",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }

    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;

  const rawText = await generateWithGemini(prompt);
  const parsed = JSON.parse(cleanJsonText(rawText));

  return {
    ...parsed,
    industry,
    lastUpdated: new Date().toISOString(),
    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
};

export const improveResumeContentWithAI = async ({ current, type, industry }) => {
  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords

    Format the response as a single paragraph without any additional text or explanations.
  `;

  return generateWithGemini(prompt);
};

export const generateCoverLetterWithAI = async ({ data, userProfile }) => {
  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.

    About the candidate:
    - Industry: ${userProfile?.industry || "Not provided"}
    - Years of Experience: ${userProfile?.experience || 0}
    - Skills: ${userProfile?.skills?.join(", ") || "Not provided"}
    - Professional Background: ${userProfile?.bio || "Not provided"}

    Job Description:
    ${data.jobDescription}

    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements

    Format the letter in markdown.
  `;

  return generateWithGemini(prompt);
};

export const generateQuizWithAI = async ({ industry, skills }) => {
  const prompt = `
    Generate 10 technical interview questions for a ${industry} professional${
    skills?.length ? ` with expertise in ${skills.join(", ")}` : ""
  }.

    Each question should be multiple choice with 4 options.

    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  const rawText = await generateWithGemini(prompt);
  const parsed = JSON.parse(cleanJsonText(rawText));
  return parsed.questions;
};

export const generateImprovementTipWithAI = async ({ industry, wrongAnswers }) => {
  if (!wrongAnswers?.length) return null;

  const wrongQuestionsText = wrongAnswers
    .map(
      (question) =>
        `Question: "${question.question}"\nCorrect Answer: "${question.answer}"\nUser Answer: "${question.userAnswer}"`
    )
    .join("\n\n");

  const prompt = `
    The user got the following ${industry} technical interview questions wrong:

    ${wrongQuestionsText}

    Based on these mistakes, provide a concise, specific improvement tip.
    Focus on the knowledge gaps revealed by these wrong answers.
    Keep the response under 2 sentences and make it encouraging.
    Don't explicitly mention the mistakes, instead focus on what to learn/practice.
  `;

  return generateWithGemini(prompt);
};
