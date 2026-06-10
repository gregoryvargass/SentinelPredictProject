import SkeletonBlock from "./SkeletonBlock";

export default function ReportDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <SkeletonBlock className="h-10 w-64" />
          <SkeletonBlock className="h-5 w-80" />
        </div>

        <SkeletonBlock className="h-10 w-40" />
      </div>

      <SkeletonBlock className="h-72 w-full" />

      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonBlock className="h-72 w-full" />
        <SkeletonBlock className="h-72 w-full" />
      </div>

      <SkeletonBlock className="h-56 w-full" />
      <SkeletonBlock className="h-40 w-full" />
    </div>
  );
}