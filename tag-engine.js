const BASIC_TAGS=TAG_CONFIG.basic,ADVANCED_TAG_GROUPS=TAG_CONFIG.groups;
const BASIC_TAG_GROUPS=[
{name:'Health & Mana',ids:['max-hp','hp-regeneration','attack-lifesteal','spell-lifesteal','instant-heal','max-mana','mana-regeneration']},
{name:'Defence',ids:['armor','magic-resistance','dispel']},
{name:'Offence',ids:['attack-damage','attack-speed','spell-amplification','true-strike-accuracy']},
{name:'Control & Counters',ids:['stun','silence','healing-reduction']},
{name:'Mobility & Vision',ids:['movement-speed','invisibility-detection']}
].map(g=>({...g,tags:g.ids.map(id=>BASIC_TAGS.find(t=>t.id===id))}));
const ALL_TAGS=ADVANCED_TAG_GROUPS.flatMap(g=>g.tags);
let tagMode='basic',activeTagId=null;
const STAT_TAGS={'strength':'STR','agility':'AGI','intelligence':'INT','max-hp':'HP','max-mana':'Mana','hp-regeneration':'Hp Regen','mana-regeneration':'Mana Regen','armor':'Armor','evasion':'Evasion','magic-resistance':'Magic Resist','attack-damage':'Damage','attack-speed':'Attack Speed','spell-amplification':'Spell Amp','movement-speed':'Move speed','attack-range':'Attack Range','status-resistance':'Status Resist','slow-resistance':'Slow Resist'};
const ATTR_TAGS={'all-attributes':['bonus_all_stats','bonus_stats','all_stats'],'attack-lifesteal':['lifesteal_percent','attack_lifesteal','bonus_lifesteal'],'spell-lifesteal':['spell_lifesteal','bonus_spell_lifesteal'],'healing-amplification':['hp_regen_amp','heal_amp'],'mana-regen-amplification':['mana_regen_multiplier'],'cast-range':['cast_range_bonus','bonus_cast_range'],'cooldown-reduction':['bonus_cooldown','cooldown_reduction']};
// Explicit mappings audited against this snapshot's ability descriptions, not free-text keyword matches.
// Effects include active, passive and conditional abilities; consult each item's details for restrictions.
const CURATED={
'strength':['power_treads'],'agility':['power_treads'],'intelligence':['power_treads'],'all-attributes':[],
'hp-regeneration':['flask','tango','tango_single','bottle','mekansm','headdress','urn_of_shadows','spirit_vessel','essence_distiller','guardian_greaves','ancient_janggo','boots_of_bearing'],
'mana-regeneration':['clarity','bottle','vladmir','ring_of_basilius','arcane_boots','guardian_greaves'],
'instant-heal':['faerie_fire','cheese','magic_stick','magic_wand','holy_locket','mekansm','guardian_greaves','arcane_blink'],
'attack-lifesteal':['lifesteal','vladmir','satanic','mask_of_madness'],
'spell-lifesteal':['voodoo_mask','bloodstone'],
'healing-amplification':['holy_locket'],
'ally-healing':['flask','bottle','mekansm','holy_locket','urn_of_shadows','spirit_vessel','essence_distiller','headdress','guardian_greaves','ancient_janggo','boots_of_bearing'],
'damage-barrier':['pipe','glimmer_cape','pavise','solar_crest','consecrated_wraps'],
'death-protection':['aegis','aeon_disk'],
'instant-mana':['cheese','magic_stick','magic_wand','holy_locket','arcane_blink','soul_ring','arcane_boots','guardian_greaves','enchanted_mango'],
'ally-mana-restoration':['holy_locket','arcane_boots','guardian_greaves','bottle'],
'mana-from-spell-damage-taken':['eternal_shroud'],
'armor':['buckler','vladmir','assault','solar_crest','armlet'],
'attack-damage-block':['stout_shield','vanguard','crimson_guard'],
'physical-barrier':['pavise','solar_crest'],
'ethereal-protection':['ghost','ethereal_blade','crellas_crozier'],
'damage-reflection':['blade_mail'],
'magic-resistance':['pipe','black_king_bar','eternal_shroud'],
'magic-barrier':['pipe','glimmer_cape'],
'enemy-spell-damage-reduction':['mage_slayer'],
'debuff-immunity':['black_king_bar'],
'status-resistance':['aeon_disk'],
'self-dispel':['black_king_bar','cyclone','wind_waker','lotus_orb','aeon_disk','manta','satanic','disperser','guardian_greaves'],
'strong-self-dispel':['aeon_disk'],
'ally-dispel':['wind_waker','lotus_orb','disperser'],
'spell-block':['sphere','mirror_shield'],
'spell-reflection':['lotus_orb','mirror_shield'],
'attack-damage':['vladmir','armlet','rapier','invis_sword','silver_edge'],
'attack-speed':['moon_shard','hurricane_pike','mask_of_madness','ancient_janggo','boots_of_bearing','solar_crest','assault'],
'critical-strike':['greater_crit','lesser_crit','revenants_brooch'],
'armor-reduction':['desolator','blight_stone','orb_of_corrosion','assault'],
'true-strike-accuracy':['javelin','monkey_king_bar','bloodthorn','witch_blade','devastator','maelstrom','mjollnir'],
'attack-range':['hurricane_pike'],
'cleave':['bfury'],
'multi-target-attack-damage':['bfury','maelstrom','mjollnir','specialists_array','hydras_breath'],
'building-damage':['meteor_hammer','assault'],
'spell-amplification':['rapier'],
'instant-spell-damage':['dagon','dagon_2','dagon_3','dagon_4','dagon_5','ethereal_blade','phylactery','angels_demise','shivas_guard','blood_grenade','overwhelming_blink'],
'aoe-spell-damage':['shivas_guard','meteor_hammer','radiance','blood_grenade','overwhelming_blink','maelstrom','mjollnir'],
'magic-resistance-reduction':['ethereal_blade','devastator'],
'cooldown-reset':['refresher','refresher_shard'],
'movement-speed':['swift_blink','phase_boots','invis_sword','silver_edge','mask_of_madness','disperser','ancient_janggo','boots_of_bearing','solar_crest','glimmer_cape','consecrated_wraps','crellas_crozier','smoke_of_deceit'],
'blink':['blink','overwhelming_blink','swift_blink','arcane_blink'],
'self-forced-movement':['force_staff','hurricane_pike','harpoon'],
'ally-forced-movement':['force_staff','hurricane_pike'],
'enemy-forced-movement':['force_staff','hurricane_pike','harpoon'],
'map-teleportation':['tpscroll','travel_boots','travel_boots_2'],
'invisibility':['invis_sword','silver_edge','shadow_amulet','glimmer_cape','smoke_of_deceit'],
'slow-resistance':['mask_of_madness','disperser','boots_of_bearing'],
'stun':['basher','abyssal_blade','meteor_hammer'],
'silence':['orchid','bloodthorn','sheepstick'],
'root':['rod_of_atos','gungir'],
'movement-slow':['overwhelming_blink','blood_grenade','dust','phylactery','angels_demise','witch_blade','devastator','echo_sabre','harpoon','shivas_guard','meteor_hammer','nullifier','skadi','diffusal_blade','disperser','ethereal_blade','orb_of_corrosion','orb_of_frost','silver_edge','sheepstick'],
'attack-speed-slow':['overwhelming_blink','shivas_guard','skadi'],
'hex':['sheepstick'],
'disarm':['heavens_halberd','ethereal_blade','sheepstick'],
'break':['silver_edge','angels_demise'],
'mana-burn':['diffusal_blade','disperser','necronomicon','necronomicon_2','necronomicon_3'],
'healing-reduction':['spirit_vessel','skadi','orb_of_corrosion','orb_of_frost','crellas_crozier'],
'enemy-buff-dispel':['nullifier','cyclone','wind_waker','disperser','necronomicon_3'],
'vision':['ward_observer','ward_dispenser','gem','moon_shard','essence_distiller'],
'invisibility-detection':['ward_sentry','ward_dispenser','gem','dust','essence_distiller','necronomicon_3'],
'ally-save':['force_staff','hurricane_pike','glimmer_cape','wind_waker','ethereal_blade','sphere','lotus_orb','pavise','solar_crest','pipe'],
 'team-armor':['buckler','vladmir','assault','solar_crest'],
 'team-magic-protection':['pipe','glimmer_cape'],
 'team-healing':['mekansm','guardian_greaves','headdress','ancient_janggo','boots_of_bearing'],
 'team-attack-buffs':['vladmir','assault','ancient_janggo','boots_of_bearing','solar_crest'],
 'wave-clear':['bfury','maelstrom','mjollnir','radiance','shivas_guard','meteor_hammer','overwhelming_blink'],
 'farming-speed':['quelling_blade','bfury','maelstrom','mjollnir','radiance','hand_of_midas'],
 'summons-controlled-units':['manta','helm_of_the_dominator','helm_of_the_overlord','necronomicon','necronomicon_2','necronomicon_3'],
 'bonus-gold':['hand_of_midas']
};
function matchesTag(item,id){if(!id)return true;if(!item.verified)return false;if(id==='dispel')return ['self-dispel','strong-self-dispel','ally-dispel'].some(t=>matchesTag(item,t));if(CURATED[id]?.includes(item.key))return true;const column=STAT_TAGS[id];if(column&&num(val(item,cols.findIndex(c=>c[0]===column)))>0)return true;return (item.attrib||[]).some(a=>a.display&&ATTR_TAGS[id]?.includes(a.key)&&num(a.value)>0)}
function visibleTags(){return tagMode==='basic'?BASIC_TAGS:ALL_TAGS}
const tagIcon={'strength':'STR','agility':'AGI','intelligence':'INT','armor':'Armor','attack-damage':'Damage','movement-speed':'Move speed'};
function tagChip(t){return '<button type="button" data-tag="'+t.id+'" aria-pressed="'+(activeTagId===t.id)+'" aria-describedby="stat-tooltip" class="'+(activeTagId===t.id?'active':'')+'" style="--rgb:'+t.color+';--accent:rgb('+t.color+')">'+(icons[tagIcon[t.id]]?'<img alt="" src="'+icons[tagIcon[t.id]]+'">':'')+esc(t.label)+'</button>'}
function renderTags(){const bar=document.querySelector('.stat-tags');bar.innerHTML=(tagMode==='basic'?BASIC_TAG_GROUPS:ADVANCED_TAG_GROUPS).map(g=>'<div class="tag-group"><span class="tag-group-label">'+esc(g.name)+'</span><div class="tag-group-chips">'+g.tags.map(tagChip).join('')+'</div></div>').join('');document.querySelectorAll('[data-mode]').forEach(b=>{const on=b.dataset.mode===tagMode;b.setAttribute('aria-pressed',String(on));b.classList.toggle('active',on)})}
function setTagMode(mode){tagMode=mode;if(activeTagId&&!visibleTags().some(t=>t.id===activeTagId))activeTagId=null;hideTip();renderTags();render()}
function selectTag(id){activeTagId=activeTagId===id?null:id;if(activeTagId&&STAT_TAGS[id]){sort=cols.findIndex(c=>c[0]===STAT_TAGS[id]);dir=-1}renderTags();render();const button=document.querySelector('[data-tag="'+id+'"]');if(button){button.focus({preventScroll:true});showTagTip(button)}}
function showTagTip(button){clearTimeout(tipTimer);const t=visibleTags().find(t=>t.id===button.dataset.tag);if(!t)return;tooltip.innerHTML='<strong>'+esc(t.label)+'</strong><small>'+(tagMode==='basic'?'PROBLEM / SITUATION':'ITEM EFFECT')+'</small><p>'+esc(t.description)+'</p>'+(t.id==='true-strike-accuracy'?'<p class="tip-note">Includes conditional true strike and chance-based accuracy; not every matching item guarantees every attack will hit.</p>':'')+'<small>Click to filter. Click again to clear. Effects may be active, passive or conditional; see item details.</small>';tooltip.hidden=false;positionTagTip(button)}
function positionTagTip(button){const r=button.getBoundingClientRect(),t=tooltip.getBoundingClientRect();tooltip.style.left=Math.max(12,Math.min(r.left+r.width/2-t.width/2,window.innerWidth-t.width-12))+'px';tooltip.style.top=Math.max(12,r.bottom+t.height+10<window.innerHeight?r.bottom+10:r.top-t.height-10)+'px'}
