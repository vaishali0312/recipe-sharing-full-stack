$content = Get-Content 'c:\Users\Vaishali Shenisetti\recipe-sharing-frontend\backend\routes\aiRoutes.js' -Raw

# Find the position after the suggest-recipes endpoint and add new endpoints
$marker = "// Nutrition Analysis (still uses local database)"
$newEndpoints = @'

// Generate recipe improvements using AI
router.post("/improve-recipe", async (req, res) => {
  try {
    const { recipe } = req.body;

    if (!recipe) {
      return res.status(400).json({ message: "Recipe is required" });
    }

    const result = await geminiService.generateRecipeImprovements(recipe);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json({ message: result.error || "Failed to generate improvements" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Generate meal plan using AI
router.post("/meal-plan", async (req, res) => {
  try {
    const { calories, diet, days, cuisine } = req.body;

    const preferences = { calories, diet, days: days || 7, cuisine };

    const result = await geminiService.generateMealPlan(preferences);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json({ message: result.error || "Failed to generate meal plan" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Chat with AI
router.post("/chat", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const result = await geminiService.chatAboutRecipe(message, context);

    if (result.success) {
      res.json({ response: result.response });
    } else {
      res.status(500).json({ message: result.error || "Failed to get response" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

'@

$replacement = $newEndpoints + $marker
$newContent = $content -replace [regex]::Escape($marker), $replacement
Set-Content -Path 'c:\Users\Vaishali Shenisetti\recipe-sharing-frontend\backend\routes\aiRoutes.js' -Value $newContent
Write-Host "Added new AI endpoints"
