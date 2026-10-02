import confetti from 'canvas-confetti';
import { THAI_MONTHS_SHORT, THAI_MONTHS } from './constants';
import { AppSettings, Member, MonthData } from './types';

export function formatBaht(amount: number): string {
  return new Intl.NumberFormat('th-TH').format(amount);
}

export function getCurrentThaiTimestamp(): string {
  const now = new Date();
  const day = now.getDate();
  const monthShort = THAI_MONTHS_SHORT[now.getMonth()];
  // Buddhist year 2 digits e.g. 2569 -> 69
  const yearBE = now.getFullYear() + 543;
  const year2Digits = String(yearBE).slice(-2);
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${day} ${monthShort} ${year2Digits}, ${hours}:${minutes}`;
}

export function getMonthLabel(monthIndex: number, yearBE: number): string {
  return `${THAI_MONTHS[monthIndex]} ${yearBE}`;
}

export function getShortMonthLabel(monthIndex: number, yearBE: number): string {
  const shortYear = String(yearBE).slice(-2);
  return `${THAI_MONTHS_SHORT[monthIndex]} '${shortYear}`;
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
    });
  } catch {
    // ignore
  }
}

export function playSuccessChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // web audio not supported or blocked
  }
}

export function generateLineSummaryText(
  monthData: MonthData,
  members: Member[],
  settings: AppSettings,
  actualIncome: number,
  totalExpenses: number,
  balance: number
): string {
  const monthName = getMonthLabel(monthData.monthIndex, monthData.yearBE);
  const paidMembers: { member: Member; info: MonthData['payments'][string] }[] = [];
  const unpaidMembers: Member[] = [];

  members.forEach((m) => {
    const p = monthData.payments[m.id];
    if (p && p.paid) {
      paidMembers.push({ member: m, info: p });
    } else {
      unpaidMembers.push(m);
    }
  });

  let text = `📢 สรุปยอดเงินกองกลาง / ค่าแชร์\n`;
  text += `📅 ประจำเดือน: ${monthName}\n`;
  text += `━━━━━━━━━━━━━━━━━\n`;
  text += `💰 ยอดเงินกองกลางทั้งหมด: ฿${formatBaht(monthData.manualTotalFund)} บาท\n`;
  text += `📥 เงินเข้าเดือนนี้: +฿${formatBaht(actualIncome)} บาท (โอนแล้ว ${paidMembers.length}/${members.length} คน)\n`;
  text += `📤 เงินออกเดือนนี้: -฿${formatBaht(totalExpenses)} บาท (${monthData.expenses.length} รายการ)\n`;
  text += `💵 ยอดคงเหลือประจำเดือน: ฿${formatBaht(balance)} บาท\n`;
  text += `━━━━━━━━━━━━━━━━━\n\n`;

  text += `✅ รายชื่อโอนแล้ว (${paidMembers.length} คน):\n`;
  if (paidMembers.length === 0) {
    text += `(ยังไม่มีรายการโอนในเดือนนี้)\n`;
  } else {
    paidMembers.forEach((item, index) => {
      const nick = item.member.nickname ? ` (${item.member.nickname})` : '';
      const payTime = item.info.paidAt ? ` [${item.info.paidAt}]` : '';
      const amt = item.info.amount ? ` ฿${formatBaht(item.info.amount)}` : '';
      text += `${index + 1}. ${item.member.name}${nick}${amt}${payTime}\n`;
    });
  }

  text += `\n⏳ รายชื่อยังไม่โอน (${unpaidMembers.length} คน):\n`;
  if (unpaidMembers.length === 0) {
    text += `🎉 ครบทุกคนแล้ว! ขอบคุณทุกคนมากครับ/ค่ะ\n`;
  } else {
    unpaidMembers.forEach((item, index) => {
      const nick = item.nickname ? ` (${item.nickname})` : '';
      text += `${index + 1}. ${item.name}${nick} (฿${formatBaht(item.defaultAmount || settings.defaultFeePerPerson)})\n`;
    });
  }

  if (monthData.expenses.length > 0) {
    text += `\n🧾 รายการเงินออกเดือนนี้:\n`;
    monthData.expenses.forEach((exp, idx) => {
      text += `${idx + 1}. ${exp.title} (-฿${formatBaht(exp.amount)}) - ${exp.payee || ''}\n`;
    });
  }

  text += `\n🏦 ช่องทางชำระเงิน:\n`;
  if (settings.promptPayNumber) {
    text += `• พร้อมเพย์: ${settings.promptPayNumber} (${settings.promptPayName})\n`;
  }
  if (settings.bankName && settings.accountNumber) {
    text += `• ธนาคาร${settings.bankName}: ${settings.accountNumber} (${settings.accountName})\n`;
  }
  text += `\n🙏 รบกวนโอนแล้วแจ้งสลิปในกลุ่มด้วยนะครับ ขอบคุณครับ!`;

  return text;
}

export function generateMemberReminderText(
  member: Member,
  monthData: MonthData,
  settings: AppSettings
): string {
  const monthName = getMonthLabel(monthData.monthIndex, monthData.yearBE);
  const amount = member.defaultAmount || settings.defaultFeePerPerson;
  const nick = member.nickname ? ` (${member.nickname})` : '';

  let text = `สวัสดีครับ/ค่ะ คุณ${member.name}${nick} 😊\n`;
  text += `ขอแจ้งเตือนชำระเงินกองกลาง / ค่าแชร์\n`;
  text += `📅 ประจำเดือน: ${monthName}\n`;
  text += `💵 ยอดที่ต้องชำระ: ฿${formatBaht(amount)} บาท\n\n`;
  text += `🏦 ช่องทางโอนเงิน:\n`;
  if (settings.promptPayNumber) {
    text += `• พร้อมเพย์: ${settings.promptPayNumber} (${settings.promptPayName})\n`;
  }
  if (settings.bankName && settings.accountNumber) {
    text += `• ธนาคาร: ${settings.bankName} เลขที่ ${settings.accountNumber} (${settings.accountName})\n`;
  }
  text += `\nโอนเรียบร้อยแล้ว ส่งสลิปแจ้งทางแชทได้เลยนะครับ ขอบคุณมากครับ 🙏`;

  return text;
}
