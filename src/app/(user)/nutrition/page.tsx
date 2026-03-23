import { Card } from "@/components/ui/card";
import { MealLogForm } from "@/components/workout/meal-log-form";

// DEMO MODE: Mock data
const mockDietPlan = {
  id: "dp1",
  title: "Studentendieet — Bulk",
  calories_target: 2400,
  protein_target: 140,
  carbs_target: 300,
  fat_target: 80,
  meals: [
    { name: "Ontbijt", time: "08:00", foods: [{ item: "Havermout met banaan" }, { item: "Eiwitten shake" }] },
    { name: "Lunch", time: "12:30", foods: [{ item: "Broodje kip" }, { item: "Yoghurt" }] },
    { name: "Avondeten", time: "18:30", foods: [{ item: "Pasta met gehakt" }, { item: "Salade" }] },
    { name: "Snack", time: "21:00", foods: [{ item: "Kwark met noten" }] },
  ],
};

const mockTodayMeals = [
  { id: "m1", food_items: [{ item: "Havermout" }, { item: "Banaan" }], calories: 450, protein: 15, carbs: 75, fat: 8, created_at: "2026-03-23T08:15:00Z" },
  { id: "m2", food_items: [{ item: "Broodje kip" }, { item: "Appel" }], calories: 520, protein: 35, carbs: 55, fat: 12, created_at: "2026-03-23T12:45:00Z" },
  { id: "m3", food_items: [{ item: "Eiwitshake" }], calories: 180, protein: 30, carbs: 8, fat: 3, created_at: "2026-03-23T15:00:00Z" },
];

export default function NutritionPage() {
  const totalCalories = mockTodayMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = mockTodayMeals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = mockTodayMeals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = mockTodayMeals.reduce((sum, m) => sum + m.fat, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-deep-teal">Voeding</h1>
        <p className="text-gray-500 mt-1">Volg je voeding en bekijk je dieetplan.</p>
      </div>

      {/* Daily summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-deep-teal">{totalCalories}</p>
          <p className="text-sm text-gray-500">kcal / {mockDietPlan.calories_target}</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-electric-teal">{totalProtein}g</p>
          <p className="text-sm text-gray-500">Eiwit / {mockDietPlan.protein_target}g</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-warm-lime">{totalCarbs}g</p>
          <p className="text-sm text-gray-500">Koolh. / {mockDietPlan.carbs_target}g</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-coral">{totalFat}g</p>
          <p className="text-sm text-gray-500">Vet / {mockDietPlan.fat_target}g</p>
        </Card>
      </div>

      {/* Log meal */}
      <Card>
        <h2 className="text-xl font-heading font-semibold mb-4">Maaltijd loggen</h2>
        <MealLogForm dietPlanId={mockDietPlan.id} />
      </Card>

      {/* Today's meals */}
      <section>
        <h2 className="text-xl font-heading font-semibold mb-4">Vandaag</h2>
        <Card>
          <ul className="divide-y divide-gray-100">
            {mockTodayMeals.map((meal) => (
              <li key={meal.id} className="py-3 flex justify-between items-center">
                <div>
                  {meal.food_items.map((item: { item: string }, idx: number) => (
                    <span key={idx} className="text-sm">
                      {idx > 0 && ", "}
                      {item.item}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-mono text-gray-400">
                  {meal.calories} kcal
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Diet plan */}
      <section>
        <h2 className="text-xl font-heading font-semibold mb-4">Dieetplan: {mockDietPlan.title}</h2>
        <Card>
          <ul className="divide-y divide-gray-100">
            {mockDietPlan.meals.map((meal, idx) => (
              <li key={idx} className="py-3">
                <div className="flex justify-between">
                  <p className="font-medium">{meal.name}</p>
                  <span className="text-sm text-gray-400 font-mono">{meal.time}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {meal.foods.map((f: { item: string }) => f.item).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
