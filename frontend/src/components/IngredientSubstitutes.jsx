import { useState, useContext } from "react";
import { getSubstitutes } from "../services/recipeService";
import { useToast } from "./Toast";
import { ThemeContext } from "../context/ThemeContext";

export default function IngredientSubstitutes({ ingredients = [] }) {
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [substitutes, setSubstitutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dietary, setDietary] = useState("");
  const { addToast } = useToast();
  const { dark } = useContext(ThemeContext);

  // Extract base ingredient name from scaled ingredient
  const extractBaseIngredient = (ingredient) => {
    // Remove quantities and units to get just the ingredient name
    return ingredient
      .replace(/^[\d\/\.\s]+(cups?|tbsp|tsp|oz|lb|g|kg|ml|l)?/i, '')
      .trim()
      .toLowerCase();
  };

  const handleSearch = async () => {
    if (!selectedIngredient) {
      addToast("Please select an ingredient", "warning");
      return;
    }
    
    setLoading(true);
    try {
      const baseIngredient = extractBaseIngredient(selectedIngredient);
      const res = await getSubstitutes({ 
        ingredient: baseIngredient,
        dietary: dietary || undefined
      });
      
      if (res.data.substitutes && res.data.substitutes.length > 0) {
        setSubstitutes(res.data.substitutes);
        addToast("Found substitutes!", "success");
      } else {
        setSubstitutes([{ 
          substitute: "No substitutes found", 
          ratio: "", 
          notes: "Try selecting a different ingredient",
          compatible: true
        }]);
      }
    } catch (err) {
      console.error("Error fetching substitutes:", err);
      addToast("Failed to find substitutes", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-4 dark:border-gray-700">
      <h3 className="font-semibold text-lg mb-4 dark:text-white">🥗 Ingredient Substitutes</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Find alternative ingredients for dietary restrictions or preferences
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={selectedIngredient}
          onChange={(e) => {
            setSelectedIngredient(e.target.value);
            setSubstitutes([]);
          }}
          className="border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1 min-w-[150px]"
        >
          <option value="">Select an ingredient</option>
          {ingredients.map((ing, idx) => (
            <option key={idx} value={ing}>{ing}</option>
          ))}
        </select>
        
        <select
          value={dietary}
          onChange={(e) => setDietary(e.target.value)}
          className="border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1 min-w-[150px]"
        >
          <option value="">No dietary restriction</option>
          <option value="vegan">Vegan</option>
          <option value="gluten_free">Gluten-Free</option>
          <option value="dairy_free">Dairy-Free</option>
        </select>
        
        <button
          onClick={handleSearch}
          disabled={!selectedIngredient || loading}
          className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50 transition"
        >
          {loading ? "Searching..." : "Find Substitutes"}
        </button>
      </div>

      {substitutes.length > 0 && (
        <div className="space-y-3">
          {substitutes.map((sub, idx) => (
            <div key={idx} className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border border-green-100 dark:border-green-800">
              <div className="font-medium text-green-700 dark:text-green-400">
                {sub.substitute}
              </div>
              {sub.ratio && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Ratio: {sub.ratio}
                </div>
              )}
              {sub.notes && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {sub.notes}
                </div>
              )}
              {sub.compatible !== undefined && (
                <div className={`text-sm ${sub.compatible ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                  {sub.compatible ? '✓ Compatible with dietary preference' : '⚠ May not match dietary preference'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
