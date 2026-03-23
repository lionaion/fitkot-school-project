import { Card } from "@/components/ui/card";
import { Users, ClipboardList, Activity } from "lucide-react";

// DEMO MODE: Mock data
const mockRecentLogs = [
  { id: "tl1", clientName: "Stan De Vries", date: "2026-03-23", duration: 35 },
  { id: "tl2", clientName: "Emma Peeters", date: "2026-03-23", duration: 25 },
  { id: "tl3", clientName: "Liam Janssens", date: "2026-03-22", duration: 40 },
  { id: "tl4", clientName: "Stan De Vries", date: "2026-03-21", duration: 30 },
  { id: "tl5", clientName: "Julie Maes", date: "2026-03-21", duration: 20 },
];

export default function TrainerDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-deep-teal">
          Hallo, Sofia
        </h1>
        <p className="text-gray-500 mt-1">Overzicht van je cliënten en plannen.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-electric-teal/10 rounded-xl">
            <Users className="w-6 h-6 text-electric-teal" />
          </div>
          <div>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-gray-500">Cliënten</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-warm-lime/20 rounded-xl">
            <ClipboardList className="w-6 h-6 text-warm-lime" />
          </div>
          <div>
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm text-gray-500">Trainingsplannen</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-coral/10 rounded-xl">
            <Activity className="w-6 h-6 text-coral" />
          </div>
          <div>
            <p className="text-2xl font-bold">{mockRecentLogs.length}</p>
            <p className="text-sm text-gray-500">Recente activiteit</p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-heading font-semibold mb-4">Recente activiteit (live feed)</h2>
        <ul className="divide-y divide-gray-100">
          {mockRecentLogs.map((log) => (
            <li key={log.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{log.clientName}</p>
                <p className="text-sm text-gray-500">{log.date}</p>
              </div>
              <span className="text-sm font-mono text-gray-400">{log.duration} min</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
