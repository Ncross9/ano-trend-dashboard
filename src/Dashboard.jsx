import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { AlertTriangle, TrendingUp, Zap, Target, Shield, CloudLightning, ShoppingCart, Mail, MessageSquare, DollarSign, TreePine, Package, ChevronDown, ChevronUp, ExternalLink, Database } from "lucide-react";

// ─── DATA: BAKED IN FROM MAY 26 2026 RESEARCH + REAL STORE SALES ───────────────

const SCAN_DATE = "May 26, 2026";
const SCAN_WEEK = "Week of May 25–31, 2026";
const TODAY_INDEX = 1; // Tue 5/26 — scan day, index into weeklyCalendar
const STORE_DATA_SOURCE = "sales_forecasting_report — 5,082 SKUs, 30/90/180/365-day order velocity";

const urgencyLevels = { CRITICAL: "🔴", HIGH: "🟠", MEDIUM: "🟡", WATCH: "🟢" };

const categories = [
  {
    id: "emergency",
    name: "Emergency Supplies",
    icon: "Shield",
    urgency: "CRITICAL",
    color: "#ef4444",
    heatScore: 94,
    summary: "This is the peak preparedness window of the year — the Atlantic hurricane season opens Monday June 1, six days out. NOAA's May 21 below-normal outlook (8–14 named storms, 3–6 hurricanes) was paired with unusually firm warnings — 'it only takes one; Category 5s have hit during below-average seasons' — and agencies are urging the public to stock food, water, medicine, batteries and supplies NOW. Layered on top: 61%+ of the U.S. is in drought, AccuWeather projects 5.5–8 million acres burning, and wildfire smoke is forecast to reach the Midwest, Great Lakes and Northeast.",
    sellingNow: [
      "Water storage, filtration & purification tablets",
      "Long-shelf-life food — buckets, MREs, freeze-dried",
      "Portable power stations, battery banks & solar chargers",
      "NOAA weather radios, batteries & lanterns",
      "First-aid / trauma kits & medicine organizers",
      "N95 / respirator masks & air filtration (wildfire smoke)",
    ],
    sellingNext: [
      "Generators, fuel cans & transfer setups",
      "Whole-home / large-format water reserves",
      "Evacuation go-bags & document/cash kits",
      "Sandbags & flood barriers for Gulf/coastal customers",
    ],
    whyNext: "The June 1 open is a hard demand trigger; even in a below-normal year, prep purchasing front-loads into late May and early June. Drought and early-season fire activity add a parallel smoke / air-quality demand stream across the eastern U.S. that extends well beyond the coast.",
    marketingAngles: {
      email: "Subject: 'Hurricane Season Starts Monday — build the kit FEMA & NOAA say to have today.' Lead with a 72-hour checklist tied to the June 1 open.",
      social: "'Below-normal forecast ≠ no risk — here's why' explainer with a 72-hour kit checklist graphic.",
      ppc: "Aggressive bids on 'hurricane kit,' 'emergency water storage,' 'wildfire smoke mask,' 'weather radio.' Boost Gulf & Atlantic coast geos.",
      sms: "Hurricane season opens 6/1. Don't wait for a cone on the map — food, water & power kits ready now → [link].",
    },
    storeData: {
      topSellers: [
        { name: "MRE Entree Special — Chicken Burrito Bowl", d30: 1072, d365: 16357 },
        { name: "2026 G.I. Issue MRE Case A or B", d30: 706, d365: 3484 },
        { name: "2026 G.I. Issue MRE A&B 2-Pack", d30: 191, d365: 900 },
        { name: "P-38 Can Opener — U.S. Shelby Co.", d30: 110, d365: 1155 },
        { name: "U.S. Military Issue Foliage Sandbags (single)", d30: 110, d365: 220 },
        { name: "MRE Entree — Chicken & Sausage Jambalaya", d30: 106, d365: 3547 },
      ],
      trending: [
        { name: "Recon Mountaineer Combat Trauma Bag V3", d30: 10, d365: 10 },
        { name: "Waterproof Matches w/ Case", d30: 32, d365: 44 },
        { name: "U.S. Issue OCP Multicam IFAK II Medical Pouch", d30: 15, d365: 17 },
      ],
      insight: "MRE entrees and 2026 GI-issue cases dominate emergency volume by an order of magnitude. Sandbags hit 110 in 30 days (matching the prior 90-day total) — a real, active flood-prep spike — and trauma SKUs like the IFAK II pouch and Recon Trauma Bag are accelerating off small bases.",
    },
  },
  {
    id: "weather",
    name: "Weather / Storm Events",
    icon: "CloudLightning",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 88,
    summary: "The week is bracketed by a wet, stormy post-Memorial-Day stretch and the June 1 hurricane season open the day after it ends. AccuWeather/SPC flag 1–4\" of rain (locally 6–8\") from southeast Texas and central Louisiana up through New York, with flash-flood and damaging-wind risk through late week, while the northern Plains and Upper Midwest run 20–30°F above normal. NOAA's May 21 outlook predicts a below-normal season driven by a developing El Niño (82% chance May–July); NHC sees no tropical formation in the next 7 days but is watching western Gulf convection and two tropical waves.",
    sellingNow: [
      "Rain gear, ponchos & waterproof shells (TX–Northeast flood threat)",
      "Tarps, sandbags & water-diversion gear (flash-flood zones)",
      "Portable fans, hydration packs & cooling gear (Midwest heat)",
      "NOAA weather radios & battery banks",
      "Waterproof dry bags & gear cases",
      "Headlamps & flashlights for outage readiness",
    ],
    sellingNext: [
      "Full hurricane-prep kits (June 1 open)",
      "Generators & fuel storage cans",
      "Storm shutters / window film, rope & lashing",
      "Sandbag bulk packs for coastal / Gulf customers",
    ],
    whyNext: "The June 1 season open creates an automatic demand trigger regardless of the below-normal forecast — this year's official messaging explicitly warns consumers not to relax. Early-season Gulf development is the historical norm, and any named system in June would spike demand instantly.",
    marketingAngles: {
      email: "Subject: '6 days to hurricane season — beat the rush, build your kit now.' Checklist tied to the June 1 open, plus active-flooding rain gear.",
      social: "Post the NOAA '8–14 storms but it only takes one' graphic with a stitched reel of a 10-minute kit build.",
      ppc: "Bid up: 'hurricane prep checklist,' 'weather radio,' 'rain gear,' 'tarps.' Front-load ahead of the June 1 demand curve.",
      sms: "Storm season opens Mon 6/1. Flash flooding hitting TX–NY now — rain gear & radios in stock → [link].",
    },
    storeData: {
      topSellers: [
        { name: "USMC FILBE Coyote Hydration Pack", d30: 43, d365: 431 },
        { name: "US Issue Waterproof Laundry & Wet Weather Bag", d30: 34, d365: 528 },
        { name: "USMC SealLine Medium Waterproof Stuff Sack", d30: 30, d365: 431 },
        { name: "U.S. Issue Waterproof Wet Weather Bag", d30: 30, d365: 164 },
        { name: "Military SealLine Large Main Pack Stuff Sack", d30: 29, d365: 384 },
        { name: "U.S. Army ACU Poncho Liner", d30: 27, d365: 298 },
      ],
      trending: [
        { name: "USMC Black SealLine Compression Stuff Sack", d30: 9, d365: 20 },
        { name: "River's Edge 40L Waterproof Backpack (5ive Star)", d30: 14, d365: 46 },
        { name: "U.S. Issue Waterproof Wet Weather Bag", d30: 30, d365: 164 },
      ],
      insight: "Waterproofing gear dominates storm response — SealLine stuff sacks, wet-weather bags, and poncho liners run the entire top 8. The standard U.S. Issue Wet Weather Bag is on a 2× annual pace, the River's Edge 40L pack on ~4× — a sharp signal that customers are actively prepping for water-exposure conditions.",
    },
  },
  {
    id: "tactical",
    name: "Tactical & EDC",
    icon: "Target",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 78,
    summary: "The Father's Day ramp (Sunday June 21) is now in full swing — EDC and tactical gift guides are live across the major outlets, with featured price points spanning roughly $13–$206 (knives, multi-tools, ferro rods, high-lumen lights). Post-Memorial-Day deal dynamics are unusual: 54% of adults plan to shop holiday sales (up from 36%), but average planned spend collapsed from $289 to $86 (–70%) amid high gas prices — so demand skews practical over indulgent. Section 122 (10%) plus apparel/footwear stacking is pushing imported-good prices up 10–20%.",
    sellingNow: [
      "EDC folding knives & fixed blades (Father's Day hero category)",
      "Multi-tools & pocket organizers",
      "EDC flashlights & headlamps (high-lumen)",
      "Ferro rods & pocket survival tools",
      "Belts, pouches & EDC carry organization",
      "Watches, compasses & value gift bundles",
    ],
    sellingNext: [
      "Father's Day gift sets & 'build-your-own-carry' bundles (peak 6/8–6/20)",
      "Gift cards as a hedge for last-minute / practical shoppers",
      "Premium knives for the higher-intent gift buyer",
      "Range / utility bags & tactical backpacks",
    ],
    whyNext: "Father's Day gifting accelerates hard through the first three weeks of June; launching bundles and gift-guide content now captures early planners. The ~70% drop in planned spend means curated, value-tiered 'practical gift' merchandising will convert better than premium-only assortments.",
    marketingAngles: {
      email: "Subject: 'Gifts Dad will actually use — EDC picks from $13 to $206,' tiered by budget.",
      social: "'5 EDC gifts under $50' reel targeting the practical-spend shopper. Unboxing of gift-bundle picks.",
      ppc: "Bid up: 'father's day gifts for dad,' 'best edc knife,' 'multi-tool gift.' Use value-tiered bundle landing pages.",
      sms: "Father's Day is 6/21. Shop EDC gifts he'll actually carry — early-bird picks live now → [link].",
    },
    storeData: {
      topSellers: [
        { name: "Classic Military Style Metal Compass, OD", d30: 15, d365: 106 },
        { name: "Streamlight Sidewinder Compact II Light Kit", d30: 12, d365: 40 },
        { name: "ESS Ballistic Crossbow 2-Lens Glasses APEL", d30: 12, d365: 163 },
        { name: "Rothco G.I. Style Police Whistle", d30: 9, d365: 154 },
        { name: "Ontario Knife SP16 SPAX, ACU", d30: 9, d365: 79 },
        { name: "Magnesium Firestarter", d30: 8, d365: 43 },
      ],
      trending: [
        { name: "Streamlight Sidewinder Compact II", d30: 12, d365: 40 },
        { name: "Magnesium Firestarter", d30: 8, d365: 43 },
        { name: "Classic Military Metal Compass OD", d30: 15, d365: 106 },
      ],
      insight: "Land-navigation and fire-starting basics lead — OD compasses and Streamlight tactical lights are running at 2–4× their annual rate. The signal here is bug-out / field-readiness, NOT EDC-fashion gifting — lean Father's Day messaging into the 'practical kit' angle to match what's actually moving.",
    },
  },
  {
    id: "surplus",
    name: "Military Surplus",
    icon: "Package",
    urgency: "MEDIUM",
    color: "#eab308",
    heatScore: 70,
    summary: "Gorpcore remains a strong 2026 driver, now in a muted, earth-toned phase — clay, truffle, olive, khaki. Cargo pants, utility vests, fleece, and especially military-surplus boots (surplus Danners cited as the budget hero) carry both fashion and function appeal. Summer camping demand is rising into June, with the outdoor apparel market projected to grow from ~$39.7B toward $77.3B by 2035. Tariff exposure is acute for surplus-adjacent imports: leather/boots, packs, and apparel face 10–20% price increases, with leather/boot relief described as 'years away.'",
    sellingNow: [
      "Surplus & tactical boots (gorpcore + function crossover)",
      "Cargo pants, utility vests & field/BDU apparel in earth tones",
      "Surplus packs, rucks & load-bearing gear",
      "Summer camping — tents, sleep systems, mess kits",
      "Olive / khaki layering pieces & field shirts",
      "Hats, gaiters & warm-weather field accessories",
    ],
    sellingNext: [
      "Hot-weather camping gear — tarps, hammocks, breathable layers",
      "Insect & sun-protection field apparel",
      "Father's Day-friendly surplus apparel & boots",
      "Bulk / value surplus bundles ahead of summer trips",
    ],
    whyNext: "Camping participation climbs through June and gorpcore keeps surplus apparel culturally relevant beyond core customers. With tariffs lifting import prices 10–20%, genuine surplus stock becomes a value differentiator worth merchandising aggressively before any further tariff actions land.",
    marketingAngles: {
      email: "Subject: 'Surplus boots & field gear — real gorpcore, real value (before prices climb).'",
      social: "'Why surplus Danners beat the $300 trend boots' styling reel in earth tones.",
      ppc: "Bid up: 'military surplus boots,' 'tactical cargo pants,' 'surplus backpack,' 'cheap camping gear.'",
      sms: "Tariffs are pushing boot prices up 10–20%. Genuine surplus still in stock — shop now → [link].",
    },
    storeData: {
      topSellers: [
        { name: "1 Qt. GI Military Plastic Canteen", d30: 461, d365: 2640 },
        { name: "50 CAL Ammo Can (storage box, 12×6×7.5 in)", d30: 210, d365: 2569 },
        { name: "Used MOLLE II ACU M4 Magazine Pouch", d30: 134, d365: 1606 },
        { name: "Scepter Military 5-Gallon Plastic Fuel Can", d30: 84, d365: 141 },
        { name: "U.S. Issue Triple ACU Side-x-Side Mag Pouch", d30: 83, d365: 1070 },
        { name: "ACU MOLLE II Rucksack, Un-assembled", d30: 78, d365: 790 },
      ],
      trending: [
        { name: "Scepter Military 5-Gallon Fuel Can", d30: 84, d365: 141 },
        { name: "2-Pack FILBE Sustainment Pouch", d30: 10, d365: 10 },
        { name: "PTS Tactical Response Multicam NYCO R/S", d30: 10, d365: 10 },
      ],
      insight: "The 1-qt GI canteen is the runaway surplus hit at 461 units in 30 days. The real story: the Scepter 5-gallon fuel can jumping from zero to 84 in 30 days is the clearest emergency-prep crossover signal in the surplus mix — customers are stockpiling water and fuel storage simultaneously ahead of June 1.",
    },
  },
  {
    id: "hunting",
    name: "Hunting — Turkey / Fishing",
    icon: "TreePine",
    urgency: "MEDIUM",
    color: "#eab308",
    heatScore: 64,
    summary: "Spring turkey is in its final closing days — Pennsylvania (through 5/30), New York (through 5/31), Wisconsin (through 5/26) and the New England states all wrap this week, with only Maine extending to June 6. Meanwhile the calendar tips fully into the summer fishing transition: post-spawn largemouth holding shallow at dawn and dusk, walleye schooling in 8–20 ft along weed lines, channel catfish feeding hard after dark, and bluegill/crappie spawning into June as water hits the mid-60s–70s. This is the cleanest turkey-to-fishing handoff week of the year.",
    sellingNow: [
      "TSS turkey loads, calls & decoys (final-days closeout — PA/NY/ME)",
      "Post-spawn bass tackle — soft plastics, topwater, weightless rigs",
      "Walleye gear — bottom-bouncers, worm harnesses, crankbaits",
      "Catfish setups — cut-bait rigs, glow floats, rod holders",
      "Panfish kits — light jigs, slip bobbers, ultralight combos",
      "Tackle storage, polarized sunglasses & quick-dry apparel",
    ],
    sellingNext: [
      "Kayaks, float tubes & trolling motors (summer on-water push)",
      "Coolers & live-well / bait management gear",
      "Bug / tick protection & UPF sun apparel",
      "Bank-fishing & night-fishing lighting",
    ],
    whyNext: "As turkey closes nationwide, spend rotates entirely to fishing and general summer recreation; the post-spawn bite and warming panfish window drive the highest-participation weeks of early summer. Father's Day (6/21) further pulls fishing gear into gift consideration.",
    marketingAngles: {
      email: "Subject: 'Last call: turkey-season closeout + your summer fishing starter kit.'",
      social: "Short clip 'Where bass go after the spawn' leading into a shallow-water lure carousel.",
      ppc: "Bid up: 'post spawn bass lures,' 'walleye crankbaits,' 'turkey call closeout,' 'catfish rigs.'",
      sms: "Turkey season's closing this week. Switch to summer fishing — post-spawn tackle restocked → [link].",
    },
    storeData: {
      notStocked: true,
      insight: "Reality check from the sales file: a keyword scan of all 5,082 SKUs returned no meaningful hunting, turkey, or fishing inventory with sales velocity. The store doesn't actually stock this category — consider hiding this tile or replacing it with a category that matches the real assortment (e.g., 'MREs / Food Storage' or 'Bags & Carry').",
    },
  },
];

// Derived data for charts
const heatData = categories.map((c) => ({ name: c.name.split(" —")[0].split(" /")[0], score: c.heatScore, fill: c.color }));

const channelPriorityData = [
  { channel: "Email", weather: 90, turkey: 78, emergency: 96, edc: 90, surplus: 70 },
  { channel: "Social", weather: 82, turkey: 82, emergency: 80, edc: 92, surplus: 88 },
  { channel: "PPC", weather: 94, turkey: 75, emergency: 97, edc: 92, surplus: 68 },
  { channel: "SMS", weather: 95, turkey: 70, emergency: 98, edc: 82, surplus: 60 },
];

const weeklyCalendar = [
  { day: "Mon 5/25", action: "Memorial Day: run the 'Honor & Prepare' sale finale — surplus apparel + EDC, with thank-the-troops messaging." },
  { day: "Tue 5/26", action: "Launch the post-Memorial-Day 'Prep for Hurricane Season' email — 6-day countdown to June 1, emergency-kit hero." },
  { day: "Wed 5/27", action: "Fishing-transition push — 'Turkey's closing, fishing's open': post-spawn tackle promo with a turkey-load closeout banner." },
  { day: "Thu 5/28", action: "Father's Day soft launch — tiered EDC gift guide ($13–$206), value-tier emphasis given soft spending." },
  { day: "Fri 5/29", action: "Weather-reactive flash promo — rain gear / tarps / radios tied to active TX–Northeast flooding, plus heat gear for the Midwest." },
  { day: "Sat 5/30", action: "Weekend 'Summer Camp Kickoff' — surplus boots, camping gear, gorpcore styling. Capture PA hunters as turkey season ends." },
  { day: "Sun 5/31", action: "Final hurricane-season countdown — 'Season opens tomorrow': emergency kits, water, power. SMS blast at peak." },
];

const topKeywords = [
  { keyword: "hurricane prep kit", volume: "High", cpc: "$1.80", competition: "High", priority: "🔴" },
  { keyword: "emergency water storage", volume: "High", cpc: "$1.40", competition: "Med", priority: "🔴" },
  { keyword: "weather radio NOAA", volume: "High", cpc: "$1.10", competition: "Med", priority: "🔴" },
  { keyword: "father's day gifts for dad", volume: "Very High", cpc: "$1.30", competition: "High", priority: "🔴" },
  { keyword: "best EDC knife", volume: "High", cpc: "$1.60", competition: "High", priority: "🟠" },
  { keyword: "military surplus boots", volume: "Med", cpc: "$0.95", competition: "Med", priority: "🟠" },
  { keyword: "post spawn bass lures", volume: "Med", cpc: "$0.85", competition: "Med", priority: "🟡" },
  { keyword: "multi-tool gift", volume: "Med", cpc: "$1.15", competition: "Med", priority: "🟠" },
  { keyword: "wildfire smoke mask N95", volume: "Med", cpc: "$1.05", competition: "Med", priority: "🟡" },
  { keyword: "tactical cargo pants", volume: "Med", cpc: "$0.90", competition: "Med", priority: "🟡" },
];

const tariffImpact = [
  { item: "Technical Backpacks (Vietnam)", tariff: "10%+ (up to ~25% stacked)", priceImpact: "+~10-20% at retail", action: "Stock now; feature pre-increase pricing as an urgency hook" },
  { item: "Boots & Leather Goods (China & Vietnam)", tariff: "30-70% CN / 0-32% VN", priceImpact: "+10-20%; relief 'years away'", action: "Lean into genuine surplus boots as the value alternative" },
  { item: "Field / Cargo Apparel (China & Vietnam)", tariff: "30-70% CN / 0-32% VN", priceImpact: "+10-20% on imported soft goods", action: "Promote earth-tone surplus apparel margin advantage" },
  { item: "TSS Turkey Loads (imported components)", tariff: "Sec 122 10% layer", priceImpact: "Modest single-digit %", action: "Close out remaining season stock before reorder repricing" },
  { item: "General Imported Gear (Sec 122 / IEEPA)", tariff: "10% to 7/24; IEEPA 20% struck", priceImpact: "Volatile — appeals stay keeps collection on", action: "Monitor July 24 expiry; avoid overcommitting forward buys" },
];

// ─── REAL STORE DATA: from the May 2026 sales forecasting report ────────────────

const overallTopMovers = [
  { name: "MRE Entree Special — Chicken Burrito Bowl", d30: 1072, category: "Emergency" },
  { name: "2026 G.I. Issue MRE Case A or B", d30: 706, category: "Emergency" },
  { name: "1 Qt. GI Military Plastic Canteen", d30: 461, category: "Surplus" },
  { name: "50 CAL Ammo Can (storage)", d30: 210, category: "Surplus" },
  { name: "Route Package Protection", d30: 194, category: "Shipping add-on" },
  { name: "2026 G.I. Issue MRE A&B 2-Pack", d30: 191, category: "Emergency" },
  { name: "Used MOLLE II ACU M4 Magazine Pouch", d30: 134, category: "Surplus" },
  { name: "P-38 Can Opener — U.S. Shelby Co.", d30: 110, category: "Emergency" },
  { name: "U.S. Military Issue Foliage Sandbags (single)", d30: 110, category: "Emergency" },
  { name: "MRE Entree — Chicken & Sausage Jambalaya", d30: 106, category: "Emergency" },
];

const deadInventory = [
  { name: "Tactical Pistol Lanyard", available: 50, d365: 5 },
  { name: "PTS Tactical Response Multicam NYCO R/S, 2XLR", available: 42, d365: 1 },
  { name: "USMC IMTV Shoulder Strap Yib-Yab", available: 42, d365: 2 },
  { name: "U.S. Made Multicam MOLLE Rucksack Shoulder Harness", available: 29, d365: 1 },
  { name: "PTS Tactical Response ODG P/C R/S, MR", available: 28, d365: 2 },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

const COLORS = ["#ef4444", "#f97316", "#f97316", "#eab308", "#eab308"];

const TabButton = ({ active, onClick, children, color }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      active ? "text-white shadow-lg" : "text-gray-300 hover:text-white hover:bg-gray-700"
    }`}
    style={active ? { backgroundColor: color } : {}}
  >
    {children}
  </button>
);

const UrgencyBadge = ({ level }) => {
  const colors = { CRITICAL: "bg-red-500", HIGH: "bg-orange-500", MEDIUM: "bg-yellow-500", WATCH: "bg-green-500" };
  return (
    <span className={`${colors[level]} text-white text-xs font-bold px-2 py-1 rounded-full`}>
      {urgencyLevels[level]} {level}
    </span>
  );
};

const CategoryDetail = ({ cat }) => {
  const [expanded, setExpanded] = useState({ now: true, next: true, marketing: false, store: true });
  const toggle = (key) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white">{cat.name}</h3>
            <UrgencyBadge level={cat.urgency} />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{cat.summary}</p>
        </div>
        <div className="ml-4 text-right">
          <div className="text-3xl font-black" style={{ color: cat.color }}>{cat.heatScore}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Heat Score</div>
        </div>
      </div>

      {/* Selling NOW */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <button onClick={() => toggle("now")} className="w-full flex items-center justify-between p-3 hover:bg-gray-750">
          <span className="text-sm font-semibold text-green-400 flex items-center gap-2">
            <Zap size={14} /> SELLING FASTEST RIGHT NOW
          </span>
          {expanded.now ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {expanded.now && (
          <div className="px-3 pb-3">
            <div className="grid grid-cols-1 gap-1">
              {cat.sellingNow.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-200">
                  <span className="text-green-400">▸</span> {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selling NEXT WEEK */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <button onClick={() => toggle("next")} className="w-full flex items-center justify-between p-3 hover:bg-gray-750">
          <span className="text-sm font-semibold text-blue-400 flex items-center gap-2">
            <TrendingUp size={14} /> SELLING NEXT WEEK & WHY
          </span>
          {expanded.next ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {expanded.next && (
          <div className="px-3 pb-3 space-y-2">
            <div className="grid grid-cols-1 gap-1">
              {cat.sellingNext.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-200">
                  <span className="text-blue-400">▸</span> {item}
                </div>
              ))}
            </div>
            <div className="bg-gray-900 rounded p-2 mt-2">
              <p className="text-xs text-gray-400 italic"><strong className="text-blue-400">WHY:</strong> {cat.whyNext}</p>
            </div>
          </div>
        )}
      </div>

      {/* Marketing Angles */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <button onClick={() => toggle("marketing")} className="w-full flex items-center justify-between p-3 hover:bg-gray-750">
          <span className="text-sm font-semibold text-purple-400 flex items-center gap-2">
            <Target size={14} /> MARKETING PLAYBOOK
          </span>
          {expanded.marketing ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {expanded.marketing && (
          <div className="px-3 pb-3 space-y-3">
            {[
              { label: "Email", icon: <Mail size={13} />, text: cat.marketingAngles.email, bg: "bg-blue-900/30", border: "border-blue-700" },
              { label: "Social", icon: <MessageSquare size={13} />, text: cat.marketingAngles.social, bg: "bg-pink-900/30", border: "border-pink-700" },
              { label: "PPC", icon: <DollarSign size={13} />, text: cat.marketingAngles.ppc, bg: "bg-green-900/30", border: "border-green-700" },
              { label: "SMS", icon: <Zap size={13} />, text: cat.marketingAngles.sms, bg: "bg-yellow-900/30", border: "border-yellow-700" },
            ].map((ch) => (
              <div key={ch.label} className={`${ch.bg} border ${ch.border} rounded-lg p-3`}>
                <div className="flex items-center gap-2 mb-1">
                  {ch.icon}
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-300">{ch.label}</span>
                </div>
                <p className="text-sm text-gray-200">{ch.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Store Data — REAL */}
      {cat.storeData && (
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-cyan-900/50">
          <button onClick={() => toggle("store")} className="w-full flex items-center justify-between p-3 hover:bg-gray-750">
            <span className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
              <Database size={14} /> YOUR STORE — REAL TOP SELLERS (LAST 30 DAYS)
            </span>
            {expanded.store ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {expanded.store && (
            <div className="px-3 pb-3 space-y-3">
              {cat.storeData.notStocked ? (
                <div className="bg-yellow-950/40 border border-yellow-800/60 rounded p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-yellow-300 mb-1">⚠ Not stocked</p>
                  <p className="text-sm text-gray-200">{cat.storeData.insight}</p>
                </div>
              ) : (
                <>
                  <div className="bg-cyan-950/30 border border-cyan-800/50 rounded p-3">
                    <p className="text-xs text-gray-200 leading-relaxed"><strong className="text-cyan-300">INSIGHT:</strong> {cat.storeData.insight}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-cyan-300 mb-2">Top sellers (30-day orders)</p>
                    <div className="bg-gray-900 rounded overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-700 text-gray-500">
                            <th className="text-left p-2 font-medium">Product</th>
                            <th className="text-right p-2 font-medium">30d</th>
                            <th className="text-right p-2 font-medium">365d</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.storeData.topSellers.map((p, i) => (
                            <tr key={i} className="border-b border-gray-800/50">
                              <td className="p-2 text-gray-200">{p.name}</td>
                              <td className="p-2 text-right text-white font-mono font-bold">{p.d30.toLocaleString()}</td>
                              <td className="p-2 text-right text-gray-400 font-mono">{p.d365.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {cat.storeData.trending && cat.storeData.trending.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-green-400 mb-2">🔥 Accelerating (30-day pace &gt; annual run-rate)</p>
                      <div className="space-y-1">
                        {cat.storeData.trending.map((p, i) => {
                          const ann = p.d30 * 12;
                          const mult = p.d365 > 0 ? (ann / p.d365).toFixed(1) : "∞";
                          return (
                            <div key={i} className="bg-green-950/30 border border-green-900/50 rounded p-2 flex items-center justify-between">
                              <span className="text-xs text-gray-200">{p.name}</span>
                              <span className="text-xs font-mono text-green-400 font-bold">{mult}× annual</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────

export default function ArmyNavyTrendDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);

  const activeCat = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="bg-gray-950 text-white min-h-screen p-4 font-sans">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Shield size={28} className="text-green-500" />
          <h1 className="text-2xl font-black tracking-tight">ARMY NAVY OUTDOORS</h1>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-sm text-gray-400">Weekly Trend Intelligence Scan</p>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{SCAN_WEEK}</span>
          <span className="text-xs bg-red-900 text-red-200 px-2 py-0.5 rounded animate-pulse">LIVE DATA</span>
          <span className="text-xs bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded">+ REAL STORE SALES</span>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-950 border border-red-800 rounded-lg p-3 mb-6 flex items-start gap-3">
        <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-300">CRITICAL ALERT — Atlantic Hurricane Season Opens June 1</p>
          <p className="text-xs text-red-400 mt-1">Hurricane season opens Monday June 1 — six days out. NOAA's May 21 outlook calls for a below-normal season (8–14 named storms), but officials are hammering 'it only takes one.' Meanwhile flash-flood and damaging-wind risk runs from Texas to New York through late week, and wildfire smoke is reaching the Midwest, Great Lakes and Northeast. Prepare now, before the season opens.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: "overview", label: "Overview" },
          { id: "categories", label: "Category Deep-Dive" },
          { id: "calendar", label: "Weekly Action Plan" },
          { id: "keywords", label: "PPC Keywords" },
          { id: "tariffs", label: "Tariff Watch" },
        ].map((tab) => (
          <TabButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} color="#22c55e">
            {tab.label}
          </TabButton>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Heat Score Bar Chart */}
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} /> Category Heat Scores</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={heatData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#d1d5db", fontSize: 11 }} width={100} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {heatData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Cards */}
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setActiveTab("categories"); }}
                className="bg-gray-900 rounded-xl p-4 text-left hover:ring-2 transition-all"
                style={{ "--tw-ring-color": cat.color }}
              >
                <div className="flex items-center justify-between mb-2">
                  <UrgencyBadge level={cat.urgency} />
                  <span className="text-2xl font-black" style={{ color: cat.color }}>{cat.heatScore}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{cat.summary.slice(0, 120)}...</p>
                <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  Top seller: <span className="text-gray-300">{cat.sellingNow[0]}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Top 3 Actions This Week */}
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> Top 3 Actions This Week</h2>
            <div className="space-y-3">
              <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-300">1. Hurricane Season Countdown (Season opens 6/1)</p>
                <p className="text-xs text-gray-300 mt-1">The Atlantic season opens Monday — six days out. Despite NOAA's below-normal forecast, 'it only takes one' is the official line. Front-load kit, water, power, and radio merchandising and run a daily countdown; close it with a Sunday 'season opens tomorrow' SMS blast.</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">2. Father's Day Value Bundles (Soft launch Thu)</p>
                <p className="text-xs text-gray-300 mt-1">Father's Day is June 21 and EDC is the hero gift category. With planned spend down ~70% to ~$86, lead with tiered, practical value bundles ($13–$206), not premium-only assortments. Launch the gift guide now to capture early planners.</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">3. Turkey-to-Fishing Handoff (Mid-week)</p>
                <p className="text-xs text-gray-300 mt-1">Spring turkey closes this week in PA, NY, WI and New England. Run a turkey-load closeout while pivoting the hunting segment to post-spawn bass, walleye, and catfish tackle — the cleanest seasonal handoff of the year.</p>
              </div>
            </div>
          </div>

          {/* Store-Wide Reality Check (from real sales file) */}
          <div className="bg-gray-900 rounded-xl p-4 border border-cyan-900/50">
            <h2 className="text-lg font-bold mb-1 flex items-center gap-2 text-cyan-300"><Database size={18} /> Store-Wide Reality Check</h2>
            <p className="text-xs text-gray-500 mb-4">Source: {STORE_DATA_SOURCE}</p>

            {/* Top 10 movers */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-cyan-300 mb-2">🔥 Top 10 Movers (last 30 days, store-wide)</h3>
              <div className="bg-gray-950 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-500">
                      <th className="text-left p-2 font-medium w-6">#</th>
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-left p-2 font-medium">Category</th>
                      <th className="text-right p-2 font-medium">30-day Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overallTopMovers.map((p, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="p-2 text-gray-500 font-mono">{i + 1}</td>
                        <td className="p-2 text-gray-200">{p.name}</td>
                        <td className="p-2 text-gray-400">{p.category}</td>
                        <td className="p-2 text-right text-white font-mono font-bold">{p.d30.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dead inventory */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-yellow-300 mb-2">⚠ Dead Inventory (≥ 20 on hand, ≤ 5 sold in 365 days)</h3>
              <div className="bg-gray-950 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-500">
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-right p-2 font-medium">On Hand</th>
                      <th className="text-right p-2 font-medium">365-day Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deadInventory.map((p, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="p-2 text-gray-200">{p.name}</td>
                        <td className="p-2 text-right text-yellow-300 font-mono">{p.available}</td>
                        <td className="p-2 text-right text-gray-400 font-mono">{p.d365}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-cyan-950/30 border border-cyan-800/50 rounded p-3 text-xs text-gray-300 leading-relaxed">
              <strong className="text-cyan-300">Cross-reference takeaway:</strong> Your actual store is far more emergency-and-surplus heavy than the categorical research implies. MREs and surplus canteens/pouches own the top 10 by an order of magnitude, and Hunting/Turkey/Fishing has essentially zero stocked inventory — recommend hiding that tile or replacing it with a category that matches the real assortment (e.g., 'MREs & Food Storage' or 'Bags & Carry'). The Scepter 5-gallon fuel can spike (0 → 84 in 30 days) and the sandbag surge (110 in 30d vs 220 all year) confirm the hurricane/storm-prep urgency story with real customer behavior.
            </div>
          </div>
        </div>
      )}

      {/* ─── CATEGORY DEEP-DIVE TAB ─── */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <TabButton key={cat.id} active={selectedCategory === cat.id} onClick={() => setSelectedCategory(cat.id)} color={cat.color}>
                {cat.name.split(" —")[0].split(" /")[0]}
              </TabButton>
            ))}
          </div>
          <CategoryDetail cat={activeCat} />
        </div>
      )}

      {/* ─── WEEKLY ACTION PLAN TAB ─── */}
      {activeTab === "calendar" && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingCart size={18} /> Weekly Marketing Action Plan</h2>
          {weeklyCalendar.map((day, i) => (
            <div key={i} className={`rounded-lg p-3 ${i === TODAY_INDEX ? "bg-red-950/50 border border-red-800" : "bg-gray-900"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-bold ${i === TODAY_INDEX ? "text-red-300" : "text-green-400"}`}>{day.day}</span>
                {i === TODAY_INDEX && <span className="text-xs bg-red-800 text-red-200 px-1.5 py-0.5 rounded">TODAY</span>}
              </div>
              <p className="text-sm text-gray-300">{day.action}</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── PPC KEYWORDS TAB ─── */}
      {activeTab === "keywords" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><DollarSign size={18} /> Priority PPC Keywords</h2>
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-400 font-medium">Priority</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Keyword</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Volume</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Est. CPC</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Competition</th>
                  </tr>
                </thead>
                <tbody>
                  {topKeywords.map((kw, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-3">{kw.priority}</td>
                      <td className="p-3 text-white font-medium">{kw.keyword}</td>
                      <td className="p-3 text-gray-300">{kw.volume}</td>
                      <td className="p-3 text-gray-300">{kw.cpc}</td>
                      <td className="p-3 text-gray-300">{kw.competition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-300 mb-2">Geo-Targeting Recommendations</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Hurricane / Emergency:</strong> <span className="text-gray-300">Gulf & Atlantic coast — TX, LA, FL, GA, SC, NC + smoke belt</span></div>
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Storm / Flood:</strong> <span className="text-gray-300">TX, LA, TN, KY, OH Valley → NY; Upper Midwest heat</span></div>
              <div className="bg-orange-950/30 rounded p-2"><strong className="text-orange-400">Turkey / Fishing:</strong> <span className="text-gray-300">PA, NY, WI, ME (closing) + nationwide fishing</span></div>
              <div className="bg-yellow-950/30 rounded p-2"><strong className="text-yellow-400">EDC / Surplus:</strong> <span className="text-gray-300">Nationwide — metro areas for EDC, rural for surplus</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TARIFF WATCH TAB ─── */}
      {activeTab === "tariffs" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-400" /> Tariff Impact Watch</h2>
          <p className="text-sm text-gray-400">Section 122's 10% global tariff is still being collected (a May 12 appeals-court stay kept it alive) and expires July 24 — while the Supreme Court struck the separate 20% IEEPA layer. Pricing is volatile. Here's what to act on now.</p>
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-400 font-medium">Item / Origin</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Tariff</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Price Impact</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tariffImpact.map((t, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-3 text-white font-medium">{t.item}</td>
                      <td className="p-3 text-red-400 font-bold">{t.tariff}</td>
                      <td className="p-3 text-gray-300">{t.priceImpact}</td>
                      <td className="p-3 text-gray-300">{t.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-yellow-300 mb-2">Strategic Takeaway</h3>
            <p className="text-sm text-gray-300">Tariffs are both a margin threat and a marketing weapon. Imported soft goods — boots, packs, apparel — are up 10–20% with relief 'years away,' while the legal picture stays unsettled: the CIT struck Section 122 on May 7 but the Federal Circuit stayed that May 12, so CBP keeps collecting the 10% from nearly all importers through the July 24 statutory cap, and the Supreme Court's 6-3 ruling struck the separate 20% IEEPA layer. Position Army Navy Outdoors as the in-stock, pre-increase value play — genuine military surplus is the tariff-insulated alternative. Avoid overcommitting forward buys until the July picture clears.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-600">Army Navy Outdoors — Weekly Trend Intelligence | Generated {SCAN_DATE} | Sources: NOAA, NHC, SPC, AccuWeather, NWTF, MeatEater, Benchmade, GearJunkie, NBC Select, Skadden, CNBC + internal sales forecasting report (5,082 SKUs)</p>
      </div>
    </div>
  );
}
