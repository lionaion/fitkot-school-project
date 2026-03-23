import { Card } from "@/components/ui/card";
import { Users, Dumbbell, ClipboardList, UtensilsCrossed } from "lucide-react";

// DEMO MODE: Mock data
export default function AdminStatsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-deep-teal">Platform statistieken</h1>
        <p className="text-gray-500 mt-1">Overzicht van het FitKot platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-electric-teal/10 rounded-xl">
            <Users className="w-6 h-6 text-electric-teal" />
          </div>
          <div>
            <p className="text-2xl font-bold">42</p>
            <p className="text-sm text-gray-500">Gebruikers</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-warm-lime/20 rounded-xl">
            <Users className="w-6 h-6 text-warm-lime" />
          </div>
          <div>
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm text-gray-500">Trainers</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-deep-teal/10 rounded-xl">
            <Dumbbell className="w-6 h-6 text-deep-teal" />
          </div>
          <div>
            <p className="text-2xl font-bold">287</p>
            <p className="text-sm text-gray-500">Workout logs</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-coral/10 rounded-xl">
            <ClipboardList className="w-6 h-6 text-coral" />
          </div>
          <div>
            <p className="text-2xl font-bold">18</p>
            <p className="text-sm text-gray-500">Trainingsplannen</p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-heading font-semibold mb-4">Samenvatting</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <UtensilsCrossed className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">12 dieetplannen</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
