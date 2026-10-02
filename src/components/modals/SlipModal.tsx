import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Trash2, Image as ImageIcon } from 'lucide-react';
import { Member, PaymentStatus } from '../../types';
import { getCurrentThaiTimestamp } from '../../utils';

interface SlipModalProps {
  isOpen: boolean;
  member: Member | null;
  payment: PaymentStatus | null;
  onClose: () => void;
  onSavePayment: (memberId: string, updatedPayment: PaymentStatus) => void;
}

export const SlipModal: React.FC<SlipModalProps> = ({
  isOpen,
  member,
  payment,
  onClose,
  onSavePayment,
}) => {
  const [paid, setPaid] = useState(false);
  const [amount, setAmount] = useState<number | string>('');
  const [method, setMethod] = useState('พร้อมเพย์');
  const [paidAt, setPaidAt] = useState('');
  const [slipUrl, setSlipUrl] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (member) {
      if (payment && payment.paid) {
        setPaid(true);
        setAmount(payment.amount ?? member.defaultAmount);
        setMethod(payment.method || 'พร้อมเพย์');
        setPaidAt(payment.paidAt || getCurrentThaiTimestamp());
        setSlipUrl(payment.slipUrl || '');
        setNote(payment.note || 'ยืนยันยอดเงินเรียบร้อย');
      } else {
        setPaid(false);
        setAmount(member.defaultAmount);
        setMethod('พร้อมเพย์');
        setPaidAt(getCurrentThaiTimestamp());
        setSlipUrl('');
        setNote('ยืนยันยอดเงินเรียบร้อย');
      }
    }
  }, [member, payment, isOpen]);

  if (!isOpen || !member) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSlipUrl(event.target.result as string);
          setPaid(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePayment(member.id, {
      paid,
      amount: Number(amount) || member.defaultAmount,
      method,
      paidAt: paid ? paidAt || getCurrentThaiTimestamp() : undefined,
      slipUrl: slipUrl || undefined,
      note: note.trim() || (paid ? 'ยืนยันยอดเงินเรียบร้อย' : ''),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-[14px]">
              สลิป / ข้อมูลการโอน: {member.name}
            </h3>
            <p className="text-[11px] text-slate-500">
              ตรวจสอบหรือแนบหลักฐานการชำระเงิน
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-3.5 text-xs flex-1">
          {/* Status Checkbox */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <div>
              <span className="font-bold text-slate-800 block text-xs">สถานะการโอนเงิน</span>
              <span className="text-[11px] text-emerald-700">
                {paid ? 'ชำระเงินเรียบร้อยแล้ว' : 'ยังไม่ชำระเงิน'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPaid(!paid)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                paid
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-600'
              }`}
            >
              {paid ? '✓ โอนแล้ว' : 'ยังไม่โอน'}
            </button>
          </div>

          {/* Slip Image Preview or Upload */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">
              รูปภาพสลิปโอนเงิน
            </label>
            {slipUrl ? (
              <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-100">
                <img
                  src={slipUrl}
                  alt="หลักฐานการโอน"
                  className="w-full max-h-52 object-contain"
                />
                <button
                  type="button"
                  onClick={() => setSlipUrl('')}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
                  title="ลบรูปสลิป"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-colors">
                <ImageIcon className="w-8 h-8 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-600">
                  คลิกเพื่ออัปโหลดสลิป
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  รองรับไฟล์รูปภาพ JPG, PNG
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">จำนวนเงินที่โอน (บาท)</label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ช่องทางชำระเงิน</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="พร้อมเพย์">พร้อมเพย์</option>
                <option value="โอนธนาคาร">โอนธนาคาร</option>
                <option value="เงินสด">เงินสด</option>
                <option value="ทรูมันนี่">ทรูมันนี่</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">วันและเวลาที่โอน</label>
            <input
              type="text"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
              placeholder="เช่น 2 ต.ค. 69, 13:21"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">หมายเหตุ / สถานะข้อความ</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น ยืนยันยอดเงินเรียบร้อย"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
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
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกข้อมูล</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
