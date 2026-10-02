import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Download, Share2 } from 'lucide-react';

interface LineSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summaryText: string;
  monthName: string;
}

export const LineSummaryModal: React.FC<LineSummaryModalProps> = ({
  isOpen,
  onClose,
  summaryText,
  monthName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy
      const textarea = document.createElement('textarea');
      textarea.value = summaryText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenLine = () => {
    const encoded = encodeURIComponent(summaryText);
    window.open(`https://line.me/R/msg/text/?${encoded}`, '_blank');
  };

  const handleDownload = () => {
    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `สรุปยอดเงินกองกลาง-${monthName.replace(/\s+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <MessageSquare className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-[15px]">ส่งสรุป LINE</h3>
              <p className="text-xs text-slate-500">ข้อความสรุปสำหรับแชร์เข้ากลุ่ม LINE</p>
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
        <div className="p-4 flex-1 overflow-y-auto">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            ตัวอย่างข้อความสรุป:
          </label>
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed select-all">
            {summaryText}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <div className="grid grid-cols-2 gap-2">
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
                  <span>คัดลอกเรียบร้อย!</span>
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
              <span>เปิดส่งใน LINE</span>
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-slate-500 hover:text-slate-700 text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดข้อความเป็นไฟล์ .txt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
