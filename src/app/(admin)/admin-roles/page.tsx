import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { TrainerAssignments } from "@/components/admin/trainer-assignments";

export default async function RolesPage() {
  const supabase = await createClient();

  const { data: trainers } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("role", "trainer");

  const { data: regularUsers } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("role", "user");

  const { data: assignments } = await supabase
    .from("trainer_clients")
    .select("id, trainer_id, client_id, users!trainer_clients_client_id_fkey(name)");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-deep-teal">Rolbeheer</h1>
        <p className="text-gray-500 mt-1">Wijs trainers toe aan cliënten.</p>
      </div>

      <Card>
        <TrainerAssignments
          trainers={trainers ?? []}
          users={regularUsers ?? []}
          assignments={assignments ?? []}
        />
      </Card>
    </div>
  );
}
