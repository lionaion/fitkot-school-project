import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function PlansPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: plans } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("trainer_id", user!.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-deep-teal">Trainingsplannen</h1>
          <p className="text-gray-500 mt-1">Maak en beheer trainingsplannen voor je cliënten.</p>
        </div>
        <Link href="/plans/new">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Nieuw plan
          </Button>
        </Link>
      </div>

      {plans && plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Link key={plan.id} href={`/plans/${plan.id}`}>
              <Card className="space-y-3 hover:shadow-md transition-shadow cursor-pointer">
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
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                  <span>{Array.isArray(plan.exercises) ? plan.exercises.length : 0} oefeningen</span>
                  <span>v{plan.version}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-gray-400 text-center py-8">
            Nog geen trainingsplannen. Maak je eerste plan!
          </p>
        </Card>
      )}
    </div>
  );
}
