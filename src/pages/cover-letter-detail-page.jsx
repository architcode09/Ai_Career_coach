import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import CoverLetterPreview from "@/src/features/cover-letter/cover-letter-preview";
import { getCoverLetter, getUserOnboardingStatus } from "@/src/services/career-service";

export default function CoverLetterDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [coverLetter, setCoverLetter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const { isOnboarded } = await getUserOnboardingStatus();
        if (!isOnboarded) {
          navigate("/onboarding", { replace: true });
          return;
        }

        const letter = await getCoverLetter(id);
        if (!letter) {
          navigate("/ai-cover-letter", { replace: true });
          return;
        }

        setCoverLetter(letter);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id, navigate]);

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

        <h1 className="gradient-title mb-6 text-6xl font-bold">
          {coverLetter?.jobTitle} at {coverLetter?.companyName}
        </h1>
      </div>

      <CoverLetterPreview content={coverLetter?.content} />
    </div>
  );
}
