import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { industries } from "@/data/industries";
import OnboardingForm from "@/src/features/onboarding/onboarding-form";
import { getUserOnboardingStatus } from "@/src/services/career-service";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const { isOnboarded } = await getUserOnboardingStatus();
        if (isOnboarded) {
          navigate("/dashboard", { replace: true });
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
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
}
