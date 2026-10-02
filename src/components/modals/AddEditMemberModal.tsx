import React, { useState, useEffect } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { Member } from '../../types';
import { POPULAR_BANKS } from '../../constants';

interface AddEditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member) => void;
  initialMember?: Member | null;
  defaultFee: number;
}

export const AddEditMemberModal: React.FC<AddEditMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMember,
  defaultFee,
}) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [tag, setTag] = useState('สมาชิกกลุ่ม');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('กสิกร');
  const [accountNumber, setAccountNumber] = useState('');
  const [defaultAmount, setDefaultAmount] = useState(defaultFee);

  useEffect(() => {
    if (initialMember) {
      setName(initialMember.name);
      setNickname(initialMember.nickname || '');
      setTag(initialMember.tag || 'สมาชิกกลุ่ม');
      setPhone(initialMember.phone || '');
      setBankName(initialMember.bankName || 'กสิกร');
      setAccountNumber(initialMember.accountNumber || '');
      setDefaultAmount(initialMember.defaultAmount || defaultFee);
    } else {
      setName('');
      setNickname('');
      setTag('สมาชิกกลุ่ม');
      setPhone('');
      setBankName('กสิกร');
      setAccountNumber('');
      setDefaultAmount(defaultFee);
    }
  }, [initialMember, defaultFee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: Member = {
      id: initialMember ? initialMember.id : `m_${Date.now()}`,
      name: name.trim(),
      nickname: nickname.trim(),
      tag: tag.trim() || 'สมาชิกกลุ่ม',
      phone: phone.trim(),
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      defaultAmount: Number(defaultAmount) || defaultFee,
    };

    onSave(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-[15px]">
              {initialMember ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มรายชื่อสมาชิกใหม่'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">ชื่อ - นามสกุล *</label>
              <input
                type="text"
                required
                placeholder="เช่น สมชาย ใจดี"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ชื่อเล่น</label>
              <input
                type="text"
                placeholder="เช่น ชาย"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                placeholder="081-xxx-xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ป้ายกำกับ / บทบาท</label>
              <input
                type="text"
                placeholder="เช่น สมาชิกกลุ่ม"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">ธนาคาร</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
              >
                {POPULAR_BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">เลขบัญชี</label>
              <input
                type="text"
                placeholder="xxx-x-xxxxx-x"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">ยอดที่ต้องโอนรายเดือน (บาท)</label>
            <input
              type="number"
              min="0"
              value={defaultAmount}
              onChange={(e) => setDefaultAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none font-bold text-slate-800"
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
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{initialMember ? 'บันทึกการแก้ไข' : 'เพิ่มสมาชิก'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
