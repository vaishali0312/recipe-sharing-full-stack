$body = @{value=5;userId='testuser'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri 'http://localhost:5000/api/ratings/recipe/test123' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"
