import { Card } from "@/components/ui/card";
import { UserManagementTable } from "@/components/admin/user-management-table";

// DEMO MODE: Mock data
const mockUsers = [
  { id: "u1", email: "stan@student.be", name: "Stan De Vries", role: "user" as const, status: "active" as const, created_at: "2026-01-15T10:00:00Z" },
  { id: "u2", email: "emma@student.be", name: "Emma Peeters", role: "user" as const, status: "active" as const, created_at: "2026-01-20T14:00:00Z" },
  { id: "u3", email: "sofia@trainer.be", name: "Sofia Martens", role: "trainer" as const, status: "active" as const, created_at: "2026-01-10T09:00:00Z" },
  { id: "u4", email: "liam@student.be", name: "Liam Janssens", role: "user" as const, status: "active" as const, created_at: "2026-02-01T16:00:00Z" },
  { id: "u5", email: "julie@student.be", name: "Julie Maes", role: "user" as const, status: "suspended" as const, created_at: "2026-02-10T11:00:00Z" },
  { id: "u6", email: "noah@student.be", name: "Noah Willems", role: "user" as const, status: "active" as const, created_at: "2026-02-15T13:00:00Z" },
  { id: "u7", email: "jan@trainer.be", name: "Jan Claes", role: "trainer" as const, status: "active" as const, created_at: "2026-01-12T08:00:00Z" },
  { id: "u8", email: "admin@fitkot.be", name: "Admin FitKot", role: "admin" as const, status: "active" as const, created_at: "2026-01-01T00:00:00Z" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-deep-teal">Gebruikersbeheer</h1>
        <p className="text-gray-500 mt-1">Beheer alle gebruikers op het platform.</p>
      </div>

      <Card>
        <UserManagementTable users={mockUsers} />
      </Card>
    </div>
  );
}
