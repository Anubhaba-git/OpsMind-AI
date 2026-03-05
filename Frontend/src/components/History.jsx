export default function History({ history }) {
  return (
    <div className="h-full flex flex-col bg-white/5 border border-white/10 rounded-xl">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 font-semibold">
        History
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <p className="text-white/60 text-sm">
            No questions asked yet.
          </p>
        ) : (
          history.map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
              title={item.question}
            >
              <p className="text-sm font-semibold truncate">
                {item.question}
              </p>
              <p className="text-xs text-white/60 mt-1">
                {new Date(item.time).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
