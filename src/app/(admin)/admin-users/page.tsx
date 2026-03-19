import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { UserManagementTable } from "@/components/admin/user-management-table";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-deep-teal">Gebruikersbeheer</h1>
        <p className="text-gray-500 mt-1">Beheer alle gebruikers op het platform.</p>
      </div>

      <Card>
        <UserManagementTable users={users ?? []} />
      </Card>
    </div>
  );
}
