import { useEffect, useState, useContext } from "react";
import { getRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";
import { ThemeContext } from "../context/ThemeContext";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dark } = useContext(ThemeContext);

  useEffect(() => {
    getRecipes()
      .then((res) => {
        // Backend returns array directly
        setRecipes(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes. Make sure the backend is running.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={`p-6 text-center ${dark ? "text-gray-400" : "text-gray-500"}`}>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="mt-2">Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className={`text-red-500 mb-4 text-lg ${dark ? "text-red-400" : "text-red-500"}`}>
          {error}
        </div>
        <p className={dark ? "text-gray-400" : "text-gray-600"}>
          Please start the backend server at http://localhost:5000
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-orange-500 hover:text-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className={`text-2xl md:text-3xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
          Recipe Hub
        </h1>
        <a 
          href="/create"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition text-sm md:text-base"
        >
          + Add Recipe
        </a>
      </div>
      
      {recipes.length === 0 ? (
        <div className={`text-center py-12 ${dark ? "text-gray-400" : "text-gray-500"}`}>
          <p className="text-lg mb-4">No recipes found.</p>
          <p className={dark ? "text-gray-500" : "text-gray-600"}>Create your first recipe to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {recipes.map((r) => (
            <RecipeCard key={r.id || r._id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
