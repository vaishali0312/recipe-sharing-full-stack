$response = Invoke-WebRequest -Uri 'http://localhost:5000/api/ratings/recipe/test123' -Method GET -UseBasicParsing
Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"
