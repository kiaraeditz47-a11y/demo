import React from 'react';
import { 
  Home, 
  MapPin, 
  Calendar, 
  Brain, 
  Video, 
  GitFork, 
  Pill, 
  ClipboardList, 
  AlertTriangle,
  HeartPulse,
  PhoneCall,
  ChevronRight,
  ShieldAlert,
  Wifi,
  WifiOff
} from 'lucide-react';
import { ServiceId, Language } from '../types';

interface SidebarProps {
  currentView: 'home' | 'appointments' | ServiceId;
  activeServiceId: ServiceId | null;
  onNavigate: (view: 'home' | 'appointments' | ServiceId) => void;
  lang: Language;
  selectedLocation: string;
  onOpenEmergency: () => void;
  isOffline?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  activeServiceId,
  onNavigate,
  lang,
  selectedLocation,
  onOpenEmergency,
  isOffline = false,
}) => {
  const navItems: {
    id: 'home' | ServiceId;
    labelEn: string;
    labelTa: string;
    labelHi: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
    isAppointment?: boolean;
  }[] = [
    {
      id: 'home',
      labelEn: 'Home',
      labelTa: 'முகப்பு',
      labelHi: 'होम',
      icon: Home,
    },
    {
      id: 'find_healthcare',
      labelEn: 'Find Healthcare',
      labelTa: 'சுகாதாரம் கண்டறி',
      labelHi: 'स्वास्थ्य केंद्र खोजें',
      icon: MapPin,
    },
    {
      id: 'appointments',
      labelEn: 'Appointments',
      labelTa: 'முன்பதிவு & டோக்கன்',
      labelHi: 'अपॉइंटमेंट और टोकन',
      icon: Calendar,
      badge: '1',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      isAppointment: true,
    },
    {
      id: 'ai_triage',
      labelEn: 'AI Triage',
      labelTa: 'AI அறிகுறி ஆய்வு',
      labelHi: 'AI लक्षण ट्रायज',
      icon: Brain,
      badge: 'AI',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'teleconsultation',
      labelEn: 'Teleconsultation',
      labelTa: 'தொலை மருத்துவம்',
      labelHi: 'टेलीकंसल्टेशन',
      icon: Video,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'referrals',
      labelEn: 'Referral Tracking',
      labelTa: 'பரிந்துரை கண்காணிப்பு',
      labelHi: 'रेफरल ट्रैकिंग',
      icon: GitFork,
      badge: 'Active',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'medicines_diagnostics',
      labelEn: 'Medicines & Diagnostics',
      labelTa: 'மருந்துகள் & ஆய்வகம்',
      labelHi: 'दवाएं और निदान',
      icon: Pill,
    },
    {
      id: 'patient_records',
      labelEn: 'Patient Records',
      labelTa: 'சுகாதார பதிவுகள்',
      labelHi: 'रोगी रिकॉर्ड',
      icon: ClipboardList,
    },
    {
      id: 'high_risk_followup',
      labelEn: 'High-Risk Follow-Up',
      labelTa: 'அதிமுக்கிய கண்காணிப்பு',
      labelHi: 'उच्च-जोखिम फॉलो-अप',
      icon: AlertTriangle,
      badge: '2 Due',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
  ];

  return (
    <aside className="w-64 lg:w-72 flex-shrink-0 flex flex-col bg-[#0b0f17] border-r border-white/[0.08] min-h-screen select-none">
      {/* Brand Header - Changed TN Public Health to ArogyaConnect as explicitly requested */}
      <div className="p-5 border-b border-white/[0.08] flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 font-black">
          <HeartPulse className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
            <span>ArogyaConnect</span>
          </h1>
          <p className="text-[11px] text-cyan-400 font-medium truncate">
            {selectedLocation}
          </p>
        </div>
      </div>

      {/* Navigation List of Contents */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          {lang === 'ta' ? 'பொருளடக்கம் / சேவைகள்' : lang === 'hi' ? 'सामग्री और सेवाएं' : 'Contents & Navigation'}
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/80 via-[#132032] to-[#12283e] text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-950/40'
                  : 'text-neutral-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-neutral-400 group-hover:text-neutral-200'
                  }`}
                />
                <span className="truncate">
                  {lang === 'ta' ? item.labelTa : lang === 'hi' ? item.labelHi : item.labelEn}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.badgeColor || 'bg-white/10 text-white/80 border-white/10'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-cyan-400 translate-x-0.5' : 'text-neutral-600 group-hover:text-neutral-400'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Offline Status Indicator */}
      <div className="px-3 pt-2 pb-1">
        <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2 text-[11px] text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold">
            {lang === 'ta' ? 'ஆஃப்லைன் தயார் முறை' : lang === 'hi' ? 'ऑफ़लाइन सक्रिय मोड' : 'Offline Ready (Local Storage)'}
          </span>
        </div>
      </div>

      {/* Bottom Emergency Help & Helplines Card */}
      <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-b from-[#181116] to-[#200e16] border border-rose-500/30 text-xs space-y-2.5 shadow-lg shadow-rose-950/40">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Emergency 108</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
        </div>

        <p className="text-[11px] text-neutral-300">
          {lang === 'ta' ? 'அரசு ஆம்புலன்ஸ் & 24/7 அவசர உதவி.' : lang === 'hi' ? 'सरकारी एम्बुलेंस और 24/7 आपातकालीन सहायता।' : 'Govt Ambulance & 24/7 Medical Advice Helplines.'}
        </p>

        <button
          onClick={onOpenEmergency}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/40 transition-all active:scale-95"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{lang === 'ta' ? 'அவசர உதவி 108' : lang === 'hi' ? 'आपातकालीन सहायता 108' : 'Emergency Help 108'}</span>
        </button>
      </div>
    </aside>
  );
};
