@echo off
chcp 65001 >NUL
cd /d "C:\Users\pc\Documents\GitHub\livestock-os"

echo === Creating branch feat/auth-complete-v2 ===
git checkout -b feat/auth-complete-v2 2>NUL
if %errorlevel% neq 0 (
  echo Branch already exists, switching...
  git checkout feat/auth-complete-v2
)

echo.
echo === Staging all files ===
git add -A
git status --short

echo.
echo === Committing ===
git commit -m "feat: LivestockOS v2 - auth + mouvements + marche + rapports + demo" -m "- Auth Supabase complete + middleware protection /dashboard" -m "- /mouvements : journal ventes/achats/transferts FCFA" -m "- /marche : prix temps reel avec tendances et recommandations" -m "- /rapports : LineChart valeur troupeau + BarChart ventes" -m "- /onboarding : guide 4 etapes + mode demo" -m "- vercel.json" -m "Co-authored-by: Claude <claude@anthropic.com>"

echo.
echo === Pushing to origin ===
git push -u origin feat/auth-complete-v2

echo.
echo === Done! Branch pushed. ===
echo Now create a PR at: https://github.com/dosteeve2-hash/livestock-os/compare/feat/auth-complete-v2
echo.
pause
