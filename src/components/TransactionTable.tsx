import type { Transaction } from "../types/transaction";

interface TransactionTableProps {
  transactions: Transaction[];
}

const ROW_HEIGHT = 48;
const VIEWPORT_HEIGHT = 560;
const OVERSCAN = 5;

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-mono uppercase text-slate-400 bg-slate-950/50">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Merchant</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Risk Score</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">
                Security Note ({transactions.length})
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-mono text-slate-300">{txn.id}</td>
                <td className="py-3 px-4 font-medium text-white">
                  {txn.merchant}
                  <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {txn.country}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-200">
                  ${txn.amount.toFixed(2)}
                </td>
                <td className="py-3 px-4 font-mono">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${txn.riskScore > 80 ? "bg-rose-500/20 text-rose-300" : txn.riskScore > 50 ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}
                  >
                    {txn.riskScore}/100
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-xs">{txn.status}</td>
                <td className="py-3 px-4 text-xs text-slate-400">
                  {" "}
                  {txn.wasSanitized && (
                    <span className="mr-2 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                      SANITIZED
                    </span>
                  )}
                  {txn.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
