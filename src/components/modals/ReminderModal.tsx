import React, { useState } from 'react';
import { X, Copy, Check, Share2, PhoneCall, Bell } from 'lucide-react';
import { Member, MonthData, AppSettings } from '../../types';
import { generateMemberReminderText } from '../../utils';

interface ReminderModalProps {
  isOpen: boolean;
  member: Member | null;
  monthData: MonthData;
  settings: AppSettings;
  onClose: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  member,
  monthData,
  settings,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !member) return null;

  const reminderText = generateMemberReminderText(member, monthData, settings);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reminderText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = reminderText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenLine = () => {
    const encoded = encodeURIComponent(reminderText);
    window.open(`https://line.me/R/msg/text/?${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-[14px]">
                เตือนชำระเงิน: {member.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                {member.nickname ? `ชื่อเล่น: ${member.nickname} | ` : ''}เบอร์: {member.phone || '-'}
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

        {/* Content Box */}
        <div className="p-4 space-y-3">
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed select-all">
            {reminderText}
          </div>

          {member.phone && (
            <div className="flex items-center justify-between p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs">
              <span className="text-emerald-800 font-medium">โทรด่วน: {member.phone}</span>
              <a
                href={`tel:${member.phone}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
              >
                <PhoneCall className="w-3 h-3" />
                <span>โทรออก</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 grid grid-cols-2 gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all active:scale-95 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>คัดลอกแล้ว!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>คัดลอกข้อความ</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenLine}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#06c755] hover:bg-[#05b54c] text-white font-semibold text-xs shadow-xs active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>ส่งผ่าน LINE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
