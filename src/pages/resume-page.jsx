import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { getResume, getUserOnboardingStatus } from "@/src/services/career-service";
import ResumeBuilder from "@/src/features/resume/resume-builder";
import { useNavigate } from "react-router-dom";

export default function ResumePage() {
  const navigate = useNavigate();
  const [initialContent, setInitialContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const { isOnboarded } = await getUserOnboardingStatus();
        if (!isOnboarded) {
          navigate("/onboarding", { replace: true });
          return;
        }

        const resume = await getResume();
        setInitialContent(resume?.content || "");
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
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={initialContent} />
    </div>
  );
}
