export interface Member {
  id: string;
  name: string;
  nickname: string;
  tag: string;
  phone: string;
  bankName: string;
  accountNumber: string;
  defaultAmount: number;
  avatarColor?: string;
}

export interface PaymentStatus {
  paid: boolean;
  paidAt?: string; // e.g. "2 ต.ค. 69, 13:21"
  amount?: number;
  method?: string; // "พร้อมเพย์" | "โอนธนาคาร" | "เงินสด"
  slipUrl?: string;
  note?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  payee: string;
  dateStr: string; // e.g. "1 ต.ค. 69, 23:25 น."
  note?: string;
}

export interface MonthData {
  monthKey: string; // "2026-09"
  yearBE: number; // 2569
  monthIndex: number; // 8 (0-indexed, 8 = Sep)
  manualTotalFund: number; // 10000
  isManualIncome: boolean;
  manualIncome: number; // 455
  payments: Record<string, PaymentStatus>;
  expenses: Expense[];
}

export interface AppSettings {
  groupName: string;
  promptPayNumber: string;
  promptPayName: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  defaultFeePerPerson: number;
}
