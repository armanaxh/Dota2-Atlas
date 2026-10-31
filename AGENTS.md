# Agent handover: Dota2 Atlas

## Start here
This is a static, unofficial Dota 2 item reference and recipe explorer for armanaxh.
Repository: https://github.com/armanaxh/Dota2-Atlas
Live site: https://armanaxh.github.io/Dota2-Atlas/
Read README.md and DATA-AUDIT.md before changing mechanics or data. Treat this document as project context, not evidence that the snapshot is current. Follow the user's current request over historical preferences here.

## Build and verify
Use Node.js 20+ (CI uses 22). No npm packages or backend are required.
Run from repository root:
    npm run build
    npm test
Build regenerates dist; commit source changes and regenerated dist together. Do not implement fixes solely in generated files.
Tests use Node VM and mocked DOM, not real browser rendering. For UI changes also inspect both pages in an allowed browser environment. Never bypass a tool access restriction.
Documentation-only changes do not require extra tests; CI still runs the existing checks.

## Code map
- build.cjs: statistics page generator; HTML, CSS, core stat logic, item dialog and embedded font data.
- build-pages.cjs: splits generated output into shared data, scripts and styles; generates item-tree.html. Invoked by build.cjs.
- items-verified.json: normalized audited snapshot consumed by the app. items.json: preserved original OpenDota input.
- item-types.json: classifications extracted from a saved Liquipedia table.
- tag-config.json: tag definitions and descriptions. tag-engine.js: shared tag matching and UI.
- efficiency.js: individual-stat gold efficiency.
- combined-efficiency.js: combined statistical valuation and explanation.
- tree-graph.js: recipe graph indexes. tree-page.js: graph interactions/rendering. tree-style.css: styling.
- check-advanced-tags.cjs and check-tree.cjs: regression checks.
- dist/: static publishable files; index.html and item-tree.html share local scripts/data/CSS.
Some generator code is compact and uses string extraction markers; check those markers when refactoring.

## Product decisions to preserve
- Minimal Dota-inspired dark theme, legible bold numbers, restrained styling.
- Gold values may be yellow; other item/stat text should not all be yellow.
- Item icons are about 48px (enlarged from the original).
- Let the browser handle table dimensions and scrolling. Do not crop the table with fixed-height or fixed-width containers.
- Use property icons where available, accessible names, and descriptive themed hover tooltips. HP stays text.
- Show a single direction arrow only on the actively sorted column. No unsorted double arrows.
- Organize statistics into attributes, resources (HP, Mana and regeneration), attack and defence. Movement Speed belongs with attack as in the user's reference.
- Resistance is labelled Magic Resist. Attack interval and Physical Resist were deliberately removed: these are hero-derived, not useful independent item stats. Armor remains.
- Keep HP regeneration separate from healing effects and healing amplification.
- Default scope is purchasable shop items, not merely items with positive prices. All dataset items includes historical/special records.
- Levelled items such as Dagon must show their own level's values, not the full level array.
- Large search field, item type selector, reset, and categorized tag chips.
- Basic mode: 5 categories, 19 tags. Advanced: 10 categories, 81 tags. Same category-and-chip layout and explanatory tooltips. Current selection is a single tag.
- Basic categories: Health & Mana; Defence; Offence; Control & Counters; Mobility & Vision.
- Item dialog: Dota-like details with icon, price, bonuses, active/passive abilities, notes, lore, recipe components and upgrades.
- Both pages link to each other and preserve relevant item/tag/scope query parameters.

## Tree behaviour
Full left-to-right dependency graph: ingredients -> selected item -> upgrades.
Show complete ingredients and upgrades as graph nodes, including extra ingredients for upgrades and duplicate quantities.
Do not replace ingredients with collapsed lists inside item cards. Do not add in-card expand buttons.
Matching finished items appear above Start with; matching finished items are enabled/expanded by default.
Standalone items are separate and initially collapsed. Clarity is standalone, not a finished assembled item.
Preserve alternate recipes, cycle protection, selected/matching/required-only styling, curved connectors and search/tag conflict explanation.
Zoom and owned-component planning were suggestions, not implemented features.

## Data provenance and limitations
Snapshot: 2026-10-31. There is no automatic data refresh.
Official item feed: https://www.dota2.com/datafeed/itemdata?language=english&item_id=ITEM_ID
Tracked Valve game definitions: https://github.com/SteamTracking/GameTracking-Dota2/blob/master/game/dota/pak01_dir/scripts/npc/items.txt
Prefer Valve values and documented definitions over third-party tables. Cite date and sources when refreshing.
501 original records were checked; 500 matched. Historical diffusal_blade_2 is unverified and excluded from shop results, tags and efficiency.
Power Treads' selected attribute is not three simultaneous bonuses. Preserve level selection and melee/ranged distinctions.
Recipe sums have five known mismatching variants (two ward stacking variants, Eternal Shroud, historical Medallion, historical Iron Talon); do not silently invent corrected prices.
Four historical description tokens remain unresolved; show unavailable instead of guessing.
Categories and tag mappings are curated, not official Valve classifications.
Raw audit downloads and one-off refresh scripts were kept locally in ignored audit/; they are NOT in GitHub. A future data refresh needs a reproducible updater or fresh retrieval. Current builds need no audit directory.
DATA-AUDIT.md records historical verification; it does not certify every current patch, remote image, or in-game interaction.

## Gold efficiency
Individual mode is off by default: direct bonus / cost * 1000. Percentage stats use percentage points.
Exclude zero cost, missing/unverified/negative, incompatible multi-value, conditional/aura or otherwise unsupported bonuses. Missing scores sort last, never as zero.
Combined statistical efficiency uses 13 single-stat reference items and a reference-value sum / cost * 100 model.
Avoid counting both attributes and their derived hero stats. Explain excluded active/utility effects. Neither score is total item strength or a universal buying recommendation.

## Hosting and access
.github/workflows/pages.yml builds, tests and deploys only dist to GitHub Pages on pushes to main or manual dispatch.
Pages Source is GitHub Actions. Initial deployment and both pages were verified on 2026-10-31.
Use repository-relative asset links so the /Dota2-Atlas/ subpath works.
Read the current remote head before publishing; preserve other contributors' changes. Do not force-push.
GitHub connector access was used for initial upload. No Git CLI was available in the original local environment; its manually initialized .git directory was not synchronized with remote commits. For new work, use a fresh clone or a properly synchronized checkout, not assumptions about that old local Git state.
No project-specific API keys are required. Use the user's authorized GitHub connection; never commit credentials or ask for passwords/tokens in this file. Do not invite guessed accounts called Codex/OpenAI. A separate collaborator requires an explicitly identified GitHub account.
Ignored: .local-archive/, .openai/, audit/, zip files, tag-coverage.json, node_modules/, .env files. Never upload local hosting identity, credential caches or unrelated files.

## Known follow-up: asset licensing
The project is a free unofficial fan reference, not affiliated with Valve.
Embedded Dota/Radiance font redistribution rights have NOT been verified. Review or replace with a suitably licensed font.
Review third-party icons and copied text for licensing/attribution. Add a clear fan-project/ownership notice to both visible pages; README alone is insufficient visibility.
These are open follow-ups, not completed legal clearance. Do not describe the repository as fully licence-audited, or apply an open-source licence to Valve/third-party assets without rights.
A pattern scan of the initial 30 uploaded files found no recognizable credentials; this is not a guarantee against every secret format.

## Collaboration
Keep user updates clear and concise. Explain changes and verification, distinguish actual completed deployment from an upload attempt, and preserve these decisions unless the user asks to revise them.
