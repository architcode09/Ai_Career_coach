import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import CoverLetterGenerator from "@/src/features/cover-letter/cover-letter-generator";
import { getUserOnboardingStatus } from "@/src/services/career-service";

export default function NewCoverLetterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const { isOnboarded } = await getUserOnboardingStatus();
        if (!isOnboarded) {
          navigate("/onboarding", { replace: true });
          return;
        }
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
      <div className="flex flex-col space-y-2">
        <Link to="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>

        <div className="pb-6">
          <h1 className="gradient-title text-6xl font-bold">Create Cover Letter</h1>
          <p className="text-muted-foreground">
            Generate a tailored cover letter for your job application
          </p>
        </div>
      </div>

      <CoverLetterGenerator />
    </div>
  );
}
