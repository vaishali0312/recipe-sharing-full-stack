// Expanded ingredient substitutes database - 20+ common ingredients
// Each ingredient has multiple substitutes with dietary options

export const substitutes = {
  // Dairy
  butter: [
    { substitute: "Coconut Oil", ratio: "1:1", notes: "Great for baking", dietary: ["vegan", "dairy_free"] },
    { substitute: "Olive Oil", ratio: "3/4:1", notes: "Good for savory dishes", dietary: ["vegan", "dairy_free"] },
    { substitute: "Applesauce", ratio: "1/2:1", notes: "Adds moisture", dietary: ["vegan", "dairy_free", "low_fat"] },
    { substitute: "Avocado", ratio: "1:1", notes: "Healthy fats", dietary: ["vegan", "dairy_free"] },
    { substitute: "Greek Yogurt", ratio: "1:1", notes: "Tangy, good for baking", dietary: ["vegetarian"] }
  ],
  milk: [
    { substitute: "Almond Milk", ratio: "1:1", notes: "Light, nutty flavor", dietary: ["vegan", "dairy_free", "nut_free"] },
    { substitute: "Oat Milk", ratio: "1:1", notes: "Creamy texture", dietary: ["vegan", "dairy_free", "nut_free"] },
    { substitute: "Coconut Milk", ratio: "1:1", notes: "Rich and creamy", dietary: ["vegan", "dairy_free"] },
    { substitute: "Soy Milk", ratio: "1:1", notes: "High protein", dietary: ["vegan", "dairy_free"] },
    { substitute: "Rice Milk", ratio: "1:1", notes: "Light and sweet", dietary: ["vegan", "dairy_free", "nut_free"] }
  ],
  cream: [
    { substitute: "Coconut Cream", ratio: "1:1", notes: "Rich and thick", dietary: ["vegan", "dairy_free"] },
    { substitute: "Cashew Cream", ratio: "1:1", notes: "Creamy and neutral", dietary: ["vegan", "dairy_free"] },
    { substitute: "Silken Tofu", ratio: "1:1", notes: "Blend until smooth", dietary: ["vegan", "dairy_free"] }
  ],
  cheese: [
    { substitute: "Nutritional Yeast", ratio: "1:1", notes: "Cheesy flavor", dietary: ["vegan", "dairy_free"] },
    { substitute: "Cashew Cheese", ratio: "1:1", notes: "Creamy texture", dietary: ["vegan", "dairy_free"] },
    { substitute: "Tofu Cheese", ratio: "1:1", notes: "Firm, good for melting", dietary: ["vegan", "dairy_free"] }
  ],
  sour_cream: [
    { substitute: "Greek Yogurt", ratio: "1:1", notes: "Tangy and creamy", dietary: ["vegetarian"] },
    { substitute: "Coconut Cream + Lemon", ratio: "1:1", notes: "Mix with lemon juice", dietary: ["vegan", "dairy_free"] },
    { substitute: "Cashew Sour Cream", ratio: "1:1", notes: "Blend cashews with vinegar", dietary: ["vegan", "dairy_free"] }
  ],
  yogurt: [
    { substitute: "Coconut Yogurt", ratio: "1:1", notes: "Creamy, probiotic", dietary: ["vegan", "dairy_free"] },
    { substitute: "Soy Yogurt", ratio: "1:1", notes: "High protein, tangy", dietary: ["vegan", "dairy_free"] },
    { substitute: "Almond Yogurt", ratio: "1:1", notes: "Light and creamy", dietary: ["vegan", "dairy_free"] }
  ],
  buttermilk: [
    { substitute: "Milk + Lemon Juice", ratio: "1 cup + 1 tbsp", notes: "Let sit 5 minutes", dietary: ["vegetarian"] },
    { substitute: "Milk + Vinegar", ratio: "1 cup + 1 tbsp", notes: "White vinegar works best", dietary: ["vegetarian"] },
    { substitute: "Plant Milk + Lemon", ratio: "1:1", notes: "Same method as dairy", dietary: ["vegan", "dairy_free"] }
  ],
  heavy_cream: [
    { substitute: "Coconut Cream", ratio: "1:1", notes: "Rich and thick", dietary: ["vegan", "dairy_free"] },
    { substitute: "Cashew Cream", ratio: "1:1", notes: "Blend cashews with water", dietary: ["vegan", "dairy_free"] },
    { substitute: "Evaporated Milk", ratio: "1:1", notes: "Lower fat option", dietary: ["vegetarian"] }
  ],

  // Eggs & Binders
  eggs: [
    { substitute: "Flax Egg", ratio: "1 tbsp flax + 3 tbsp water", notes: "Best for baking", dietary: ["vegan"] },
    { substitute: "Chia Egg", ratio: "1 tbsp chia + 3 tbsp water", notes: "Similar to flax", dietary: ["vegan"] },
    { substitute: "Banana", ratio: "1/2 per egg", notes: "Adds sweetness", dietary: ["vegan"] },
    { substitute: "Applesauce", ratio: "1/4 cup per egg", notes: "Adds moisture", dietary: ["vegan"] },
    { substitute: "Silken Tofu", ratio: "1/4 cup per egg", notes: "Neutral flavor", dietary: ["vegan"] },
    { substitute: "Aquafaba", ratio: "3 tbsp per egg", notes: "Chickpea liquid", dietary: ["vegan"] }
  ],

  // Sweeteners
  sugar: [
    { substitute: "Honey", ratio: "3/4:1", notes: "Reduce liquid", dietary: ["vegetarian"] },
    { substitute: "Maple Syrup", ratio: "3/4:1", notes: "Reduce liquid", dietary: ["vegan", "dairy_free"] },
    { substitute: "Stevia", ratio: "1 tsp per cup", notes: "Very sweet", dietary: ["vegan", "dairy_free", "keto"] },
    { substitute: "Coconut Sugar", ratio: "1:1", notes: "Lower glycemic", dietary: ["vegan", "dairy_free"] },
    { substitute: "Monk Fruit", ratio: "1/2 tsp per cup", notes: "Zero-calorie", dietary: ["vegan", "dairy_free", "keto"] }
  ],
  honey: [
    { substitute: "Maple Syrup", ratio: "1:1", notes: "Similar consistency", dietary: ["vegan", "dairy_free"] },
    { substitute: "Agave Nectar", ratio: "1:1", notes: "Very sweet", dietary: ["vegan", "dairy_free"] },
    { substitute: "Date Syrup", ratio: "1:1", notes: "Caramel-like", dietary: ["vegan", "dairy_free"] }
  ],

  // Flours & Starches
  flour: [
    { substitute: "Almond Flour", ratio: "1:1", notes: "Gluten-free, nutty", dietary: ["gluten_free", "vegetarian"] },
    { substitute: "Rice Flour", ratio: "1:1", notes: "Gluten-free", dietary: ["gluten_free", "vegetarian"] },
    { substitute: "Oat Flour", ratio: "1:1", notes: "Blend oats", dietary: ["vegetarian"] },
    { substitute: "Coconut Flour", ratio: "1/4:1", notes: "Very absorbent", dietary: ["gluten_free", "vegetarian"] },
    { substitute: "GF Flour Blend", ratio: "1:1", notes: "Best for most recipes", dietary: ["gluten_free", "vegetarian"] }
  ],
  cornstarch: [
    { substitute: "Arrowroot Powder", ratio: "1:1", notes: "Works at lower temps", dietary: ["vegan", "dairy_free", "gluten_free"] },
    { substitute: "Tapioca Starch", ratio: "1:1", notes: "Glossy finish", dietary: ["vegan", "dairy_free", "gluten_free"] },
    { substitute: "Potato Starch", ratio: "1:1", notes: "Good for baking", dietary: ["vegan", "dairy_free", "gluten_free"] }
  ],
  baking_powder: [
    { substitute: "Baking Soda + Cream of Tartar", ratio: "1/4 tsp + 1/2 tsp per 1 tsp", notes: "Mix immediately", dietary: ["vegan", "dairy_free"] },
    { substitute: "Baking Soda + Lemon Juice", ratio: "1/2 tsp + 1 tsp per 1 tsp", notes: "Use immediately", dietary: ["vegan", "dairy_free"] }
  ],
  yeast: [
    { substitute: "Baking Powder", ratio: "1 tsp per packet", notes: "For quick breads only", dietary: ["vegan", "dairy_free"] },
    { substitute: "Sourdough Starter", ratio: "1:1", notes: "Longer rising time", dietary: ["vegan", "dairy_free"] }
  ],

  // Fats & Oils
  oil: [
    { substitute: "Butter", ratio: "1:1", notes: "Adds richness", dietary: ["vegetarian"] },
    { substitute: "Applesauce", ratio: "1:1", notes: "For baking, lower fat", dietary: ["vegan", "dairy_free", "low_fat"] },
    { substitute: "Mashed Avocado", ratio: "1:1", notes: "Healthy fats", dietary: ["vegan", "dairy_free"] },
    { substitute: "Greek Yogurt", ratio: "1:1", notes: "Creamy, adds protein", dietary: ["vegetarian"] }
  ],
  vegetable_oil: [
    { substitute: "Coconut Oil", ratio: "1:1", notes: "Solid at room temp", dietary: ["vegan", "dairy_free"] },
    { substitute: "Olive Oil", ratio: "3/4:1", notes: "Good for savory", dietary: ["vegan", "dairy_free"] },
    { substitute: "Avocado Oil", ratio: "1:1", notes: "Neutral, high smoke point", dietary: ["vegan", "dairy_free"] }
  ],

  // Condiments & Seasonings
  vinegar: [
    { substitute: "Lemon Juice", ratio: "1:1", notes: "Similar acidity", dietary: ["vegan", "dairy_free"] },
    { substitute: "Lime Juice", ratio: "1:1", notes: "Works in most recipes", dietary: ["vegan", "dairy_free"] },
    { substitute: "Apple Cider Vinegar", ratio: "1:1", notes: "Similar tang", dietary: ["vegan", "dairy_free"] }
  ],
  soy_sauce: [
    { substitute: "Tamari", ratio: "1:1", notes: "Gluten-free alternative", dietary: ["vegan", "dairy_free", "gluten_free"] },
    { substitute: "Coconut Aminos", ratio: "1:1", notes: "Gluten-free, less sodium", dietary: ["vegan", "dairy_free", "gluten_free"] },
    { substitute: "Liquid Aminos", ratio: "1:1", notes: "Similar flavor", dietary: ["vegan", "dairy_free"] }
  ],
  garlic: [
    { substitute: "Garlic Powder", ratio: "1/8 tsp per clove", notes: "More potent", dietary: ["vegan", "dairy_free", "low_fodmap"] },
    { substitute: "Shallots", ratio: "1 small per clove", notes: "Milder flavor", dietary: ["vegan", "dairy_free"] },
    { substitute: "Asafoetida", ratio: "Small pinch", notes: "Strong when cooked", dietary: ["vegan", "dairy_free", "low_fodmap"] }
  ],
  onion: [
    { substitute: "Shallots", ratio: "1:1", notes: "Milder, sweeter", dietary: ["vegan", "dairy_free"] },
    { substitute: "Green Onions", ratio: "1:1", notes: "Less strong", dietary: ["vegan", "dairy_free"] },
    { substitute: "Onion Powder", ratio: "1 tbsp per onion", notes: "Use sparingly", dietary: ["vegan", "dairy_free", "low_fodmap"] }
  ],
  lemon: [
    { substitute: "Lime", ratio: "1:1", notes: "Similar acidity", dietary: ["vegan", "dairy_free"] },
    { substitute: "Orange", ratio: "1:1", notes: "Sweeter", dietary: ["vegan", "dairy_free"] },
    { substitute: "White Wine Vinegar", ratio: "1:1", notes: "For cooking only", dietary: ["vegan", "dairy_free"] }
  ],
  lime: [
    { substitute: "Lemon", ratio: "1:1", notes: "Similar acidity", dietary: ["vegan", "dairy_free"] },
    { substitute: "Grapefruit", ratio: "1:1", notes: "Tarter", dietary: ["vegan", "dairy_free"] }
  ],

  // Grains & Pasta
  bread_crumbs: [
    { substitute: "Rolled Oats", ratio: "1:1", notes: "Process briefly", dietary: ["vegetarian"] },
    { substitute: "Crushed Crackers", ratio: "1:1", notes: "Salted or unsalted", dietary: ["vegetarian"] },
    { substitute: "Almond Flour", ratio: "1:1", notes: "Gluten-free coating", dietary: ["gluten_free", "vegetarian"] },
    { substitute: "Panko", ratio: "1:1", notes: "Extra crispy", dietary: ["vegetarian"] }
  ],
  pasta: [
    { substitute: "Zucchini Noodles", ratio: "1:1", notes: "Low carb", dietary: ["vegan", "dairy_free", "keto", "low_carb"] },
    { substitute: "Rice Noodles", ratio: "1:1", notes: "Gluten-free", dietary: ["vegan", "dairy_free", "gluten_free"] },
    { substitute: "Spiralized Squash", ratio: "1:1", notes: "Spaghetti squash", dietary: ["vegan", "dairy_free", "keto"] },
    { substitute: "Chickpea Pasta", ratio: "1:1", notes: "Higher protein", dietary: ["vegan", "dairy_free", "gluten_free"] },
    { substitute: "Quinoa Pasta", ratio: "1:1", notes: "Gluten-free", dietary: ["vegan", "dairy_free", "gluten_free"] }
  ],
  rice: [
    { substitute: "Cauliflower Rice", ratio: "1:1", notes: "Low carb", dietary: ["vegan", "dairy_free", "keto", "low_carb"] },
    { substitute: "Quinoa", ratio: "1:1", notes: "Higher protein", dietary: ["vegan", "dairy_free", "gluten_free"] },
    { substitute: "Basmati Rice", ratio: "1:1", notes: "Fragrant", dietary: ["vegan", "dairy_free", "gluten_free"] },
    { substitute: "Wild Rice", ratio: "1:1", notes: "Nuttier flavor", dietary: ["vegan", "dairy_free", "gluten_free"] }
  ],

  // Baking Ingredients
  chocolate: [
    { substitute: "Carob", ratio: "1:1", notes: "Caffeine-free", dietary: ["vegan", "dairy_free"] },
    { substitute: "Cocoa Powder + Sugar", ratio: "1:1", notes: "Mix with sweetener", dietary: ["vegan", "dairy_free"] },
    { substitute: "Dark Chocolate 70%+", ratio: "1:1", notes: "Check for dairy-free", dietary: ["vegan", "dairy_free"] },
    { substitute: "Cacao Nibs", ratio: "1:1", notes: "Crunchy, intense", dietary: ["vegan", "dairy_free", "raw"] }
  ],
  vanilla: [
    { substitute: "Maple Syrup", ratio: "1:1", notes: "Distinct flavor", dietary: ["vegan", "dairy_free"] },
    { substitute: "Almond Extract", ratio: "1/2:1", notes: "Much stronger", dietary: ["vegan", "dairy_free"] }
  ],
  cinnamon: [
    { substitute: "Nutmeg", ratio: "1/4:1", notes: "Warmer, sweeter", dietary: ["vegan", "dairy_free"] },
    { substitute: "Pumpkin Pie Spice", ratio: "1:1", notes: "Contains cinnamon", dietary: ["vegan", "dairy_free"] },
    { substitute: "Allspice", ratio: "1/2:1", notes: "More intense", dietary: ["vegan", "dairy_free"] },
    { substitute: "Ginger", ratio: "1/2:1", notes: "More zesty", dietary: ["vegan", "dairy_free"] }
  ],
  nutmeg: [
    { substitute: "Cinnamon", ratio: "2:1", notes: "Milder", dietary: ["vegan", "dairy_free"] },
    { substitute: "Allspice", ratio: "1:1", notes: "Similar warmth", dietary: ["vegan", "dairy_free"] },
    { substitute: "Mace", ratio: "1:1", notes: "From same plant", dietary: ["vegan", "dairy_free"] }
  ]
};

// Helper function to get substitutes for an ingredient
export const getSubstitutes = (ingredient, dietary = null) => {
  const key = ingredient?.toLowerCase().replace(/\s+/g, '_') || '';
  const options = substitutes[key] || [];
  
  if (!dietary) {
    return options;
  }
  
  // Filter by dietary preference
  return options.filter(opt => 
    !opt.dietary || opt.dietary.includes(dietary.toLowerCase())
  );
};

export default substitutes;
