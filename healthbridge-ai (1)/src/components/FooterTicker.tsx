import React from 'react';
import { Zap, Target, CheckCircle, ShieldCheck, HeartPulse } from 'lucide-react';
import { Language } from '../types';

interface FooterTickerProps {
  lang: Language;
}

export const FooterTicker: React.FC<FooterTickerProps> = ({ lang }) => {
  return (
    <div className="mt-14 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-6 text-xs text-neutral-400 font-medium">
      <div className="flex flex-wrap items-center gap-6 sm:gap-8">
        <div className="flex items-center gap-2 text-neutral-300">
          <Zap className="w-4 h-4 text-amber-400 stroke-[2.2]" />
          <span>
            {lang === 'ta' 
              ? '24x7 அவசர ஆம்புலன்ஸ் (108 / 104)' 
              : lang === 'hi' 
              ? '24x7 आपातकालीन एम्बुलेंस (108 / 104)' 
              : '24x7 Emergency Help (108 / 104)'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-neutral-300">
          <Target className="w-4 h-4 text-cyan-400 stroke-[2.2]" />
          <span>
            {lang === 'ta' 
              ? 'ABHA டிஜிட்டல் அடையாள அட்டை' 
              : lang === 'hi' 
              ? 'ABHA एकीकृत डिजिटल स्वास्थ्य रिकॉर्ड' 
              : 'ABHA Integrated Records'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-neutral-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 stroke-[2.2]" />
          <span>
            {lang === 'ta' 
              ? 'இலவச அரசு மருந்துகள் & ஆய்வகம்' 
              : lang === 'hi' 
              ? 'निःशुल्क सरकारी दवाएं एवं लैब जांच' 
              : 'Zero-Cost Medicines & Diagnostics'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-neutral-300">
          <HeartPulse className="w-4 h-4 text-rose-400 stroke-[2.2]" />
          <span>
            {lang === 'ta' 
              ? 'அதி-தீவிர தாய் சேய் கண்காணிப்பு' 
              : lang === 'hi' 
              ? 'मातृ एवं शिशु सक्रिय ट्रैकिंग' 
              : 'Proactive Maternal & Infant Tracking'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-neutral-500">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
        <span>Kanyakumari District Public Health System • ArogyaConnect</span>
      </div>
    </div>
  );
};
