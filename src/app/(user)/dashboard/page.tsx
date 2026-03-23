import { Card } from "@/components/ui/card";
import { Dumbbell, Flame, Camera, UtensilsCrossed } from "lucide-react";

// DEMO MODE: Mock data instead of Supabase queries
const mockRecentLogs = [
  { id: "1", date: "2026-03-23", duration: 35, exercises: [{ name: "Push-ups" }, { name: "Squats" }, { name: "Plank" }] },
  { id: "2", date: "2026-03-21", duration: 25, exercises: [{ name: "Lunges" }, { name: "Burpees" }] },
  { id: "3", date: "2026-03-19", duration: 40, exercises: [{ name: "Mountain Climbers" }, { name: "Sit-ups" }, { name: "Dips" }, { name: "Calf Raises" }] },
  { id: "4", date: "2026-03-17", duration: 30, exercises: [{ name: "Push-ups" }, { name: "Plank" }, { name: "Squats" }] },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-deep-teal">
          Hallo, Stan
        </h1>
        <p className="text-gray-500 mt-1">Hier is je overzicht voor deze week.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-electric-teal/10 rounded-xl">
            <Dumbbell className="w-6 h-6 text-electric-teal" />
          </div>
          <div>
            <p className="text-2xl font-bold">4</p>
            <p className="text-sm text-gray-500">Workouts deze week</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-warm-lime/20 rounded-xl">
            <Flame className="w-6 h-6 text-warm-lime" />
          </div>
          <div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-gray-500">Dagen streak</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-coral/10 rounded-xl">
            <Camera className="w-6 h-6 text-coral" />
          </div>
          <div>
            <p className="text-2xl font-bold">6</p>
            <p className="text-sm text-gray-500">Voortgangsfoto&apos;s</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-deep-teal/10 rounded-xl">
            <UtensilsCrossed className="w-6 h-6 text-deep-teal" />
          </div>
          <div>
            <p className="text-2xl font-bold">1 850</p>
            <p className="text-sm text-gray-500">Kcal vandaag</p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-heading font-semibold mb-4">Recente workouts</h2>
        <ul className="divide-y divide-gray-100">
          {mockRecentLogs.map((log) => (
            <li key={log.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{log.date}</p>
                <p className="text-sm text-gray-500">
                  {log.exercises.length} oefeningen
                </p>
              </div>
              <span className="text-sm font-mono text-gray-400">
                {log.duration} min
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
