import type { SecurityAuditReport } from "../types/transaction";

interface SecurityBannerProps {
  report: SecurityAuditReport;
}

const SecurityBanner = ({ report }: SecurityBannerProps) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <p className="text-xs text-slate-400 uppercase font-mono">
          Raw Scanned
        </p>
        <p className="text-2xl font-bold text-white mt-1">
          {report.totalRawRecords.toLocaleString()}
        </p>
      </div>
      <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/50">
        <p className="text-xs text-emerald-400 uppercase font-mono">
          Safe Records
        </p>
        <p className="text-2xl font-bold text-emerald-400 mt-1">
          {report.validRecords.toLocaleString()}
        </p>
      </div>
      <div className="p-4 rounded-xl bg-slate-900 border border-amber-900/50">
        <p className="text-xs text-amber-400 uppercase font-mono">
          XSS Neutralized
        </p>
        <p className="text-2xl font-bold text-amber-400 mt-1">
          {report.neutralizedXssPayloads.toLocaleString()}
        </p>
      </div>
      <div className="p-4 rounded-xl bg-slate-900 border border-rose-900/50">
        <p className="text-xs text-rose-400 uppercase font-mono">
          Corrupted Blocked
        </p>
        <p className="text-2xl font-bold text-rose-400 mt-1">
          {report.rejectedCorruptedRecords.toLocaleString()}
        </p>
        <p className="text-xs text-rose-300 font-mono mt-1">
          ID: {report.corruptedIds.join(", ")}
        </p>
      </div>
    </section>
  );
};

export default SecurityBanner;
