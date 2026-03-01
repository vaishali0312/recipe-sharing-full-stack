import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { addFavorite, removeFavorite } from "../services/recipeService";
import { useToast } from "./Toast";

export default function RecipeCard({ recipe }) {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Handle both Supabase (id) and MongoDB (_id) formats
  const recipeId = recipe.id || recipe._id;
  
  // Use a data URL as fallback instead of external placeholder service
  const defaultImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23988' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  const imageUrl = recipe.image_url || recipe.image || defaultImage;

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Allow guests to add favorites too
    const userId = user?.id || 'guest';
    
    // Validate recipeId
    if (!recipeId) {
      console.error("Recipe ID is missing:", recipe);
      addToast("Cannot add favorite: recipe ID is missing", "error");
      return;
    }
    
    try {
      if (isFavorite) {
        await removeFavorite(recipeId, userId);
        setIsFavorite(false);
        addToast("Removed from favorites!", "success");
      } else {
        console.log("Adding favorite from card:", { recipeId, userId });
        const response = await addFavorite(recipeId, userId);
        console.log("Favorite response:", response);
        setIsFavorite(true);
        addToast("Added to favorites!", "success");
      }
    } catch (err) {
      console.error("Error handling favorite:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update favorites";
      addToast(errorMessage, "error");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl transition relative">
      <button
        onClick={handleFavorite}
        className={`absolute top-2 right-2 p-2 rounded-full ${isFavorite ? 'bg-pink-500' : 'bg-white dark:bg-gray-700'} shadow-md hover:bg-pink-100 dark:hover:bg-pink-900 transition`}
        title="Add to favorites"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
      <Link to={`/recipe/${recipeId}`}>
        <img 
          src={imageUrl} 
          alt={recipe.title}
          className="h-48 w-full object-cover rounded-t-xl"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div className="p-4">
          <h2 className="font-semibold text-lg">{recipe.title}</h2>
          <p className="text-sm opacity-70">{recipe.category}</p>
          <span className="text-orange-500 font-medium hover:text-orange-600">
            View →
          </span>
        </div>
      </Link>
    </div>
  );
}
