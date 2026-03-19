import { BarLoader } from "react-spinners";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "@/src/components/header";
import { useAuth } from "@/src/context/auth-context";
import HomePage from "@/src/pages/home-page";
import DashboardPage from "@/src/pages/dashboard-page";
import OnboardingPage from "@/src/pages/onboarding-page";
import ResumePage from "@/src/pages/resume-page";
import CoverLettersPage from "@/src/pages/cover-letters-page";
import NewCoverLetterPage from "@/src/pages/new-cover-letter-page";
import CoverLetterDetailPage from "@/src/pages/cover-letter-detail-page";
import InterviewPage from "@/src/pages/interview-page";
import MockInterviewPage from "@/src/pages/mock-interview-page";
import SignInPage from "@/src/pages/sign-in-page";
import SignUpPage from "@/src/pages/sign-up-page";
import NotFoundPage from "@/src/pages/not-found-page";

function RequireAuth({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <BarLoader className="mt-4" width="100%" color="gray" />;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

export default function App() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/onboarding"
            element={
              <RequireAuth>
                <OnboardingPage />
              </RequireAuth>
            }
          />
          <Route
            path="/resume"
            element={
              <RequireAuth>
                <ResumePage />
              </RequireAuth>
            }
          />
          <Route
            path="/ai-cover-letter"
            element={
              <RequireAuth>
                <div className="container mx-auto mb-20 mt-8 px-5">
                  <CoverLettersPage />
                </div>
              </RequireAuth>
            }
          />
          <Route
            path="/ai-cover-letter/new"
            element={
              <RequireAuth>
                <NewCoverLetterPage />
              </RequireAuth>
            }
          />
          <Route
            path="/ai-cover-letter/:id"
            element={
              <RequireAuth>
                <CoverLetterDetailPage />
              </RequireAuth>
            }
          />
          <Route
            path="/interview"
            element={
              <RequireAuth>
                <div className="container mx-auto mb-20 mt-8 px-5">
                  <InterviewPage />
                </div>
              </RequireAuth>
            }
          />
          <Route
            path="/interview/mock"
            element={
              <RequireAuth>
                <MockInterviewPage />
              </RequireAuth>
            }
          />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-200">
          <p>Made with care by Archit Surmal</p>
        </div>
      </footer>
    </>
  );
}
