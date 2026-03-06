// app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role === "USER") {
    redirect("/dashboard/user");
  }

  if (session.user.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  redirect("/");
}
