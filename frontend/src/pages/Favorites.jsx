import { useEffect, useState, useContext } from "react";
import { getFavorites, getRecipe, removeFavorite } from "../services/recipeService";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useToast } from "../components/Toast";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const { dark } = useContext(ThemeContext);
  const { addToast } = useToast();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id || 'guest';

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = () => {
    getFavorites(userId)
      .then(async (res) => {
        const favData = res.data || [];
        
        const recipePromises = favData.map(async (fav) => {
          try {
            const recipeRes = await getRecipe(fav.recipeId);
            return { ...recipeRes.data, favoriteId: fav.id };
          } catch (err) {
            console.error("Error fetching recipe:", fav.recipeId, err);
            return null;
          }
        });
        
        const recipeData = await Promise.all(recipePromises);
        setRecipes(recipeData.filter(r => r !== null));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setLoading(false);
      });
  };

  const handleRemoveFavorite = async (recipeId, favoriteId) => {
    if (!confirm("Are you sure you want to remove this recipe from favorites?")) return;
    
    // Store the current recipes count for optimistic update check
    const previousRecipes = [...recipes];
    
    try {
      // Optimistically update the UI first
      setRecipes(prevRecipes => prevRecipes.filter(r => {
        const currentId = r.id || r._id;
        return currentId !== recipeId;
      }));
      
      // Make the API call
      await removeFavorite(recipeId, userId);
      
      // Refresh dashboard stats to update the favorites count
      if (window.refreshDashboardStats) {
        window.refreshDashboardStats();
      }
      
      addToast("Removed from favorites!", "success");
    } catch (err) {
      console.error("Error removing favorite:", err);
      
      // Restore previous state on error
      setRecipes(previousRecipes);
      
      // Reload favorites to ensure consistency
      loadFavorites();
      
      // Show more specific error message
      const errorMessage = err.response?.status === 404 
        ? "This recipe was already removed from favorites" 
        : "Failed to remove from favorites. Please try again.";
      addToast(errorMessage, "error");
    }
  };

  if (loading) {
    return (
      <div className={`p-6 text-center ${dark ? "text-gray-400" : "text-gray-500"}`}>
        Loading favorites...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>
        ❤️ My Favorites
      </h1>

      {recipes.length === 0 ? (
        <div className={`text-center py-12 ${dark ? "text-gray-400" : "text-gray-500"}`}>
          <p className="text-lg mb-4">No favorites yet.</p>
          <p className={dark ? "text-gray-500" : "text-gray-400"}>
            Start adding recipes to your favorites from the recipe details page!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {recipes.map((r) => {
            const recipeId = r.id || r._id;
            return (
              <div key={recipeId} className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl transition">
                <div className="relative">
                  <img 
                    src={r.image_url || r.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23988' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"} 
                    alt={r.title}
                    className="h-48 w-full object-cover rounded-t-xl"
                  />
                  <button
                    onClick={() => handleRemoveFavorite(recipeId, r.favoriteId)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition"
                    title="Remove from favorites"
                  >
                    🗑️
                  </button>
                </div>
                <a href={`/recipe/${recipeId}`}>
                  <div className="p-4">
                    <h2 className="font-semibold text-lg">{r.title}</h2>
                    <p className="text-sm opacity-70">{r.category}</p>
                    <span className="text-orange-500 font-medium hover:text-orange-600">
                      View →
                    </span>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}