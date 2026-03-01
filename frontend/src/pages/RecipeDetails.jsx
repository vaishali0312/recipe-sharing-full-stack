import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getRecipe,
  getComments,
  addComment,
  getRatings,
  addRating,
  addFavorite,
  deleteRecipe,
} from "../services/recipeService";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { ThemeContext } from "../context/ThemeContext";
import RatingStars from "../components/RatingStars";
import CommentBox from "../components/CommentBox";
import RecipeCollaboration from "../components/RecipeCollaboration";
import IngredientSubstitutes from "../components/IngredientSubstitutes";
import { scaleIngredients } from "../utils/servingsScaler";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { dark } = useContext(ThemeContext);
  const { addToast } = useToast();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [servings, setServings] = useState(1);
  const [originalServings, setOriginalServings] = useState(1);
  const [comments, setComments] = useState([]);
  const [ratingData, setRatingData] = useState({ average: 0, count: 0 });
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedServings = params.get('servings');
    if (sharedServings) {
      setServings(parseInt(sharedServings) || 1);
    }
  }, []);

  useEffect(() => {
    getRecipe(id)
      .then((res) => {
        setRecipe(res.data);
        const originalServ = res.data?.servings || 1;
        setOriginalServings(originalServ);
        const params = new URLSearchParams(window.location.search);
        const urlServings = params.get('servings');
        setServings(urlServings ? parseInt(urlServings) : originalServ);
      })
      .catch((err) => {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe");
      });

    getComments(id)
      .then((res) => {
        setComments(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
      });

    getRatings(id)
      .then((res) => {
        // Handle both old format (array) and new format ({average, count})
        if (Array.isArray(res.data)) {
          const ratings = res.data;
          const count = ratings.length;
          const average = count > 0 
            ? ratings.reduce((sum, r) => sum + (r.value || r.rating || 0), 0) / count 
            : 0;
          setRatingData({ average: Math.round(average * 10) / 10, count });
        } else {
          setRatingData(res.data || { average: 0, count: 0 });
        }
      })
      .catch((err) => {
        console.error("Error fetching ratings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const generateShareUrl = () => {
    const baseUrl = window.location.origin + "/recipe/" + id;
    const urlWithServings = `${baseUrl}?servings=${servings}`;
    setShareUrl(urlWithServings);
    return urlWithServings;
  };

  const copyShareLink = async () => {
    const url = shareUrl || generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast("Link copied to clipboard!", "success");
    } catch (err) {
      console.error("Failed to copy:", err);
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast("Link copied to clipboard!", "success");
    }
  };

  const getScaledIngredients = () => {
    if (!recipe || !recipe.ingredients) return [];
    if (servings === originalServings) return recipe.ingredients;
    return scaleIngredients(recipe.ingredients, originalServings, servings);
  };

  const submitComment = async (text) => {
    if (!user) {
      addToast("Please login to comment", "warning");
      return;
    }
    try {
      await addComment(id, { text, userId: user.id, userName: user.name });
      const res = await getComments(id);
      setComments(res.data || []);
      addToast("Comment added successfully!", "success");
    } catch (err) {
      console.error("Comment error:", err);
      addToast("Failed to add comment", "error");
    }
  };

  const submitRating = async () => {
    const userId = user?.id || 'guest';
    if (rating === 0) {
      addToast("Please select a rating", "warning");
      return;
    }
    try {
      await addRating(id, { value: rating, userId });
      const res = await getRatings(id);
      if (Array.isArray(res.data)) {
        const ratings = res.data;
        const count = ratings.length;
        const average = count > 0 
          ? ratings.reduce((sum, r) => sum + (r.value || r.rating || 0), 0) / count 
          : 0;
        setRatingData({ average: Math.round(average * 10) / 10, count });
      } else {
        setRatingData(res.data || { average: 0, count: 0 });
      }
      addToast("Rating submitted successfully!", "success");
    } catch (err) {
      console.error("Rating error:", err);
      addToast("Failed to submit rating", "error");
    }
  };

  const handleFavorite = async () => {
    const userId = user?.id || 'guest';
    if (!id) {
      addToast("Cannot add favorite: recipe ID is missing", "error");
      return;
    }
    try {
      console.log("Adding favorite:", { recipeId: id, userId });
      const response = await addFavorite(id, userId);
      console.log("Favorite response:", response);
      // Refresh dashboard stats to update the favorites count
      if (window.refreshDashboardStats) {
        window.refreshDashboardStats();
      }
      addToast("Added to favorites!", "success");
    } catch (err) {
      console.error("Favorite error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to add to favorites";
      addToast(errorMessage, "error");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }
    try {
      await deleteRecipe(id);
      addToast("Recipe deleted successfully!", "success");
      navigate("/");
    } catch (err) {
      console.error("Delete error:", err);
      addToast("Failed to delete recipe", "error");
    }
  };

  if (loading) {
    return (
      <div className={`p-6 text-center ${dark ? "text-gray-400" : "text-gray-500"}`}>
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error || "Recipe not found"}</p>
        <Link to="/" className="text-orange-500 hover:text-orange-600">
          Go back to Home
        </Link>
      </div>
    );
  }

  const scaledIngredients = getScaledIngredients();
  const isScaled = servings !== originalServings;

  return (
    <div className={`max-w-3xl mx-auto p-6 ${dark ? "bg-gray-900" : "bg-white"} rounded-lg shadow`}>
      <Link to="/" className="text-teal-600 hover:text-teal-700 mb-4 inline-block">
        ← Back to Recipes
      </Link>

      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="rounded-xl w-full h-72 object-cover"
        />
      )}

      <h1 className={`text-3xl font-bold mt-4 ${dark ? "text-white" : "text-gray-900"}`}>
        {recipe.title}
      </h1>
      {recipe.description && (
        <p className={`mt-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>
          {recipe.description}
        </p>
      )}
      <p className={`${dark ? "text-gray-400" : "text-gray-600"}`}>
        {recipe.category}
      </p>

      {ratingData.count > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-yellow-500">★</span>
          <span className={dark ? "text-gray-300" : "text-gray-700"}>
            {ratingData.average}
          </span>
          <span className={dark ? "text-gray-500" : "text-gray-500"}>
            ({ratingData.count} ratings)
          </span>
        </div>
      )}

      {recipe.video_url && (
        <iframe
          className="mt-4 w-full h-64"
          src={recipe.video_url}
          title="recipe video"
          frameBorder="0"
          allowFullScreen
        />
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${dark ? "text-gray-200" : "text-gray-700"}`}>
            Servings:
          </span>
          <button
            onClick={() => setServings(Math.max(1, servings - 1))}
            className="w-8 h-8 rounded-full bg-teal-600 text-white hover:bg-teal-700 flex items-center justify-center transition"
          >
            -
          </button>
          <input
            type="number"
            value={servings}
            min="1"
            className={`border rounded px-2 py-1 w-16 text-center ${
              dark 
                ? "bg-gray-700 border-gray-600 text-white" 
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
            onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
          />
          <button
            onClick={() => setServings(servings + 1)}
            className="w-8 h-8 rounded-full bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center transition"
          >
            +
          </button>
        </div>
        
        <button
          onClick={copyShareLink}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
        >
          {copied ? "✓ Copied!" : "🔗 Share with Servings"}
        </button>
        
        {/* Social Media Share Buttons */}
        <div className="flex items-center gap-2">
          <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Share:
          </span>
          <button
            onClick={() => {
              const url = shareUrl || generateShareUrl();
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            }}
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition flex items-center justify-center w-9 h-9"
            title="Share on Facebook"
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button
            onClick={() => {
              const url = shareUrl || generateShareUrl();
              const text = `Check out this recipe: ${recipe.title}`;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
            }}
            className="bg-black hover:bg-gray-800 p-2 rounded-lg transition flex items-center justify-center w-9 h-9"
            title="Share on Twitter/X"
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>
          <button
            onClick={() => {
              const url = shareUrl || generateShareUrl();
              const text = `Check out this recipe: ${recipe.title}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
            }}
            className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition flex items-center justify-center w-9 h-9"
            title="Share on WhatsApp"
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
          <button
            onClick={() => {
              const url = shareUrl || generateShareUrl();
              const text = `Check out this recipe: ${recipe.title}`;
              window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`, '_blank');
            }}
            className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition flex items-center justify-center w-9 h-9"
            title="Share via Email"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </button>
        </div>
        
        {/* PDF Export Button */}
        <button
          onClick={() => {
            const ingredientsList = Array.isArray(scaledIngredients) 
              ? scaledIngredients.map(ing => `<li>${ing}</li>`).join('')
              : `<li>${scaledIngredients}</li>`;
            
            const instructionsList = Array.isArray(recipe.instructions)
              ? recipe.instructions.map(inst => `<li>${inst}</li>`).join('')
              : recipe.instructions;
            
            const printContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <title>${recipe.title} - Recipe</title>
                <style>
                  body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                  h1 { color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px; }
                  h2 { color: #333; margin-top: 20px; }
                  ul, ol { line-height: 1.6; }
                  li { margin-bottom: 5px; }
                  .meta { color: #666; font-size: 14px; }
                  .servings { background: #fff7ed; padding: 10px; border-radius: 5px; margin: 10px 0; }
                </style>
              </head>
              <body>
                <h1>${recipe.title}</h1>
                ${recipe.description ? `<p>${recipe.description}</p>` : ''}
                <div class="meta">
                  <p>Category: ${recipe.category || 'N/A'}</p>
                  <div class="servings">Servings: ${servings}</div>
                </div>
                <h2>Ingredients</h2>
                <ul>${ingredientsList}</ul>
                <h2>Instructions</h2>
                ${Array.isArray(recipe.instructions) ? `<ol>${instructionsList}</ol>` : `<div>${instructionsList}</div>`}
              </body>
              </html>
            `;
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          title="Export as PDF (Print)"
        >
          📄 Export PDF
        </button>
        
        {isScaled && (
          <span className={`text-sm px-2 py-1 rounded ${
            dark 
              ? "text-orange-400 bg-orange-900/30" 
              : "text-orange-600 bg-orange-50"
          }`}>
            ⚠️ Ingredients scaled from {originalServings} to {servings} servings
          </span>
        )}
      </div>

      <h2 className={`font-semibold mt-6 text-xl ${dark ? "text-white" : "text-gray-900"}`}>
        Ingredients {isScaled && `(adjusted for ${servings} servings)`}
      </h2>
      {Array.isArray(scaledIngredients) ? (
        <ul className={`list-disc list-inside mt-2 space-y-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>
          {scaledIngredients.map((ing, index) => (
            <li key={index}>{ing}</li>
          ))}
        </ul>
      ) : (
        <p className={dark ? "text-gray-300" : "text-gray-700"}>{scaledIngredients}</p>
      )}

      <h2 className={`font-semibold mt-6 text-xl ${dark ? "text-white" : "text-gray-900"}`}>
        Instructions
      </h2>
      {Array.isArray(recipe.instructions) ? (
        <ol className={`list-decimal list-inside mt-2 space-y-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>
          {recipe.instructions.map((inst, index) => (
            <li key={index}>{inst}</li>
          ))}
        </ol>
      ) : (
        <div 
          className={dark ? "text-gray-300" : "text-gray-700"}
          dangerouslySetInnerHTML={{ __html: recipe.instructions }} 
        />
      )}

      <div className="mt-6 flex gap-4 flex-wrap">
        <button
          onClick={handleFavorite}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
        >
          ❤️ Add to Favorites
        </button>
        
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          🗑️ Delete Recipe
        </button>
      </div>

      <div className="mt-8 border-t dark:border-gray-700 pt-4">
        <h3 className={`font-semibold text-lg mb-2 ${dark ? "text-white" : "text-gray-900"}`}>
          Rate this Recipe
        </h3>
        <div className="flex items-center gap-4">
          <RatingStars rating={rating} setRating={setRating} />
          <button
            onClick={submitRating}
            className="ml-3 bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
          >
            Submit Rating
          </button>
        </div>
      </div>

      <div className="mt-8 border-t dark:border-gray-700 pt-4">
        <h3 className={`font-semibold text-lg mb-4 ${dark ? "text-white" : "text-gray-900"}`}>
          Comments ({comments.length})
        </h3>
        
        {comments.length > 0 && (
          <div className="space-y-4 mb-6">
            {comments.map((comment, index) => (
              <div 
                key={comment.id || index} 
                className={`p-3 rounded-lg ${
                  dark ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-medium ${dark ? "text-white" : "text-gray-900"}`}>
                    {comment.userName || "Anonymous"}
                  </span>
                  <span className={dark ? "text-gray-500" : "text-gray-500 text-sm"}>
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <p className={dark ? "text-gray-300" : "text-gray-700"}>{comment.text}</p>
              </div>
            ))}
          </div>
        )}

        <CommentBox onSubmit={submitComment} />
      </div>

      <RecipeCollaboration recipeId={id} currentUser={user} />

      <IngredientSubstitutes ingredients={scaledIngredients} />
    </div>
  );
}
