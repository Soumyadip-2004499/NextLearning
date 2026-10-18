import { redirect } from "next/navigation";
import { getAuthenticatedFacilitator } from "@/lib/facilitator-auth";
import { FacilitatorShell } from "@/components/layout/facilitator-shell";


interface FacilitatorLayoutProps {
  children: React.ReactNode;
}

export default async function FacilitatorLayout({
  children,
}: FacilitatorLayoutProps) {
  const auth = await getAuthenticatedFacilitator();

  // Redirect to /auth/login if not authenticated
  if (auth.error === "unauthenticated" || !auth.user) {
    redirect("/auth/login?role=facilitator&callbackUrl=/facilitator");
  }

  // Redirect to /dashboard if authenticated but not a facilitator
  if (auth.error === "unauthorized" || auth.user.role !== "FACILITATOR") {
    redirect("/dashboard");
  }

  return (
    <FacilitatorShell
      user={auth.user}
      facilitatorProfile={auth.facilitatorProfile}
    >
      {children}
    </FacilitatorShell>
  );
}
