export default function VoteFallback() {
  return (
    <div className="flex justify-center gap-16 items-center min-h-[80vh]">
      {[1, 2].map((i) => (
        <div key={i} className="flex flex-col items-center gap-4">
          <div className="w-64 h-64 bg-gray-800/10 rounded-lg animate-pulse" />
          <div className="text-center space-y-2 flex flex-col items-center justify-center">
            <div className="h-6 w-16 bg-gray-800/10 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-800/10 rounded animate-pulse" />
            <div className="h-12 w-24 bg-gray-800/10 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
