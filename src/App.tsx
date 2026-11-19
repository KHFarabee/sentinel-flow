import { useEffect, useState } from "react";
import SecurityBanner from "./components/SecurityBanner";
import TransactionTable from "./components/TransactionTable";
import type { SecurityAuditReport, Transaction } from "./types/transaction";
import { validateAndSanitizaTransactions } from "./utils/security";

export function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auditReport, setAuditReport] = useState<SecurityAuditReport | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isStressMode, setIsStressMode] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      const response = await fetch("/data.json");
      const rawData: unknown = await response.json();
      const result = validateAndSanitizaTransactions(rawData);
      setTransactions(result.transaction);
      setAuditReport(result.auditReport);
    }
    loadData();
  }, []);

  const filteredTransaction = transactions.filter((txn) => {
    const query = searchQuery.toLowerCase();
    return (
      txn.id.toLowerCase().includes(query) ||
      txn.merchant.toLowerCase().includes(query) ||
      txn.country.toLowerCase().includes(query) ||
      txn.note.toLowerCase().includes(query)
    );
  });

  const visibleTransactions = isStressMode
    ? filteredTransaction
    : filteredTransaction.slice(0, 50);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            SentinelFlow
          </h1>
          <p className="text-sm text-emerald-400 mt-2">
            Total Transactions in Memory: {transactions.length}
          </p>
          <button
            type="button"
            onClick={() => setIsStressMode((prev) => !prev)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer border ${
              isStressMode
                ? "bg-rose-500/20 border-rose-500 text-rose-300"
                : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            {isStressMode
              ? "🔥 Stress Mode ON (Rendering All 9,999 Rows!)"
              : "⚡ Safe Mode: Top 50 (Click to Test React Limit)"}
          </button>
        </header>
        {auditReport && <SecurityBanner report={auditReport} />}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, merchant, country.."
            className="w-full sm:max-w-md px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <TransactionTable transactions={visibleTransactions} />
      </div>
    </div>
  );
}

export default App;
