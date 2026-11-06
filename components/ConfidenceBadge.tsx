type ConfidenceBadgeProps = { confidence: number };

export default function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const tone = confidence >= 85 ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : confidence >= 70 ? "bg-amber-50 text-amber-700 ring-amber-200" : "bg-rose-50 text-rose-700 ring-rose-200";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${tone}`}>{confidence}% confidence</span>;
}
