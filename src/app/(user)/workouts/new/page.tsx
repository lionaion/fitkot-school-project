"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type { WorkoutUnit } from "@/types/database";

interface ExerciseEntry {
  name: string;
  sets: number;
  reps: number;
  unit: WorkoutUnit;
  completed: boolean;
}

export default function NewWorkoutPage() {
  const router = useRouter();
  const supabase = createClient();
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<ExerciseEntry[]>([
    { name: "", sets: 3, reps: 10, unit: "reps", completed: true },
  ]);

  function addExercise() {
    setExercises([
      ...exercises,
      { name: "", sets: 3, reps: 10, unit: "reps", completed: true },
    ]);
  }

  function removeExercise(index: number) {
    setExercises(exercises.filter((_, i) => i !== index));
  }

  function updateExercise(index: number, field: keyof ExerciseEntry, value: string | number | boolean) {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Je bent niet ingelogd.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("workout_logs").insert({
      user_id: user.id,
      exercises: exercises.filter((ex) => ex.name.trim() !== ""),
      duration: parseInt(duration),
      notes,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/workouts");
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-display font-bold text-deep-teal">
        Workout loggen
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <h2 className="font-heading font-semibold text-lg">Oefeningen</h2>

          {exercises.map((ex, i) => (
            <div key={i} className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  label={i === 0 ? "Oefening" : undefined}
                  placeholder="Bijv. Push-ups"
                  value={ex.name}
                  onChange={(e) => updateExercise(i, "name", e.target.value)}
                  required
                />
              </div>
              <div className="w-20">
                <Input
                  label={i === 0 ? "Sets" : undefined}
                  type="number"
                  min={1}
                  value={ex.sets}
                  onChange={(e) => updateExercise(i, "sets", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="w-20">
                <Input
                  label={i === 0 ? "Reps" : undefined}
                  type="number"
                  min={1}
                  value={ex.reps}
                  onChange={(e) => updateExercise(i, "reps", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="w-24">
                <select
                  className="w-full px-3 py-3 rounded-xl border border-gray-300 bg-white text-sm min-h-[44px]"
                  value={ex.unit}
                  onChange={(e) => updateExercise(i, "unit", e.target.value)}
                >
                  <option value="reps">Reps</option>
                  <option value="seconds">Sec</option>
                  <option value="minutes">Min</option>
                </select>
              </div>
              {exercises.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExercise(i)}
                  className="p-3 text-gray-400 hover:text-coral transition-colors min-h-[44px] min-w-[44px]"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}

          <Button type="button" variant="ghost" size="sm" onClick={addExercise}>
            <Plus className="w-4 h-4 mr-2" />
            Oefening toevoegen
          </Button>
        </Card>

        <Card className="space-y-4">
          <Input
            id="duration"
            label="Duur (minuten)"
            type="number"
            min={1}
            max={480}
            placeholder="30"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
          <div className="space-y-1">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 font-mono">
              Notities (optioneel)
            </label>
            <textarea
              id="notes"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-teal focus:border-transparent transition-colors resize-none"
              rows={3}
              placeholder="Hoe voelde de training?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </Card>

        {error && <p className="text-sm text-coral text-center">{error}</p>}

        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? "Opslaan..." : "Workout opslaan"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Annuleren
          </Button>
        </div>
      </form>
    </div>
  );
}
