import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  Bell, 
  Globe, 
  Check, 
  Menu, 
  X,
  UserCheck
} from 'lucide-react';
import { Language, UserRole } from '../types';

interface DashboardHeaderProps {
  lang: Language;
  onSelectLang: (lang: Language) => void;
  userRole: UserRole;
  onToggleRole: (role: UserRole) => void;
  onOpenEmergency: () => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  onToggleSidebarMobile?: () => void;
  isMobileSidebarOpen?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lang,
  onSelectLang,
  userRole,
  onToggleRole,
  onOpenEmergency,
  selectedLocation,
  onSelectLocation,
  onToggleSidebarMobile,
  isMobileSidebarOpen,
}) => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // 5 Authentic Locations in Kanyakumari District
  const locations = [
    {
      id: 'loc-1',
      nameEn: 'Kanyakumari District',
      nameTa: 'கன்னியாகுமரி மாவட்டம்',
      nameHi: 'कन्याकुमारी जिला',
      typeEn: 'District Headquarters & Network',
      typeTa: 'மாவட்ட தலைமையகம்',
      typeHi: 'जिला मुख्यालय एवं नेटवर्क',
    },
    {
      id: 'loc-2',
      nameEn: 'Agastheeswaram Taluk',
      nameTa: 'அகத்தீஸ்வரம் வட்டம்',
      nameHi: 'अगस्तीश्वरम तालुक',
      typeEn: 'Sub-Centre & Rural Hospital Hub',
      typeTa: 'துணை மையங்கள் & ஊரக மருத்துவமனை',
      typeHi: 'उप-केंद्र एवं ग्रामीण अस्पताल केंद्र',
    },
    {
      id: 'loc-3',
      nameEn: 'Nagercoil Sub-District',
      nameTa: 'நாகர்கோவில் உட்கோட்டம்',
      nameHi: 'नागरकोइल उप-मंडल',
      typeEn: 'Medical College & Tertiary Care',
      typeTa: 'மருத்துவக் கல்லூரி & சிறப்பு மையம்',
      typeHi: 'मेडिकल कॉलेज एवं तृतीयक देखभाल',
    },
    {
      id: 'loc-4',
      nameEn: 'Thovalai Taluk',
      nameTa: 'தோவாளை வட்டம்',
      nameHi: 'थोवलई तालुक',
      typeEn: 'Primary Health Centres (PHC)',
      typeTa: 'ஆரம்ப சுகாதார நிலையங்கள்',
      typeHi: 'प्राथमिक स्वास्थ्य केंद्र (PHC)',
    },
    {
      id: 'loc-5',
      nameEn: 'Kottaram Sector',
      nameTa: 'கொட்டாரம் பகுதி',
      nameHi: 'कोट्टारम सेक्टर',
      typeEn: 'Village HSC & Maternal Clinic',
      typeTa: 'கிராம துணை மையம் & தாய் சேய் நலம்',
      typeHi: 'ग्रामीण उप-केंद्र एवं मातृ क्लिनिक',
    },
  ];

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setIsLocationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLangLabel = () => {
    if (lang === 'ta') return 'தமிழ்';
    if (lang === 'hi') return 'हिन्दी';
    return 'English';
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0b0f17]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-3 flex-wrap md:flex-nowrap">
        {/* Left: Mobile hamburger + "Patient Dashboard • Kanyakumari Healthcare Network" */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onToggleSidebarMobile}
            className="md:hidden p-2 rounded-xl bg-white/[0.06] border border-white/10 text-neutral-300 hover:text-white"
            aria-label="Toggle navigation"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
              {userRole === 'patient' 
                ? (lang === 'ta' ? 'நோயாளர் கட்டுப்பாட்டகம்' : lang === 'hi' ? 'रोगी डैशबोर्ड' : 'Patient Dashboard') 
                : (lang === 'ta' ? 'சுகாதார பணியாளர் தளம்' : lang === 'hi' ? 'स्वास्थ्य कार्यकर्ता डैशबोर्ड' : 'Staff Dashboard (VHN)')}
            </h2>
            <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                {lang === 'ta' 
                  ? 'கன்னியாகுமரி மாவட்ட சுகாதார கட்டமைப்பு' 
                  : lang === 'hi'
                  ? 'कन्याकुमारी जिला स्वास्थ्य नेटवर्क'
                  : 'Kanyakumari Healthcare Network'}
              </span>
            </p>
          </div>
        </div>

        {/* Right controls:
            [ 📍 5 Locations ▾ ] [ 🚨 Emergency Help ] [ 🌐 Language ▾ ] [ 🔔 2 ] [ [D] Devi S. ▾ ]
        */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* 1. 5 Locations Dropdown Selector beside emergency button */}
          <div className="relative" ref={locationRef}>
            <button
              id="location-selector-btn"
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-xs font-semibold text-neutral-200 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span className="max-w-[130px] sm:max-w-[170px] truncate">
                {selectedLocation}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {isLocationOpen && (
              <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-72 rounded-2xl bg-[#111622] border border-white/15 shadow-2xl p-2 text-xs space-y-1 z-50 animate-fadeIn">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-white/5 flex items-center justify-between">
                  <span>{lang === 'ta' ? '5 இடங்களைத் தேர்ந்தெடுக்கவும்' : lang === 'hi' ? 'स्थान चुनें' : 'Select Network Location'}</span>
                  <span className="text-teal-400">5 Active Hubs</span>
                </div>

                <div className="py-1 space-y-1 max-h-64 overflow-y-auto">
                  {locations.map((loc) => {
                    const isSelected = selectedLocation.includes(loc.nameEn) || selectedLocation === loc.nameEn;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => {
                          onSelectLocation(loc.nameEn);
                          setIsLocationOpen(false);
                        }}
                        className={`w-full p-2 rounded-xl text-left flex items-start justify-between transition-colors ${
                          isSelected 
                            ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30' 
                            : 'text-neutral-300 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-white">
                            {lang === 'ta' ? loc.nameTa : lang === 'hi' ? loc.nameHi : loc.nameEn}
                          </div>
                          <div className="text-[10px] text-neutral-400 mt-0.5">
                            {lang === 'ta' ? loc.typeTa : lang === 'hi' ? loc.typeHi : loc.typeEn}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Emergency Help Button */}
          <button
            id="emergency-help-btn"
            onClick={onOpenEmergency}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
          >
            <span className="text-sm">🚨</span>
            <span className="whitespace-nowrap">
              {lang === 'ta' ? 'அவசர உதவி 108' : lang === 'hi' ? 'आपातकालीन सहायता 108' : 'Emergency Help 108'}
            </span>
          </button>

          {/* 3. Language Selector (English / தமிழ் / हिन्दी) */}
          <div className="relative" ref={langRef}>
            <button
              id="language-toggle-btn"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-colors"
              title="Choose Language / மொழி / भाषा"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{getLangLabel()}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-[#111622] border border-white/15 shadow-2xl p-1.5 text-xs space-y-1 z-50 animate-fadeIn">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'ta', label: 'தமிழ் (Tamil)' },
                  { code: 'hi', label: 'हिन्दी (Hindi)' },
                ].map(item => (
                  <button
                    key={item.code}
                    onClick={() => {
                      onSelectLang(item.code as Language);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-colors ${
                      lang === item.code
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                        : 'text-neutral-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {lang === item.code && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-neutral-200 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-neutral-300" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[9px] font-bold text-white flex items-center justify-center border border-[#0b0f17]">
                2
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#111622] border border-white/15 shadow-2xl p-3 text-xs space-y-2.5 z-50 animate-fadeIn">
                <div className="font-bold text-white flex items-center justify-between border-b border-white/10 pb-2">
                  <span>{lang === 'ta' ? 'அறிவிப்புகள்' : lang === 'hi' ? 'सूचनाएं' : 'Notifications'}</span>
                  <span className="text-[10px] text-teal-400">2 New</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-neutral-200">
                    <strong className="text-white block text-[11px]">Appointment Confirmed</strong>
                    <span>Token #12 at Kanyakumari PHC today at 10:30 AM.</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-neutral-200">
                    <strong className="text-rose-300 block text-[11px]">Follow-up Overdue</strong>
                    <span>Maternal ANC checkup due since Sept 24, 2026.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. User Profile Chip: [D] Devi S. Patient • 32y ▾ */}
          <div className="relative" ref={profileRef}>
            <button
              id="profile-menu-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 transition-colors"
            >
              <div className="w-7 h-7 rounded-xl bg-teal-400/20 border border-teal-400/30 text-teal-300 flex items-center justify-center font-bold text-xs">
                {userRole === 'patient' ? 'D' : 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">
                  {userRole === 'patient' ? 'Devi S.' : 'Sister Anitha'}
                </div>
                <div className="text-[10px] text-neutral-400 leading-tight">
                  {userRole === 'patient' ? 'Patient' : 'VHN'}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#111622] border border-white/15 shadow-2xl p-2 text-xs space-y-1 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-white/10">
                  <div className="font-bold text-white">
                    {userRole === 'patient' ? 'Devi S.' : 'Sister Anitha'}
                  </div>
                </div>

                <div className="pt-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-neutral-400 uppercase">
                    Switch Role
                  </div>
                  <button
                    onClick={() => {
                      onToggleRole('patient');
                      setIsProfileOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between ${
                      userRole === 'patient' ? 'bg-teal-500/20 text-teal-300 font-bold' : 'text-neutral-300 hover:bg-white/5'
                    }`}
                  >
                    <span>Patient: Devi S.</span>
                    {userRole === 'patient' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </button>

                  <button
                    onClick={() => {
                      onToggleRole('health_worker');
                      setIsProfileOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between ${
                      userRole === 'health_worker' ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-neutral-300 hover:bg-white/5'
                    }`}
                  >
                    <span>VHN: Sister Anitha</span>
                    {userRole === 'health_worker' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
