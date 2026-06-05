import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { AlertTriangle, TrendingUp, Zap, Target, Shield, CloudLightning, ShoppingCart, Mail, MessageSquare, DollarSign, TreePine, Package, ChevronDown, ChevronUp, ExternalLink, Database, AlertOctagon } from "lucide-react";

// ─── DATA: BAKED IN FROM JUNE 5 2026 RESEARCH + REAL STORE SALES (1,450 SKUs) ──

const SCAN_DATE = "June 5, 2026";
const SCAN_WEEK = "Week of June 1–7, 2026";
const TODAY_INDEX = 4; // Fri 6/5 — scan day, index into weeklyCalendar
const STORE_DATA_SOURCE = "sales_forecasting_report — 1,450 SKUs, 7-day + 30-day order velocity";

const urgencyLevels = { CRITICAL: "🔴", HIGH: "🟠", MEDIUM: "🟡", WATCH: "🟢" };

const categories = [
  {
    id: "emergency",
    name: "Emergency Supplies",
    icon: "Shield",
    urgency: "CRITICAL",
    color: "#ef4444",
    heatScore: 96,
    summary: "Atlantic hurricane season is now ACTIVE — Day 5 today, with NHC tracking the first potential disturbance. NOAA's below-normal outlook (8–14 named storms, 3–6 hurricanes) is paired with FEMA / agency messaging that 'it only takes one,' driving early-season prep purchasing. Layered demand: wildfire risk elevated across the southern tier, and the June severe-weather belt is migrating north toward the Central/Northern Plains and Upper Midwest with derecho risk this month.",
    sellingNow: [
      "MREs & long-shelf-life food (your #1 store mover by far)",
      "Water storage, filtration & purification tablets",
      "Portable power stations, battery banks & solar chargers",
      "NOAA weather radios, batteries & lanterns",
      "First-aid / trauma kits, IFAKs & tourniquets",
      "N95 / respirator masks (wildfire smoke belt)",
    ],
    sellingNext: [
      "Generators & fuel cans (early hurricane prep)",
      "Hurricane hardware — tarps, window film, sandbags",
      "Evacuation go-bags & document/cash kits",
      "Pet emergency kits & large-format water reserves",
    ],
    whyNext: "We're now inside hurricane season — every named system or NHC bulletin drives a measurable purchase spike. The northward shift of the severe-weather belt in June adds Plains/Upper-Midwest tornado and derecho demand layered on top of coastal hurricane prep.",
    marketingAngles: {
      email: "Subject: 'Day 5 of Hurricane Season — is your kit ready?' Lead with MRE bundles + a 72-hour checklist. CRITICAL internal: most popular MREs at <2 days of cover.",
      social: "'Day 5 of Atlantic hurricane season — here's what to have in the house.' Pair with the FEMA 'it only takes one' line.",
      ppc: "Aggressive bids on 'hurricane kit,' 'mre case,' 'emergency water storage,' 'wildfire smoke mask,' 'weather radio.' Geo-boost Gulf & Atlantic coast.",
      sms: "Hurricane season is OPEN. Your top sellers are nearly out — MRE cases, sandbags & power kits restocking → [link].",
    },
    storeData: {
      topSellers: [
        { name: "MRE Entree — Chicken Burrito Bowl", d30: 1120, d7: 210 },
        { name: "2026 GI MRE Case A or B", d30: 744, d7: 172 },
        { name: "2026 GI MRE A&B 2-Pack", d30: 221, d7: 46 },
        { name: "MRE Entree — Mexican Beef w/ Vegetables", d30: 123, d7: 56 },
        { name: "MRE Entree — Beef Stew", d30: 122, d7: 58 },
        { name: "P-38 Can Opener — U.S. Shelby Co.", d30: 119, d7: 2 },
      ],
      trending: [
        { name: "Genuine US Issue MRE — 1-Meal Pack", d7: 84, d30: 109, mult: 3.3 },
        { name: "MRE Beef Stew", d7: 58, d30: 122, mult: 2.0 },
        { name: "MRE Pasta w/ Marinara (Veg)", d7: 54, d30: 116, mult: 2.0 },
      ],
      cold: [
        { name: "P-38 Can Opener — 10-Pack", d7: 0, d30: 11 },
        { name: "U.S. Military Issue Sandbags (Olive)", d7: 0, d30: 10 },
      ],
      insight: "🚨 OOS CRITICAL: GI MRE Case at 0.6 days of cover (744 d30, only 14 on hand, NO reorder placed); MRE Chicken Burrito Bowl at 2.2 days (1,120 d30, 81 on hand). Place reorders TODAY or you lose hurricane-season demand. Genuine US Issue 1-Meal pack accelerating at 3.3× recent pace.",
    },
  },
  {
    id: "weather",
    name: "Weather / Storm Events",
    icon: "CloudLightning",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 80,
    summary: "June's severe-weather belt is migrating north to Nebraska, Iowa, Minnesota, the Dakotas, Wisconsin, Illinois and southern Canada, with derecho risk across the Northern Plains / Upper Midwest / Great Lakes / Ohio Valley if a ridge builds over the central U.S. Flooding may affect more people than tornadoes this month — wetter-than-normal conditions are favored in the Southwest, Central Rockies, Southern High Plains and Southeast. Heat exhaustion, lightning, and rapid-onset flooding are the leading health risks.",
    sellingNow: [
      "Waterproof bags, dry sacks & wet-weather bags (your top storm sellers)",
      "Rain gear, ponchos & waterproof shells",
      "Tarps & flood-response gear (Southwest / Southeast rain belt)",
      "Hydration packs, cooling towels & electrolytes (heat & humidity)",
      "Headlamps, flashlights & power banks for outage readiness",
      "NOAA weather radios (Plains tornado / derecho belt)",
    ],
    sellingNext: [
      "Soft-shell jackets & rain shells (active accelerators)",
      "Generators & fuel storage cans",
      "Storm shutters / window film & lashing rope",
      "Cooling fans & shade canopies as heat entrenches",
    ],
    whyNext: "The northward shift puts the Plains and Upper Midwest in the bullseye for the next 6 weeks — Nebraska to Wisconsin gets the next tornado / derecho cycles. Southwest and Southeast wetter-than-normal regimes drive sustained rain-gear and tarp demand.",
    marketingAngles: {
      email: "Subject: 'June's storm map just shifted north.' Feature waterproofing, ponchos, headlamps; geo-target NE/IA/MN/SD/WI.",
      social: "Map graphic: 'Where June's severe-weather belt lives this year' + a 'Do you have these tonight?' 3-item checklist.",
      ppc: "Bid up: 'weather radio,' 'rain poncho,' 'tarp heavy duty,' 'dry bag,' 'soft shell jacket.' Front-load Northern Plains and Midwest geos.",
      sms: "Storm belt shifted north — tornado & derecho risk this week in NE/IA/MN/SD/WI. Radios & rain gear shipping today → [link].",
    },
    storeData: {
      topSellers: [
        { name: "Military SealLine Large Main Pack Stuff Sack", d30: 48, d7: 16 },
        { name: "USMC SealLine Medium Waterproof Stuff Sack", d30: 45, d7: 15 },
        { name: "US Issue Waterproof Wet Weather Bag", d30: 42, d7: 12 },
        { name: "USMC FILBE Coyote Hydration Pack", d30: 40, d7: 10 },
        { name: "USMC MARPAT Wet Weather Tarp", d30: 34, d7: 15 },
        { name: "SealLine Waterproof Bag Bundle", d30: 26, d7: 14 },
      ],
      trending: [
        { name: "Special Ops Tactical Hooded Soft Shell Jacket", d7: 4, d30: 4, mult: 4.3 },
        { name: "Gen III Level 6 Extreme Cold & Wet Weather Pants", d7: 3, d30: 4, mult: 3.2 },
        { name: "U.S. Army ACU Poncho Liner (Used)", d7: 11, d30: 18, mult: 2.6 },
      ],
      cold: [
        { name: "USMC MARPAT Poncho Liner w/ Zipper", d7: 0, d30: 20 },
        { name: "Scepter Military 5-Gallon Plastic Fuel Can (Used)", d7: 0, d30: 11 },
      ],
      insight: "Waterproofing dominates weather response — SealLine stuff sacks and the USMC Wet Weather Tarp lead, with the ACU Poncho Liner up 2.6× pace. The Scepter fuel can went cold this week after pulling 11 last month — check for supply gap or stock-out.",
    },
  },
  {
    id: "surplus",
    name: "Military Surplus",
    icon: "Package",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 80,
    summary: "Gorpcore continues to drive crossover demand in 2026 (muted earth tones, BDU/cargo silhouettes, surplus footwear). Summer camping season is now active — Memorial Day kicked it off and the camping segment is running hard through June. Tariffs (Section 122 10% still collected under May 12 appeals-court stay, expires July 24; ~30%+ on China; SCOTUS struck the IEEPA 20% layer) keep imported soft goods 10–20% more expensive than authentic surplus.",
    sellingNow: [
      "MOLLE pouches — Flash Bang Pouch BREAKING OUT (see Store Data)",
      "Surplus packs, FILBE / ALICE / MOLLE rucks & sustainment pouches",
      "GI canteens, ammo cans, mess kits & field cooking gear",
      "BDU / OCP / Multicam apparel & cargo pants",
      "Boonie hats, patrol caps & summer-weight headwear",
      "USMC 'Charlies' shirts & dress-uniform pieces (real breakouts this week)",
    ],
    sellingNext: [
      "Lightweight summer-weight surplus & sun-protective layers",
      "Camping & sleep systems — bivies, modular sleep, cots",
      "Father's Day-friendly surplus apparel & boots",
      "Bulk / value bundles ahead of July 4 + summer travel",
    ],
    whyNext: "MOLLE accessory demand is signaling something real (Flash Bang Pouch sold 316/332 monthly units in just the last 7 days). Combined with camping-season ramp and tariff inflation on new imports, surplus is positioned to win the value conversation through summer.",
    marketingAngles: {
      email: "Subject: 'Field-tested. Tariff-free.' Feature MOLLE pouches, GI canteens, surplus uniform breakouts. Highlight the Flash Bang Pouch restock.",
      social: "Gorpcore reel: 'Why surplus uniforms are the value play of 2026' — Charlies shirt + OCP + Boonie hat outfit-of-the-day.",
      ppc: "Bid up: 'molle pouch,' 'military surplus boots,' 'alice pack,' 'boonie hat,' 'surplus cargo pants.'",
      sms: "MOLLE pouches selling out FAST — Flash Bang Pouch 316 sold this week. Restock dropping → [link].",
    },
    storeData: {
      topSellers: [
        { name: "U.S. Issue Flash Bang MOLLE Pouch (Grade 1)", d30: 332, d7: 316 },
        { name: "50 CAL Ammo Can (storage box)", d30: 224, d7: 20 },
        { name: "2-Pack U.S. Issue Flash Bang MOLLE Pouch", d30: 166, d7: 158 },
        { name: "Coyote FILBE Sustainment Pouch", d30: 95, d7: 14 },
        { name: "Military Issue M4 Double Single Mag Pouch", d30: 84, d7: 14 },
        { name: "1 Qt. GI Military Plastic Canteen", d30: 80, d7: 14 },
      ],
      trending: [
        { name: "U.S. Issue Flash Bang MOLLE Pouch", d7: 316, d30: 332, mult: 4.1 },
        { name: "2-Pack Flash Bang MOLLE Pouch", d7: 158, d30: 166, mult: 4.1 },
        { name: "USMC Khaki SS 'Charlies' Shirt", d7: 9, d30: 9, mult: 4.3 },
      ],
      cold: [
        { name: "U.S. Issue Multicam M4 Double Mag Pouch", d7: 0, d30: 29 },
        { name: "Military Issue Hydration GP MOLLE Pouch (Used)", d7: 0, d30: 25 },
      ],
      insight: "🚨 MASSIVE BREAKOUT: BOTH Flash Bang MOLLE Pouch SKUs are stocked out at zero on-hand — 316 of 332 monthly orders for the single, and 158 of 166 for the 2-pack, came in the last 7 days. URGENT restock + homepage feature. Multiple uniform breakouts (Charlies shirt, OCP FR shirt, Boonie hat) all running 4.3× recent pace.",
    },
  },
  {
    id: "tactical",
    name: "Tactical & EDC",
    icon: "Target",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 78,
    summary: "Father's Day is 16 days out — peak gift-research window. NRF projects record $22.4B in Father's Day spending with an average $199.38 per person (up ~$10 YoY); the 35–44 age cohort plans to spend $278.90. Greeting cards (58%), clothing (55%), and gift cards (50%) lead intent, but EDC knives, multi-tools, and pocket lights are perennial top-3 dad-gift categories with strong margin. Tariff pressure (~30% on Chinese EDC inputs) makes 'lock in pricing now' a credible urgency lever.",
    sellingNow: [
      "EDC folding knives & multi-tools (Father's Day hero category)",
      "EDC flashlights — flat-profile & high-lumen pocket lights",
      "Compasses, whistles & navigation basics",
      "Ferro rods & fire-starting kits",
      "Tactical pens & EDC carry organizers",
      "Machetes & field-utility blades (your 4.3× breakout)",
    ],
    sellingNext: [
      "Father's Day gift bundles — knife + light + multi-tool sets",
      "Engravable / personalized knives (lead-time pulls these forward)",
      "Gift cards as a hedge for last-minute / practical shoppers",
      "Range / utility bags & EDC backpacks",
    ],
    whyNext: "Father's Day gift research peaks 10–14 days before the holiday. Shipping cutoffs for personalized gear are NOW. The $22.4B / $199 avg spend backdrop means tiered bundles ($25 / $75 / $200) will catch the full spread of shopper intent.",
    marketingAngles: {
      email: "Subject: 'Gifts Dad will actually use — 16 days to Father's Day.' Bundle by budget ($25 / $75 / $200); show shipping cutoffs.",
      social: "'5 EDC gifts under $50' + '5 under $200' carousels; unboxing reels of new pocket lights and multi-tools.",
      ppc: "Bid up: 'father's day gifts for dad,' 'best EDC knife,' 'multi-tool gift,' 'pocket flashlight gift,' 'engraved knife.'",
      sms: "16 days to Father's Day. Knives, lights & multi-tools he'll actually carry — bundle deals live → [link].",
    },
    storeData: {
      topSellers: [
        { name: "Classic Military Style Metal Compass, OD", d30: 12, d7: 0 },
        { name: "Streamlight Sidewinder Compact II Light Kit", d30: 10, d7: 4 },
        { name: "Gov Issue Gerber E-Tool Tri-fold Shovel", d30: 9, d7: 2 },
        { name: "Sweetfire Strikeable Fire Starter, 8-Pack", d30: 8, d7: 0 },
        { name: "Rothco G.I. Style Police Whistle", d30: 7, d7: 1 },
        { name: "Ontario Knife SP16 SPAX, ACU", d30: 6, d7: 0 },
      ],
      trending: [
        { name: "18-inch MOLLE Machete Sheath OD", d7: 5, d30: 5, mult: 4.3 },
        { name: "Streamlight Sidewinder Compact II", d7: 4, d30: 10, mult: 1.7 },
      ],
      cold: [
        { name: "Classic Military Style Metal Compass, OD", d7: 0, d30: 12 },
      ],
      insight: "Tactical is your THINNEST category (29 SKUs, only 93 d30 orders). Your #1 tactical SKU — the OD Metal Compass — went completely cold this week. With Father's Day 16 days out and NRF forecasting $199 avg spend, the assortment is missing the depth to capture this window. Consider adding multi-tool, EDC light, and folding-knife SKUs ASAP.",
    },
  },
  {
    id: "hunting",
    name: "Hunting — Turkey / Fishing",
    icon: "TreePine",
    urgency: "MEDIUM",
    color: "#eab308",
    heatScore: 64,
    summary: "Spring turkey season effectively closed nationwide this week — Maine wrapped on June 6. Demand has rotated fully to summer fishing patterns: post-spawn bass on offshore structure, walleye schooling, catfish in peak feed, panfish/crappie. Father's Day (6/21) further pulls fishing gear into gift consideration. This is the cleanest summer-recreation window of the year for outdoor retailers.",
    sellingNow: [
      "Summer bass tackle — soft plastics, topwater, deep crankbaits",
      "Walleye gear — bottom-bouncers, worm harnesses",
      "Catfish setups — cut-bait rigs, glow floats, rod holders",
      "Panfish & crappie tackle",
      "Coolers, fillet knives & live wells",
      "UPF apparel, polarized sunglasses & bug repellent",
    ],
    sellingNext: [
      "Kayaks, float tubes & trolling motors",
      "Father's Day fishing gift bundles",
      "Bug & tick protection (peak season)",
      "Bank-fishing & night-fishing lighting",
    ],
    whyNext: "Post-spawn bite + warming panfish + active summer recreation = the highest-participation weeks of early summer. Father's Day adds gift-driven volume on top.",
    marketingAngles: {
      email: "Subject: 'Summer fishing is open — your starter kit + Father's Day gift picks.'",
      social: "Short clip 'Where bass go after the spawn' leading into a shallow-water lure carousel.",
      ppc: "Bid up: 'post spawn bass lures,' 'walleye crankbaits,' 'catfish rigs,' 'father's day fishing gift.'",
      sms: "Summer fishing season is HERE. Tackle, coolers & combos shipping today → [link].",
    },
    storeData: {
      notStocked: true,
      insight: "Reality check from the sales file: 0 hunting/turkey/fishing SKUs across all 1,450 active products. The store doesn't stock this category — consider hiding this tile or pivoting it to a category that matches your real assortment (MREs & Food Storage, or MOLLE & Carry, given the current sales mix).",
    },
  },
];

// Derived data for charts
const heatData = categories.map((c) => ({ name: c.name.split(" —")[0].split(" /")[0], score: c.heatScore, fill: c.color }));

const channelPriorityData = [
  { channel: "Email", weather: 90, turkey: 70, emergency: 98, edc: 92, surplus: 88 },
  { channel: "Social", weather: 82, turkey: 75, emergency: 85, edc: 92, surplus: 90 },
  { channel: "PPC", weather: 92, turkey: 70, emergency: 97, edc: 92, surplus: 80 },
  { channel: "SMS", weather: 95, turkey: 65, emergency: 99, edc: 85, surplus: 78 },
];

const weeklyCalendar = [
  { day: "Mon 6/1", action: "Hurricane season OPENS. Launch 'Hurricane Season 2026 — Day 1' campaign: MRE bundles, weather radios, water/power kits. Email + SMS + PPC surge." },
  { day: "Tue 6/2", action: "Father's Day soft launch (20 days out) — EDC gift guide tiered $25 / $75 / $200. Open landing page. Social teaser." },
  { day: "Wed 6/3", action: "Surplus & camping push — MOLLE pouches, GI canteens, Boonie hats, OCP shirts. Gorpcore styling reel." },
  { day: "Thu 6/4", action: "Mid-week storm refresh — northern Plains tornado / derecho risk content. Boost weather-radio PPC in NE/IA/MN/SD/WI." },
  { day: "Fri 6/5", action: "🚨 INTERNAL: PLACE MRE REORDERS TODAY (GI MRE Case at 0.6 days cover). Flash Bang MOLLE Pouch restock notice to customers. Father's Day SMS." },
  { day: "Sat 6/6", action: "Weekend Father's Day push + summer camp/camping kickoff — surplus boots, sleep systems, MOLLE packs. Maine turkey-season close-out note." },
  { day: "Sun 6/7", action: "Week recap + tease 'Storm Week' next week if Northern Plains pattern locks in. Send 'Shipping cutoffs approaching' Father's Day email." },
];

const topKeywords = [
  { keyword: "hurricane prep kit", volume: "Very High", cpc: "$1.90", competition: "High", priority: "🔴" },
  { keyword: "mre case", volume: "High", cpc: "$1.20", competition: "Med", priority: "🔴" },
  { keyword: "noaa weather radio", volume: "High", cpc: "$1.10", competition: "Med", priority: "🔴" },
  { keyword: "father's day gifts for dad", volume: "Very High", cpc: "$1.40", competition: "High", priority: "🔴" },
  { keyword: "best EDC knife", volume: "High", cpc: "$1.60", competition: "High", priority: "🟠" },
  { keyword: "military surplus boots", volume: "Med", cpc: "$0.95", competition: "Med", priority: "🟠" },
  { keyword: "molle pouch", volume: "Med", cpc: "$0.85", competition: "Med", priority: "🟠" },
  { keyword: "multi-tool gift", volume: "Med", cpc: "$1.15", competition: "Med", priority: "🟠" },
  { keyword: "tarp heavy duty", volume: "Med", cpc: "$0.90", competition: "Med", priority: "🟡" },
  { keyword: "boonie hat military", volume: "Med", cpc: "$0.70", competition: "Low", priority: "🟡" },
];

const tariffImpact = [
  { item: "Technical Backpacks (Vietnam)", tariff: "10%+ (up to ~25% stacked)", priceImpact: "+~10-20% retail", action: "Stock now; feature pre-increase pricing as urgency hook" },
  { item: "Boots & Leather Goods (China & Vietnam)", tariff: "30-70% CN / 0-32% VN", priceImpact: "+10-20%; relief 'years away'", action: "Lean into genuine surplus boots as the value alternative" },
  { item: "Field / Cargo Apparel (China & Vietnam)", tariff: "30-70% CN / 0-32% VN", priceImpact: "+10-20% on imported soft goods", action: "Promote earth-tone surplus apparel margin advantage" },
  { item: "EDC Knives, Lights & Multi-Tools (China)", tariff: "~30%+", priceImpact: "+15-25% on import-dependent SKUs", action: "Bundle for Father's Day now; 'lock in pricing before hikes'" },
  { item: "General Imported Gear (Sec 122 / IEEPA)", tariff: "10% to 7/24; IEEPA 20% struck", priceImpact: "Volatile — appeals stay keeps collection on", action: "Monitor July 24 expiry; avoid overcommitting forward buys" },
];

// ─── REAL STORE DATA: from the June 5, 2026 sales forecasting report ──────────

const overallTopMovers = [
  { name: "MRE Entree — Chicken Burrito Bowl", d30: 1120, d7: 210, category: "Emergency" },
  { name: "2026 GI MRE Case A or B", d30: 744, d7: 172, category: "Emergency" },
  { name: "Rothco Reflective Elastic PT Belt", d30: 577, d7: 1, category: "Other" },
  { name: "U.S. Issue Flash Bang MOLLE Pouch", d30: 332, d7: 316, category: "Surplus" },
  { name: "50 CAL Ammo Can (storage)", d30: 224, d7: 20, category: "Surplus" },
  { name: "2026 GI MRE A&B 2-Pack", d30: 221, d7: 46, category: "Emergency" },
  { name: "2-Pack Flash Bang MOLLE Pouch", d30: 166, d7: 158, category: "Surplus" },
  { name: "Route Package Protection", d30: 126, d7: 32, category: "Shipping" },
  { name: "MRE Entree — Mexican Beef w/ Vegetables", d30: 123, d7: 56, category: "Emergency" },
  { name: "MRE Entree — Beef Stew", d30: 122, d7: 58, category: "Emergency" },
];

const breakouts = [
  { name: "U.S. Issue Flash Bang MOLLE Pouch", d7: 316, d30: 332, mult: 4.1, category: "Surplus" },
  { name: "2-Pack Flash Bang MOLLE Pouch", d7: 158, d30: 166, mult: 4.1, category: "Surplus" },
  { name: "Genuine US Issue MRE — 1-Meal Pack", d7: 84, d30: 109, mult: 3.3, category: "Emergency" },
  { name: "Used MOLLE II ACU M4 Mag Pouch", d7: 65, d30: 108, mult: 2.6, category: "Surplus" },
  { name: "MRE Entree — Beef Stew", d7: 58, d30: 122, mult: 2.0, category: "Emergency" },
  { name: "Spiced Apples MRE Special", d7: 54, d30: 114, mult: 2.0, category: "Emergency" },
];

const outOfStockRisk = [
  { name: "2026 GI MRE Case A or B", oh: 14, d30: 744, cover: 0.6, status: "CRITICAL — no reorder placed" },
  { name: "U.S. Issue Flash Bang MOLLE Pouch", oh: 0, d30: 332, cover: 0.0, status: "ALREADY OOS" },
  { name: "2-Pack Flash Bang MOLLE Pouch", oh: 0, d30: 166, cover: 0.0, status: "ALREADY OOS" },
  { name: "2026 GI MRE A&B 2-Pack", oh: 7, d30: 221, cover: 1.0, status: "CRITICAL — 1 day cover" },
  { name: "Rothco Reflective Elastic PT Belt", oh: 23, d30: 577, cover: 1.2, status: "Note: d7=1, may be cooling" },
  { name: "MRE Entree — Chicken Burrito Bowl", oh: 81, d30: 1120, cover: 2.2, status: "URGENT — your #1 seller" },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

const COLORS = ["#ef4444", "#f97316", "#f97316", "#f97316", "#eab308"];

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
              <Database size={14} /> YOUR STORE — REAL DATA (7-DAY + 30-DAY VELOCITY)
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
                    <p className="text-xs font-bold uppercase tracking-wide text-cyan-300 mb-2">Top sellers (30-day & 7-day orders)</p>
                    <div className="bg-gray-900 rounded overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-700 text-gray-500">
                            <th className="text-left p-2 font-medium">Product</th>
                            <th className="text-right p-2 font-medium">30d</th>
                            <th className="text-right p-2 font-medium">7d</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.storeData.topSellers.map((p, i) => (
                            <tr key={i} className="border-b border-gray-800/50">
                              <td className="p-2 text-gray-200">{p.name}</td>
                              <td className="p-2 text-right text-white font-mono font-bold">{p.d30.toLocaleString()}</td>
                              <td className="p-2 text-right text-gray-400 font-mono">{p.d7.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {cat.storeData.trending && cat.storeData.trending.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-green-400 mb-2">🔥 Accelerating (7-day pace &gt; 30-day average)</p>
                      <div className="space-y-1">
                        {cat.storeData.trending.map((p, i) => (
                          <div key={i} className="bg-green-950/30 border border-green-900/50 rounded p-2 flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-200">{p.name}</span>
                            <span className="text-xs font-mono text-green-400 font-bold whitespace-nowrap">{p.mult.toFixed(1)}× pace · 7d:{p.d7}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cat.storeData.cold && cat.storeData.cold.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">❄ Going cold (0 sold this week, was selling)</p>
                      <div className="space-y-1">
                        {cat.storeData.cold.map((p, i) => (
                          <div key={i} className="bg-gray-900 border border-gray-700/50 rounded p-2 flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-300">{p.name}</span>
                            <span className="text-xs font-mono text-gray-400 whitespace-nowrap">7d:0 · 30d:{p.d30}</span>
                          </div>
                        ))}
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
        <AlertOctagon size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-300">CRITICAL ALERT — Hurricane Season Open + MRE Inventory at 0.6 Days Cover</p>
          <p className="text-xs text-red-400 mt-1">Atlantic hurricane season opened Monday June 1 — Day 5 today. NOAA forecast 8–14 named storms (below-normal but 'it only takes one'). The June severe-weather belt is shifting north to NE/IA/MN/SD/WI with derecho risk. <strong>INTERNAL URGENT:</strong> Your top MRE SKU (GI MRE Case, 744 d30 orders) has 14 on hand and NO reorder placed — 0.6 days of cover. Both Flash Bang MOLLE Pouch SKUs already OOS after selling 474 units this past week. Place reorders TODAY.</p>
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
                <p className="text-sm font-semibold text-red-300">1. 🚨 URGENT — Restock MRE Inventory TODAY</p>
                <p className="text-xs text-gray-300 mt-1">GI MRE Case at 0.6 days of cover (744 d30, 14 on hand, NO reorder placed); MRE Chicken Burrito Bowl at 2.2 days (1,120 d30, 81 on hand). Place reorders today or you stock out before the weekend and lose the hurricane-season demand window.</p>
              </div>
              <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-300">2. 🚨 Flash Bang MOLLE Pouch Breakout — Restock + Feature</p>
                <p className="text-xs text-gray-300 mt-1">Both Flash Bang MOLLE Pouch SKUs hit 4.1× recent pace and are ALREADY out of stock (332 + 166 d30, 0 on hand each). 474 units sold this past week alone. Emergency restock and feature on the homepage — this is your biggest breakout signal of the month.</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">3. Father's Day Bundle Launch (16 days out)</p>
                <p className="text-xs text-gray-300 mt-1">NRF projects record $22.4B / $199 avg spend; the 35-44 cohort plans $278.90. Launch tiered EDC bundles ($25 / $75 / $200) now to clear shipping cutoffs. Your tactical assortment is thin — consider adding multi-tool and pocket-light SKUs ASAP.</p>
              </div>
            </div>
          </div>

          {/* Store-Wide Reality Check (real sales) */}
          <div className="bg-gray-900 rounded-xl p-4 border border-cyan-900/50">
            <h2 className="text-lg font-bold mb-1 flex items-center gap-2 text-cyan-300"><Database size={18} /> Store-Wide Reality Check</h2>
            <p className="text-xs text-gray-500 mb-4">Source: {STORE_DATA_SOURCE}</p>

            {/* OOS Risk */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-red-300 mb-2">🚨 Out-of-Stock Risk (less than 2 weeks of cover at current pace)</h3>
              <div className="bg-gray-950 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-500">
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-right p-2 font-medium">On Hand</th>
                      <th className="text-right p-2 font-medium">30d Sold</th>
                      <th className="text-right p-2 font-medium">Cover (days)</th>
                      <th className="text-left p-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outOfStockRisk.map((p, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="p-2 text-gray-200">{p.name}</td>
                        <td className={`p-2 text-right font-mono ${p.oh === 0 ? "text-red-400 font-bold" : "text-yellow-300"}`}>{p.oh}</td>
                        <td className="p-2 text-right text-white font-mono">{p.d30.toLocaleString()}</td>
                        <td className={`p-2 text-right font-mono font-bold ${p.cover < 1 ? "text-red-400" : "text-yellow-300"}`}>{p.cover.toFixed(1)}</td>
                        <td className="p-2 text-red-300 text-xs">{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Breakouts */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-green-400 mb-2">🔥 Breakouts (7-day pace running well above 30-day average)</h3>
              <div className="bg-gray-950 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-500">
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-left p-2 font-medium">Category</th>
                      <th className="text-right p-2 font-medium">7d</th>
                      <th className="text-right p-2 font-medium">30d</th>
                      <th className="text-right p-2 font-medium">Lift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakouts.map((p, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="p-2 text-gray-200">{p.name}</td>
                        <td className="p-2 text-gray-400">{p.category}</td>
                        <td className="p-2 text-right text-white font-mono font-bold">{p.d7.toLocaleString()}</td>
                        <td className="p-2 text-right text-gray-400 font-mono">{p.d30.toLocaleString()}</td>
                        <td className="p-2 text-right text-green-400 font-mono font-bold">{p.mult.toFixed(1)}×</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top 10 movers */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-cyan-300 mb-2">Top 10 Movers Store-Wide (last 30 days)</h3>
              <div className="bg-gray-950 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-500">
                      <th className="text-left p-2 font-medium w-6">#</th>
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-left p-2 font-medium">Category</th>
                      <th className="text-right p-2 font-medium">30d</th>
                      <th className="text-right p-2 font-medium">7d</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overallTopMovers.map((p, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="p-2 text-gray-500 font-mono">{i + 1}</td>
                        <td className="p-2 text-gray-200">{p.name}</td>
                        <td className="p-2 text-gray-400">{p.category}</td>
                        <td className="p-2 text-right text-white font-mono font-bold">{p.d30.toLocaleString()}</td>
                        <td className="p-2 text-right text-gray-400 font-mono">{p.d7.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-cyan-950/30 border border-cyan-800/50 rounded p-3 text-xs text-gray-300 leading-relaxed">
              <strong className="text-cyan-300">Cross-reference takeaway:</strong> Your real store is far more emergency-and-surplus heavy than the categorical research implies. MREs and MOLLE pouches own the top 10. The Flash Bang MOLLE Pouch breakout (316 of 332 monthly orders in just the last week, both SKUs now OOS) is the single biggest signal in the data — this product needs an emergency PO and a homepage feature TODAY. The Hunting / Turkey / Fishing category remains zero-stock — recommend hiding or pivoting that tile to something that matches your actual mix (MREs & Food Storage, or MOLLE & Carry).
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
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Hurricane / Emergency:</strong> <span className="text-gray-300">Gulf & Atlantic coast — TX, LA, FL, GA, SC, NC</span></div>
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Tornado / Derecho:</strong> <span className="text-gray-300">NE, IA, MN, SD, ND, WI, IL, OH Valley</span></div>
              <div className="bg-orange-950/30 rounded p-2"><strong className="text-orange-400">Heat & Flooding:</strong> <span className="text-gray-300">Southwest, Central Rockies, Southern High Plains, Southeast</span></div>
              <div className="bg-yellow-950/30 rounded p-2"><strong className="text-yellow-400">EDC / Surplus:</strong> <span className="text-gray-300">Nationwide — metro areas for EDC, rural for surplus</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TARIFF WATCH TAB ─── */}
      {activeTab === "tariffs" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-400" /> Tariff Impact Watch</h2>
          <p className="text-sm text-gray-400">Section 122's 10% global tariff is still being collected — the Federal Circuit's May 12 stay kept it alive while the appeal proceeds; the statute expires July 24. The Supreme Court struck the separate 20% IEEPA layer. Pricing remains volatile.</p>
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
            <p className="text-sm text-gray-300">Imported soft goods — boots, packs, apparel, EDC knives/lights — remain 10–25% more expensive than authentic surplus. The CIT struck Section 122 on May 7 but the Federal Circuit stayed that May 12, so CBP keeps collecting from nearly all importers through the July 24 statutory cap. Position Army Navy Outdoors as the in-stock, pre-increase value play — your real sales data already shows surplus MOLLE pouches and uniform pieces breaking out 4×, validating that positioning. Avoid overcommitting forward buys until the July picture clears.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-600">Army Navy Outdoors — Weekly Trend Intelligence | Generated {SCAN_DATE} | Sources: NOAA, NHC, SPC, AccuWeather, NRF, Gibson Dunn / Skadden (tariff law) + internal sales forecasting report (1,450 SKUs)</p>
      </div>
    </div>
  );
}
