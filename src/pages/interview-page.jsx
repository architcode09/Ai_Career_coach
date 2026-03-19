import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import StatsCards from "@/src/features/interview/stats-cards";
import PerformanceChart from "@/src/features/interview/performance-chart";
import QuizList from "@/src/features/interview/quiz-list";
import { getAssessments, getUserOnboardingStatus } from "@/src/services/career-service";
import { useNavigate } from "react-router-dom";

export default function InterviewPage() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const { isOnboarded } = await getUserOnboardingStatus();
        if (!isOnboarded) {
          navigate("/onboarding", { replace: true });
          return;
        }

        const result = await getAssessments();
        setAssessments(result);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [navigate]);

  if (loading) {
    return <BarLoader className="mt-4" width="100%" color="gray" />;
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="gradient-title text-6xl font-bold">Interview Preparation</h1>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}
