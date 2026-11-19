// ১. Union Type (নির্দিষ্ট কয়েকটি অপশনের বাইরে কিছু হতে পারবে না)
export type TransactionStatus = "COMPLETED" | "PENDING" | "FLAGGED" | "BLOCKED";

export type TransactionCategory =
  | "Cloud Infrastructure"
  | "Wire Transfer"
  | "Crypto"
  | "Retail"
  | "Offshore";

// ২. Interface (একটি পূর্ণাঙ্গ ট্রানজেকশন অবজেক্ট দেখতে কেমন হবে তার নকশা)
export interface Transaction {
  readonly id: string;
  timestamp: string;
  merchant: string;
  amount: number;
  currency: "USD";
  country: string;
  category: TransactionCategory;
  riskScore: number;
  status: TransactionStatus;
  ipAddress: string;
  accountHolder: string;
  note: string;
  // সিকিউরিটি ফ্ল্যাগ: ডাটাটিতে কি হ্যাকারের কোনো আক্রমণ (XSS) ধরা পড়েছিল এবং পরিষ্কার করা হয়েছে?
  wasSanitized?: boolean;
}

// ৩. আমাদের সিকিউরিটি চেকপোস্টের রিপোর্ট কার্ড
export interface SecurityAuditReport {
  totalRawRecords: number;
  validRecords: number;
  rejectedCorruptedRecords: number;
  neutralizedXssPayloads: number;
  corruptedIds: string[];
}
