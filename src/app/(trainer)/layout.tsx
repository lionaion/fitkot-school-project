import { AppShell } from "@/components/ui/app-shell";

// DEMO MODE: No auth check — hardcoded "trainer" role
export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell role="trainer">{children}</AppShell>;
}
