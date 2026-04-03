import { useState, type Key } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Target,
  ArrowUpRight,
  Download,
  RefreshCw,
  Package,
  BarChart2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────

const WEEKLY_SALES = [5200, 8100, 6400, 9800, 7200, 5100, 3400];
const WEEKLY_ORDERS = [34, 52, 41, 63, 48, 31, 22];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STAT_CARDS = [
  {
    label: "Total Revenue",
    value: "$45,200",
    change: "+13.2%",
    up: true,
    icon: DollarSign,
    accent: "#2563eb",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  {
    label: "Daily Average",
    value: "$1,850",
    change: "+2.1%",
    up: true,
    icon: TrendingUp,
    accent: "#059669",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
  {
    label: "Monthly Target",
    value: "$38,400",
    change: "+18.4%",
    up: true,
    icon: Target,
    accent: "#7c3aed",
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
  },
  {
    label: "Total Orders",
    value: "291",
    change: "-4.3%",
    up: false,
    icon: ShoppingBag,
    accent: "#e11d48",
    bg: "bg-rose-50",
    text: "text-rose-500",
    border: "border-rose-100",
  },
];

const TOP_PRODUCTS = [
  {
    name: "Vinyl Banners",
    sub: "Outdoor · 3 color · Grommets",
    sold: 1240,
    pct: 87,
    badge: "Top Performer",
    badgeColor: "bg-blue-50 text-blue-600",
    emoji: "🖼️",
  },
  {
    name: "Custom Die-Cut Stickers",
    sub: "Matte Finish · Weatherproof",
    sold: 850,
    pct: 62,
    badge: "Steady Growth",
    badgeColor: "bg-emerald-50 text-emerald-600",
    emoji: "🏷️",
  },
  {
    name: "Business Cards",
    sub: "Premium Silk · Foil · Cardstock",
    sold: 620,
    pct: 45,
    badge: "Seasonal High",
    badgeColor: "bg-amber-50 text-amber-600",
    emoji: "💳",
  },
  {
    name: "Canvas Prints",
    sub: "Gallery Wrap · UV Protected",
    sold: 410,
    pct: 31,
    badge: "Rising",
    badgeColor: "bg-violet-50 text-violet-600",
    emoji: "🎨",
  },
];

const STOCK_ITEMS = [
  { name: "PVC Vinyl", current: 45, max: 100, status: "ok" },
  { name: "Sticker Roll (Matte)", current: 8, max: 100, status: "low" },
  { name: "Mesh Banner", current: 72, max: 100, status: "ok" },
  { name: "Glossy Photo Paper", current: 30, max: 50, status: "ok" },
  { name: "Laminate Film", current: 6, max: 80, status: "low" },
  { name: "Transfer Tape", current: 4, max: 50, status: "low" },
];

const ORDER_HISTORY = [
  {
    id: "#ORD-2841",
    customer: "PrintCo Ltd",
    items: 4,
    total: "$1,280",
    status: "Delivered",
    date: "Mar 28",
  },
  {
    id: "#ORD-2840",
    customer: "Banner World",
    items: 2,
    total: "$640",
    status: "Processing",
    date: "Mar 27",
  },
  {
    id: "#ORD-2839",
    customer: "Sticker Studio",
    items: 7,
    total: "$2,100",
    status: "Delivered",
    date: "Mar 26",
  },
  {
    id: "#ORD-2838",
    customer: "QuickPrint Inc",
    items: 1,
    total: "$320",
    status: "Cancelled",
    date: "Mar 25",
  },
  {
    id: "#ORD-2837",
    customer: "FlyerKing",
    items: 3,
    total: "$960",
    status: "Delivered",
    date: "Mar 24",
  },
];

// ── Sparkline SVG ─────────────────────────────────────────────
function Sparkline({
  data,
  color = "#2563eb",
  height = 72,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const W = 320,
    H = height,
    pad = 10;
  const xs = data.map(
    (_: any, i: number) => pad + (i / (data.length - 1)) * (W - pad * 2),
  );
  const ys = data.map(
    (v) => pad + (1 - (v - min) / (max - min || 1)) * (H - pad * 2),
  );
  const line = xs
    .map(
      (x: number, i: number) =>
        `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`,
    )
    .join(" ");
  const area = `${line} L${xs[xs.length - 1].toFixed(1)},${H} L${xs[0].toFixed(1)},${H} Z`;
  const id = `g${color.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {xs.map((x: string | number | undefined, i: number) => (
        <circle
          key={i}
          cx={x}
          cy={ys[i]}
          r="3.5"
          fill="white"
          stroke={color}
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────
function BarChart({
  data,
  color = "#2563eb",
}: {
  data: number[];
  color?: string;
}) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-20 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{
              height: `${(v / max) * 100}%`,
              background: `${color}${i === data.indexOf(max) ? "ff" : "99"}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Section Title ─────────────────────────────────────────────
function SectionTitle({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="mb-5">
      <h2
        className="text-base font-bold text-slate-800 tracking-tight"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {children}
      </h2>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function ReportPage() {
  const [range, setRange] = useState("7d");
  const [activeChart, setActiveChart] = useState("sales");

  return (
    <div
      className="min-h-screen bg-slate-50 pb-24"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-100 px-6 py-5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-extrabold text-slate-800 tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Reports
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Analytics & performance · March 2026
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Range Selector */}
            <div className="flex bg-slate-100 rounded-xl overflow-hidden p-1 gap-1">
              {["7d", "30d", "90d"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    range === r
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {r === "7d" ? "Week" : r === "30d" ? "Month" : "Quarter"}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-all">
              <Download size={13} /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-7 space-y-8">
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((s, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-5 border ${s.border} shadow-sm hover:shadow-md transition-all group`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider leading-tight">
                  {s.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <s.icon size={15} className={s.text} />
                </div>
              </div>
              <div
                className="text-2xl font-extrabold text-slate-800 tracking-tight mb-1.5"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {s.value}
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${s.up ? "text-emerald-500" : "text-rose-500"}`}
              >
                {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {s.change} vs last period
              </div>
            </div>
          ))}
        </div>

        {/* ── Sales & Orders Chart ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <SectionTitle sub="7-day revenue and order volume trend">
                Sales Performance
              </SectionTitle>
            </div>
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
              {["sales", "orders"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveChart(t)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
                    activeChart === t
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="mb-3">
            {activeChart === "sales" ? (
              <Sparkline data={WEEKLY_SALES} color="#2563eb" height={90} />
            ) : (
              <Sparkline data={WEEKLY_ORDERS} color="#7c3aed" height={90} />
            )}
          </div>
          <div className="flex justify-between px-1">
            {DAYS.map((d) => (
              <span
                key={d}
                className="text-xs font-medium text-slate-400"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Summary Strip */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
            {[
              {
                label: "Peak Day",
                value: activeChart === "sales" ? "$9,800" : "63 orders",
                sub: "Thursday",
              },
              {
                label: "Weekly Total",
                value: activeChart === "sales" ? "$45,200" : "291 orders",
                sub: "↑ 13.5% vs last week",
              },
              {
                label: "Avg / Day",
                value: activeChart === "sales" ? "$6,457" : "41.6 orders",
                sub: "On target",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
              >
                <div className="text-xs text-slate-400 font-medium mb-1">
                  {item.label}
                </div>
                <div
                  className="text-sm font-bold text-slate-800"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {item.value}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Top Products ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <SectionTitle sub="Top selling items by volume this month">
              Most Popular Products
            </SectionTitle>
            <button className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline">
              View Full Report <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {TOP_PRODUCTS.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-lg flex-shrink-0">
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800">
                    {p.name}
                  </div>
                  <div className="text-xs text-slate-400 truncate">{p.sub}</div>
                </div>
                {/* Progress */}
                <div className="w-24 hidden sm:block">
                  <div
                    className="flex justify-between text-xs text-slate-400 mb-1 font-medium"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    <span>{p.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                </div>
                <div className="text-right min-w-[70px]">
                  <div
                    className="text-sm font-bold text-slate-800"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {p.sold.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">sold</div>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${p.badgeColor} hidden md:inline-flex`}
                >
                  {p.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Inventory Stock Report ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <SectionTitle sub="Current stock levels vs. capacity">
              Inventory Stock Report
            </SectionTitle>
            <div className="flex items-center gap-2 text-xs text-rose-500 font-semibold bg-rose-50 px-3 py-1.5 rounded-lg">
              <AlertCircle size={13} />3 items low
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {STOCK_ITEMS.map((item, i) => {
              const pct = Math.round((item.current / item.max) * 100);
              const isLow = item.status === "low";
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isLow ? "bg-rose-50" : "bg-emerald-50"}`}
                  >
                    {isLow ? (
                      <AlertCircle size={15} className="text-rose-500" />
                    ) : (
                      <CheckCircle2 size={15} className="text-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800">
                      {item.name}
                    </div>
                    <div
                      className="text-xs text-slate-400 mt-0.5"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {item.current} / {item.max} units
                    </div>
                  </div>
                  <div className="w-32 hidden sm:block">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isLow ? "bg-rose-400" : "bg-emerald-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg min-w-[68px] text-center ${
                      isLow
                        ? "bg-rose-50 text-rose-500"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {pct}% full
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Order History ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <SectionTitle sub="Recent order history and status">
              Order History Trends
            </SectionTitle>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl transition-all">
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
          {/* Bar summary */}
          <div className="px-6 pt-4 pb-2">
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
              {DAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <BarChart data={WEEKLY_ORDERS} color="#2563eb" />
          </div>
          {/* Orders List */}
          <div className="divide-y divide-slate-50 mt-2">
            {ORDER_HISTORY.map((o, i) => {
              const statusStyles: Record<string, string> = {
                Delivered: "bg-emerald-50 text-emerald-600",
                Processing: "bg-blue-50 text-blue-600",
                Cancelled: "bg-rose-50 text-rose-500",
              };
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold text-slate-400"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {o.id}
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        {o.customer}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {o.items} items · {o.date}
                    </div>
                  </div>
                  <div
                    className="text-sm font-bold text-slate-800"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {o.total}
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${statusStyles[o.status]}`}
                  >
                    {o.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
                                                                                                                                                                                                                                                                                                                                                             