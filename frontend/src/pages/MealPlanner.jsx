import { useState, useEffect, useContext } from "react";
import { getMealPlans, createMealPlan, updateMealPlan, deleteMealPlan, getRecipes } from "../services/recipeService";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function MealPlanner() {
  const { user } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [showAddRecipe, setShowAddRecipe] = useState(null); // { day, mealType }

  useEffect(() => {
    if (user?.id) {
      loadPlans();
      loadRecipes();
    }
  }, [user]);

  const loadPlans = async () => {
    try {
      const res = user?.id ? await getMealPlans(user.id) : await getMealPlans();
      setPlans(res.data || []);
      if (res.data && res.data.length > 0 && !selectedPlan) {
        setSelectedPlan(res.data[0]);
      }
    } catch (err) {
      console.error("Error loading meal plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async () => {
    try {
      const res = await getRecipes();
      setRecipes(res.data || []);
    } catch (err) {
      console.error("Error loading recipes:", err);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      const res = await createMealPlan({ 
        name: newPlanName, 
        meals: {},
        userId: user.id 
      });
      setPlans([...plans, res.data]);
      setSelectedPlan(res.data);
      setShowCreateForm(false);
      setNewPlanName("");
    } catch (err) {
      console.error("Error creating meal plan:", err);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!confirm("Are you sure you want to delete this meal plan?")) return;
    try {
      await deleteMealPlan(planId);
      const newPlans = plans.filter(p => p.id !== planId);
      setPlans(newPlans);
      if (selectedPlan?.id === planId) {
        setSelectedPlan(newPlans[0] || null);
      }
    } catch (err) {
      console.error("Error deleting meal plan:", err);
    }
  };

  const handleAddMeal = async (day, mealType, recipe) => {
    if (!selectedPlan) return;
    try {
      const meals = { ...(selectedPlan.meals || {}) };
      if (!meals[day]) meals[day] = {};
      meals[day][mealType] = { recipeId: recipe.id, recipeName: recipe.title };
      
      const res = await updateMealPlan(selectedPlan.id, { meals });
      setSelectedPlan(res.data);
      setPlans(plans.map(p => p.id === selectedPlan.id ? res.data : p));
      setShowAddRecipe(null);
    } catch (err) {
      console.error("Error adding meal:", err);
    }
  };

  const handleRemoveMeal = async (day, mealType) => {
    if (!selectedPlan) return;
    try {
      const meals = { ...(selectedPlan.meals || {}) };
      if (meals[day] && meals[day][mealType]) {
        delete meals[day][mealType];
      }
      
      const res = await updateMealPlan(selectedPlan.id, { meals });
      setSelectedPlan(res.data);
      setPlans(plans.map(p => p.id === selectedPlan.id ? res.data : p));
    } catch (err) {
      console.error("Error removing meal:", err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading meal planner...</div>;
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Please login to use the meal planner.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📅 Meal Planner</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          + New Plan
        </button>
      </div>

      {/* Create Plan Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Meal Plan</h2>
            <form onSubmit={handleCreatePlan}>
              <input
                type="text"
                placeholder="Plan name (e.g., Week 1)"
                className="input w-full mb-4"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Create</button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Selector */}
      {plans.length > 0 ? (
        <>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
                  selectedPlan?.id === plan.id
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <span>{plan.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePlan(plan.id);
                  }}
                  className="text-xs hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Weekly Grid */}
          {selectedPlan && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border bg-gray-100 dark:bg-gray-700"></th>
                    {DAYS.map((day) => (
                      <th key={day} className="p-2 border bg-gray-100 dark:bg-gray-700 text-sm">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MEAL_TYPES.map((mealType) => (
                    <tr key={mealType}>
                      <td className="p-2 border font-medium bg-gray-100 dark:bg-gray-700 text-sm">
                        {mealType}
                      </td>
                      {DAYS.map((day) => {
                        const meal = selectedPlan.meals?.[day]?.[mealType];
                        return (
                          <td key={`${day}-${mealType}`} className="p-2 border text-center">
                            {meal ? (
                              <div className="flex flex-col items-center">
                                <Link
                                  to={`/recipe/${meal.recipeId}`}
                                  className="text-orange-600 hover:underline text-sm"
                                >
                                  {meal.recipeName}
                                </Link>
                                <button
                                  onClick={() => handleRemoveMeal(day, mealType)}
                                  className="text-red-500 text-xs mt-1"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowAddRecipe({ day, mealType })}
                                className="text-gray-400 hover:text-orange-500 text-2xl"
                              >
                                +
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No meal plans yet.</p>
          <p className="text-gray-400">Create your first meal plan to get started!</p>
        </div>
      )}

      {/* Add Recipe Modal */}
      {showAddRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Select Recipe for {showAddRecipe.day} - {showAddRecipe.mealType}
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recipes.length === 0 ? (
                <p className="text-gray-500">No recipes available.</p>
              ) : (
                recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="p-3 border rounded-lg hover:bg-orange-50 cursor-pointer"
                    onClick={() => handleAddMeal(showAddRecipe.day, showAddRecipe.mealType, recipe)}
                  >
                    <p className="font-medium">{recipe.title}</p>
                    <p className="text-sm text-gray-500">{recipe.category}</p>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setShowAddRecipe(null)}
              className="mt-4 w-full btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
