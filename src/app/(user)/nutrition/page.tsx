import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { MealLogForm } from "@/components/workout/meal-log-form";

export default async function NutritionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Active diet plan
  const { data: dietPlan } = await supabase
    .from("diet_plans")
    .select("*")
    .eq("user_id", user!.id)
    .eq("active", true)
    .single();

  // Today's meal logs
  const today = new Date().toISOString().split("T")[0];
  const { data: todayMeals } = await supabase
    .from("meal_logs")
    .select("*")
    .eq("user_id", user!.id)
    .eq("date", today)
    .order("created_at", { ascending: true });

  const totalCalories = todayMeals?.reduce((sum, m) => sum + m.calories, 0) ?? 0;
  const totalProtein = todayMeals?.reduce((sum, m) => sum + Number(m.protein), 0) ?? 0;
  const totalCarbs = todayMeals?.reduce((sum, m) => sum + Number(m.carbs), 0) ?? 0;
  const totalFat = todayMeals?.reduce((sum, m) => sum + Number(m.fat), 0) ?? 0;

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
          <p className="text-sm text-gray-500">
            kcal{dietPlan ? ` / ${dietPlan.calories_target}` : ""}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-electric-teal">{totalProtein.toFixed(0)}g</p>
          <p className="text-sm text-gray-500">
            Eiwit{dietPlan?.protein_target ? ` / ${dietPlan.protein_target}g` : ""}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-warm-lime">{totalCarbs.toFixed(0)}g</p>
          <p className="text-sm text-gray-500">
            Koolh.{dietPlan?.carbs_target ? ` / ${dietPlan.carbs_target}g` : ""}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-coral">{totalFat.toFixed(0)}g</p>
          <p className="text-sm text-gray-500">
            Vet{dietPlan?.fat_target ? ` / ${dietPlan.fat_target}g` : ""}
          </p>
        </Card>
      </div>

      {/* Log meal */}
      <Card>
        <h2 className="text-xl font-heading font-semibold mb-4">Maaltijd loggen</h2>
        <MealLogForm dietPlanId={dietPlan?.id ?? null} />
      </Card>

      {/* Today's meals */}
      <section>
        <h2 className="text-xl font-heading font-semibold mb-4">Vandaag</h2>
        {todayMeals && todayMeals.length > 0 ? (
          <Card>
            <ul className="divide-y divide-gray-100">
              {todayMeals.map((meal) => (
                <li key={meal.id} className="py-3 flex justify-between items-center">
                  <div>
                    {Array.isArray(meal.food_items) &&
                      meal.food_items.map((item: { item: string }, idx: number) => (
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
        ) : (
          <Card>
            <p className="text-gray-400 text-center py-8">
              Nog geen maaltijden vandaag. Log je eerste maaltijd!
            </p>
          </Card>
        )}
      </section>

      {/* Diet plan */}
      {dietPlan && (
        <section>
          <h2 className="text-xl font-heading font-semibold mb-4">Dieetplan: {dietPlan.title}</h2>
          <Card>
            {Array.isArray(dietPlan.meals) && dietPlan.meals.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {dietPlan.meals.map((meal: { name: string; time: string; foods: { item: string }[] }, idx: number) => (
                  <li key={idx} className="py-3">
                    <div className="flex justify-between">
                      <p className="font-medium">{meal.name}</p>
                      <span className="text-sm text-gray-400 font-mono">{meal.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {meal.foods?.map((f: { item: string }) => f.item).join(", ")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center py-4">Geen maaltijden in dit plan.</p>
            )}
          </Card>
        </section>
      )}
    </div>
  );
}
