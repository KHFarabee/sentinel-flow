function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-3 w-3 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            System Online
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">
          SentinelFlow
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          High-Frequency Financial Fraud & Transaction Monitoring Engine.
        </p>
      </div>
    </div>
  );
}

export default App;
