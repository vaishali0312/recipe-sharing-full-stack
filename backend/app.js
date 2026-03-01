import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Helper function to read from DB
const readDb = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { recipes: [], users: [], comments: [], ratings: [], favorites: [], mealPlans: [] };
  }
};

// Helper function to write to DB
const writeDb = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// ==================== ROUTES ====================

// Recipe Routes
app.get('/api/recipes', (req, res) => {
  const db = readDb();
  res.json(db.recipes);
});

app.get('/api/recipes/:id', (req, res) => {
  const db = readDb();
  const recipe = db.recipes.find(r => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  res.json(recipe);
});

app.post('/api/recipes', (req, res) => {
  const db = readDb();
  const newRecipe = {
    id: `recipe${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.recipes.push(newRecipe);
  writeDb(db);
  res.status(201).json(newRecipe);
});

app.put('/api/recipes/:id', (req, res) => {
  const db = readDb();
  const index = db.recipes.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Recipe not found' });
  
  db.recipes[index] = { ...db.recipes[index], ...req.body };
  writeDb(db);
  res.json(db.recipes[index]);
});

app.delete('/api/recipes/:id', (req, res) => {
  const db = readDb();
  const index = db.recipes.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Recipe not found' });
  
  db.recipes.splice(index, 1);
  writeDb(db);
  res.json({ message: 'Recipe deleted successfully' });
});

// User Routes
app.get('/api/users', (req, res) => {
  const db = readDb();
  res.json(db.users);
});

app.get('/api/users/:id', (req, res) => {
  const db = readDb();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

app.post('/api/users/register', (req, res) => {
  const db = readDb();
  const { username, email, password } = req.body;
  
  const existingUser = db.users.find(u => u.email === email);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });
  
  const newUser = {
    id: `user${Date.now()}`,
    username,
    email,
    password,
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  writeDb(db);
  res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
});

app.post('/api/users/login', (req, res) => {
  const db = readDb();
  const { email, password } = req.body;
  
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  
  res.json({ 
    message: 'Login successful', 
    user: { id: user.id, username: user.username, email: user.email } 
  });
});

// Comment Routes
app.get('/api/comments', (req, res) => {
  const db = readDb();
  res.json(db.comments);
});

app.get('/api/comments/recipe/:recipeId', (req, res) => {
  const db = readDb();
  const comments = db.comments.filter(c => c.recipeId === req.params.recipeId);
  res.json(comments);
});

app.post('/api/comments', (req, res) => {
  const db = readDb();
  const newComment = {
    id: `comment${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.comments.push(newComment);
  writeDb(db);
  res.status(201).json(newComment);
});

app.post('/api/comments/recipe/:recipeId', (req, res) => {
  const db = readDb();
  const newComment = {
    id: `comment${Date.now()}`,
    recipeId: req.params.recipeId,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.comments.push(newComment);
  writeDb(db);
  res.status(201).json(newComment);
});

app.delete('/api/comments/:id', (req, res) => {
  const db = readDb();
  const index = db.comments.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Comment not found' });

  db.comments.splice(index, 1);
  writeDb(db);
  res.json({ message: 'Comment deleted successfully' });
});

// Rating Routes
app.get('/api/ratings/recipe/:recipeId', (req, res) => {
  const db = readDb();
  const ratings = db.ratings.filter(r => r.recipeId === req.params.recipeId);
  
  // Calculate average and count
  const count = ratings.length;
  const average = count > 0 
    ? ratings.reduce((sum, r) => sum + (r.value || r.rating || 0), 0) / count 
    : 0;
  
  res.json({ average: Math.round(average * 10) / 10, count });
});

app.post('/api/ratings/recipe/:recipeId', (req, res) => {
  const db = readDb();
  const newRating = {
    id: `rating${Date.now()}`,
    recipeId: req.params.recipeId,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.ratings.push(newRating);
  writeDb(db);
  res.status(201).json(newRating);
});

// Favorite Routes
app.get('/api/favorites/user/:userId', (req, res) => {
  const db = readDb();
  const favorites = db.favorites.filter(f => f.userId === req.params.userId);
  res.json(favorites);
});

app.post('/api/favorites', (req, res) => {
  const db = readDb();
  const { userId, recipeId } = req.body;
  
  const existingFavorite = db.favorites.find(
    f => f.userId === userId && f.recipeId === recipeId
  );
  if (existingFavorite) return res.status(400).json({ message: 'Recipe already in favorites' });
  
  const newFavorite = {
    id: `fav${Date.now()}`,
    userId,
    recipeId,
    createdAt: new Date().toISOString()
  };
  db.favorites.push(newFavorite);
  writeDb(db);
  res.status(201).json(newFavorite);
});

app.delete('/api/favorites', (req, res) => {
  const db = readDb();
  const { userId, recipeId } = req.query;
  const index = db.favorites.findIndex(
    f => f.userId === userId && f.recipeId === recipeId
  );
  if (index === -1) return res.status(404).json({ message: 'Favorite not found' });
  
  db.favorites.splice(index, 1);
  writeDb(db);
  res.json({ message: 'Favorite removed successfully' });
});

// Meal Planner Routes
app.get('/api/meal-plans/user/:userId', (req, res) => {
  const db = readDb();
  const mealPlans = db.mealPlans.filter(m => m.userId === req.params.userId);
  res.json(mealPlans);
});

app.get('/api/meal-plans', (req, res) => {
  // Support getting all meal plans (for backwards compatibility)
  const db = readDb();
  res.json(db.mealPlans || []);
});

app.post('/api/meal-plans', (req, res) => {
  const db = readDb();
  const newMealPlan = {
    id: `meal${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.mealPlans.push(newMealPlan);
  writeDb(db);
  res.status(201).json(newMealPlan);
});

app.put('/api/meal-plans/:id', (req, res) => {
  const db = readDb();
  const index = db.mealPlans.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Meal plan not found' });
  
  db.mealPlans[index] = { ...db.mealPlans[index], ...req.body };
  writeDb(db);
  res.json(db.mealPlans[index]);
});

app.delete('/api/meal-plans/:id', (req, res) => {
  const db = readDb();
  const index = db.mealPlans.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Meal plan not found' });
  
  db.mealPlans.splice(index, 1);
  writeDb(db);
  res.json({ message: 'Meal plan deleted successfully' });
});

// AI Suggestions Route
app.post('/api/ai/suggest-recipes', (req, res) => {
  const db = readDb();
  const { ingredients, cuisine, dietary } = req.body;
  
  // Simple AI simulation - return random recipes as suggestions
  const suggestions = db.recipes
    .filter(r => !cuisine || r.category === cuisine)
    .slice(0, 5);
  
  res.json({ suggestions });
});

// AI Substitutes Route
app.post('/api/ai/substitutes', (req, res) => {
  const { ingredient, dietary } = req.body;
  
  // Expanded substitute suggestions with 20+ common ingredients
  const substitutesData = {
    // Dairy
    "butter": [
      { substitute: "Coconut Oil", ratio: "1:1", notes: "Great for baking, adds slight coconut flavor", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Olive Oil", ratio: "3/4:1", notes: "Good for savory dishes", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Applesauce", ratio: "1/2:1", notes: "Adds moisture, slightly sweet", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Avocado", ratio: "1:1", notes: "Healthy fats, great for spreading", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Greek Yogurt", ratio: "1:1", notes: "Tangy, good for baking", compatible: dietary === "vegetarian" },
      { substitute: "Prune Puree", ratio: "1:1", notes: "Great for baking, adds natural sweetness", compatible: dietary === "vegan" || dietary === "dairy_free" }
    ],
    "milk": [
      { substitute: "Almond Milk", ratio: "1:1", notes: "Light, slightly nutty flavor", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Oat Milk", ratio: "1:1", notes: "Creamy texture, neutral flavor", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Coconut Milk", ratio: "1:1", notes: "Rich and creamy", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Soy Milk", ratio: "1:1", notes: "High protein, neutral flavor", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Rice Milk", ratio: "1:1", notes: "Light and sweet, good for smoothies", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Cashew Milk", ratio: "1:1", notes: "Creamy, rich texture", compatible: dietary === "vegan" || dietary === "dairy_free" }
    ],
    "cream": [
      { substitute: "Coconut Cream", ratio: "1:1", notes: "Rich and thick", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Cashew Cream", ratio: "1:1", notes: "Creamy and neutral", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Silken Tofu", ratio: "1:1", notes: "Blend until smooth", compatible: dietary === "vegan" || dietary === "dairy_free" }
    ],
    "cheese": [
      { substitute: "Nutritional Yeast", ratio: "1:1", notes: "Cheesy flavor, great for sauces", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Cashew Cheese", ratio: "1:1", notes: "Creamy, similar texture", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Tofu Cheese", ratio: "1:1", notes: "Firm texture, good for melting", compatible: dietary === "vegan" || dietary === "dairy_free" }
    ],
    "sour cream": [
      { substitute: "Greek Yogurt", ratio: "1:1", notes: "Tangy and creamy", compatible: dietary === "vegetarian" },
      { substitute: "Coconut Cream + Lemon", ratio: "1:1", notes: "Mix with lemon juice", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Cashew Sour Cream", ratio: "1:1", notes: "Blend soaked cashews with vinegar", compatible: dietary === "vegan" || dietary === "dairy_free" }
    ],
    "yogurt": [
      { substitute: "Coconut Yogurt", ratio: "1:1", notes: "Creamy, probiotic", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Soy Yogurt", ratio: "1:1", notes: "High protein, tangy", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Almond Yogurt", ratio: "1:1", notes: "Light and creamy", compatible: dietary === "vegan" || dietary === "dairy_free" }
    ],
    "buttermilk": [
      { substitute: "Milk + Lemon Juice", ratio: "1 cup milk + 1 tbsp lemon", notes: "Let sit 5 minutes", compatible: dietary === "vegetarian" },
      { substitute: "Milk + Vinegar", ratio: "1 cup milk + 1 tbsp vinegar", notes: "White vinegar works best", compatible: dietary === "vegetarian" },
      { substitute: "Plant Milk + Lemon", ratio: "1:1", notes: "Same method as dairy", compatible: dietary === "vegan" || dietary === "dairy_free" }
    ],
    "heavy cream": [
      { substitute: "Coconut Cream", ratio: "1:1", notes: "Rich and thick", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Cashew Cream", ratio: "1:1", notes: "Blend cashews with water", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Evaporated Milk", ratio: "1:1", notes: "Lower fat option", compatible: dietary === "vegetarian" }
    ],
    // Eggs & Binders
    "eggs": [
      { substitute: "Flax Egg", ratio: "1 tbsp flax + 3 tbsp water per egg", notes: "Best for baking, binds well", compatible: dietary === "vegan" },
      { substitute: "Chia Egg", ratio: "1 tbsp chia + 3 tbsp water per egg", notes: "Similar to flax egg", compatible: dietary === "vegan" },
      { substitute: "Banana", ratio: "1/2 banana per egg", notes: "Adds sweetness, good for pancakes", compatible: dietary === "vegan" },
      { substitute: "Applesauce", ratio: "1/4 cup per egg", notes: "Adds moisture and sweetness", compatible: dietary === "vegan" },
      { substitute: "Silken Tofu", ratio: "1/4 cup blended per egg", notes: "Neutral flavor, good for dense baked goods", compatible: dietary === "vegan" },
      { substitute: "Aquafaba", ratio: "3 tbsp per egg", notes: "Chickpea liquid, good for meringues", compatible: dietary === "vegan" }
    ],
    // Sweeteners
    "sugar": [
      { substitute: "Honey", ratio: "3/4:1", notes: "Reduce liquid, not vegan", compatible: dietary === "vegetarian" || !dietary },
      { substitute: "Maple Syrup", ratio: "3/4:1", notes: "Reduce liquid, distinct flavor", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Stevia", ratio: "1 tsp per cup", notes: "Very sweet, no calories", compatible: true },
      { substitute: "Coconut Sugar", ratio: "1:1", notes: "Lower glycemic index", compatible: true },
      { substitute: "Monk Fruit", ratio: "1/2 tsp per cup", notes: "Natural zero-calorie sweetener", compatible: true },
      { substitute: "Agave Nectar", ratio: "3/4:1", notes: "Reduce liquid, very sweet", compatible: dietary === "vegan" || dietary === "dairy_free" }
    ],
    "honey": [
      { substitute: "Maple Syrup", ratio: "1:1", notes: "Similar consistency", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Agave Nectar", ratio: "1:1", notes: "Very sweet, milder flavor", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Date Syrup", ratio: "1:1", notes: "Rich, caramel-like flavor", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Molasses", ratio: "3/4:1", notes: "Stronger flavor, more nutrients", compatible: dietary === "vegan" || dietary === "dairy_free" }
    ],
    // Flours & Starches
    "flour": [
      { substitute: "Almond Flour", ratio: "1:1", notes: "Gluten-free, nutty flavor", compatible: dietary === "gluten_free" || dietary === "vegetarian" },
      { substitute: "Rice Flour", ratio: "1:1", notes: "Gluten-free, light texture", compatible: dietary === "gluten_free" || dietary === "vegetarian" },
      { substitute: "Oat Flour", ratio: "1:1", notes: "Make by blending oats, slightly dense", compatible: dietary === "vegetarian" },
      { substitute: "Coconut Flour", ratio: "1/4:1", notes: "Very absorbent, add more liquid", compatible: dietary === "gluten_free" || dietary === "vegetarian" },
      { substitute: "Gluten-Free Flour Blend", ratio: "1:1", notes: "Best for most recipes", compatible: dietary === "gluten_free" || dietary === "vegetarian" }
    ],
    "cornstarch": [
      { substitute: "Arrowroot Powder", ratio: "1:1", notes: "Works at lower temps", compatible: true },
      { substitute: "Tapioca Starch", ratio: "1:1", notes: "Glossy finish", compatible: true },
      { substitute: "Potato Starch", ratio: "1:1", notes: "Good for baking", compatible: true },
      { substitute: "All-Purpose Flour", ratio: "2:1", notes: "Less effective thickening", compatible: dietary === "vegetarian" }
    ],
    "baking powder": [
      { substitute: "Baking Soda + Cream of Tartar", ratio: "1/4 tsp soda + 1/2 tsp tartar per 1 tsp powder", notes: "Mix immediately before using", compatible: true },
      { substitute: "Baking Soda + Lemon Juice", ratio: "1/2 tsp soda + 1 tsp lemon per 1 tsp powder", notes: "Use immediately", compatible: true },
      { substitute: "Self-Rising Flour", ratio: "1:1", notes: "Contains baking powder", compatible: dietary === "vegetarian" }
    ],
    "yeast": [
      { substitute: "Baking Powder", ratio: "1 tsp per 1 packet yeast", notes: "For quick breads only", compatible: true },
      { substitute: "Sourdough Starter", ratio: "1:1", notes: "Will need longer rising time", compatible: true }
    ],
    // Fats & Oils
    "oil": [
      { substitute: "Butter", ratio: "1:1", notes: "Adds richness, not vegan", compatible: dietary === "vegetarian" },
      { substitute: "Applesauce", ratio: "1:1 (reduce other liquid)", notes: "For baking, lower fat", compatible: dietary === "vegan" || dietary === "low_fat" },
      { substitute: "Mashed Avocado", ratio: "1:1", notes: "Healthy fats", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Greek Yogurt", ratio: "1:1", notes: "Creamy, adds protein", compatible: dietary === "vegetarian" }
    ],
    "vegetable oil": [
      { substitute: "Coconut Oil", ratio: "1:1", notes: "Solid at room temp", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Olive Oil", ratio: "3/4:1", notes: "Good for savory dishes", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Avocado Oil", ratio: "1:1", notes: "Neutral flavor, high smoke point", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Apple Sauce", ratio: "1:1", notes: "For baking, reduces fat", compatible: dietary === "vegan" || dietary === "low_fat" }
    ],
    // Condiments & Seasonings
    "vinegar": [
      { substitute: "Lemon Juice", ratio: "1:1", notes: "Similar acidity", compatible: true },
      { substitute: "Lime Juice", ratio: "1:1", notes: "Works in most recipes", compatible: true },
      { substitute: "Apple Cider Vinegar", ratio: "1:1", notes: "Similar tang", compatible: true }
    ],
    "soy sauce": [
      { substitute: "Tamari", ratio: "1:1", notes: "Gluten-free alternative", compatible: dietary === "gluten_free" },
      { substitute: "Coconut Aminos", ratio: "1:1", notes: "Gluten-free, less sodium", compatible: true },
      { substitute: "Worcestershire Sauce", ratio: "1:1", notes: "Contains fish (not vegan)", compatible: dietary === "vegetarian" },
      { substitute: "Liquid Aminos", ratio: "1:1", notes: "Similar flavor profile", compatible: dietary === "vegan" || dietary === "dairy_free" }
    ],
    "garlic": [
      { substitute: "Garlic Powder", ratio: "1/8 tsp per clove", notes: "Use less, more potent", compatible: true },
      { substitute: "Shallots", ratio: "1 small shallot per clove", notes: "Milder, different flavor", compatible: true },
      { substitute: "Asafoetida", ratio: "Small pinch", notes: "Strong garlic odor when cooked", compatible: true }
    ],
    "onion": [
      { substitute: "Shallots", ratio: "1:1", notes: "Milder, sweeter", compatible: true },
      { substitute: "Green Onions", ratio: "1:1", notes: "Less strong flavor", compatible: true },
      { substitute: "Onion Powder", ratio: "1 tbsp powder per medium onion", notes: "Use sparingly", compatible: true },
      { substitute: "Leeks", ratio: "1:1", notes: "Use white and light green parts", compatible: true }
    ],
    "lemon": [
      { substitute: "Lime", ratio: "1:1", notes: "Similar acidity", compatible: true },
      { substitute: "Lemon Juice (bottled)", ratio: "1:1", notes: "Convenience option", compatible: true },
      { substitute: "Orange", ratio: "1:1", notes: "Sweeter, less acidic", compatible: true },
      { substitute: "White Wine Vinegar", ratio: "1:1", notes: "For cooking, not baking", compatible: true }
    ],
    "lime": [
      { substitute: "Lemon", ratio: "1:1", notes: "Similar acidity", compatible: true },
      { substitute: "Lime Juice (bottled)", ratio: "1:1", notes: "Convenience option", compatible: true },
      { substitute: "Grapefruit", ratio: "1:1", notes: "Tarter, more bitter", compatible: true }
    ],
    // Grains & Pasta
    "bread crumbs": [
      { substitute: "Rolled Oats", ratio: "1:1", notes: "Process briefly", compatible: dietary === "vegetarian" },
      { substitute: "Crushed Crackers", ratio: "1:1", notes: "Salted or unsalted", compatible: dietary === "vegetarian" },
      { substitute: "Almond Flour", ratio: "1:1", notes: "Gluten-free coating", compatible: dietary === "gluten_free" || dietary === "vegetarian" },
      { substitute: "Panko", ratio: "1:1", notes: "Extra crispy coating", compatible: dietary === "vegetarian" },
      { substitute: "Crushed Cornflakes", ratio: "1:1", notes: "Light and crispy", compatible: dietary === "vegetarian" }
    ],
    "pasta": [
      { substitute: "Zucchini Noodles", ratio: "1:1", notes: "Low carb, light", compatible: true },
      { substitute: "Rice Noodles", ratio: "1:1", notes: "Gluten-free Asian option", compatible: true },
      { substitute: "Spiralized Squash", ratio: "1:1", notes: "Butternut or spaghetti squash", compatible: true },
      { substitute: "Chickpea Pasta", ratio: "1:1", notes: "Higher protein", compatible: true },
      { substitute: "Quinoa Pasta", ratio: "1:1", notes: "Gluten-free alternative", compatible: true },
      { substitute: "Shirataki Noodles", ratio: "1:1", notes: "Very low calorie", compatible: true }
    ],
    "rice": [
      { substitute: "Cauliflower Rice", ratio: "1:1", notes: "Low carb alternative", compatible: true },
      { substitute: "Quinoa", ratio: "1:1", notes: "Higher protein, fluffy", compatible: true },
      { substitute: "Couscous", ratio: "1:1", notes: "Small pasta, not gluten-free", compatible: dietary === "vegetarian" },
      { substitute: "Basmati Rice", ratio: "1:1", notes: "Fragrant variety", compatible: true },
      { substitute: "Wild Rice", ratio: "1:1", notes: "Nuttier flavor", compatible: true },
      { substitute: "Barley", ratio: "1:1", notes: "Chewier texture", compatible: dietary === "vegetarian" }
    ],
    // Baking Ingredients
    "chocolate": [
      { substitute: "Carob", ratio: "1:1", notes: "Caffeine-free, sweeter", compatible: true },
      { substitute: "Cocoa Powder + Sugar", ratio: "1:1", notes: "Mix with sweetener", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Dark Chocolate (70%+)", ratio: "1:1", notes: "Check for dairy-free", compatible: dietary === "vegan" || dietary === "dairy_free" },
      { substitute: "Cacao Nibs", ratio: "1:1", notes: "Crunchy, intense flavor", compatible: true }
    ],
    "vanilla": [
      { substitute: "Vanilla Extract (alcohol-based)", ratio: "1:1", notes: "Standard replacement", compatible: dietary === "vegetarian" },
      { substitute: "Maple Syrup", ratio: "1:1", notes: "Adds distinct flavor", compatible: true },
      { substitute: "Almond Extract", ratio: "1/2:1", notes: "Much stronger, use less", compatible: true },
      { substitute: "Vanilla Bean Paste", ratio: "1:1", notes: "Intense vanilla flavor", compatible: dietary === "vegetarian" }
    ],
    "cinnamon": [
      { substitute: "Nutmeg", ratio: "1/4:1", notes: "Warmer, sweeter", compatible: true },
      { substitute: "Pumpkin Pie Spice", ratio: "1:1", notes: "Contains cinnamon and others", compatible: true },
      { substitute: "Allspice", ratio: "1/2:1", notes: "More intense", compatible: true },
      { substitute: "Ginger", ratio: "1/2:1", notes: "More zesty", compatible: true },
      { substitute: "Cardamom", ratio: "1/2:1", notes: "Citrusy, floral", compatible: true }
    ],
    "nutmeg": [
      { substitute: "Cinnamon", ratio: "2:1", notes: "Milder, more common", compatible: true },
      { substitute: "Allspice", ratio: "1:1", notes: "Similar warmth", compatible: true },
      { substitute: "Mace", ratio: "1:1", notes: "Similar flavor, from same plant", compatible: true }
    ]
  };
  
  const lowerIngredient = ingredient?.toLowerCase() || "";
  const substitutes = substitutesData[lowerIngredient] || [
    { substitute: "No direct substitute found", ratio: "", notes: "Try searching for a specific ingredient", compatible: true }
  ];
  
  // Filter by dietary compatibility if specified
  const filteredSubstitutes = dietary 
    ? substitutes.filter(s => s.compatible === true)
    : substitutes;
  
  res.json({ substitutes: filteredSubstitutes.length > 0 ? filteredSubstitutes : substitutes });
});

// Nutrition Analysis Route
app.post('/api/ai/nutrition', (req, res) => {
  res.json({ nutrition: { calories: 200, protein: 10, carbs: 30, fat: 5, fiber: 3 } });
});

// Analytics Routes
app.get('/api/analytics/recipes', (req, res) => {
  const db = readDb();
  res.json({
    totalRecipes: db.recipes.length,
    totalUsers: db.users.length,
    totalComments: db.comments.length,
    totalRatings: db.ratings.length,
    recentRecipes: db.recipes.slice(-5)
  });
});

app.get('/api/analytics/popular', (req, res) => {
  const db = readDb();
  const recipeStats = db.recipes.map(recipe => {
    const ratings = db.ratings.filter(r => r.recipeId === recipe.id);
    const comments = db.comments.filter(c => c.recipeId === recipe.id);
    const favorites = db.favorites.filter(f => f.recipeId === recipe.id);
    
    return {
      recipe,
      ratingsCount: ratings.length,
      commentsCount: comments.length,
      favoritesCount: favorites.length,
      averageRating: ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0
    };
  });
  
  // Sort by popularity (favorites + ratings + comments)
  recipeStats.sort((a, b) => 
    (b.favoritesCount + b.ratingsCount + b.commentsCount) - 
    (a.favoritesCount + a.ratingsCount + a.commentsCount)
  );
  
  res.json(recipeStats);
});

// Forum Routes
app.get('/api/forum/posts', (req, res) => {
  const db = readDb();
  res.json(db.forumPosts || []);
});

app.post('/api/forum/posts', (req, res) => {
  const db = readDb();
  if (!db.forumPosts) db.forumPosts = [];
  
  const newPost = {
    id: `post${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    replies: []
  };
  db.forumPosts.push(newPost);
  writeDb(db);
  res.status(201).json(newPost);
});

app.post('/api/forum/posts/:id/reply', (req, res) => {
  const db = readDb();
  if (!db.forumPosts) db.forumPosts = [];
  
  const postIndex = db.forumPosts.findIndex(p => p.id === req.params.id);
  if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });
  
  const reply = {
    id: `reply${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  if (!db.forumPosts[postIndex].replies) {
    db.forumPosts[postIndex].replies = [];
  }
  db.forumPosts[postIndex].replies.push(reply);
  writeDb(db);
  res.status(201).json(reply);
});

// Forum Like endpoint
app.post('/api/forum/posts/:id/like', (req, res) => {
  const db = readDb();
  if (!db.forumPosts) db.forumPosts = [];
  
  const postIndex = db.forumPosts.findIndex(p => p.id === req.params.id);
  if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });
  
  // Initialize likes if not present
  if (!db.forumPosts[postIndex].likes) {
    db.forumPosts[postIndex].likes = 0;
  }
  
  // Increment likes
  db.forumPosts[postIndex].likes += 1;
  writeDb(db);
  
  res.json({ 
    message: 'Post liked successfully', 
    likes: db.forumPosts[postIndex].likes 
  });
});

// Collaboration Routes
// Get collaborators for a recipe
app.get('/api/collaboration/recipes/:recipeId/collaborators', (req, res) => {
  const db = readDb();
  const collaborations = (db.collaborations || []).filter(c => c.recipeId === req.params.recipeId);
  res.json({ data: collaborations });
});

// Add collaborator to a recipe
app.post('/api/collaboration/recipes/:recipeId/collaborators', (req, res) => {
  const db = readDb();
  if (!db.collaborations) db.collaborations = [];
  
  const newCollaboration = {
    id: `collab${Date.now()}`,
    recipeId: req.params.recipeId,
    userId: req.body.userId,
    role: req.body.role || 'editor',
    email: req.body.email,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  db.collaborations.push(newCollaboration);
  writeDb(db);
  res.status(201).json(newCollaboration);
});

// Update collaborator role
app.put('/api/collaboration/recipes/:recipeId/collaborators/:collabId', (req, res) => {
  const db = readDb();
  const index = db.collaborations?.findIndex(c => c.id === req.params.collabId);
  if (index === -1 || index === undefined) {
    return res.status(404).json({ message: 'Collaborator not found' });
  }
  
  db.collaborations[index] = { 
    ...db.collaborations[index], 
    role: req.body.role 
  };
  writeDb(db);
  res.json(db.collaborations[index]);
});

// Remove collaborator
app.delete('/api/collaboration/recipes/:recipeId/collaborators/:collabId', (req, res) => {
  const db = readDb();
  if (!db.collaborations) db.collaborations = [];
  
  const index = db.collaborations.findIndex(c => c.id === req.params.collabId);
  if (index === -1) {
    return res.status(404).json({ message: 'Collaborator not found' });
  }
  
  db.collaborations.splice(index, 1);
  writeDb(db);
  res.json({ message: 'Collaborator removed successfully' });
});

// Legacy route support
app.get('/api/collaborations/recipe/:recipeId', (req, res) => {
  const db = readDb();
  res.json(db.collaborations || []);
});

app.post('/api/collaborations', (req, res) => {
  const db = readDb();
  if (!db.collaborations) db.collaborations = [];
  
  const newCollaboration = {
    id: `collab${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  db.collaborations.push(newCollaboration);
  writeDb(db);
  res.status(201).json(newCollaboration);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
