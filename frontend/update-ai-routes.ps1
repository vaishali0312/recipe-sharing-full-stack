$content = Get-Content 'c:\Users\Vaishali Shenisetti\recipe-sharing-frontend\backend\routes\aiRoutes.js' -Raw
$newContent = $content -replace 'const router = express.Router\(\);', 'const router = express.Router();`nconst geminiService = require("../services/geminiService");'
Set-Content -Path 'c:\Users\Vaishali Shenisetti\recipe-sharing-frontend\backend\routes\aiRoutes.js' -Value $newContent
Write-Host "Updated aiRoutes.js with geminiService import"
