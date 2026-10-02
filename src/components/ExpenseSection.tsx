import React from 'react';
import { MinusCircle, Plus, Clock, Edit2, Trash2, Receipt } from 'lucide-react';
import { Expense } from '../types';
import { formatBaht } from '../utils';

interface ExpenseSectionProps {
  expenses: Expense[];
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export const ExpenseSection: React.FC<ExpenseSectionProps> = ({
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
}) => {
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <section className="px-4 py-3">
      {/* Header Container */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <MinusCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-[14px] font-bold text-slate-800">รายการเงินออกประจำเดือน</h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/50">
                {expenses.length} รายการ
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">บันทึกรายจ่ายเงินกองกลาง</p>
          </div>
        </div>

        {/* Add Expense Button */}
        <button
          onClick={onAddExpense}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs shadow-rose-600/20 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>บันทึกเงินออก</span>
        </button>
      </div>

      {/* Expenses List */}
      <div className="space-y-2">
        {expenses.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl bg-white/50 text-slate-400 text-xs">
            <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p>ยังไม่มีรายการจ่ายออกในเดือนนี้</p>
            <button
              onClick={onAddExpense}
              className="mt-2 text-emerald-600 font-semibold hover:underline"
            >
              + บันทึกรายการแรก
            </button>
          </div>
        ) : (
          expenses.map((expense, index) => (
            <div
              key={expense.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[13.5px] font-bold text-slate-800">
                      {index + 1}. {expense.title}
                    </span>
                    {expense.category && (
                      <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {expense.category}
                      </span>
                    )}
                  </div>
                  {expense.payee && (
                    <p className="text-xs text-slate-500 mt-1">
                      จ่ายให้: <span className="text-slate-700 font-medium">{expense.payee}</span>
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[15px] font-bold text-rose-600">
                    -฿{formatBaht(expense.amount)}
                  </div>
                  <span className="text-[10px] text-slate-400">บาท</span>
                </div>
              </div>

              {/* Bottom bar of the expense item */}
              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{expense.dateStr}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditExpense(expense)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="แก้ไขรายการ"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="ลบรายการ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Row */}
      {expenses.length > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-500 px-2 pt-2.5">
          <span>รวมรายการเงินออกทั้งหมด {expenses.length} รายการ</span>
          <span>
            ยอดออกรวม:{' '}
            <strong className="text-rose-600 font-bold">฿{formatBaht(totalAmount)}</strong> บาท
          </span>
        </div>
      )}
    </section>
  );
};
