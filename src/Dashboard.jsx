import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { AlertTriangle, TrendingUp, Zap, Target, Shield, CloudLightning, ShoppingCart, Mail, MessageSquare, DollarSign, TreePine, Package, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

// ─── DATA: BAKED IN FROM MAY 15 2026 RESEARCH ─────────────────────────────────

const SCAN_DATE = "May 15, 2026";
const SCAN_WEEK = "Week of May 18–24, 2026";
const KEY_DAY_INDEX = 3; // Thu 5/21 — NOAA hurricane outlook, the week's pivotal action day

const urgencyLevels = { CRITICAL: "🔴", HIGH: "🟠", MEDIUM: "🟡", WATCH: "🟢" };

const categories = [
  {
    id: "emergency",
    name: "Emergency Supplies",
    icon: "Shield",
    urgency: "CRITICAL",
    color: "#ef4444",
    heatScore: 92,
    summary: "This is the highest-leverage week of the quarter for emergency-prep merchandising. NOAA's official 2026 Atlantic hurricane outlook releases Thursday May 21 — nine days before the June 1 season open. Pre-season forecasts (CSU 13 storms / 6 hurricanes; AccuWeather 11–16 named storms) signal a 'somewhat below-normal' El Niño season, but below-normal still means 11–16 named storms. Southwest wildfire risk is elevated with snowpack under 20% of normal, and Plains flooding adds an active-week prep driver.",
    sellingNow: [
      "Emergency kits / bug-out bags (7-day food + water)",
      "Water storage containers, purification tablets & gravity filters",
      "NOAA weather radios, flashlights & lanterns",
      "Portable power stations, solar chargers & CO detectors",
      "Long-shelf-life / freeze-dried food buckets",
      "N95 respirators & air filtration for wildfire smoke",
    ],
    sellingNext: [
      "Generator accessories, fuel cans & transfer-fill supplies",
      "Hurricane hardware — window film, tie-downs, tarps",
      "First-aid & trauma kits",
      "Pet emergency kits & waterproof document safes",
      "Vehicle emergency kits for evacuation readiness",
    ],
    whyNext: "The May 21 NOAA announcement is a guaranteed national news event that will drive a search-and-purchase spike for hurricane prep through May 21–31, leading into the June 1 season open. Inventory and content staged before May 21 captures the reaction wave; competitors who wait will be late.",
    marketingAngles: {
      email: "Subject: 'The 2026 Hurricane Forecast Is In.' Pre-stage for May 21 — lead with the headline storm numbers and a tiered kit bundle (Starter / Family / 7-Day).",
      social: "May 21–22 myth-buster post: 'Below-Normal Season ≠ No Risk — it only takes one storm.' Pair with a 7-day prep checklist graphic.",
      ppc: "Surge spend May 21–31 on 'emergency kit,' 'hurricane supplies,' 'freeze dried food,' 'portable generator.' Boost Gulf & Atlantic coast geos.",
      sms: "Hurricane season starts June 1. NOAA's 2026 forecast just dropped — stock your kit before the rush → [link].",
    },
  },
  {
    id: "weather",
    name: "Weather / Storm Events",
    icon: "CloudLightning",
    urgency: "CRITICAL",
    color: "#ef4444",
    heatScore: 88,
    summary: "A multi-day severe weather setup hits the central U.S. this week: a western trough ejects across the Plains with a possible severe outbreak Monday May 18 (Nebraska into central Kansas — tornadoes, large hail, damaging wind), then the front spreads scattered severe storms from Texas through the MS/OH Valleys into the Mid-Atlantic Tuesday–Thursday. Simultaneously a record-challenging heatwave grips the East and South — 22 states with record-heat potential, temps 15–25°F above average. NOAA's official 2026 Atlantic hurricane outlook drops Thursday May 21.",
    sellingNow: [
      "NOAA weather radios & emergency AM/FM radios",
      "Tarps, sandbags & flood-barrier supplies",
      "Battery-powered fans, cooling towels & hydration products",
      "Headlamps, flashlights & rechargeable lanterns",
      "Weatherproof totes & gear bags to stage supplies",
      "Portable power stations & power banks",
    ],
    sellingNext: [
      "Full hurricane-prep kits (post-May 21 demand surge)",
      "Generator accessories, fuel cans & CO detectors",
      "Shade canopies & cooling gear",
      "First-aid & trauma kits",
      "Water storage containers & purification tablets",
    ],
    whyNext: "The May 21 NOAA outlook will dominate national news and push hurricane prep from a niche coastal concern to mainstream search-and-buy behavior within days. The early record-breaking heat is pulling the summer cooling and hydration demand curve forward by 3–4 weeks.",
    marketingAngles: {
      email: "Subject: 'Two extremes, one week — are you ready for either?' Feature storm radios and lighting alongside cooling and hydration gear. Fire a May 21 NOAA-reaction follow-up.",
      social: "Split-screen reel: Plains tornado risk Monday vs. East Coast record heat. Caption: 'Two extremes, one week — are you ready?'",
      ppc: "Bid up: 'noaa weather radio,' 'portable power station,' 'hurricane prep kit,' 'cooling fan.' Front-load budget to May 21–24.",
      sms: "FLASH: Severe storms in the Plains + record heat out East. Storm & cooling gear in stock, same-day ship → [link].",
    },
  },
  {
    id: "tactical",
    name: "Tactical & EDC",
    icon: "Target",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 74,
    summary: "Memorial Day weekend (May 23–25) anchors the week — 54% of consumers plan a holiday-weekend purchase (up from 36% in 2025), though average planned spend has dropped sharply to ~$86, signaling deal-hunting, lower-ticket buying. The Father's Day ramp (June 21) is the parallel driver: tactical knives and EDC flashlights are top male-gift categories. The 2026 EDC trend skews 'minimalist preparedness' — flat lights, titanium knives, compact multi-tools. Section 122's 10% global tariff remains in effect after a May 12 appeals-court stay.",
    sellingNow: [
      "EDC flashlights — flat lights & compact 1,000+ lumen models",
      "Folding knives — titanium-handle & lightweight tactical models",
      "Multi-tools & pocket organizers (minimalist-carry trend)",
      "EDC belts, wallets & pocket clips",
      "Tactical bags, sling packs & admin pouches",
      "Headlamps & compact lighting for Memorial Day camping",
    ],
    sellingNext: [
      "Father's Day gift bundles — knife + light + multi-tool sets",
      "Engravable / personalized knives & gift-ready packaging",
      "Watches, tactical pens & giftable EDC accessories",
      "Range / EDC gear bags as summer-carry season opens",
    ],
    whyNext: "Memorial Day weekend kicks off the summer-carry and gifting season, and the Father's Day gift-research window opens in late May — knives and flashlights are perennial top-3 dad gifts. Tariff-driven price increases make Memorial Day promotions a 'lock in pre-hike pricing' urgency lever.",
    marketingAngles: {
      email: "Subject: 'Memorial Day EDC Event — plus early Father's Day picks.' Feature gift-bundled knife / light / multi-tool sets. Push 'beat tariff price hikes.'",
      social: "'2026 EDC trend: minimalist carry' reel showcasing flat lights and titanium folders. Unboxing of new releases.",
      ppc: "Bid up: 'memorial day knife sale,' 'edc flashlight,' 'father's day gift for dad,' 'multi-tool.' Use bundle landing pages.",
      sms: "Memorial Day EDC deals are LIVE — knives, flashlights & multi-tools. Beat tariff price hikes → [link].",
    },
  },
  {
    id: "hunting",
    name: "Hunting — Turkey / Fishing",
    icon: "TreePine",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 71,
    summary: "This week is the final stretch of spring turkey season — West Virginia closes May 24, Wisconsin May 26, with NY, PA, MN and MI running through May 30–31 and Maine the lone outlier to June 6. It's the last-call window for turkey consumables. Fishing pivots hard into summer patterns: bass move post-spawn, walleye school on flats, and catfish enter peak as water temps climb into the 70s. Memorial Day weekend (May 23–25) is the year's biggest camping-and-fishing demand spike.",
    sellingNow: [
      "TSS turkey loads & choke tubes for the final hunt week",
      "Turkey calls, decoys & lightweight camo",
      "Post-spawn bass tackle — spinnerbaits, soft plastics, deep crankbaits, jigs",
      "Catfish gear — circle hooks, cut-bait rigs, heavy combos",
      "Walleye tackle — jigs, live-bait rigs, crawler harnesses",
      "Tackle boxes, line & rod/reel combos for Memorial Day trips",
    ],
    sellingNext: [
      "Summer fishing transition gear — topwater, offshore baits, panfish rigs",
      "Kayak fishing accessories & wading gear",
      "Coolers, fillet knives & stringers",
      "Sun-protection apparel — performance shirts, gaiters, hats",
      "Bug repellent & Thermacell-type products",
    ],
    whyNext: "Once turkey seasons close (most by May 30–31), hunting-consumable demand collapses and the outdoor consumer shifts fully to summer fishing and camping — a transition that completes over Memorial Day weekend. Warm-water species feed aggressively, making late May the strongest summer-tackle window of the year.",
    marketingAngles: {
      email: "Subject: 'Last call — turkey season closes this week.' Late-season turkey gear for the hunting segment, paired with a 'Gear Up for Summer Fishing' cross-sell block.",
      social: "Tip carousel: 'Post-spawn bass patterns — where the big ones go in late May.' Split with a turkey-season-closer reminder.",
      ppc: "Dual ad groups: 'turkey choke tube' / 'tss turkey loads' (closing-fast urgency) and 'catfish rigs' / 'post spawn bass lures.'",
      sms: "Headed to the lake this Memorial Day? Tackle, coolers & combos in stock — shop before the weekend rush → [link].",
    },
  },
  {
    id: "surplus",
    name: "Military Surplus",
    icon: "Package",
    urgency: "MEDIUM",
    color: "#eab308",
    heatScore: 68,
    summary: "Memorial Day weekend (May 23–25) is the peak camping-demand event of late spring, with grills / outdoor cooking (28%) and summer apparel (27%) the top holiday categories — directly favoring surplus apparel, boots, and field gear. Gorpcore remains a dominant 2026 crossover trend: vintage surplus boots, cargo pants, and field jackets styled into mainstream streetwear. The Section 122 10% global tariff plus elevated China duties keep pressuring imported soft-goods costs, making authentic surplus a relative-value story.",
    sellingNow: [
      "Combat & tactical boots — surplus & lightweight summer styles",
      "Cargo pants / BDU trousers & field shorts",
      "Surplus field jackets, shirts & moisture-wicking base layers",
      "Rucksacks, ALICE / MOLLE packs & duffels",
      "Ponchos, shelter halves & tarps",
      "Surplus cooking gear — canteens, mess kits, folding stoves",
    ],
    sellingNext: [
      "Lightweight summer-weight surplus apparel & boonie hats",
      "Sleeping systems, cots & bivy gear",
      "Camp organization — footlockers, gear bags, organizers",
      "Insect-season gear — mosquito nets, gaiters",
    ],
    whyNext: "Memorial Day weekend traditionally launches the summer camping season, and surplus packs, apparel, and shelter gear ride that demand directly. With tariffs lifting prices on name-brand imported outdoor apparel, durable authentic surplus becomes a sharper value proposition for budget-cautious 2026 shoppers.",
    marketingAngles: {
      email: "Subject: 'Memorial Day Camp-Out Event — surplus packs, boots & shelter gear.' Feature a camping bundle; compare surplus vs. tariff-inflated retail.",
      social: "Gorpcore styling reel: 'Field jacket + cargos — the surplus look everyone's wearing in 2026.'",
      ppc: "Bid up: 'military surplus boots,' 'alice pack,' 'bdu pants,' 'cheap camping gear.' Add Memorial Day promo extensions.",
      sms: "Memorial Day = camping season. Surplus packs, boots & tarps — built tough, priced right → [link].",
    },
  },
];

// Derived data for charts
const heatData = categories.map((c) => ({ name: c.name.split(" —")[0].split(" /")[0], score: c.heatScore, fill: c.color }));

const channelPriorityData = [
  { channel: "Email", weather: 90, turkey: 80, emergency: 95, edc: 88, surplus: 70 },
  { channel: "Social", weather: 82, turkey: 85, emergency: 78, edc: 90, surplus: 88 },
  { channel: "PPC", weather: 95, turkey: 75, emergency: 96, edc: 90, surplus: 65 },
  { channel: "SMS", weather: 96, turkey: 72, emergency: 98, edc: 80, surplus: 60 },
];

const weeklyCalendar = [
  { day: "Mon 5/18", action: "Launch 'Storm Week' email — severe weather outbreak forecast for the Plains today; lead with weather radios, lighting, power stations. Pre-build the May 21 NOAA-reaction email so it's ready to fire." },
  { day: "Tue 5/19", action: "'Last Call: Turkey Season' push to the hunting segment (WV closes 5/24); cross-sell summer fishing tackle. Keep storm-prep ads live as severe storms continue TX / MS Valley." },
  { day: "Wed 5/20", action: "Launch the Memorial Day Sale early-access window — EDC, surplus camping gear, and fishing tackle bundles. Email + social teaser." },
  { day: "Thu 5/21", action: "PRIMARY ACTION — fire the 'NOAA 2026 Hurricane Outlook Is OUT' email + SMS the moment the 11 a.m. EDT briefing ends. Surge PPC on hurricane / emergency-kit keywords. Post the 'below-normal ≠ no risk' social myth-buster." },
  { day: "Fri 5/22", action: "Full Memorial Day Sale goes live site-wide. Reinforce emergency-prep messaging. Heatwave cooling-gear social post." },
  { day: "Sat 5/23", action: "Memorial Day weekend peak — 'Camping & Fishing This Weekend?' SMS featuring surplus packs, coolers, tackle. Boost top-converting Memorial Day ads." },
  { day: "Sun 5/24", action: "'Sale Ends Monday' Memorial Day urgency email; final turkey-season-closer (WV) note; tease Father's Day gifting — knives & lights — for the week ahead." },
];

const topKeywords = [
  { keyword: "hurricane prep kit", volume: "Very High", cpc: "$2.40", competition: "High", priority: "🔴" },
  { keyword: "emergency survival kit", volume: "High", cpc: "$2.10", competition: "High", priority: "🔴" },
  { keyword: "noaa weather radio", volume: "High", cpc: "$1.30", competition: "Med", priority: "🔴" },
  { keyword: "portable power station", volume: "High", cpc: "$3.20", competition: "High", priority: "🟠" },
  { keyword: "memorial day knife sale", volume: "Med", cpc: "$1.60", competition: "Med", priority: "🟠" },
  { keyword: "military surplus boots", volume: "Med", cpc: "$1.10", competition: "Med", priority: "🟠" },
  { keyword: "edc flashlight", volume: "High", cpc: "$1.70", competition: "High", priority: "🟠" },
  { keyword: "tss turkey loads", volume: "Low", cpc: "$0.95", competition: "Low", priority: "🟡" },
  { keyword: "post spawn bass lures", volume: "Med", cpc: "$0.85", competition: "Med", priority: "🟡" },
  { keyword: "alice pack / molle backpack", volume: "Med", cpc: "$1.00", competition: "Med", priority: "🟡" },
];

const tariffImpact = [
  { item: "Tactical / Outdoor Apparel & Cargo Pants (China + global)", tariff: "10%+", priceImpact: "+8-15% retail; brands raising prices late May", action: "Promote pre-hike in-stock inventory as a Memorial Day value" },
  { item: "Imported Backpacks & Packs", tariff: "10%+", priceImpact: "+10-15%; some brands can't forecast FY26", action: "Push current-priced packs for camping; feature surplus alternatives" },
  { item: "Imported Footwear / Combat Boots", tariff: "10-20%", priceImpact: "De minimis exemption ended; some brands paused US shipments", action: "Position military surplus boots as the tariff-insulated value play" },
  { item: "EDC Flashlights & Multi-Tools (China)", tariff: "~30%+", priceImpact: "+15-25% on import-dependent SKUs", action: "Bundle for Father's Day now; 'lock in pricing before hikes'" },
  { item: "TSS Turkey Loads (tungsten — imported)", tariff: "10%+", priceImpact: "Modest +5-10% on premium loads", action: "Clear remaining stock during the final turkey-season week" },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

const COLORS = ["#ef4444", "#ef4444", "#f97316", "#f97316", "#eab308"];

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
  const [expanded, setExpanded] = useState({ now: true, next: true, marketing: false });
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
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-400">Weekly Trend Intelligence Scan</p>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{SCAN_WEEK}</span>
          <span className="text-xs bg-red-900 text-red-200 px-2 py-0.5 rounded animate-pulse">LIVE DATA</span>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-950 border border-red-800 rounded-lg p-3 mb-6 flex items-start gap-3">
        <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-300">CRITICAL ALERT — NOAA 2026 Hurricane Outlook + Severe Weather Week</p>
          <p className="text-xs text-red-400 mt-1">NOAA releases its official 2026 Atlantic hurricane outlook Thursday May 21 (11 a.m. EDT) — nine days before the June 1 season open. A possible severe weather outbreak hits the Plains May 18, while a record-challenging heatwave grips 22 Eastern and Southern states. Pre-stage emergency-prep inventory and content now.</p>
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
                <p className="text-sm font-semibold text-red-300">1. NOAA Hurricane Outlook Reaction (Thu 5/21)</p>
                <p className="text-xs text-gray-300 mt-1">NOAA releases its official 2026 Atlantic hurricane outlook Thursday at 11 a.m. EDT. Pre-stage the email, SMS, and PPC surge now and fire the moment the briefing ends — this is the week's defining sales event.</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">2. Storm + Heat Dual Campaign (Mon–Thu)</p>
                <p className="text-xs text-gray-300 mt-1">A severe weather outbreak threatens the Plains May 18 while a record heatwave grips 22 Eastern states. Sell storm-prep gear and cooling/hydration products in the same week — two demand streams, one campaign.</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">3. Memorial Day Sale + Father's Day Ramp (Wed onward)</p>
                <p className="text-xs text-gray-300 mt-1">Memorial Day participation is up (54% plan a purchase) but spend is down ~70% — lead with value bundles and lower-ticket EDC, tackle, and surplus camping gear. Bridge into the Father's Day knife/flashlight gifting ramp.</p>
              </div>
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
            <div key={i} className={`rounded-lg p-3 ${i === KEY_DAY_INDEX ? "bg-red-950/50 border border-red-800" : "bg-gray-900"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-bold ${i === KEY_DAY_INDEX ? "text-red-300" : "text-green-400"}`}>{day.day}</span>
                {i === KEY_DAY_INDEX && <span className="text-xs bg-red-800 text-red-200 px-1.5 py-0.5 rounded">KEY DAY</span>}
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
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Storm Prep:</strong> <span className="text-gray-300">NE, KS, TX, MO, IA + MS/OH Valley & Mid-Atlantic</span></div>
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Hurricane / Emergency:</strong> <span className="text-gray-300">Gulf & Atlantic coast — TX, LA, FL, GA, SC, NC</span></div>
              <div className="bg-orange-950/30 rounded p-2"><strong className="text-orange-400">Turkey / Fishing:</strong> <span className="text-gray-300">WV, WI, PA, NY, MN, MI, ME + nationwide fishing</span></div>
              <div className="bg-yellow-950/30 rounded p-2"><strong className="text-yellow-400">EDC / Surplus:</strong> <span className="text-gray-300">Nationwide — metro areas for EDC, rural for surplus</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TARIFF WATCH TAB ─── */}
      {activeTab === "tariffs" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-400" /> Tariff Impact Watch</h2>
          <p className="text-sm text-gray-400">Section 122's 10% global tariff remains fully in effect — the Federal Circuit issued a May 12 stay keeping it live during appeal. Here's what to act on now.</p>
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
            <p className="text-sm text-gray-300">Tariffs are still live and refunds are not flowing: the May 7 court ruling against Section 122 applies only to named plaintiffs, and the May 12 appeals-court stay keeps the 10% global tariff in effect for everyone else through expedited briefing. For this week, 'buy before prices rise' remains a credible, honest urgency message. Position Army Navy Outdoors as the value destination — authentic military surplus is the tariff-insulated alternative as name-brand imported apparel, packs, and footwear climb 10–25%.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-600">Army Navy Outdoors — Weekly Trend Intelligence | Generated {SCAN_DATE} | Sources: NOAA, SPC, Colorado State University, AccuWeather, Ready.gov, OutdoorHub, KY Fish & Wildlife, BDO, Inside Radio, GearJunkie</p>
      </div>
    </div>
  );
}
