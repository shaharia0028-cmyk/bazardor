import { getTrend, PRICE_COLORS, type Trend } from "@/lib/constants";
import { formatPercent } from "@/lib/format";

const SYMBOLS: Record<Trend, string> = { up: "▲", down: "▼", flat: "—" };

/** Tailwind text colour for a trend (see PRICE_COLORS for the red/green choice). */
export function trendColor(trend: Trend): string {
  if (trend === "flat") return "text-base-content/60";
  const isGood = PRICE_COLORS.risePositive ? trend === "up" : trend === "down";
  return isGood ? "text-success" : "text-error";
}

/** ▲ ২.১% / ▼ ২.৯% / — ০.০% */
export function TrendText({ change, className = "" }: { change: number; className?: string }) {
  const trend = getTrend({ change });
  return (
    <span className={`font-semibold ${trendColor(trend)} ${className}`}>
      {SYMBOLS[trend]} {formatPercent(change)}
    </span>
  );
}

export default function PriceBadge({ change }: { change: number }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full bg-base-200 px-2.5 text-xs">
      <TrendText change={change} />
    </span>
  );
}
