// /app/auth/error/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CircleAlert className="h-12 w-12 text-destructive mx-auto" />
          <CardTitle className="text-3xl font-bold">
            Autherntication Error
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Something went wrong during authentication. This might be due to
            incorrect credentials, network issues, or a temporary configuration
            problem.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Back to Home
            </Link>
            <Link href="/" className={buttonVariants()}>
              Try to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
