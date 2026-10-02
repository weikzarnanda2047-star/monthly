import React, { useState, useMemo } from 'react';
import {
  Check,
  Clock,
  Search,
  ArrowUpDown,
  Bell,
  FileText,
  Copy,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Member, PaymentStatus } from '../types';

interface MemberListProps {
  members: Member[];
  payments: Record<string, PaymentStatus>;
  onTogglePayment: (memberId: string) => void;
  onOpenReminder: (member: Member) => void;
  onOpenSlipModal: (member: Member) => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
  onCopyMemberInfo: (member: Member) => void;
}

type FilterType = 'all' | 'paid' | 'unpaid';
type SortType = 'default' | 'name' | 'status';

export const MemberList: React.FC<MemberListProps> = ({
  members,
  payments,
  onTogglePayment,
  onOpenReminder,
  onOpenSlipModal,
  onEditMember,
  onDeleteMember,
  onCopyMemberInfo,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('default');
  const [isExpanded, setIsExpanded] = useState(false);

  // Compute counts
  const totalCount = members.length;
  const paidCount = useMemo(() => {
    return members.filter((m) => payments[m.id]?.paid).length;
  }, [members, payments]);
  const unpaidCount = totalCount - paidCount;

  // Filtered & sorted members
  const filteredMembers = useMemo(() => {
    let result = [...members];

    // Filter by tab
    if (activeFilter === 'paid') {
      result = result.filter((m) => payments[m.id]?.paid);
    } else if (activeFilter === 'unpaid') {
      result = result.filter((m) => !payments[m.id]?.paid);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.nickname.toLowerCase().includes(q) ||
          m.phone.includes(q) ||
          m.bankName.toLowerCase().includes(q) ||
          m.accountNumber.includes(q) ||
          (payments[m.id]?.note && payments[m.id]?.note?.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortType === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'th'));
    } else if (sortType === 'status') {
      result.sort((a, b) => {
        const aPaid = payments[a.id]?.paid ? 1 : 0;
        const bPaid = payments[b.id]?.paid ? 1 : 0;
        return aPaid - bPaid;
      });
    }

    return result;
  }, [members, payments, activeFilter, searchQuery, sortType]);

  // When searching, display all matching results immediately so no one is hidden
  const isSearching = searchQuery.trim().length > 0;
  const displayLimit = 5;
  const showCollapseButton = !isSearching && filteredMembers.length > displayLimit;
  const visibleMembers = isSearching || isExpanded
    ? filteredMembers
    : filteredMembers.slice(0, displayLimit);
  const remainingCount = filteredMembers.length - displayLimit;

  const cycleSort = () => {
    if (sortType === 'default') setSortType('name');
    else if (sortType === 'name') setSortType('status');
    else setSortType('default');
  };

  return (
    <section className="px-4 py-3">
      {/* Title & subtitle + Search Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-[15px] font-bold text-slate-800">รายชื่อเช็กยอดเงินโอนเข้า</h2>
            <p className="text-xs text-slate-400 font-normal">
              เช็กว่าใครโอนเงินแล้วบ้างในเดือนนี้ (ติ๊กถูกหน้ารายชื่อ)
            </p>
          </div>
          {isSearching && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-in fade-in shrink-0">
              พบ {filteredMembers.length} คน
            </span>
          )}
        </div>

        {/* Top Prominent Search Bar */}
        <div className="mt-2.5 flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-white rounded-xl border border-slate-200/90 shadow-2xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="ค้นหาชื่อสมาชิก, ชื่อเล่น, เบอร์โทร, ธนาคาร..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-2.5 pr-8 bg-transparent text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="ล้างคำค้นหา"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort button */}
          <button
            onClick={cycleSort}
            className={`p-2 rounded-xl border bg-white flex items-center justify-center transition-all shadow-2xs active:scale-95 shrink-0 ${
              sortType !== 'default'
                ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title={`เรียงลำดับ: ${
              sortType === 'default'
                ? 'ตามค่าเริ่มต้น'
                : sortType === 'name'
                ? 'ตามชื่อ ก-ฮ'
                : 'ตามสถานะโอนเงิน'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/60 rounded-xl mb-3">
        {/* Tab 1: ทั้งหมด */}
        <button
          onClick={() => setActiveFilter('all')}
          className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-white text-slate-800 shadow-2xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          ทั้งหมด ({totalCount})
        </button>

        {/* Tab 2: โอนแล้ว */}
        <button
          onClick={() => setActiveFilter('paid')}
          className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeFilter === 'paid'
              ? 'bg-white text-emerald-700 shadow-2xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>โอนแล้ว ({paidCount})</span>
        </button>

        {/* Tab 3: ยังไม่โอน */}
        <button
          onClick={() => setActiveFilter('unpaid')}
          className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeFilter === 'unpaid'
              ? 'bg-white text-amber-700 shadow-2xs'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>ยังไม่โอน ({unpaidCount})</span>
        </button>
      </div>

      {/* Members List */}
      <div className="space-y-2.5">
        {visibleMembers.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs bg-white rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p>ไม่พบรายชื่อตามเงื่อนไขที่ค้นหา</p>
          </div>
        ) : (
          visibleMembers.map((member, index) => {
            const payment = payments[member.id] || { paid: false };
            const isPaid = payment.paid;

            return (
              <div
                key={member.id}
                className={`bg-white rounded-2xl p-3 border transition-all shadow-2xs ${
                  isPaid
                    ? 'border-emerald-200/80 hover:border-emerald-300'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Top Info Row */}
                <div className="flex items-start gap-3">
                  {/* Circular Checkbox */}
                  <button
                    onClick={() => onTogglePayment(member.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-transform active:scale-90 ${
                      isPaid
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'border-2 border-slate-300 hover:border-emerald-500 bg-white'
                    }`}
                    title={isPaid ? 'คลิกเพื่อยกเลิกการโอน' : 'คลิกเพื่อเช็กว่าโอนแล้ว'}
                  >
                    {isPaid && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  {/* Name and Bank Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13.5px] font-bold text-slate-800">
                        {index + 1}. {member.name}
                        {member.nickname ? ` (${member.nickname})` : ''}
                      </span>
                      {member.tag && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {member.tag}
                        </span>
                      )}
                    </div>

                    {/* Phone & Bank details */}
                    <div className="text-[11.5px] text-slate-500 mt-0.5 space-y-0.5">
                      {member.phone && (
                        <p className="flex items-center gap-1">
                          <span>โทร: {member.phone}</span>
                        </p>
                      )}
                      {member.accountNumber && (
                        <p className="text-slate-400">
                          บ/ช: {member.accountNumber}{' '}
                          {member.bankName ? `(${member.bankName})` : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Status Badge */}
                  <div className="text-right shrink-0">
                    {isPaid ? (
                      <div className="flex flex-col items-end">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10.5px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{payment.paidAt || 'โอนแล้ว'}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {payment.method || 'พร้อมเพย์'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-700 text-[10.5px] font-semibold">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>ยังไม่โอน</span>
                        </div>
                        <span className="text-[10px] text-slate-300 mt-0.5">-</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-xs">
                  {/* Left bottom side */}
                  <div>
                    {isPaid ? (
                      <span className="text-[11px] font-semibold text-emerald-600">
                        {payment.note || 'ยืนยันยอดเงินเรียบร้อย'}
                      </span>
                    ) : (
                      <button
                        onClick={() => onOpenReminder(member)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-semibold transition-all border border-amber-200/60 active:scale-95 cursor-pointer"
                      >
                        <Bell className="w-3 h-3 text-amber-600" />
                        <span>เตือนชำระเงิน</span>
                      </button>
                    )}
                  </div>

                  {/* Right action icons: Slip, Copy, Edit, Trash */}
                  <div className="flex items-center gap-2 text-slate-400">
                    <button
                      onClick={() => onOpenSlipModal(member)}
                      className={`p-1 rounded-lg transition-colors ${
                        payment.slipUrl
                          ? 'text-emerald-600 hover:text-emerald-700 bg-emerald-50'
                          : 'hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={payment.slipUrl ? 'ดูสลิปหลักฐาน' : 'แนบสลิป / บันทึกการโอน'}
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onCopyMemberInfo(member)}
                      className="p-1 rounded-lg hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      title="คัดลอกข้อมูลสมาชิก"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onEditMember(member)}
                      className="p-1 rounded-lg hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      title="แก้ไขข้อมูล"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteMember(member.id)}
                      className="p-1 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="ลบรายชื่อ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Expand / Collapse Button */}
      {showCollapseButton && (
        <div className="text-center mt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95"
          >
            {isExpanded ? (
              <>
                <span>ย่อรายชื่อ</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>แสดงสมาชิกอีก {remainingCount} คน</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};
