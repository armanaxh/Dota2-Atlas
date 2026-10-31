# Dota2 Atlas

Static Dota 2 item statistics and graphical recipe explorer.

## Run locally
Open dist/index.html or dist/item-tree.html in a browser. Keep the dist files together.
No dependencies or backend are required. Item artwork loads from Valve's CDN.

## Build and check
With Node.js 20 or later:

    npm run build
    npm test

Commit source changes and the regenerated dist files together.

## GitHub Pages
Push this project root to armanaxh/Dota2-Atlas. In repository Settings > Pages,
choose GitHub Actions as the publishing source. The included workflow checks the
project and publishes dist on pushes to main or manual runs.

## Files
- dist/: publishable website and shared local assets
- build.cjs, build-pages.cjs: reproducible website generation
- items-verified.json: audited item snapshot; items.json: original input
- tag-config.json, tag-engine.js: shared tag definitions and matching logic
- tree-*.js, tree-style.css: recipe graph and interface
- efficiency.js, combined-efficiency.js: valuation logic
- check-*.cjs: regression checks
- DATA-AUDIT.md: source provenance and known limitations

Old one-off editing scripts, duplicate upload packages and archives are retained
locally in .local-archive and excluded from Git. Downloaded audit evidence and
former hosting metadata are also excluded. No credentials should be committed.

Data snapshot: 31 October 2026. This is an unofficial fan project. Dota 2 artwork
and fonts belong to Valve. No automatic data refresh is configured.
