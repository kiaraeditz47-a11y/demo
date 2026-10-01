import React, { useState } from 'react';
import { PhoneCall, AlertOctagon, X, MapPin, Clock, ShieldCheck, Siren } from 'lucide-react';
import { Language } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, lang }) => {
  const [callingNumber, setCallingNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCall = (num: string) => {
    setCallingNumber(num);
    setTimeout(() => {
      setCallingNumber(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-[28px] bg-[#11141a] border border-rose-500/40 shadow-2xl shadow-rose-950/60 overflow-hidden text-neutral-100">
        {/* Top Emergency Red Banner */}
        <div className="bg-gradient-to-r from-rose-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <Siren className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {lang === 'ta' ? 'அவசர மருத்துவ உதவி மையம்' : 'Emergency Medical Assistance'}
              </h3>
              <p className="text-xs text-rose-100 font-medium">
                {lang === 'ta' ? '24x7 இலவச ஆம்புலன்ஸ் & அரசு மருத்துவ ஆலோசனை' : '24x7 Free Ambulance Dispatch & Advisory'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {callingNumber && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center text-emerald-300 text-sm font-semibold animate-pulse">
              ✓ {lang === 'ta' ? `${callingNumber} எண்ணுக்கு அவசர அழைப்பு இணைக்கப்படுகிறது...` : `Connecting emergency dispatch to ${callingNumber}...`}
            </div>
          )}

          {/* Primary 108 Card */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg font-black text-xl">
                108
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  {lang === 'ta' ? '108 அவசர ஆம்புலன்ஸ் சேவை' : '108 Ambulance Dispatch'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {lang === 'ta' ? 'கன்னியாகுமரி மாவட்ட அதிவிரைவு மீட்பு' : 'GPS-tracked emergency vehicle response'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleCall('108')}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{lang === 'ta' ? 'அழைக்கவும்' : 'Call 108'}</span>
            </button>
          </div>

          {/* 104 Health Helpline Card */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg font-black text-xl">
                104
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  {lang === 'ta' ? '104 மருத்துவ உதவி எண்' : '104 Health Advisory Line'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {lang === 'ta' ? 'தமிழ்நாடு அரசு 24 மணி நேர ஆலோசனை' : 'Govt of Tamil Nadu 24/7 Doctor Helpline'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleCall('104')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{lang === 'ta' ? 'அழைக்கவும்' : 'Call 104'}</span>
            </button>
          </div>

          {/* Nearest 24/7 Centers in Kanyakumari */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{lang === 'ta' ? 'அருகிலுள்ள 24 மணி நேர அவசர சிகிச்சை மையங்கள்' : 'Nearest 24/7 Emergency Casualty Facilities'}</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-neutral-200">Kanyakumari Government PHC</div>
                  <div className="text-neutral-400">Beach Road • 1.8 km • 24x7 Maternity & Casualty</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  OPEN 24/7
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-neutral-200">Agastheeswaram Rural Hospital</div>
                  <div className="text-neutral-400">Taluk HQ Road • 6.4 km • Trauma & Surgical Unit</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  OPEN 24/7
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Govt. Public Health Network • Free Emergency Response</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 font-semibold transition-colors"
          >
            {lang === 'ta' ? 'மூடுக' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
