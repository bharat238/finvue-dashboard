import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="animate-fade-slide-in">
      {/* Hero */}
      <div className="mb-6">
        <Skeleton className="h-3 w-32 mb-2" />
        <Skeleton className="h-12 w-64" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card rounded-2xl shadow-ambient p-5">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-8 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-3 bg-card rounded-2xl shadow-ambient p-6">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-64 mb-4" />
          <Skeleton className="h-[220px] w-full rounded-xl" />
        </div>
        <div className="lg:col-span-2 bg-card rounded-2xl shadow-ambient p-6">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-[200px] w-[200px] rounded-full mx-auto" />
        </div>
      </div>
    </div>
  );
}
