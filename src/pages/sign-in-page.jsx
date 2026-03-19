import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/src/context/auth-context";
import { getUserOnboardingStatus } from "@/src/services/career-service";

export default function SignInPage() {
  const { user, signIn, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signIn({ email, password });
      const { isOnboarded } = await getUserOnboardingStatus();
      navigate(isOnboarded ? "/dashboard" : "/onboarding", { replace: true });
      toast.success("Welcome back");
    } catch (error) {
      toast.error(error.message || "Sign in failed");
    }
  };

  return (
    <div className="flex justify-center pt-24">
      <Card className="mx-2 w-full max-w-md">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">Sign In</CardTitle>
          <CardDescription>Access your AI career workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              No account yet?{" "}
              <Link to="/sign-up" className="text-primary underline underline-offset-2">
                Create one
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
