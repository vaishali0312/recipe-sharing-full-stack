import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipe, updateRecipe, deleteRecipe } from "../services/recipeService";
import RichEditor from "../components/RichEditor";
import { useToast } from "../components/Toast";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [recipe, setRecipe] = useState({
    title: "",
    category: "",
    ingredients: "",
    instructions: "",
    image_url: "",
    video_url: "",
    servings: 1
  });

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getRecipe(id)
      .then((res) => {
        const data = res.data;
        setRecipe({
          title: data.title || "",
          category: data.category || "",
          ingredients: Array.isArray(data.ingredients) ? data.ingredients.join("\n") : data.ingredients || "",
          instructions: data.instructions || "",
          image_url: data.image_url || "",
          video_url: data.video_url || "",
          servings: data.servings || 1
        });
      })
      .catch((err) => console.error("Error loading recipe:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const ingredientsArray = recipe.ingredients
        .split("\n")
        .map(item => item.trim())
        .filter(item => item.length > 0);

      await updateRecipe(id, {
        title: recipe.title,
        ingredients: ingredientsArray,
        instructions: recipe.instructions,
        image_url: recipe.image_url || null,
        video_url: recipe.video_url || null,
        category: recipe.category || null,
        servings: parseInt(recipe.servings) || 1
      });
      addToast("Recipe updated!", "success");
      navigate(`/recipe/${id}`);
    } catch (err) {
      console.error("Error updating recipe:", err);
      addToast("Failed to update recipe", "error");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
      return;
    }
    
    setDeleting(true);
    try {
      await deleteRecipe(id);
      addToast("Recipe deleted successfully!", "success");
      navigate("/");
    } catch (err) {
      console.error("Error deleting recipe:", err);
      addToast("Failed to delete recipe", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading recipe...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="max-w-2xl mx-auto p-6 space-y-4"
    >
      <h1 className="text-2xl font-bold">Edit Recipe</h1>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Recipe Title
        </label>
        <input
          type="text"
          className="input"
          value={recipe.title}
          onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <input
          type="text"
          className="input"
          value={recipe.category}
          onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Servings
        </label>
        <input
          type="number"
          min="1"
          className="input w-24"
          value={recipe.servings}
          onChange={(e) => setRecipe({ ...recipe, servings: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Ingredients (one per line)
        </label>
        <textarea
          className="input h-32"
          value={recipe.ingredients}
          onChange={(e) => setRecipe({ ...recipe, ingredients: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Instructions
        </label>
        <RichEditor
          value={recipe.instructions}
          onChange={(val) => setRecipe({ ...recipe, instructions: val })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Image URL
        </label>
        <input
          type="url"
          className="input"
          value={recipe.image_url}
          onChange={(e) => setRecipe({ ...recipe, image_url: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Video URL
        </label>
        <input
          type="url"
          className="input"
          value={recipe.video_url}
          onChange={(e) => setRecipe({ ...recipe, video_url: e.target.value })}
        />
      </div>

      <div className="flex gap-4">
        <button 
          type="submit" 
          className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90"
        >
          Update Recipe
        </button>
        
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? "Deleting..." : "Delete Recipe"}
        </button>
      </div>
    </form>
  );
}
