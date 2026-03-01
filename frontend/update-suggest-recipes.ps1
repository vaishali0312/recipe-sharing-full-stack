$content = Get-Content 'c:\Users\Vaishali Shenisetti\recipe-sharing-frontend\backend\routes\aiRoutes.js' -Raw

# Replace the old suggest-recipes endpoint with the new one that uses Gemini
$oldCode = @'
// AI Recipe Suggestions
router.post("/suggest-recipes", async (req, res) => {
  try {
    const { ingredients, dietary_preference } = req.body;

    console.log("Received AI request:", ingredients, dietary_preference);

    // Temporary mock response
    const suggestions = ingredients.map((ingredient, idx) => ({
      title: `${ingredient} Delight`,
      description: `A tasty recipe with ${ingredient}`,
      match_score: Math.floor(Math.random() * 100),
      cooking_time: 30 + idx * 5,
      ingredients: [ingredient],
    }));

    res.json({ suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
'@

$newCode = @'
// AI Recipe Suggestions - Now uses Gemini AI
router.post("/suggest-recipes", async (req, res) => {
  try {
    const { ingredients, dietary_preference } = req.body;

    console.log("Received AI request:", ingredients, dietary_preference);

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: "Ingredients array is required" });
    }

    // Use Gemini AI to generate recipe suggestions
    const result = await geminiService.suggestRecipesByIngredients(ingredients, dietary_preference);

    if (result.success) {
      res.json({ 
        suggestions: result.suggestions,
        message: "AI-powered recipe suggestions"
      });
    } else {
      // Fallback to mock response if AI fails
      console.error("Gemini API failed:", result.error);
      const suggestions = ingredients.map((ingredient, idx) => ({
        title: `${ingredient} Delight`,
        description: `A tasty recipe with ${ingredient}`,
        match_score: Math.floor(Math.random() * 100),
        cooking_time: 30 + idx * 5,
        ingredients: [ingredient],
      }));
      res.json({ suggestions, message: "Fallback suggestions" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
'@

$newContent = $content -replace [regex]::Escape($oldCode), $newCode
Set-Content -Path 'c:\Users\Vaishali Shenisetti\recipe-sharing-frontend\backend\routes\aiRoutes.js' -Value $newContent
Write-Host "Updated suggest-recipes endpoint"
