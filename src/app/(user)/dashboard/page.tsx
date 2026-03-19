import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Dumbbell, Flame, Camera, UtensilsCrossed } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("name")
    .eq("id", user!.id)
    .single();

  // Recent workout logs (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: weeklyWorkouts } = await supabase
    .from("workout_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .gte("date", sevenDaysAgo.toISOString().split("T")[0]);

  const { count: totalPhotos } = await supabase
    .from("progress_photos")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { data: recentLogs } = await supabase
    .from("workout_logs")
    .select("id, date, duration, exercises")
    .eq("user_id", user!.id)
    .order("date", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-deep-teal">
          Hallo, {profile?.name || "Sporter"}
        </h1>
        <p className="text-gray-500 mt-1">Hier is je overzicht voor deze week.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-electric-teal/10 rounded-xl">
            <Dumbbell className="w-6 h-6 text-electric-teal" />
          </div>
          <div>
            <p className="text-2xl font-bold">{weeklyWorkouts ?? 0}</p>
            <p className="text-sm text-gray-500">Workouts deze week</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-warm-lime/20 rounded-xl">
            <Flame className="w-6 h-6 text-warm-lime" />
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-gray-500">Dagen streak</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-coral/10 rounded-xl">
            <Camera className="w-6 h-6 text-coral" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalPhotos ?? 0}</p>
            <p className="text-sm text-gray-500">Voortgangsfoto&apos;s</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-deep-teal/10 rounded-xl">
            <UtensilsCrossed className="w-6 h-6 text-deep-teal" />
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-gray-500">Kcal vandaag</p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-heading font-semibold mb-4">Recente workouts</h2>
        {recentLogs && recentLogs.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {recentLogs.map((log) => (
              <li key={log.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{log.date}</p>
                  <p className="text-sm text-gray-500">
                    {Array.isArray(log.exercises) ? log.exercises.length : 0} oefeningen
                  </p>
                </div>
                <span className="text-sm font-mono text-gray-400">
                  {log.duration} min
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center py-8">
            Nog geen workouts gelogd. Start vandaag!
          </p>
        )}
      </Card>
    </div>
  );
}
