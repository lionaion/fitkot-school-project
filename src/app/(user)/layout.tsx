import { AppShell } from "@/components/ui/app-shell";

// DEMO MODE: No auth check — hardcoded "user" role
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell role="user">{children}</AppShell>;
}
