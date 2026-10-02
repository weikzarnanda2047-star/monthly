import React from 'react';
import { Home, ArrowDownLeft, Plus, ArrowUpRight, Users } from 'lucide-react';

export type NavTab = 'overview' | 'inflow' | 'outflow' | 'members';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onQuickAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onQuickAdd,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 px-2 py-1 shadow-lg max-w-lg mx-auto">
      <div className="flex items-center justify-around relative">
        {/* Tab 1: ภาพรวม */}
        <button
          onClick={() => onTabChange('overview')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] transition-colors ${
            activeTab === 'overview'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">ภาพรวม</span>
        </button>

        {/* Tab 2: เงินเข้า */}
        <button
          onClick={() => onTabChange('inflow')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] transition-colors ${
            activeTab === 'inflow'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ArrowDownLeft className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">เงินเข้า</span>
        </button>

        {/* Center Floating Action Button (+) */}
        <div className="relative -top-4 flex items-center justify-center px-1">
          <button
            onClick={onQuickAdd}
            className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-90 transition-transform cursor-pointer"
            title="เพิ่มรายการใหม่อย่างรวดเร็ว"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 3: เงินออก */}
        <button
          onClick={() => onTabChange('outflow')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] transition-colors ${
            activeTab === 'outflow'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ArrowUpRight className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">เงินออก</span>
        </button>

        {/* Tab 4: สมาชิก */}
        <button
          onClick={() => onTabChange('members')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] transition-colors ${
            activeTab === 'members'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">สมาชิก</span>
        </button>
      </div>
    </nav>
  );
};
