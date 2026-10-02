import React, { useState, useEffect } from 'react';
import { X, Check, Wallet, ArrowDownLeft } from 'lucide-react';
import { formatBaht } from '../../utils';

interface EditFundModalProps {
  isOpen: boolean;
  mode: 'totalFund' | 'income';
  currentValue: number;
  onClose: () => void;
  onSave: (val: number) => void;
}

export const EditFundModal: React.FC<EditFundModalProps> = ({
  isOpen,
  mode,
  currentValue,
  onClose,
  onSave,
}) => {
  const [val, setVal] = useState<number | string>(currentValue);

  useEffect(() => {
    setVal(currentValue);
  }, [currentValue, isOpen]);

  if (!isOpen) return null;

  const isTotal = mode === 'totalFund';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(Number(val) || 0);
    onClose();
  };

  const addPreset = (diff: number) => {
    setVal((prev) => Math.max(0, (Number(prev) || 0) + diff));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            isTotal ? 'bg-indigo-50/60 border-indigo-100' : 'bg-emerald-50/60 border-emerald-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs ${
                isTotal ? 'bg-indigo-600' : 'bg-emerald-600'
              }`}
            >
              {isTotal ? <Wallet className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-[14px]">
                {isTotal ? 'กรอกยอดเงินทั้งหมด' : 'กรอกยอดเงินเข้าเดือนนี้'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isTotal
                  ? 'ยอดเงินกองกลาง / เงินในบัญชีทั้งหมด'
                  : 'กำหนดตัวเลขเงินเข้าประจำเดือนนี้'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              จำนวนเงิน (บาท)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ฿
              </span>
              <input
                type="number"
                min="0"
                autoFocus
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-xl font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none ${
                  isTotal ? 'focus:border-indigo-600' : 'focus:border-emerald-600'
                }`}
              />
            </div>
            {Number(val) > 0 && (
              <p className="text-right text-[11px] text-slate-400 mt-1">
                = {formatBaht(Number(val))} บาท
              </p>
            )}
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              ปุ่มลัดปรับยอด:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[100, 500, 1000, 5000].map((step) => (
                <button
                  type="button"
                  key={step}
                  onClick={() => addPreset(step)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                >
                  +{formatBaht(step)}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-600 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 rounded-xl text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all ${
                isTotal
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>บันทึกยอดเงิน</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
