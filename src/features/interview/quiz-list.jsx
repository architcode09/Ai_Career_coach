import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "@/src/features/interview/quiz-result";
import { formatDate } from "@/src/lib/date-utils";

export default function QuizList({ assessments }) {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-title text-3xl md:text-4xl">Recent Quizzes</CardTitle>
              <CardDescription>Review your past quiz performance</CardDescription>
            </div>
            <Button onClick={() => navigate("/interview/mock")}>Start New Quiz</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments?.map((assessment, index) => (
              <Card
                key={assessment.id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => setSelectedQuiz(assessment)}
              >
                <CardHeader>
                  <CardTitle className="gradient-title text-2xl">Quiz {index + 1}</CardTitle>
                  <CardDescription className="flex w-full justify-between">
                    <div>Score: {assessment.quizScore.toFixed(1)}%</div>
                    <div>{formatDate(assessment.createdAt, "MMMM dd, yyyy HH:mm")}</div>
                  </CardDescription>
                </CardHeader>
                {assessment.improvementTip && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{assessment.improvementTip}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedQuiz)} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <QuizResult
            result={selectedQuiz}
            hideStartNew
            onStartNew={() => navigate("/interview/mock")}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
