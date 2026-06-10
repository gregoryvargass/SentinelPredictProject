export default function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-800/80 ${className}`}
    />
  );
}