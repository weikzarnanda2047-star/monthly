import React from 'react';
import { Wallet, Pencil, Wand2 } from 'lucide-react';
import { formatBaht, getShortMonthLabel, getMonthLabel } from '../utils';

interface FinancialOverviewProps {
  totalFund: number;
  income: number;
  expenses: number;
  paidCount: number;
  totalMembersCount: number;
  expectedIncomeTotal: number;
  isManualIncome: boolean;
  monthIndex: number;
  yearBE: number;
  expenseCount: number;
  onEditTotalFund: () => void;
  onEditIncome: () => void;
  onAutoCalculateIncome: () => void;
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  totalFund,
  income,
  expenses,
  paidCount,
  totalMembersCount,
  expectedIncomeTotal,
  monthIndex,
  yearBE,
  expenseCount,
  onEditTotalFund,
  onEditIncome,
  onAutoCalculateIncome,
}) => {
  const shortMonthStr = getShortMonthLabel(monthIndex, yearBE);
  const fullMonthStr = getMonthLabel(monthIndex, yearBE);
  const balance = income - expenses;
  const isProfit = balance >= 0;

  return (
    <section className="px-4 py-2 space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-slate-800">ภาพรวมการเงินเดือนนี้</h2>
        <span className="text-xs font-semibold text-slate-400">{shortMonthStr}</span>
      </div>

      {/* Card 1: เงินทั้งหมด (กรอกใส่ได้) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3c349e] via-[#4338ca] to-[#3730a3] p-4 text-white shadow-md shadow-indigo-900/15">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Wallet className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-medium text-white/90">เงินทั้งหมด (กรอกใส่ได้)</span>
          </div>

          <button
            onClick={onEditTotalFund}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-indigo-950 text-[11px] font-bold shadow-xs hover:bg-white/90 active:scale-95 transition-all"
          >
            <Pencil className="w-3 h-3 text-indigo-900" />
            <span>กรอกใส่เอง</span>
          </button>
        </div>

        {/* Big Amount */}
        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ฿{formatBaht(totalFund)}
          </span>
          <span className="text-xs font-normal text-white/80">บาท</span>
        </div>

        <p className="text-[11px] text-white/70 mt-2 font-light">
          ยอดเงินกองกลาง / เงินในบัญชีทั้งหมด
        </p>
      </div>

      {/* Card 2: เงินเข้าเดือนนี้ (กันยายน 2569) */}
      <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/40 p-4 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-semibold text-slate-700">
              เงินเข้าเดือนนี้ ({fullMonthStr})
            </span>
          </div>

          <button
            onClick={onEditIncome}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-emerald-300 bg-white text-emerald-800 text-[11px] font-semibold hover:bg-emerald-50 active:scale-95 transition-all"
          >
            <Pencil className="w-3 h-3 text-emerald-600" />
            <span>ใส่ยอดเอง</span>
          </button>
        </div>

        {/* Big Inflow Amount */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
            +฿{formatBaht(income)}
          </span>
          <span className="text-xs font-medium text-slate-500">บาท</span>
        </div>

        {/* Sub-row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-emerald-100/80 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>
              เช็กชื่อโอนแล้ว <strong className="text-slate-800 font-bold">{paidCount}</strong> จาก{' '}
              {totalMembersCount} คน
            </span>
          </div>

          <button
            onClick={onAutoCalculateIncome}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100/70 hover:bg-emerald-200/70 text-emerald-800 font-semibold active:scale-95 transition-all cursor-pointer"
            title="คำนวณยอดเงินเข้าจากสมาชิกที่โอนแล้ว"
          >
            <Wand2 className="w-3 h-3 text-emerald-600" />
            <span>ช่วยคำนวณ (฿{formatBaht(expectedIncomeTotal)})</span>
          </button>
        </div>
      </div>

      {/* 2 Columns: เงินออกเดือนนี้ & เงินคงเหลือ */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Card 3: เงินออกเดือนนี้ */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <span className="text-xs font-medium text-slate-600">เงินออกเดือนนี้</span>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="text-xl sm:text-2xl font-bold text-rose-600 tracking-tight">
              -฿{formatBaht(expenses)}
            </span>
            <span className="text-[11px] font-normal text-slate-400">บาท</span>
          </div>

          <p className="text-[11px] text-slate-400 font-normal">{expenseCount} รายการจ่ายออก</p>
        </div>

        {/* Card 4: เงินคงเหลือ */}
        <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-sky-100 flex items-center justify-center">
                <div className="w-2 h-2 rounded-xs bg-sky-500" />
              </div>
              <span className="text-xs font-medium text-slate-600">เงินคงเหลือ</span>
            </div>

            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isProfit ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {isProfit ? 'กำไร' : 'ขาดทุน'}
            </span>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span
              className={`text-xl sm:text-2xl font-bold tracking-tight ${
                isProfit ? 'text-slate-800' : 'text-rose-600'
              }`}
            >
              ฿{formatBaht(balance)}
            </span>
            <span className="text-[11px] font-normal text-slate-400">บาท</span>
          </div>

          <p className="text-[11px] text-slate-400 font-normal">คำนวณ: เข้า - ออก</p>
        </div>
      </div>
    </section>
  );
};
