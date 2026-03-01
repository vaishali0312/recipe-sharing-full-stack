import { useState, useEffect, useContext, useCallback } from "react";
import { getRecipes, getFavorites, getMealPlans } from "../services/recipeService";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    favoritesCount: 0,
    mealPlansCount: 0
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!user?.id) {
      setStats({ totalRecipes: 0, favoritesCount: 0, mealPlansCount: 0 });
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Get all recipes and favorites in parallel
      const [recipesRes, favRes, plansRes] = await Promise.all([
        getRecipes(),
        getFavorites(user.id),
        getMealPlans(user.id)
      ]);
      
      const allRecipes = recipesRes.data || [];
      const favData = favRes.data || [];
      
      // Only count favorites that have valid (existing) recipes
      // Use Set for O(1) lookup instead of making individual API calls
      const recipeIds = new Set(allRecipes.map(r => r.id));
      const favoritesCount = favData.filter(fav => recipeIds.has(fav.recipeId)).length;
      
      const totalRecipes = allRecipes.length;
      const mealPlansCount = (plansRes.data || []).length;
      
      setStats({ totalRecipes, favoritesCount, mealPlansCount });
    } catch (err) {
      console.error("Error loading stats:", err);
      setStats({ totalRecipes: 0, favoritesCount: 0, mealPlansCount: 0 });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Expose refresh function for external use
  useEffect(() => {
    window.refreshDashboardStats = loadStats;
    return () => {
      delete window.refreshDashboardStats;
    };
  }, [loadStats]);

  // Initial load when user logs in
  useEffect(() => {
    if (user?.id) {
      loadStats();
    } else {
      setLoading(false);
    }
  }, [user?.id, loadStats]);

  // Handle visibility and focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        loadStats();
      }
    };
    
    const handleFocus = () => {
      if (user?.id) {
        loadStats();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user?.id, loadStats]);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>
      
      {user ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold">Welcome back, {user.username || user.name || user.email.split('@')[0]}!</h2>
            <p className="opacity-90">Here's your recipe overview</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <div className="text-3xl font-bold text-orange-500">{stats.totalRecipes}</div>
              <div className="text-gray-600 dark:text-gray-400">Total Recipes</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <div className="text-3xl font-bold text-orange-500">{stats.favoritesCount}</div>
              <div className="text-gray-600 dark:text-gray-400">My Favorites</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <div className="text-3xl font-bold text-orange-500">{stats.mealPlansCount}</div>
              <div className="text-gray-600 dark:text-gray-400">Meal Plans</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/create" className="block p-4 border-2 border-orange-500 rounded-lg text-center hover:bg-orange-50 dark:hover:bg-orange-900">
                <span className="text-2xl">➕</span>
                <p className="font-medium">Create Recipe</p>
              </a>
              <a href="/favorites" className="block p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="text-2xl">❤️</span>
                <p className="font-medium">View Favorites</p>
              </a>
              <a href="/meal-planner" className="block p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="text-2xl">📅</span>
                <p className="font-medium">Meal Planner</p>
              </a>
              <a href="/" className="block p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-700">
                <span className="text-2xl">🍳</span>
                <p className="font-medium">Browse Recipes</p>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">👋</div>
          <h2 className="text-xl font-semibold mb-2">Welcome to RecipeHub!</h2>
          <p className="text-gray-500 mb-6">Login to access your dashboard</p>
          <a href="/login" className="btn-primary">Login</a>
        </div>
      )}
    </div>
  );
}
