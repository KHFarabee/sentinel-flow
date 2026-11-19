import type {
  SecurityAuditReport,
  Transaction,
  TransactionCategory,
  TransactionStatus,
} from "../types/transaction";

const VALID_STATUSES: readonly TransactionStatus[] = [
  "COMPLETED",
  "PENDING",
  "FLAGGED",
  "BLOCKED",
];

const VALID_CATEGORIES: readonly TransactionCategory[] = [
  "Cloud Infrastructure",
  "Wire Transfer",
  "Crypto",
  "Retail",
  "Offshore",
];

const MAX_ALLOWED_TRANSACTION_AMOUNT = 10_000_000;

// ১. হ্যাকারের XSS পেলোড শনাক্ত করার প্যাটার্ন (Regular Expressions)
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // <script>...</script> ট্যাগ
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, // <iframe> ট্যাগ
  /<[^>]+>/g, // যেকোনো HTML ট্যাগ (যেমন <img onerror=...>)
  /javascript\s*:/gi, // javascript: প্রোটোকল
  /on\w+\s*=/gi, // যেকোনো ইভেন্ট হ্যান্ডলার (যেমন onerror=, onclick=)
];

export function sanitizeText(input: unknown): {
  cleanText: string;
  hadXss: boolean;
} {
  if (typeof input !== "string") return { cleanText: "", hadXss: false };

  let cleanText = input;
  let hadXss = false;

  for (const pattern of DANGEROUS_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(cleanText)) {
      hadXss = true;
      cleanText = cleanText.replace(pattern, "[REDACTED_SECURITY_THREAT]");
    }
  }
  return {
    cleanText: cleanText.trim(),
    hadXss,
  };
}

export function validateAndSanitizaTransactions(rawData: unknown) {
  const auditReport: SecurityAuditReport = {
    totalRawRecords: 0,
    validRecords: 0,
    rejectedCorruptedRecords: 0,
    neutralizedXssPayloads: 0,
    corruptedIds: [],
  };

  if (!Array.isArray(rawData)) return { transaction: [], auditReport };

  auditReport.totalRawRecords = rawData.length;
  const safeTransaction: Transaction[] = [];

  for (const item of rawData) {
    if (typeof item !== "object" || item === null) {
      auditReport.rejectedCorruptedRecords++;
      continue;
    }
    const record = item as Record<string, unknown>;
    const rawId = typeof record.id === "string" ? item.id : "UNKNOWN_ID";
    const amount = Number(record.amount);
    if (!Number.isFinite(amount) || amount <= 0 || amount >= 10_000_000) {
      auditReport.rejectedCorruptedRecords++;
      auditReport.corruptedIds.push(rawId);
      continue;
    }

    const riskScore = Number(record.riskScore);
    if (!Number.isFinite(riskScore) || riskScore < 0 || riskScore > 100) {
      auditReport.rejectedCorruptedRecords++;
      auditReport.corruptedIds.push(rawId);
      continue;
    }

    const status = record.status as TransactionStatus;
    const category = record.category as TransactionCategory;
    if (
      !VALID_STATUSES.includes(status) ||
      !VALID_CATEGORIES.includes(category)
    ) {
      auditReport.rejectedCorruptedRecords++;
      auditReport.corruptedIds.push(rawId);
      continue;
    }

    const parsedDate = Date.parse(String(record.timestamp));
    if (Number.isNaN(parsedDate)) {
      auditReport.rejectedCorruptedRecords++;
      auditReport.corruptedIds.push(rawId);
      continue;
    }
    const marchantSanitized = sanitizeText(record.merchant);
    const noteSanitized = sanitizeText(record.note);
    const accountSanitized = sanitizeText(record.accountHolder);

    const wasSanitized =
      marchantSanitized.hadXss ||
      noteSanitized.hadXss ||
      accountSanitized.hadXss;

    if (wasSanitized) auditReport.neutralizedXssPayloads++;

    safeTransaction.push({
      id: rawId,
      timestamp: String(record.timestamp),
      merchant: marchantSanitized.cleanText || "Unknown Merchant",
      amount,
      currency: "USD",
      country:
        typeof record.country === "string"
          ? record.country.slice(0, 2).toUpperCase()
          : "UN",
      category,
      riskScore,
      status,
      ipAddress:
        typeof record.ipAddress === "string" ? record.ipAddress : "0.0.0.0",
      accountHolder: accountSanitized.cleanText || "Anonymous",
      note: noteSanitized.cleanText,
      wasSanitized,
    });

    auditReport.validRecords++;
  }
  return {
    transaction: safeTransaction,
    auditReport,
  };
}
