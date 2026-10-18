import Link from "next/link";
import { GraduationCap, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 mb-6">
        <GraduationCap className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
      <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button variant="gradient">
            <Home className="h-4 w-4" /> Go Home
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
