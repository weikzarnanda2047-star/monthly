import React from 'react';
import { Settings, UserPlus, MessageCircle } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenLineSummary: () => void;
  onOpenAddMember: () => void;
  groupName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenLineSummary,
  onOpenAddMember,
  groupName = 'เงินกองกลาง / ค่าแชร์กลุ่มรายเดือน',
}) => {
  return (
    <header className="bg-white px-4 pt-4 pb-3 border-b border-slate-100 shadow-xs sticky top-0 z-30">
      <div className="flex items-center justify-between gap-3">
        {/* Logo and title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="14" x="2" y="5" rx="3" />
              <line x1="2" x2="22" y1="10" y2="10" />
              <circle cx="17" cy="14" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-slate-800 leading-snug">
              ระบบเช็กยอดเงินโอนรายเดือน
            </h1>
            <p className="text-xs text-slate-400 font-medium">{groupName}</p>
          </div>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
          title="ตั้งค่าระบบ"
        >
          <Settings className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Two Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 mt-3">
        {/* LINE Summary button */}
        <button
          onClick={onOpenLineSummary}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-emerald-500/30 bg-emerald-50/60 hover:bg-emerald-100/60 text-emerald-700 text-sm font-semibold transition-all active:scale-[0.98] shadow-xs"
        >
          <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
          <span>ส่งสรุป LINE</span>
        </button>

        {/* Add Member button */}
        <button
          onClick={onOpenAddMember}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all active:scale-[0.98] shadow-sm shadow-emerald-700/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>เพิ่มรายชื่อ</span>
        </button>
      </div>
    </header>
  );
};
