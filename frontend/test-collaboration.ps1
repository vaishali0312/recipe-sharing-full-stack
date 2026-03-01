$body = @{userId='testuser';role='editor';email='test@example.com'} | ConvertTo-Json
$response = Invoke-WebRequest -Uri 'http://localhost:5000/api/collaboration/recipes/test123/collaborators' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"
