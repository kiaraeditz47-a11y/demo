import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Language, ServiceId } from '../types';

interface HomeQuickCardsProps {
  lang: Language;
  onSelectService: (id: ServiceId) => void;
  activeToken?: string;
  activeFacility?: string;
  activeDoctor?: string;
  activeTime?: string;
}

export const HomeQuickCards: React.FC<HomeQuickCardsProps> = ({
  lang,
  onSelectService,
  activeToken = '#12',
  activeFacility = 'Kanyakumari PHC',
  activeDoctor = 'Dr. Meena R.',
  activeTime = '10:30 AM'
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 my-6">
      {/* CARD 1: 📅 Today Appointment (from Image 3) */}
      <div 
        id="card-today-appointment"
        onClick={() => onSelectService('appointments')}
        className="group relative cursor-pointer overflow-hidden rounded-[26px] p-6 sm:p-7 border border-white/[0.08] hover:border-cyan-500/40 bg-gradient-to-b from-[#111722] via-[#0d131d] to-[#0a1824] shadow-xl hover:shadow-[0_15px_35px_-10px_rgba(6,182,212,0.3)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
      >
        {/* Ambient bottom glow */}
        <div 
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity"
          style={{
            background: 'radial-gradient(120% 70% at 50% 100%, rgba(6, 182, 212, 0.45) 0%, transparent 80%)'
          }}
        />

        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {lang === 'ta' ? 'இன்றைய நியமனம்' : lang === 'hi' ? 'आज का अपॉइंटमेंट' : 'Today Appointment'}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {activeToken}
            </span>
          </div>

          {/* Details Rows exactly like Image 3 */}
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 font-normal">{lang === 'ta' ? 'நிலையம்' : lang === 'hi' ? 'स्वास्थ्य केंद्र' : 'Facility'}</span>
              <span className="text-white font-semibold text-right">{activeFacility}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 font-normal">{lang === 'ta' ? 'மருத்துவர்' : lang === 'hi' ? 'डॉक्टर' : 'Doctor'}</span>
              <span className="text-white font-semibold text-right">{activeDoctor}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 font-normal">{lang === 'ta' ? 'நேரம்' : lang === 'hi' ? 'समय' : 'Time'}</span>
              <span className="text-white font-semibold text-right">{activeTime}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-neutral-400 font-normal">{lang === 'ta' ? 'டோக்கன்' : lang === 'hi' ? 'टोकन संख्या' : 'Token'}</span>
              <span className="text-teal-400 font-bold text-base">{activeToken}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 font-normal">{lang === 'ta' ? 'காத்திருப்பு' : lang === 'hi' ? 'अनुमानित प्रतीक्षा' : 'Est. Wait'}</span>
              <span className="text-white font-medium">~25 min</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA hint */}
        <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-teal-400/90 font-semibold group-hover:text-teal-300">
          <span>{lang === 'ta' ? 'விவரம் / டோக்கன் காண்க' : lang === 'hi' ? 'पास एवं विवरण देखें' : 'View Pass / Directions'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* CARD 2: 🔄 Active Referral (from Image 3) */}
      <div 
        id="card-active-referral"
        onClick={() => onSelectService('referrals')}
        className="group relative cursor-pointer overflow-hidden rounded-[26px] p-6 sm:p-7 border border-white/[0.08] hover:border-amber-500/40 bg-gradient-to-b from-[#181514] via-[#141214] to-[#1f160e] shadow-xl hover:shadow-[0_15px_35px_-10px_rgba(245,158,11,0.3)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
      >
        {/* Ambient bottom glow */}
        <div 
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity"
          style={{
            background: 'radial-gradient(120% 70% at 50% 100%, rgba(245, 158, 11, 0.45) 0%, transparent 80%)'
          }}
        />

        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔄</span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {lang === 'ta' ? 'செயலில் உள்ள பரிந்துரை' : lang === 'hi' ? 'सक्रिय रेफरल' : 'Active Referral'}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {lang === 'ta' ? 'செயலில்' : lang === 'hi' ? 'प्रगति पर' : 'In Progress'}
            </span>
          </div>

          <p className="text-xs text-neutral-400 mb-6">
            PHC → Rural Hospital → District
          </p>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 font-normal">{lang === 'ta' ? 'நிலை' : lang === 'hi' ? 'स्थिति' : 'Status'}</span>
              <span className="text-amber-400 font-bold">{lang === 'ta' ? 'பரிசீலனைக்காக காத்திருக்கிறது' : lang === 'hi' ? 'परामर्श की प्रतीक्षा' : 'Awaiting consultation'}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-neutral-300 space-y-1">
              <div className="text-[11px] text-neutral-400">REF-2026-KK-0847</div>
              <div className="text-white font-medium">Right distal radius checkup at Agastheeswaram Rural Hospital</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA hint */}
        <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-amber-400/90 font-semibold group-hover:text-amber-300">
          <span>{lang === 'ta' ? 'பரிந்துரையை கண்காணிக்க' : lang === 'hi' ? 'केस ट्रैक करें' : 'Track Case Escalation'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* CARD 3: ⚠️ Follow-up Due (from Image 3) */}
      <div 
        id="card-followup-due"
        onClick={() => onSelectService('high_risk_followup')}
        className="group relative cursor-pointer overflow-hidden rounded-[26px] p-6 sm:p-7 border border-white/[0.08] hover:border-rose-500/40 bg-gradient-to-b from-[#1c1216] via-[#161014] to-[#250f19] shadow-xl hover:shadow-[0_15px_35px_-10px_rgba(244,63,94,0.3)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
      >
        {/* Ambient bottom glow */}
        <div 
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity"
          style={{
            background: 'radial-gradient(120% 70% at 50% 100%, rgba(244, 63, 94, 0.45) 0%, transparent 80%)'
          }}
        />

        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {lang === 'ta' ? 'தொடர் கண்காணிப்பு' : lang === 'hi' ? 'फॉलो-अप आवश्यक' : 'Follow-up Due'}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {lang === 'ta' ? 'தாமதமானது' : lang === 'hi' ? 'नियत समय समाप्त' : 'Overdue'}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-base font-bold text-white">
              {lang === 'ta' ? 'தாய்மை நலம் ANC வருகை' : lang === 'hi' ? 'मातृ ANC जांच' : 'Maternal ANC Visit'}
            </h4>
            <p className="text-xs text-neutral-400">
              {lang === 'ta' ? 'திட்டமிடப்பட்டது: செப் 24, 2026' : lang === 'hi' ? 'निर्धारित तिथि: 24 सितंबर 2026' : 'Scheduled Sept 24, 2026'}
            </p>

            <div className="mt-3 p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs text-rose-200/90">
              Assigned to Sister Anitha (VHN) • Home visit or PHC checkup recommended.
            </div>
          </div>
        </div>

        {/* Bottom CTA hint */}
        <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-rose-400/90 font-semibold group-hover:text-rose-300">
          <span>{lang === 'ta' ? 'கண்காணிப்பு விவரம்' : lang === 'hi' ? 'विजिट शेड्यूल करें' : 'Schedule VHN Visit'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
