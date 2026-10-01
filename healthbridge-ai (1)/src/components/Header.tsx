import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  Siren, 
  Bell, 
  User, 
  ChevronDown, 
  Check, 
  ArrowRightLeft,
  X
} from 'lucide-react';
import { Language, UserRole } from '../types';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  userRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onOpenEmergency: () => void;
  onSelectService: (id: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  userRole,
  onSwitchRole,
  onOpenEmergency,
  onSelectService,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Token Calling Soon', desc: 'OPD Token #12 is currently 4 patients away at Kanyakumari PHC (~20 mins).', time: '10m ago', unread: true, link: 'appointments' },
    { id: 2, title: 'Referral Verified', desc: 'Case REF-2026-KK-0847 received by Ortho department at Agastheeswaram.', time: '1h ago', unread: true, link: 'referrals' },
    { id: 3, title: 'Maternal ANC Alert', desc: 'ANC Visit 4 is due for 28-week ultrasound checkup.', time: '1d ago', unread: false, link: 'high_risk_followup' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#060709]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-teal-500/20">
            🏥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
                Arogya<span className="text-teal-400">Connect</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/15 text-teal-300 border border-teal-500/30">
                {lang === 'ta' ? 'கன்னியாகுமரி' : 'Kanyakumari District'}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-neutral-400 font-medium hidden xs:block">
              {lang === 'ta' ? 'தமிழ்நாடு அரசு பொது சுகாதாரத் துறை' : 'Govt. of Tamil Nadu Public Health Department'}
            </p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency Fast Dispatch Button */}
          <button
            onClick={onOpenEmergency}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
          >
            <Siren className="w-4 h-4 animate-pulse" />
            <span>{lang === 'ta' ? 'அவசர உதவி' : 'Emergency 108'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-colors"
            title="Toggle English / தமிழ்"
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="w-10 h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-neutral-200 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#12151b] border border-white/15 shadow-2xl p-4 text-xs space-y-3 animate-fadeIn z-50">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-white">Notifications</span>
                  <button onClick={() => setShowNotifMenu(false)} className="text-neutral-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        onSelectService(n.link);
                        setShowNotifMenu(false);
                      }}
                      className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer border border-white/5 transition-colors"
                    >
                      <div className="flex items-center justify-between text-neutral-200 font-semibold mb-0.5">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-neutral-400">{n.time}</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher (Citizen vs Health Worker) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-neutral-200 flex items-center gap-2 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">
                {userRole === 'patient' ? 'D' : '🩺'}
              </div>
              <span className="hidden md:inline-block">
                {userRole === 'patient' ? 'Devi S. (Citizen)' : 'Sister Anitha (VHN)'}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#12151b] border border-white/15 shadow-2xl p-2 text-xs space-y-1 animate-fadeIn z-50">
                <div className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Switch Active Portal
                </div>
                <button
                  onClick={() => {
                    onSwitchRole('patient');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors ${
                    userRole === 'patient' ? 'bg-teal-500/20 text-teal-300 font-bold' : 'text-neutral-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs">👤</span>
                    <div>
                      <div className="text-white">Devi S. (Citizen)</div>
                      <div className="text-[10px] text-neutral-400">ABHA: 91-4458-1209</div>
                    </div>
                  </div>
                  {userRole === 'patient' && <Check className="w-4 h-4 text-teal-400" />}
                </button>

                <button
                  onClick={() => {
                    onSwitchRole('health_worker');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors ${
                    userRole === 'health_worker' ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-neutral-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs">🩺</span>
                    <div>
                      <div className="text-white">Sister Anitha (VHN)</div>
                      <div className="text-[10px] text-neutral-400">PHC Staff Portal</div>
                    </div>
                  </div>
                  {userRole === 'health_worker' && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
