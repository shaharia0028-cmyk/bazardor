export default function ProductLoading() {
  return (
    <div className="space-y-4" role="status" aria-label="লোড হচ্ছে…">
      <div className="skeleton h-6 w-56" />
      <div className="skeleton h-44 w-full rounded-2xl" />
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-24 rounded-2xl" />
        ))}
      </div>
      <div className="skeleton h-96 w-full rounded-2xl" />
    </div>
  );
}
