let efficiencyMode=false;
const PERCENT_COLUMNS=new Set(['Spell Amp','Magic Resist','Status Resist','Slow Resist','Evasion']);
function efficiencyEligible(n){return n>=2&&!['category','combined'].includes(cols[n][1])}
function efficiencyValue(i,n){if(!efficiencyEligible(n)||!i.verified||!Number.isFinite(i.cost)||i.cost<=0)return null;let attrs=statAttributes(i,n);const name=cols[n][0];if(n>=2&&n<=4){if(i.attrib.some(a=>a.heading==='+$selected_attrib'))return null;attrs=attrs.concat(allAttributes(i))}if(!attrs.length)return null;
// These listed bonuses depend on break state, health, time or another condition.
const conditional={tranquil_boots:['Hp Regen','Move speed'],armlet:['STR'],vampire_fangs:['Hp Regen'],vambrace:['STR','AGI','INT'],power_treads:['STR','AGI','INT','Move speed']};
if(conditional[i.key]?.includes(name))return null;
if(attrs.some(a=>/aura|selected|primary|secondary|night|day|melee|ranged heroes/i.test(a.heading||'')))return null;
if(name==='Attack Range'&&attrs.some(a=>a.heading!=='+$attack_range_all'))return null;
if(attrs.some(a=>!/^[-+]?\d+(\.\d+)?$/.test(String(a.value).trim())))return null;
const percentages=attrs.map(a=>!!a.percentage);if(percentages.some(Boolean)&&!PERCENT_COLUMNS.has(name))return null;
if(PERCENT_COLUMNS.has(name)&&percentages.some(v=>!v))return null;
const values=attrs.map(signedValue);if(values.some(v=>v===null||v<0))return null;const bonus=values.reduce((s,v)=>s+v,0);if(bonus<=0)return null;const value=bonus/i.cost*1000;return Number.isFinite(value)?{value,unit:PERCENT_COLUMNS.has(name)?'pp /1k':'/1k'}:null}
function efficiencyText(e){return e.value.toLocaleString('en-GB',{minimumFractionDigits:1,maximumFractionDigits:2})+' '+e.unit}
function efficiencyCell(i,n){if(!efficiencyMode)return '';const e=efficiencyValue(i,n);return e?'<small class="efficiency-value">'+efficiencyText(e)+'</small>':''}
function sortedCompare(a,b){if(cols[sort][1]==='combined'){const x=calculateCombinedGoldEfficiency(a),y=calculateCombinedGoldEfficiency(b);if(x===null&&y===null)return a.dname.localeCompare(b.dname);if(x===null)return 1;if(y===null)return -1;return dir*(x-y)||a.dname.localeCompare(b.dname)}if(efficiencyMode&&efficiencyEligible(sort)){const x=efficiencyValue(a,sort),y=efficiencyValue(b,sort);if(!x&&!y)return a.dname.localeCompare(b.dname);if(!x)return 1;if(!y)return -1;return dir*(x.value-y.value)||a.dname.localeCompare(b.dname)}return dir*compare(a,b,sort)||a.dname.localeCompare(b.dname)}
function efficiencyHelp(){return '<div class="efficiency-help"><strong>Gold Efficiency</strong><p>Stat Bonus ÷ Gold Cost × 1,000. Higher values give more of this stat per 1,000 gold. Other stats, active abilities and strategic value are not included. Percentage stats use percentage points (pp). Conditional, alternative, aura and incompatible units are excluded.</p></div>'}
