import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// DEMO MODE: Mock data
const mockPlans = [
  {
    id: "tp1",
    title: "Bodyweight Basics",
    description: "Beginnersvriendelijk plan voor studenten zonder materiaal. Focus op fundamentele bewegingen.",
    tags: ["geen materiaal", "beginner", "kleine ruimte"],
    exercises: [{}, {}, {}, {}],
    version: 2,
  },
  {
    id: "tp2",
    title: "HIIT Kottraining",
    description: "Hoge intensiteit intervallen voor maximaal resultaat in minimale tijd.",
    tags: ["HIIT", "<20 min", "intensief"],
    exercises: [{}, {}, {}, {}, {}],
    version: 1,
  },
  {
    id: "tp3",
    title: "Core & Stretch",
    description: "Focus op kernstabiliteit en flexibiliteit. Perfect als actief herstel.",
    tags: ["core", "stretch", "herstel"],
    exercises: [{}, {}, {}, {}, {}, {}],
    version: 3,
  },
  {
    id: "tp4",
    title: "Upper Body Blast",
    description: "Intensieve bovenlichaam training met alleen bodyweight oefeningen.",
    tags: ["bovenlichaam", "gevorderd"],
    exercises: [{}, {}, {}, {}, {}],
    version: 1,
  },
];

export default function PlansPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockPlans.map((plan) => (
          <Card key={plan.id} className="space-y-3 hover:shadow-md transition-shadow cursor-pointer">
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
            <div className="flex justify-between text-xs text-gray-400 font-mono">
              <span>{plan.exercises.length} oefeningen</span>
              <span>v{plan.version}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
