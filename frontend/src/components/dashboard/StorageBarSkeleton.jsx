export default function StorageBarSkeleton() {
  return (
    <div className="w-full rounded-xl bg-black border border-neutral-800 p-4 sm:p-6 shadow-md animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-neutral-800" />

        <div className="flex-1">
          <div className="h-5 w-24 bg-neutral-800 rounded mb-2" />
          <div className="h-3 w-40 bg-neutral-800 rounded" />
        </div>
      </div>

      <div className="w-full h-3 rounded-full bg-neutral-800 mb-4" />

      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-neutral-800" />
            <div className="h-3 w-16 bg-neutral-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}