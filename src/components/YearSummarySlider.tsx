import React from 'react';
import { Calendar } from 'lucide-react';
import { THAI_MONTHS_SHORT } from '../constants';
import { formatBaht } from '../utils';

interface YearMonthStat {
  monthIndex: number;
  income: number;
  expenses: number;
  balance: number;
}

interface YearSummarySliderProps {
  yearBE: number;
  currentMonthIndex: number;
  totalYearIncome: number;
  totalYearExpenses: number;
  monthlyStats: YearMonthStat[];
  onSelectMonth: (monthIndex: number) => void;
}

export const YearSummarySlider: React.FC<YearSummarySliderProps> = ({
  yearBE,
  currentMonthIndex,
  totalYearIncome,
  totalYearExpenses,
  monthlyStats,
  onSelectMonth,
}) => {
  const shortYear = String(yearBE).slice(-2);

  return (
    <section className="px-4 py-3">
      {/* Header with badges */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-slate-500" />
          <h2 className="text-[13.5px] font-bold text-slate-800">
            สรุปเงินเข้า - เงินออก (ปี {yearBE})
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            เข้า ฿{formatBaht(totalYearIncome)}
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
            ออก ฿{formatBaht(totalYearExpenses)}
          </span>
        </div>
      </div>

      {/* Horizontal Month Cards Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth snap-x">
        {monthlyStats.map((stat) => {
          const isCurrent = stat.monthIndex === currentMonthIndex;
          const monthShort = THAI_MONTHS_SHORT[stat.monthIndex];

          return (
            <button
              key={stat.monthIndex}
              onClick={() => onSelectMonth(stat.monthIndex)}
              className={`shrink-0 w-24 p-2.5 rounded-xl border text-left transition-all snap-start ${
                isCurrent
                  ? 'border-emerald-500 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-slate-300'
              }`}
            >
              {/* Month label */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-bold ${
                    isCurrent ? 'text-emerald-700' : 'text-slate-700'
                  }`}
                >
                  {monthShort} &apos;{shortYear}
                </span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>

              {/* Inflow */}
              <div className="flex items-center justify-between text-[10.5px] leading-tight text-slate-500">
                <span>เข้า</span>
                <span
                  className={`font-semibold ${
                    stat.income > 0 ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {stat.income > 0 ? `+฿${formatBaht(stat.income)}` : '+฿0'}
                </span>
              </div>

              {/* Outflow */}
              <div className="flex items-center justify-between text-[10.5px] leading-tight text-slate-500 mt-0.5">
                <span>ออก</span>
                <span
                  className={`font-semibold ${
                    stat.expenses > 0 ? 'text-rose-600' : 'text-slate-400'
                  }`}
                >
                  {stat.expenses > 0 ? `-฿${formatBaht(stat.expenses)}` : '-฿0'}
                </span>
              </div>

              {/* Net Remaining */}
              <div className="flex items-center justify-between text-[10.5px] leading-tight text-slate-600 pt-1 mt-1 border-t border-slate-100 font-medium">
                <span>เหลือ</span>
                <span
                  className={`font-bold ${
                    stat.balance > 0
                      ? 'text-slate-800'
                      : stat.balance < 0
                      ? 'text-rose-600'
                      : 'text-slate-400'
                  }`}
                >
                  ฿{formatBaht(stat.balance)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
