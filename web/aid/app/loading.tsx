export default function Loading() {
  return (
    <div className="space-y-8 pb-12 animate-pulse">
      <div className="h-10 w-48 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 h-[400px] bg-slate-200 rounded-xl" />
        <div className="h-[400px] bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}
