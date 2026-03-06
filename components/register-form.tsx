//components\register-form.tsx
"use client";
import { useActionState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";
import type { RegisterFormState } from "@/lib/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data: session } = useSession();
  const router = useRouter();
  const initialState: RegisterFormState = {
    errors: {},
    success: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState,
  );

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
    console.log(session);
  }, [session, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Register with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            {state.errors?._form && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                {state.errors._form.join(", ")}
              </div>
            )}
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => signIn("google", { redirectTo: "/dashboard" })}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Register with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="name"
                  placeholder="Bagha"
                  defaultValue={state.values?.name}
                  disabled={isPending}
                  aria-invalid={!!state.errors?.name}
                />

                {state.errors?.name && (
                  <p className="text-sm text-destructive mt-1">
                    {state.errors.name[0]}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  defaultValue={state.values?.email}
                  required
                  disabled={isPending}
                  aria-invalid={!!state.errors?.email}
                />

                {state.errors?.email && (
                  <p className="text-sm text-destructive mt-1">
                    {state.errors.email[0]}
                  </p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isPending}
                  aria-invalid={!!state.errors?.password}
                />

                {state.errors?.password && (
                  <p className="text-sm text-destructive mt-1">
                    {state.errors.password[0]}
                  </p>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Registering..." : "Register"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
