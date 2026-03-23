"use client";

import { useRouter } from "next/navigation";
import { Nav } from "@/components/ui/nav";
import type { UserRole } from "@/types/database";

interface AppShellProps {
  role: UserRole;
  children: React.ReactNode;
}

export function AppShell({ role, children }: AppShellProps) {
  const router = useRouter();

  function handleSignOut() {
    // DEMO MODE: Just redirect to home
    router.push("/");
  }

  return (
    <div className="flex h-screen bg-off-white">
      <Nav role={role} onSignOut={handleSignOut} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
