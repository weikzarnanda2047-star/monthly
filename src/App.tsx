import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  DEFAULT_MEMBERS,
  DEFAULT_INITIAL_MONTH_DATA,
  DEFAULT_SETTINGS,
  INITIAL_MONTH_KEY,
  THAI_MONTHS,
} from './constants';
import { AppSettings, Expense, Member, MonthData, PaymentStatus } from './types';
import {
  getCurrentThaiTimestamp,
  getMonthLabel,
  playSuccessChime,
  triggerConfetti,
  generateLineSummaryText,
} from './utils';

import { Header } from './components/Header';
import { MonthNavigator } from './components/MonthNavigator';
import { FinancialOverview } from './components/FinancialOverview';
import { YearSummarySlider } from './components/YearSummarySlider';
import { ExpenseSection } from './components/ExpenseSection';
import { MemberList } from './components/MemberList';
import { BottomNav, NavTab } from './components/BottomNav';

import { LineSummaryModal } from './components/modals/LineSummaryModal';
import { AddEditMemberModal } from './components/modals/AddEditMemberModal';
import { AddEditExpenseModal } from './components/modals/AddEditExpenseModal';
import { EditFundModal } from './components/modals/EditFundModal';
import { ReminderModal } from './components/modals/ReminderModal';
import { SlipModal } from './components/modals/SlipModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { QuickAddModal } from './components/modals/QuickAddModal';

const STORAGE_KEY = 'monthly_transfer_fund_v1';

export default function App() {
  // Main state initialized with defaults or local storage
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_members`);
      return saved ? JSON.parse(saved) : DEFAULT_MEMBERS;
    } catch {
      return DEFAULT_MEMBERS;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [monthsData, setMonthsData] = useState<Record<string, MonthData>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_months`);
      return saved ? JSON.parse(saved) : { [INITIAL_MONTH_KEY]: DEFAULT_INITIAL_MONTH_DATA };
    } catch {
      return { [INITIAL_MONTH_KEY]: DEFAULT_INITIAL_MONTH_DATA };
    }
  });

  // Current selected month
  const [currentMonthKey, setCurrentMonthKey] = useState<string>(INITIAL_MONTH_KEY);
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('overview');

  // Modal visibility states
  const [isLineSummaryOpen, setIsLineSummaryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddEditMemberOpen, setIsAddEditMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isAddEditExpenseOpen, setIsAddEditExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editFundModal, setEditFundModal] = useState<{
    isOpen: boolean;
    mode: 'totalFund' | 'income';
  }>({ isOpen: false, mode: 'totalFund' });
  const [reminderMember, setReminderMember] = useState<Member | null>(null);
  const [slipMember, setSlipMember] = useState<Member | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Section refs for smooth scrolling when tapping BottomNav tabs
  const overviewRef = useRef<HTMLDivElement>(null);
  const expensesRef = useRef<HTMLDivElement>(null);
  const membersRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
      localStorage.setItem(`${STORAGE_KEY}_months`, JSON.stringify(monthsData));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [members, settings, monthsData]);

  // Parse current month & year
  const currentMonthData: MonthData = useMemo(() => {
    if (monthsData[currentMonthKey]) {
      return monthsData[currentMonthKey];
    }
    const [yearStr, monthStr] = currentMonthKey.split('-');
    const yearCE = Number(yearStr) || 2026;
    const mIdx = (Number(monthStr) || 9) - 1;
    return {
      monthKey: currentMonthKey,
      yearBE: yearCE + 543,
      monthIndex: mIdx,
      manualTotalFund: 10000,
      isManualIncome: true,
      manualIncome: 455,
      payments: {},
      expenses: [],
    };
  }, [monthsData, currentMonthKey]);

  // Compute calculated amounts for current month
  const {
    totalFund,
    actualIncome,
    totalExpenses,
    balance,
    paidCount,
    expectedIncomeTotal,
  } = useMemo(() => {
    const payments = currentMonthData.payments || {};

    // Actual sum from checked members
    let sumChecked = 0;
    let countPaid = 0;
    let expectedSum = 0;

    members.forEach((m) => {
      const p = payments[m.id];
      const fee = m.defaultAmount || settings.defaultFeePerPerson;
      expectedSum += fee;

      if (p && p.paid) {
        countPaid += 1;
        sumChecked += p.amount !== undefined ? p.amount : fee;
      }
    });

    const incomeVal = currentMonthData.isManualIncome
      ? currentMonthData.manualIncome
      : sumChecked;

    const expSum = (currentMonthData.expenses || []).reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    return {
      totalFund: currentMonthData.manualTotalFund,
      actualIncome: incomeVal,
      totalExpenses: expSum,
      balance: incomeVal - expSum,
      paidCount: countPaid,
      expectedIncomeTotal: expectedSum,
    };
  }, [currentMonthData, members, settings]);

  // 12 months statistics for current year
  const currentYearBE = currentMonthData.yearBE;
  const currentYearCE = currentYearBE - 543;

  const { monthlyStats, totalYearIncome, totalYearExpenses } = useMemo(() => {
    let yearIncome = 0;
    let yearExp = 0;
    const stats = [];

    for (let mIdx = 0; mIdx < 12; mIdx++) {
      const mStr = String(mIdx + 1).padStart(2, '0');
      const key = `${currentYearCE}-${mStr}`;
      const mData = monthsData[key];

      let inc = 0;
      let exp = 0;

      if (mData) {
        if (mData.isManualIncome) {
          inc = mData.manualIncome;
        } else {
          // sum of checked
          Object.values(mData.payments || {}).forEach((p) => {
            if (p.paid) inc += p.amount || settings.defaultFeePerPerson;
          });
        }
        exp = (mData.expenses || []).reduce((s, e) => s + e.amount, 0);
      }

      yearIncome += inc;
      yearExp += exp;

      stats.push({
        monthIndex: mIdx,
        income: inc,
        expenses: exp,
        balance: inc - exp,
      });
    }

    return {
      monthlyStats: stats,
      totalYearIncome: yearIncome,
      totalYearExpenses: yearExp,
    };
  }, [currentYearCE, monthsData, settings]);

  // Handlers for month navigation
  const handlePrevMonth = () => {
    let mIdx = currentMonthData.monthIndex - 1;
    let yCE = currentYearCE;
    if (mIdx < 0) {
      mIdx = 11;
      yCE -= 1;
    }
    const newKey = `${yCE}-${String(mIdx + 1).padStart(2, '0')}`;
    ensureMonthExists(newKey, yCE + 543, mIdx);
    setCurrentMonthKey(newKey);
  };

  const handleNextMonth = () => {
    let mIdx = currentMonthData.monthIndex + 1;
    let yCE = currentYearCE;
    if (mIdx > 11) {
      mIdx = 0;
      yCE += 1;
    }
    const newKey = `${yCE}-${String(mIdx + 1).padStart(2, '0')}`;
    ensureMonthExists(newKey, yCE + 543, mIdx);
    setCurrentMonthKey(newKey);
  };

  const handleResetThisMonth = () => {
    ensureMonthExists(INITIAL_MONTH_KEY, 2569, 8);
    setCurrentMonthKey(INITIAL_MONTH_KEY);
    showToast('กลับสู่เดือน กันยายน 2569');
  };

  const handleSelectMonthYear = (mIdx: number, yBE: number) => {
    const yCE = yBE - 543;
    const newKey = `${yCE}-${String(mIdx + 1).padStart(2, '0')}`;
    ensureMonthExists(newKey, yBE, mIdx);
    setCurrentMonthKey(newKey);
  };

  const ensureMonthExists = (key: string, yearBE: number, monthIndex: number) => {
    if (!monthsData[key]) {
      setMonthsData((prev) => ({
        ...prev,
        [key]: {
          monthKey: key,
          yearBE,
          monthIndex,
          manualTotalFund: 10000,
          isManualIncome: true,
          manualIncome: 0,
          payments: {},
          expenses: [],
        },
      }));
    }
  };

  // Toggle member payment
  const handleTogglePayment = (memberId: string) => {
    const currentStatus = currentMonthData.payments[memberId]?.paid;
    const newStatus = !currentStatus;

    if (newStatus) {
      triggerConfetti();
      playSuccessChime();
      showToast('เช็กยอดเงินโอนเรียบร้อย 🎉');
    } else {
      showToast('ยกเลิกสถานะโอนเงิน');
    }

    setMonthsData((prev) => {
      const m = prev[currentMonthKey] || currentMonthData;
      const member = members.find((x) => x.id === memberId);
      const fee = member?.defaultAmount || settings.defaultFeePerPerson;

      const updatedPayments = {
        ...(m.payments || {}),
        [memberId]: {
          ...(m.payments?.[memberId] || {}),
          paid: newStatus,
          paidAt: newStatus ? getCurrentThaiTimestamp() : undefined,
          amount: fee,
          method: m.payments?.[memberId]?.method || 'พร้อมเพย์',
          note: newStatus ? 'ยืนยันยอดเงินเรียบร้อย' : '',
        },
      };

      return {
        ...prev,
        [currentMonthKey]: {
          ...m,
          payments: updatedPayments,
        },
      };
    });
  };

  // Auto calculate income based on checked members
  const handleAutoCalculateIncome = () => {
    let sumChecked = 0;
    members.forEach((m) => {
      const p = currentMonthData.payments[m.id];
      if (p && p.paid) {
        sumChecked += p.amount !== undefined ? p.amount : (m.defaultAmount || settings.defaultFeePerPerson);
      }
    });

    setMonthsData((prev) => {
      const m = prev[currentMonthKey] || currentMonthData;
      return {
        ...prev,
        [currentMonthKey]: {
          ...m,
          isManualIncome: false,
          manualIncome: sumChecked,
        },
      };
    });

    showToast(`คำนวณจากยอดที่โอนแล้วจริง (+฿${sumChecked})`);
  };

  // Save updated total fund or income
  const handleSaveFundValue = (newVal: number) => {
    if (editFundModal.mode === 'totalFund') {
      setMonthsData((prev) => {
        const m = prev[currentMonthKey] || currentMonthData;
        return {
          ...prev,
          [currentMonthKey]: {
            ...m,
            manualTotalFund: newVal,
          },
        };
      });
      showToast(`อัปเดตยอดเงินกองกลาง ฿${newVal.toLocaleString()}`);
    } else {
      setMonthsData((prev) => {
        const m = prev[currentMonthKey] || currentMonthData;
        return {
          ...prev,
          [currentMonthKey]: {
            ...m,
            isManualIncome: true,
            manualIncome: newVal,
          },
        };
      });
      showToast(`อัปเดตเงินเข้าเดือนนี้ ฿${newVal.toLocaleString()}`);
    }
  };

  // Add / Edit Member
  const handleSaveMember = (savedMember: Member) => {
    setMembers((prev) => {
      const exists = prev.some((m) => m.id === savedMember.id);
      if (exists) {
        return prev.map((m) => (m.id === savedMember.id ? savedMember : m));
      }
      return [...prev, savedMember];
    });
    showToast(editingMember ? 'แก้ไขข้อมูลสมาชิกเรียบร้อย' : 'เพิ่มสมาชิกใหม่เรียบร้อย');
    setEditingMember(null);
  };

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm('คุณต้องการลบรายชื่อสมาชิกนี้ใช่หรือไม่?')) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      showToast('ลบสมาชิกแล้ว');
    }
  };

  const handleCopyMemberInfo = async (member: Member) => {
    const text = `${member.name} (${member.nickname || '-'}) | เบอร์: ${member.phone} | ธนาคาร: ${member.bankName} บ/ช: ${member.accountNumber}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast('คัดลอกข้อมูลสมาชิกแล้ว');
    } catch {
      showToast('คัดลอกสำเร็จ');
    }
  };

  // Expenses handlers
  const handleSaveExpense = (savedExpense: Expense) => {
    setMonthsData((prev) => {
      const m = prev[currentMonthKey] || currentMonthData;
      const currentList = m.expenses || [];
      const exists = currentList.some((e) => e.id === savedExpense.id);
      const updatedList = exists
        ? currentList.map((e) => (e.id === savedExpense.id ? savedExpense : e))
        : [savedExpense, ...currentList];

      return {
        ...prev,
        [currentMonthKey]: {
          ...m,
          expenses: updatedList,
        },
      };
    });
    showToast(editingExpense ? 'แก้ไขรายการเงินออกเรียบร้อย' : 'บันทึกเงินออกสำเร็จ');
    setEditingExpense(null);
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm('คุณต้องการลบรายการรายจ่ายนี้ใช่หรือไม่?')) {
      setMonthsData((prev) => {
        const m = prev[currentMonthKey] || currentMonthData;
        return {
          ...prev,
          [currentMonthKey]: {
            ...m,
            expenses: (m.expenses || []).filter((e) => e.id !== expenseId),
          },
        };
      });
      showToast('ลบรายการเงินออกแล้ว');
    }
  };

  // Slip modal save
  const handleSavePaymentDetail = (memberId: string, updatedPayment: PaymentStatus) => {
    setMonthsData((prev) => {
      const m = prev[currentMonthKey] || currentMonthData;
      return {
        ...prev,
        [currentMonthKey]: {
          ...m,
          payments: {
            ...(m.payments || {}),
            [memberId]: updatedPayment,
          },
        },
      };
    });
    showToast('บันทึกรายละเอียดการโอนแล้ว');
  };

  // Quick Action menu callback
  const handleQuickAction = (action: 'expense' | 'member' | 'fund' | 'auto_check') => {
    if (action === 'expense') {
      setEditingExpense(null);
      setIsAddEditExpenseOpen(true);
    } else if (action === 'member') {
      setEditingMember(null);
      setIsAddEditMemberOpen(true);
    } else if (action === 'fund') {
      setEditFundModal({ isOpen: true, mode: 'totalFund' });
    } else if (action === 'auto_check') {
      setMonthsData((prev) => {
        const m = prev[currentMonthKey] || currentMonthData;
        const newPayments: Record<string, PaymentStatus> = {};
        members.forEach((mem) => {
          newPayments[mem.id] = {
            paid: true,
            paidAt: getCurrentThaiTimestamp(),
            amount: mem.defaultAmount || settings.defaultFeePerPerson,
            method: 'พร้อมเพย์',
            note: 'ยืนยันยอดเงินเรียบร้อย',
          };
        });
        return {
          ...prev,
          [currentMonthKey]: {
            ...m,
            payments: newPayments,
          },
        };
      });
      triggerConfetti();
      playSuccessChime();
      showToast('ติ๊กสถานะโอนเงินครบทุกคนแล้ว! 🎉');
    }
  };

  // Navigation tab switcher
  const handleTabChange = (tab: NavTab) => {
    setActiveNavTab(tab);
    if (tab === 'overview') {
      overviewRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'inflow') {
      membersRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'outflow') {
      expensesRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'members') {
      membersRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Settings: Reset to screenshot Demo data
  const handleResetToDemo = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นตามแบบหน้าจอหรือไม่?')) {
      setMembers(DEFAULT_MEMBERS);
      setSettings(DEFAULT_SETTINGS);
      setMonthsData({ [INITIAL_MONTH_KEY]: DEFAULT_INITIAL_MONTH_DATA });
      setCurrentMonthKey(INITIAL_MONTH_KEY);
      localStorage.removeItem(`${STORAGE_KEY}_members`);
      localStorage.removeItem(`${STORAGE_KEY}_settings`);
      localStorage.removeItem(`${STORAGE_KEY}_months`);
      showToast('รีเซ็ตข้อมูลเป็นค่าเริ่มต้นเรียบร้อย');
    }
  };

  // Export JSON
  const handleExportData = () => {
    const backup = {
      members,
      settings,
      monthsData,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-fund-transfer-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('ดาวน์โหลดไฟล์สำรองข้อมูลเรียบร้อย');
  };

  // Import JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.members && parsed.settings) {
            setMembers(parsed.members);
            setSettings(parsed.settings);
            if (parsed.monthsData) setMonthsData(parsed.monthsData);
            showToast('กู้คืนข้อมูลสำเร็จแล้ว');
            setIsSettingsOpen(false);
          } else {
            alert('รูปแบบไฟล์สำรองไม่ถูกต้อง');
          }
        } catch {
          alert('ไม่สามารถอ่านไฟล์ได้');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('คำเตือน: คุณต้องการลบข้อมูลทั้งหมดหรือไม่?')) {
      setMembers([]);
      setMonthsData({});
      showToast('ล้างข้อมูลทั้งหมดแล้ว');
    }
  };

  const fullMonthStr = getMonthLabel(currentMonthData.monthIndex, currentMonthData.yearBE);
  const lineSummaryText = useMemo(() => {
    return generateLineSummaryText(
      currentMonthData,
      members,
      settings,
      actualIncome,
      totalExpenses,
      balance
    );
  }, [currentMonthData, members, settings, actualIncome, totalExpenses, balance]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      {/* Mobile container - width limited to phone format on desktop and full width on mobile */}
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-2xl relative pb-24">
        {/* Sticky App Header */}
        <Header
          groupName={settings.groupName}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenLineSummary={() => setIsLineSummaryOpen(true)}
          onOpenAddMember={() => {
            setEditingMember(null);
            setIsAddEditMemberOpen(true);
          }}
        />

        {/* Month Navigator */}
        <div ref={overviewRef}>
          <MonthNavigator
            monthIndex={currentMonthData.monthIndex}
            yearBE={currentMonthData.yearBE}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onResetThisMonth={handleResetThisMonth}
            onSelectMonthYear={handleSelectMonthYear}
          />
        </div>

        {/* Financial Overview Cards */}
        <FinancialOverview
          totalFund={totalFund}
          income={actualIncome}
          expenses={totalExpenses}
          paidCount={paidCount}
          totalMembersCount={members.length}
          expectedIncomeTotal={expectedIncomeTotal}
          isManualIncome={currentMonthData.isManualIncome}
          monthIndex={currentMonthData.monthIndex}
          yearBE={currentMonthData.yearBE}
          expenseCount={(currentMonthData.expenses || []).length}
          onEditTotalFund={() => setEditFundModal({ isOpen: true, mode: 'totalFund' })}
          onEditIncome={() => setEditFundModal({ isOpen: true, mode: 'income' })}
          onAutoCalculateIncome={handleAutoCalculateIncome}
        />

        {/* Year Summary Slider */}
        <YearSummarySlider
          yearBE={currentYearBE}
          currentMonthIndex={currentMonthData.monthIndex}
          totalYearIncome={totalYearIncome}
          totalYearExpenses={totalYearExpenses}
          monthlyStats={monthlyStats}
          onSelectMonth={(mIdx) => handleSelectMonthYear(mIdx, currentYearBE)}
        />

        {/* Monthly Expenses Section */}
        <div ref={expensesRef} className="pt-1">
          <ExpenseSection
            expenses={currentMonthData.expenses || []}
            onAddExpense={() => {
              setEditingExpense(null);
              setIsAddEditExpenseOpen(true);
            }}
            onEditExpense={(exp) => {
              setEditingExpense(exp);
              setIsAddEditExpenseOpen(true);
            }}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>

        {/* Transfer Checklist / Members Section */}
        <div ref={membersRef} className="pt-1">
          <MemberList
            members={members}
            payments={currentMonthData.payments || {}}
            onTogglePayment={handleTogglePayment}
            onOpenReminder={(m) => setReminderMember(m)}
            onOpenSlipModal={(m) => setSlipMember(m)}
            onEditMember={(m) => {
              setEditingMember(m);
              setIsAddEditMemberOpen(true);
            }}
            onDeleteMember={handleDeleteMember}
            onCopyMemberInfo={handleCopyMemberInfo}
          />
        </div>

        {/* Bottom Floating Navigation */}
        <BottomNav
          activeTab={activeNavTab}
          onTabChange={handleTabChange}
          onQuickAdd={() => setIsQuickAddOpen(true)}
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 z-50 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <LineSummaryModal
        isOpen={isLineSummaryOpen}
        onClose={() => setIsLineSummaryOpen(false)}
        summaryText={lineSummaryText}
        monthName={fullMonthStr}
      />

      <AddEditMemberModal
        isOpen={isAddEditMemberOpen}
        onClose={() => {
          setIsAddEditMemberOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
        initialMember={editingMember}
        defaultFee={settings.defaultFeePerPerson}
      />

      <AddEditExpenseModal
        isOpen={isAddEditExpenseOpen}
        onClose={() => {
          setIsAddEditExpenseOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        initialExpense={editingExpense}
      />

      <EditFundModal
        isOpen={editFundModal.isOpen}
        mode={editFundModal.mode}
        currentValue={
          editFundModal.mode === 'totalFund' ? totalFund : actualIncome
        }
        onClose={() => setEditFundModal({ isOpen: false, mode: 'totalFund' })}
        onSave={handleSaveFundValue}
      />

      <ReminderModal
        isOpen={!!reminderMember}
        member={reminderMember}
        monthData={currentMonthData}
        settings={settings}
        onClose={() => setReminderMember(null)}
      />

      <SlipModal
        isOpen={!!slipMember}
        member={slipMember}
        payment={slipMember ? currentMonthData.payments[slipMember.id] || null : null}
        onClose={() => setSlipMember(null)}
        onSavePayment={handleSavePaymentDetail}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          showToast('บันทึกการตั้งค่าแล้ว');
        }}
        onResetToDemo={handleResetToDemo}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onClearAll={handleClearAll}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSelectAction={handleQuickAction}
      />
    </div>
  );
}
