import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function WorkoutsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get assigned plans
  const { data: assignments } = await supabase
    .from("plan_assignments")
    .select("plan_id, workout_plans(id, title, description, exercises, tags)")
    .eq("user_id", user!.id);

  // Get workout history
  const { data: logs } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("user_id", user!.id)
    .order("date", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-deep-teal">Workouts</h1>
          <p className="text-gray-500 mt-1">Beheer je trainingen en bekijk je geschiedenis.</p>
        </div>
        <Link href="/workouts/new">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Workout loggen
          </Button>
        </Link>
      </div>

      {/* Assigned plans */}
      <section>
        <h2 className="text-xl font-heading font-semibold mb-4">Mijn plannen</h2>
        {assignments && assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((a) => {
              const plan = a.workout_plans as unknown as {
                id: string;
                title: string;
                description: string;
                tags: string[];
                exercises: unknown[];
              };
              return (
                <Card key={plan.id} className="space-y-3">
                  <h3 className="font-heading font-semibold text-lg">{plan.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{plan.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-electric-teal/10 text-electric-teal rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 font-mono">
                    {plan.exercises?.length ?? 0} oefeningen
                  </p>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <p className="text-gray-400 text-center py-8">
              Je hebt nog geen trainingsplannen. Vraag je trainer om een plan toe te wijzen.
            </p>
          </Card>
        )}
      </section>

      {/* Workout history */}
      <section>
        <h2 className="text-xl font-heading font-semibold mb-4">Geschiedenis</h2>
        {logs && logs.length > 0 ? (
          <Card>
            <ul className="divide-y divide-gray-100">
              {logs.map((log) => (
                <li key={log.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{log.date}</p>
                    <p className="text-sm text-gray-500">
                      {Array.isArray(log.exercises) ? log.exercises.length : 0} oefeningen
                      {log.notes && ` — ${log.notes}`}
                    </p>
                  </div>
                  <span className="text-sm font-mono text-gray-400">
                    {log.duration} min
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card>
            <p className="text-gray-400 text-center py-8">
              Nog geen workouts gelogd.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
