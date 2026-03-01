$body = @{
    title = "Test Recipe HTML"
    ingredients = "ingredient 1"
    instructions = "<p>Step 1</p><p>Step 2</p>"
    category = "Test"
    servings = 2
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:5000/api/recipes' -Method Post -Body $body -ContentType 'application/json'
