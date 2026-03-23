import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// DEMO MODE: Mock data
const mockPlans = [
  {
    id: "p1",
    title: "Bodyweight Basics",
    description: "Een beginnersvriendelijk plan met oefeningen die je in je kot kunt doen zonder materiaal.",
    tags: ["geen materiaal", "beginner", "kleine ruimte"],
    exercises: [
      { name: "Push-ups", sets: 3, reps: 12 },
      { name: "Squats", sets: 3, reps: 15 },
      { name: "Plank", sets: 3, reps: 45 },
    ],
  },
  {
    id: "p2",
    title: "HIIT Kottraining",
    description: "Korte maar intensieve intervallen. Ideaal voor drukke studiedagen.",
    tags: ["HIIT", "<20 min", "intensief"],
    exercises: [
      { name: "Burpees", sets: 4, reps: 10 },
      { name: "Mountain Climbers", sets: 4, reps: 20 },
    ],
  },
];

const mockLogs = [
  { id: "l1", date: "2026-03-23", duration: 35, exercises: [{}, {}, {}], notes: "Voelde goed, kon alle sets afmaken" },
  { id: "l2", date: "2026-03-21", duration: 25, exercises: [{}, {}], notes: "" },
  { id: "l3", date: "2026-03-19", duration: 40, exercises: [{}, {}, {}, {}], notes: "Zware sessie, benen trilden" },
  { id: "l4", date: "2026-03-17", duration: 30, exercises: [{}, {}, {}], notes: "" },
  { id: "l5", date: "2026-03-15", duration: 20, exercises: [{}, {}], notes: "Snelle ochtendtraining" },
];

export default function WorkoutsPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockPlans.map((plan) => (
            <Card key={plan.id} className="space-y-3">
              <h3 className="font-heading font-semibold text-lg">{plan.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{plan.description}</p>
              <div className="flex flex-wrap gap-2">
                {plan.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-electric-teal/10 text-electric-teal rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 font-mono">
                {plan.exercises.length} oefeningen
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Workout history */}
      <section>
        <h2 className="text-xl font-heading font-semibold mb-4">Geschiedenis</h2>
        <Card>
          <ul className="divide-y divide-gray-100">
            {mockLogs.map((log) => (
              <li key={log.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{log.date}</p>
                  <p className="text-sm text-gray-500">
                    {log.exercises.length} oefeningen
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
      </section>
    </div>
  );
}
