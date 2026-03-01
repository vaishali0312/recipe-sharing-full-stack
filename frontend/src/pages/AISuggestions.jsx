import { useState, useContext } from "react";
import { suggestRecipes, analyzeNutrition, getSubstitutes } from "../services/recipeService";
import { useToast } from "../components/Toast";
import { ThemeContext } from "../context/ThemeContext";

export default function AISuggestions() {
  const { dark } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("suggestions");
  const [ingredients, setIngredients] = useState("");
  const [diet, setDiet] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  // Nutrition state
  const [nutritionResults, setNutritionResults] = useState(null);

  // Substitutes state
  const [substituteIngredient, setSubstituteIngredient] = useState("");
  const [substitutes, setSubstitutes] = useState([]);

  const handleSuggest = async () => {
    if (!ingredients.trim()) {
      addToast("Please enter some ingredients", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await suggestRecipes({
        ingredients: ingredients.split(",").map(i => i.trim()).filter(i => i),
        dietary_preference: diet,
      });
      setResults(res.data.suggestions || []);
      addToast(res.data.message || "Suggestions generated!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to fetch suggestions", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNutrition = async () => {
    if (!ingredients.trim()) {
      addToast("Please enter some ingredients", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await analyzeNutrition({
        ingredients: ingredients.split(",").map(i => i.trim()).filter(i => i),
      });
      setNutritionResults(res.data);
      addToast("Nutrition analyzed!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to analyze nutrition", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubstitutes = async () => {
    if (!substituteIngredient.trim()) {
      addToast("Please enter an ingredient to substitute", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await getSubstitutes({
        ingredient: substituteIngredient,
        dietary: diet,
      });
      setSubstitutes(res.data.substitutes || []);
      addToast(res.data.message || "Substitutes found!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to find substitutes", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "suggestions", label: "Recipe Suggestions", icon: "🍳" },
    { id: "nutrition", label: "Nutrition", icon: "🥗" },
    { id: "substitutes", label: "Substitutes", icon: "🔄" },
  ];

  return (
    <div className={`max-w-3xl mx-auto p-6 ${dark ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      <h1 className={`text-2xl font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>
        🤖 AI Recipe Assistant
      </h1>
      <p className={`text-sm mb-6 ${dark ? "text-gray-400" : "text-gray-600"}`}>
        Get AI-powered recipe suggestions, nutrition info, and ingredient substitutes
      </p>

      {/* Status Banner */}
      <div className={`mb-6 p-3 rounded-lg ${dark ? "bg-amber-900/30 border border-amber-700" : "bg-amber-50 border border-amber-200"}`}>
        <p className={`text-sm ${dark ? "text-amber-400" : "text-amber-700"}`}>
          💡 AI service is using fallback data due to API quota limits. The app still functions with curated responses.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-teal-600 text-white"
                : dark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recipe Suggestions Tab */}
      {activeTab === "suggestions" && (
        <div className={`p-6 rounded-xl ${dark ? "bg-gray-800" : "bg-white"} shadow-lg`}>
          <input
            className={`w-full p-3 rounded-lg mb-3 border ${
              dark 
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
            placeholder="Enter ingredients (e.g., chicken, rice, tomato)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <select 
            className={`w-full p-3 rounded-lg mb-4 border ${
              dark 
                ? "bg-gray-700 border-gray-600 text-white" 
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
            value={diet} 
            onChange={(e) => setDiet(e.target.value)}
          >
            <option value="">No Preference</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="keto">Keto</option>
            <option value="gluten_free">Gluten Free</option>
          </select>
          <button 
            onClick={handleSuggest} 
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {loading ? "Generating..." : "Get Recipe Suggestions"}
          </button>
          
          {/* Results */}
          {results.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                Suggested Recipes ({results.length})
              </h3>
              {results.map((recipe, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg border ${
                    dark 
                      ? "bg-gray-700 border-gray-600" 
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <h4 className={`font-semibold ${dark ? "text-teal-400" : "text-teal-700"}`}>
                    {recipe.title || "Recipe"}
                  </h4>
                  <p className={`text-sm mt-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>
                    {recipe.description || "A delicious recipe with your ingredients"}
                  </p>
                  {recipe.cooking_time && (
                    <p className={`text-xs mt-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                      ⏱️ Cooking time: {recipe.cooking_time} minutes
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Nutrition Analysis Tab */}
      {activeTab === "nutrition" && (
        <div className={`p-6 rounded-xl ${dark ? "bg-gray-800" : "bg-white"} shadow-lg`}>
          <input
            className={`w-full p-3 rounded-lg mb-3 border ${
              dark 
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
            placeholder="Enter ingredients (e.g., chicken, rice, olive oil)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <button 
            onClick={handleNutrition} 
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {loading ? "Analyzing..." : "Analyze Nutrition"}
          </button>
          
          {nutritionResults && (
            <div className={`mt-6 p-4 rounded-lg border ${
              dark 
                ? "bg-gray-700 border-gray-600" 
                : "bg-gray-50 border-gray-200"
            }`}>
              <h3 className={`font-semibold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>
                Nutrition Facts (Per Serving)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg ${dark ? "bg-gray-600" : "bg-white"}`}>
                  <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Calories</p>
                  <p className={`text-xl font-bold ${dark ? "text-teal-400" : "text-teal-600"}`}>
                    {nutritionResults.perServing?.calories || 0}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${dark ? "bg-gray-600" : "bg-white"}`}>
                  <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Protein</p>
                  <p className={`text-xl font-bold ${dark ? "text-teal-400" : "text-teal-600"}`}>
                    {nutritionResults.perServing?.protein || 0}g
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${dark ? "bg-gray-600" : "bg-white"}`}>
                  <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Carbs</p>
                  <p className={`text-xl font-bold ${dark ? "text-teal-400" : "text-teal-600"}`}>
                    {nutritionResults.perServing?.carbs || 0}g
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${dark ? "bg-gray-600" : "bg-white"}`}>
                  <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Fat</p>
                  <p className={`text-xl font-bold ${dark ? "text-teal-400" : "text-teal-600"}`}>
                    {nutritionResults.perServing?.fat || 0}g
                  </p>
                </div>
              </div>
              
              {nutritionResults.total?.vitamins?.length > 0 && (
                <div className="mt-4">
                  <p className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
                    🥬 Vitamins:{" "}
                    <span className={`${dark ? "text-gray-400" : "text-gray-500"}`}>
                      {nutritionResults.total.vitamins.join(", ")}
                    </span>
                  </p>
                </div>
              )}
              
              {nutritionResults.total?.minerals?.length > 0 && (
                <div className="mt-2">
                  <p className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
                    💪 Minerals:{" "}
                    <span className={`${dark ? "text-gray-400" : "text-gray-500"}`}>
                      {nutritionResults.total.minerals.join(", ")}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Substitutes Tab */}
      {activeTab === "substitutes" && (
        <div className={`p-6 rounded-xl ${dark ? "bg-gray-800" : "bg-white"} shadow-lg`}>
          <input
            className={`w-full p-3 rounded-lg mb-3 border ${
              dark 
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
            placeholder="Enter ingredient (e.g., butter, eggs, milk)"
            value={substituteIngredient}
            onChange={(e) => setSubstituteIngredient(e.target.value)}
          />
          <select 
            className={`w-full p-3 rounded-lg mb-4 border ${
              dark 
                ? "bg-gray-700 border-gray-600 text-white" 
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
            value={diet} 
            onChange={(e) => setDiet(e.target.value)}
          >
            <option value="">No Dietary Restriction</option>
            <option value="vegan">Vegan</option>
            <option value="gluten_free">Gluten Free</option>
            <option value="dairy_free">Dairy Free</option>
          </select>
          <button 
            onClick={handleSubstitutes} 
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {loading ? "Finding..." : "Find Substitutes"}
          </button>
          
          <div className="mt-6 space-y-4">
            {substitutes.length > 0 ? (
              substitutes.map((sub, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg border ${
                    dark 
                      ? "bg-gray-700 border-gray-600" 
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <h4 className={`font-semibold ${dark ? "text-teal-400" : "text-teal-700"}`}>
                    {sub.substitute}
                  </h4>
                  <p className={`text-sm mt-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>
                    <span className="font-medium">Ratio:</span> {sub.ratio}
                  </p>
                  <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                    {sub.notes}
                  </p>
                  {sub.compatible !== undefined && (
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                      sub.compatible 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {sub.compatible ? "✓ Compatible" : "✗ Not Compatible"}
                    </span>
                  )}
                </div>
              ))
            ) : (
              !loading && (
                <p className={`text-center ${dark ? "text-gray-400" : "text-gray-500"}`}>
                  Enter an ingredient above to find alternatives
                </p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
