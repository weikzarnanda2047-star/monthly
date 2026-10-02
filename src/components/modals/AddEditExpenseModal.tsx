import React, { useState, useEffect } from 'react';
import { X, MinusCircle, Check } from 'lucide-react';
import { Expense } from '../../types';
import { getCurrentThaiTimestamp } from '../../utils';

interface AddEditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
  initialExpense?: Expense | null;
}

export const AddEditExpenseModal: React.FC<AddEditExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialExpense,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ค่าใช้จ่ายทั่วไป');
  const [amount, setAmount] = useState<number | string>('');
  const [payee, setPayee] = useState('ร้านค้า');
  const [dateStr, setDateStr] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (initialExpense) {
      setTitle(initialExpense.title);
      setCategory(initialExpense.category || 'ค่าใช้จ่ายทั่วไป');
      setAmount(initialExpense.amount);
      setPayee(initialExpense.payee || '');
      setDateStr(initialExpense.dateStr);
      setNote(initialExpense.note || '');
    } else {
      setTitle('');
      setCategory('ค่าใช้จ่ายทั่วไป');
      setAmount('');
      setPayee('ร้านค้า');
      setDateStr(`${getCurrentThaiTimestamp()} น.`);
      setNote('');
    }
  }, [initialExpense, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    const newExpense: Expense = {
      id: initialExpense ? initialExpense.id : `exp_${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      amount: Number(amount),
      payee: payee.trim(),
      dateStr: dateStr.trim() || `${getCurrentThaiTimestamp()} น.`,
      note: note.trim(),
    };

    onSave(newExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <MinusCircle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-[15px]">
              {initialExpense ? 'แก้ไขรายการเงินออก' : 'บันทึกรายการเงินออกประจำเดือน'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">ชื่อรายการค่าใช้จ่าย *</label>
            <input
              type="text"
              required
              placeholder="เช่น ซื้ออาหาร, ค่าอุปกรณ์, ค่าสถานที่"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">หมวดหมู่</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:outline-none"
              >
                <option value="ค่าใช้จ่ายทั่วไป">ค่าใช้จ่ายทั่วไป</option>
                <option value="อาหารและเครื่องดื่ม">อาหารและเครื่องดื่ม</option>
                <option value="ค่าเช่า/สถานที่">ค่าเช่า/สถานที่</option>
                <option value="อุปกรณ์/ของใช้">อุปกรณ์/ของใช้</option>
                <option value="การเดินทาง">การเดินทาง</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">จำนวนเงิน (บาท) *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="200"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:outline-none font-bold text-rose-600 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">จ่ายให้ / ร้านค้า</label>
              <input
                type="text"
                placeholder="เช่น ร้านค้า, เซเว่น"
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">วันและเวลาที่จ่าย</label>
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">หมายเหตุเพิ่มเติม (ถ้ามี)</label>
            <input
              type="text"
              placeholder="บันทึกรายละเอียดเพิ่มเติม..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
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
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{initialExpense ? 'บันทึกการแก้ไข' : 'บันทึกเงินออก'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
