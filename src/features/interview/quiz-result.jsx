import { Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function QuizResult({ result, hideStartNew = false, onStartNew }) {
  if (!result) return null;

  return (
    <div className="mx-auto">
      <h1 className="gradient-title flex items-center gap-2 text-3xl">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Quiz Results
      </h1>

      <CardContent className="space-y-6">
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-bold">{result.quizScore.toFixed(1)}%</h3>
          <Progress value={result.quizScore} className="w-full" />
        </div>

        {result.improvementTip && (
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium">Improvement Tip:</p>
            <p className="text-muted-foreground">{result.improvementTip}</p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-medium">Question Review</h3>

          {result.questions.map((question, index) => (
            <div key={`${question.question}-${index}`} className="space-y-2 rounded-lg border p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{question.question}</p>

                {question.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Your answer: {question.userAnswer || "Not answered"}</p>
                {!question.isCorrect && <p>Correct answer: {question.answer}</p>}
              </div>

              <div className="rounded bg-muted p-2 text-sm">
                <p className="font-medium">Explanation:</p>
                <p>{question.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter>
          <Button onClick={onStartNew} className="w-full">
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
