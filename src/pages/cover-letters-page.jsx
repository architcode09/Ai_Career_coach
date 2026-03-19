import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import CoverLetterList from "@/src/features/cover-letter/cover-letter-list";
import {
  deleteCoverLetter,
  getCoverLetters,
  getUserOnboardingStatus,
} from "@/src/services/career-service";

export default function CoverLettersPage() {
  const navigate = useNavigate();
  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const { isOnboarded } = await getUserOnboardingStatus();
        if (!isOnboarded) {
          navigate("/onboarding", { replace: true });
          return;
        }

        const letters = await getCoverLetters();
        setCoverLetters(letters);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [navigate]);

  const handleDelete = async (id) => {
    const updatedLetters = await deleteCoverLetter(id);
    setCoverLetters(updatedLetters);
  };

  if (loading) {
    return <BarLoader className="mt-4" width="100%" color="gray" />;
  }

  return (
    <div>
      <div className="mb-5 flex flex-col items-center justify-between gap-2 md:flex-row">
        <h1 className="gradient-title text-6xl font-bold">My Cover Letters</h1>
        <Link to="/ai-cover-letter/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} onDelete={handleDelete} />
    </div>
  );
}
