import React from 'react';
import { X, MinusCircle, UserPlus, Wallet, Sparkles } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'expense' | 'member' | 'fund' | 'auto_check') => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 overflow-hidden space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">การดำเนินการด่วน</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1">
          {/* Action 1: Add Expense */}
          <button
            onClick={() => {
              onSelectAction('expense');
              onClose();
            }}
            className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200/60 text-left transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MinusCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">บันทึกรายการเงินออก</h4>
              <p className="text-[11px] text-slate-500">บันทึกค่าใช้จ่าย ซื้ออาหาร ของใช้</p>
            </div>
          </button>

          {/* Action 2: Add Member */}
          <button
            onClick={() => {
              onSelectAction('member');
              onClose();
            }}
            className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/60 text-left transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">เพิ่มรายชื่อสมาชิกใหม่</h4>
              <p className="text-[11px] text-slate-500">เพิ่มรายชื่อผู้โอนเงินเข้ากลุ่ม</p>
            </div>
          </button>

          {/* Action 3: Edit Fund / Inflow */}
          <button
            onClick={() => {
              onSelectAction('fund');
              onClose();
            }}
            className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/60 text-left transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">ปรับยอดเงินกองกลาง</h4>
              <p className="text-[11px] text-slate-500">แก้ไขยอดเงินทั้งหมด หรือยอดเงินเข้า</p>
            </div>
          </button>

          {/* Action 4: Auto check all */}
          <button
            onClick={() => {
              onSelectAction('auto_check');
              onClose();
            }}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">ติ๊กโอนแล้วทุกคน</h4>
              <p className="text-[11px] text-slate-500">เปลี่ยนสถานะสมาชิกทุกคนเป็นโอนแล้ว</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
