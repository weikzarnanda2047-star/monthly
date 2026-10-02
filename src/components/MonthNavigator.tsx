import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Calendar as CalendarIcon, X } from 'lucide-react';
import { THAI_MONTHS } from '../constants';
import { getMonthLabel } from '../utils';

interface MonthNavigatorProps {
  monthIndex: number;
  yearBE: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onResetThisMonth: () => void;
  onSelectMonthYear: (monthIndex: number, yearBE: number) => void;
}

export const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  monthIndex,
  yearBE,
  onPrevMonth,
  onNextMonth,
  onResetThisMonth,
  onSelectMonthYear,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempYearBE, setTempYearBE] = useState(yearBE);

  const currentLabel = getMonthLabel(monthIndex, yearBE);

  return (
    <div className="relative px-4 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Month selector with arrows */}
        <div className="flex items-center bg-white rounded-xl border border-slate-200/90 shadow-2xs py-1 px-1.5 flex-1 max-w-[210px]">
          <button
            onClick={onPrevMonth}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
            title="เดือนก่อนหน้า"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowPicker(true)}
            className="flex-1 text-center text-[13.5px] font-semibold text-slate-800 hover:text-emerald-700 truncate px-1 transition-colors"
          >
            {currentLabel}
          </button>

          <button
            onClick={onNextMonth}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
            title="เดือนถัดไป"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Back to this month button */}
        <button
          onClick={onResetThisMonth}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-700 text-xs font-semibold transition-all active:scale-95 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>กลับสู่เดือนนี้</span>
        </button>

        {/* Calendar picker icon */}
        <button
          onClick={() => setShowPicker(true)}
          className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all shadow-2xs active:scale-95"
          title="เลือกเดือนและปี"
        >
          <CalendarIcon className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Month/Year picker popup */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">เลือกเดือนและปี (พ.ศ.)</h3>
              <button
                onClick={() => setShowPicker(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Year selector */}
            <div className="flex items-center justify-center gap-3 my-3">
              <button
                onClick={() => setTempYearBE((y) => y - 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-lg text-slate-800">พ.ศ. {tempYearBE}</span>
              <button
                onClick={() => setTempYearBE((y) => y + 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Months grid */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {THAI_MONTHS.map((m, idx) => {
                const isSelected = idx === monthIndex && tempYearBE === yearBE;
                return (
                  <button
                    key={m}
                    onClick={() => {
                      onSelectMonthYear(idx, tempYearBE);
                      setShowPicker(false);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
