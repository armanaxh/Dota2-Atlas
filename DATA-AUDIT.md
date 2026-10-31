# Data audit — 31 October 2026

## Sources and scope

All 501 existing records were queried against Valve's public `datafeed/itemdata` endpoint, using their item IDs. Raw responses are retained in `audit/item-<id>.json`. Names, costs, displayed special values, ability text, mana costs, cooldowns and lore were rebuilt from the returned records. This checks consistency with the published feed; it is not a live-match verification of every mechanic.

Recipe definitions and shop flags were checked against tracked Valve game definitions: https://github.com/SteamTracking/GameTracking-Dota2/blob/master/game/dota/pak01_dir/scripts/npc/items.txt

The original OpenDota input remains unchanged in `items.json`; the audited data is in `items-verified.json`.

## Results

- 500 records returned a matching official item record. Every normalized numerical special value and price was checked against its response.
- One historical entry, `diffusal_blade_2`, returned no official record. It is labelled unverified, excluded from shop results, tag matches and efficiency scoring.
- 14 price fields differed, including missing prices normalized to zero and historical items. This does not mean 14 current shop prices changed.
- 23 displayed-stat fields required level selection compared with the original unprocessed source, principally Dagon and Necronomicon. Dagon's previously corrected stat columns remain correct; its damage descriptions, mana costs and cooldowns now also use the proper level.
- Power Treads' selected attribute is no longer treated as three simultaneous attribute bonuses. Its alternate recipes and melee/ranged movement bonuses are preserved.
- Recipe variants include upgrade recipes and duplicate components. No listed component references are missing.
- Shop filtering uses tracked purchasability/obsolete flags and neutral classification, including free Observer Wards, rather than positive gold cost alone.
- 81 Advanced tags and 19 Basic tags have matching data. Tag mappings are curated interpretations of the snapshot, not official Valve classifications or exhaustive guarantees of every interaction.

## Remaining limitations, shown rather than guessed

- Four unresolved description tokens remain in historical Tome of Knowledge and Ascetic's Cap records; their values display as unavailable.
- Five recipe variants have a component sum different from the feed's item price: two ward-stacking variants, Eternal Shroud, historical Medallion of Courage and historical Iron Talon. Source prices are preserved; recipe warnings are shown. Ward stacks are not ordinary fixed-price recipes. Eternal Shroud's tracked components sum to 3,800 while the feed lists 3,900.
- Category names come from the user's saved Liquipedia table and are not official game classifications.
- The official feed and tracked repository may not update simultaneously. Historical/special-mode records remain available under All dataset items.
- Artwork URLs were retained; this audit did not certify every remote image's availability.
- Visual browser QA is unavailable because the browser tool rejects local-file URLs. No alternative route was used to bypass that restriction.

## Gold efficiency

Default off. Scores use `direct bonus / item cost * 1000`, with percentage bonuses expressed as percentage points. Original stat values are retained. No scores are assigned to zero-cost, unverified, missing, negative, multi-value, known conditional, aura, percentage-regeneration or incompatible range bonuses. A blank score is not zero. Scores measure only that stat, not total item usefulness. Invalid scores sort last in both directions.

## Verification

Automated checks cover every tag selection/deselection, category counts, aliases, mode transitions, search, reset, item details, recipe links, recipe quantities, level-specific values, shop flags, efficiency calculation, exclusions, missing-last sorting and restoration of raw mode. All pass.
