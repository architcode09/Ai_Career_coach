import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import DashboardView from "@/src/features/dashboard/dashboard-view";
import {
  getIndustryInsights,
  getUserOnboardingStatus,
} from "@/src/services/career-service";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const { isOnboarded } = await getUserOnboardingStatus();
        if (!isOnboarded) {
          navigate("/onboarding", { replace: true });
          return;
        }

        const result = await getIndustryInsights();
        setInsights(result);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [navigate]);

  return (
    <div className="container mx-auto px-5">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="gradient-title text-6xl font-bold">Industry Insights</h1>
      </div>

      {loading && <BarLoader className="mt-4" width="100%" color="gray" />}
      {!loading && error && <p className="text-red-500">{error}</p>}
      {!loading && insights && <DashboardView insights={insights} />}
    </div>
  );
}
