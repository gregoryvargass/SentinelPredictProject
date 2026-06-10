import SkeletonBlock from "./SkeletonBlock";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonBlock className="h-10 w-56" />
      <SkeletonBlock className="h-24 w-full" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SkeletonBlock className="h-28 w-full" />
        <SkeletonBlock className="h-28 w-full" />
        <SkeletonBlock className="h-28 w-full" />
        <SkeletonBlock className="h-28 w-full" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonBlock className="h-96 w-full" />
        <SkeletonBlock className="h-96 w-full" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonBlock className="h-80 w-full" />
        <SkeletonBlock className="h-80 w-full" />
      </div>

      <SkeletonBlock className="h-96 w-full" />
    </div>
  );
}