import API from "./api";

// recipes
export const getRecipes = () => API.get("/recipes");
export const getRecipe = (id) => API.get(`/recipes/${id}`);
export const createRecipe = (data) => API.post("/recipes", data);
export const updateRecipe = (id, data) => API.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);

// comments
export const getComments = (id) => API.get(`/comments/recipe/${id}`);
export const addComment = (id, data) => API.post(`/comments/recipe/${id}`, data);

// ratings
export const getRatings = (id) => API.get(`/ratings/recipe/${id}`);
export const addRating = (id, data) => API.post(`/ratings/recipe/${id}`, data);

// favorites
export const getFavorites = (userId) => API.get(`/favorites/user/${userId}`);
export const addFavorite = (recipeId, userId) => API.post("/favorites", { recipeId, userId });
export const removeFavorite = (recipeId, userId) => API.delete("/favorites", { params: { recipeId, userId } });

// meal planner
export const getMealPlans = (userId) => API.get(`/meal-plans/user/${userId}`);
export const getMealPlan = (id) => API.get(`/meal-plans/${id}`);
export const createMealPlan = (data) => API.post("/meal-plans", data);
export const updateMealPlan = (id, data) => API.put(`/meal-plans/${id}`, data);
export const deleteMealPlan = (id) => API.delete(`/meal-plans/${id}`);

// Ingredient substitutes (local backend)
export const getSubstitutes = (data) => API.post("/ai/substitutes", data);

// Forum
export const getForumPosts = () => API.get("/forum/posts");
export const createForumPost = (data) => API.post("/forum/posts", data);
export const deleteForumPost = (postId) => API.delete(`/forum/posts/${postId}`);
export const replyToPost = (postId, data) => API.post(`/forum/posts/${postId}/reply`, data);
export const likePost = (postId) => API.post(`/forum/posts/${postId}/like`);

// Collaboration
export const getCollaborations = (recipeId) => API.get(`/collaborations/recipe/${recipeId}`);
export const createCollaboration = (data) => API.post("/collaborations", data);
