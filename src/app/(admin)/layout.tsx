import { AppShell } from "@/components/ui/app-shell";

// DEMO MODE: No auth check — hardcoded "admin" role
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell role="admin">{children}</AppShell>;
}
