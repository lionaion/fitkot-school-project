"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface FoodEntry {
  item: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealLogFormProps {
  dietPlanId: string | null;
}

export function MealLogForm({ dietPlanId }: MealLogFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [foods, setFoods] = useState<FoodEntry[]>([
    { item: "", calories: 0, protein: 0, carbs: 0, fat: 0 },
  ]);

  function addFood() {
    setFoods([...foods, { item: "", calories: 0, protein: 0, carbs: 0, fat: 0 }]);
  }

  function removeFood(index: number) {
    setFoods(foods.filter((_, i) => i !== index));
  }

  function updateFood(index: number, field: keyof FoodEntry, value: string | number) {
    const updated = [...foods];
    updated[index] = { ...updated[index], [field]: value };
    setFoods(updated);
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

    const validFoods = foods.filter((f) => f.item.trim() !== "");
    const totalCalories = validFoods.reduce((sum, f) => sum + f.calories, 0);
    const totalProtein = validFoods.reduce((sum, f) => sum + f.protein, 0);
    const totalCarbs = validFoods.reduce((sum, f) => sum + f.carbs, 0);
    const totalFat = validFoods.reduce((sum, f) => sum + f.fat, 0);

    const { error: insertError } = await supabase.from("meal_logs").insert({
      user_id: user.id,
      diet_plan_id: dietPlanId,
      food_items: validFoods,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.refresh();
    setFoods([{ item: "", calories: 0, protein: 0, carbs: 0, fat: 0 }]);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {foods.map((food, i) => (
        <div key={i} className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              label={i === 0 ? "Voedsel" : undefined}
              placeholder="Bijv. Havermout"
              value={food.item}
              onChange={(e) => updateFood(i, "item", e.target.value)}
              required
            />
          </div>
          <div className="w-20">
            <Input
              label={i === 0 ? "Kcal" : undefined}
              type="number"
              min={0}
              value={food.calories || ""}
              onChange={(e) => updateFood(i, "calories", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="w-16">
            <Input
              label={i === 0 ? "P (g)" : undefined}
              type="number"
              min={0}
              value={food.protein || ""}
              onChange={(e) => updateFood(i, "protein", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="w-16">
            <Input
              label={i === 0 ? "K (g)" : undefined}
              type="number"
              min={0}
              value={food.carbs || ""}
              onChange={(e) => updateFood(i, "carbs", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="w-16">
            <Input
              label={i === 0 ? "V (g)" : undefined}
              type="number"
              min={0}
              value={food.fat || ""}
              onChange={(e) => updateFood(i, "fat", parseFloat(e.target.value) || 0)}
            />
          </div>
          {foods.length > 1 && (
            <button
              type="button"
              onClick={() => removeFood(i)}
              className="p-3 text-gray-400 hover:text-coral min-h-[44px] min-w-[44px]"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}

      <Button type="button" variant="ghost" size="sm" onClick={addFood}>
        <Plus className="w-4 h-4 mr-2" />
        Voedsel toevoegen
      </Button>

      {error && <p className="text-sm text-coral">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Opslaan..." : "Maaltijd opslaan"}
      </Button>
    </form>
  );
}
