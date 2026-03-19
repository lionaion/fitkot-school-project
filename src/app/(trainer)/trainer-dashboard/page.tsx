import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Users, ClipboardList, Activity } from "lucide-react";

export default async function TrainerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("name")
    .eq("id", user!.id)
    .single();

  const { count: clientCount } = await supabase
    .from("trainer_clients")
    .select("*", { count: "exact", head: true })
    .eq("trainer_id", user!.id);

  const { count: planCount } = await supabase
    .from("workout_plans")
    .select("*", { count: "exact", head: true })
    .eq("trainer_id", user!.id);

  // Recent client workout logs
  const { data: recentLogs } = await supabase
    .from("workout_logs")
    .select("id, user_id, date, duration, users(name)")
    .in(
      "user_id",
      (
        await supabase
          .from("trainer_clients")
          .select("client_id")
          .eq("trainer_id", user!.id)
      ).data?.map((tc) => tc.client_id) ?? []
    )
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-deep-teal">
          Hallo, {profile?.name || "Trainer"}
        </h1>
        <p className="text-gray-500 mt-1">Overzicht van je cliënten en plannen.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-electric-teal/10 rounded-xl">
            <Users className="w-6 h-6 text-electric-teal" />
          </div>
          <div>
            <p className="text-2xl font-bold">{clientCount ?? 0}</p>
            <p className="text-sm text-gray-500">Cliënten</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-warm-lime/20 rounded-xl">
            <ClipboardList className="w-6 h-6 text-warm-lime" />
          </div>
          <div>
            <p className="text-2xl font-bold">{planCount ?? 0}</p>
            <p className="text-sm text-gray-500">Trainingsplannen</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-coral/10 rounded-xl">
            <Activity className="w-6 h-6 text-coral" />
          </div>
          <div>
            <p className="text-2xl font-bold">{recentLogs?.length ?? 0}</p>
            <p className="text-sm text-gray-500">Recente activiteit</p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-heading font-semibold mb-4">Recente activiteit (live feed)</h2>
        {recentLogs && recentLogs.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {recentLogs.map((log) => {
              const clientName = (log.users as unknown as { name: string })?.name ?? "Onbekend";
              return (
                <li key={log.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{clientName}</p>
                    <p className="text-sm text-gray-500">{log.date}</p>
                  </div>
                  <span className="text-sm font-mono text-gray-400">{log.duration} min</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-400 text-center py-8">
            Nog geen activiteit van cliënten.
          </p>
        )}
      </Card>
    </div>
  );
}
