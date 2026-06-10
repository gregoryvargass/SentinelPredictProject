import SkeletonBlock from "./SkeletonBlock";

export default function ReportsTableSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonBlock className="h-10 w-40" />
      <SkeletonBlock className="h-20 w-full" />
      <SkeletonBlock className="h-40 w-full" />

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="space-y-3">
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}