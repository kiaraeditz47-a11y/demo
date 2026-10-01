import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  Users, 
  Calendar, 
  ArrowLeft,
  Navigation,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Language, Facility } from '../../types';
import { FACILITIES } from '../../data/healthcareData';

interface FindHealthcareViewProps {
  lang: Language;
  onBack: () => void;
  onBookFacility?: (facilityName: string) => void;
}

export const FindHealthcareView: React.FC<FindHealthcareViewProps> = ({
  lang,
  onBack,
  onBookFacility,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredFacilities = FACILITIES.filter(f => {
    const matchType = filterType === 'all' || f.type.toLowerCase().includes(filterType.toLowerCase());
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                        f.location.toLowerCase().includes(search.toLowerCase()) ||
                        f.services.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  const getFacilityTypeLabel = (type: string) => {
    if (lang === 'ta') {
      if (type === 'Sub-Centre') return 'சுகாதார துணை மையம்';
      if (type === 'PHC') return 'ஆரம்ப சுகாதார நிலையம்';
      if (type === 'Rural Hospital') return 'ஊரக அரசு மருத்துவமனை';
      return 'மாவட்ட தலைமை மருத்துவக் கல்லூரி';
    }
    if (lang === 'hi') {
      if (type === 'Sub-Centre') return 'उप-स्वास्थ्य केंद्र';
      if (type === 'PHC') return 'प्राथमिक स्वास्थ्य केंद्र (PHC)';
      if (type === 'Rural Hospital') return 'ग्रामीण सरकारी अस्पताल';
      return 'जिला मेडिकल कॉलेज अस्पताल';
    }
    return type;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-neutral-300 hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                {lang === 'ta' ? 'அரசு சுகாதார நெட்வொர்க்' : lang === 'hi' ? 'सरकारी स्वास्थ्य नेटवर्क' : 'Public Health Network'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="text-[11px] text-neutral-400">
                {lang === 'ta' ? 'கன்னியாகுமரி மாவட்டம்' : lang === 'hi' ? 'कन्याकुमारी जिला' : 'Kanyakumari District'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'ta' ? 'அருகிலுள்ள சுகாதார மையங்களை கண்டறிக' : lang === 'hi' ? 'निकटतम स्वास्थ्य केंद्र खोजें' : 'Find Healthcare Facilities'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>
              {lang === 'ta' ? '4 நிலைகளில் 24/7 சேவை' : lang === 'hi' ? '4 स्तरों पर 24/7 सेवा' : '4-Tier 24/7 Coverage'}
            </span>
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={
              lang === 'ta' 
                ? 'மருத்துவமனை பெயர், இடம் அல்லது சேவை (எ.கா. தடுப்பூசி, பிரசவம்) தேடுக...' 
                : lang === 'hi'
                ? 'अस्पताल, स्थान या सेवा खोजें (उदा. टीकाकरण, प्रसूति)...'
                : 'Search hospital, location, or service (e.g., maternity, lab, ortho)...'
            }
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0e141f] border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', labelEn: `All (${FACILITIES.length})`, labelTa: `அனைத்தும் (${FACILITIES.length})`, labelHi: `सभी (${FACILITIES.length})` },
            { id: 'sub-centre', labelEn: 'Sub-Centre (4)', labelTa: 'துணை மையம் (4)', labelHi: 'उप-केंद्र (4)' },
            { id: 'phc', labelEn: 'PHC (4)', labelTa: 'PHC (4)', labelHi: 'PHC (4)' },
            { id: 'rural hospital', labelEn: 'Rural Hosp (4)', labelTa: 'ஊரக மருத்துவமனை (4)', labelHi: 'ग्रामीण अस्पताल (4)' },
            { id: 'district hospital', labelEn: 'District Hosp (4)', labelTa: 'மாவட்ட மருத்துவமனை (4)', labelHi: 'जिला अस्पताल (4)' },
          ].map(filt => (
            <button
              key={filt.id}
              onClick={() => setFilterType(filt.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                filterType === filt.id
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 border border-white/10'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>{lang === 'ta' ? filt.labelTa : lang === 'hi' ? filt.labelHi : filt.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFacilities.map((fac) => (
          <div
            key={fac.id}
            className="p-5 rounded-2xl bg-gradient-to-b from-[#101725] to-[#0c111a] border border-white/10 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl"
          >
            {/* Header: Name, Badge, Distance */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {getFacilityTypeLabel(fac.type)}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">
                    {fac.distance}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">
                  {fac.name}
                </h2>
                <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>{fac.location}</span>
                </p>
              </div>

              {/* Live Queue Indicator */}
              <div className="text-right p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[10px] text-neutral-400 font-medium">
                  {lang === 'ta' ? 'தற்போதைய வரிசை' : lang === 'hi' ? 'वर्तमान कतार' : 'Current Queue'}
                </div>
                <div className="text-lg font-black text-cyan-400 flex items-center justify-end gap-1">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>{fac.queueCount}</span>
                </div>
                <div className="text-[9px] text-emerald-400 font-semibold">
                  {lang === 'ta' ? 'விரைவான சேவை' : lang === 'hi' ? 'सक्रिय टोकन' : 'Active Intake'}
                </div>
              </div>
            </div>

            {/* Operating Hours & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 pt-1">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03]">
                <Clock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                <span className="truncate">{fac.hours}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03]">
                <Phone className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                <span className="font-mono">{fac.phone}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <a
                href={`tel:${fac.phone}`}
                className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>{lang === 'ta' ? 'அழைக்க' : lang === 'hi' ? 'कॉल करें' : 'Call Desk'}</span>
              </a>

              {onBookFacility && (
                <button
                  onClick={() => onBookFacility(fac.name)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all active:scale-95"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{lang === 'ta' ? 'நியமனம் பதிவு' : lang === 'hi' ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
