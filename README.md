# NITT Central Library E-Book Discovery Portal

GitHub Pages-compatible static website.

## Data
Generated from `Total E-Book.xlsx`, Sheet1. Source rows: 3287. Unique records included: 3232.

## Files
- index.html
- data/ebooks.json
- assets/style.css
- assets/app.js
- .nojekyll

## GitHub Pages
GitHub Pages serves static HTML/CSS/JavaScript files. It does not run PHP/MySQL.

Upload the contents of this folder to the root of your repository, then:
1. GitHub repository → Settings
2. Pages
3. Build and deployment → Deploy from a branch
4. Branch: `main`
5. Folder: `/ (root)`
6. Save
7. Open the generated Pages URL.

Do not upload the original Excel file if you don't want the raw source data publicly accessible. The website uses only `data/ebooks.json`.

If `ebooks.json` is changed, refresh the page with Ctrl+F5 after GitHub Pages redeploys.
