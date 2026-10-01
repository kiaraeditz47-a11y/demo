import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Pill, 
  FlaskConical, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  BellRing
} from 'lucide-react';
import { Language } from '../../types';
import { MEDICINES, DIAGNOSTICS } from '../../data/healthcareData';

interface MedicinesDiagnosticsViewProps {
  lang: Language;
  onBack: () => void;
}

export const MedicinesDiagnosticsView: React.FC<MedicinesDiagnosticsViewProps> = ({
  lang,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'medicines' | 'diagnostics'>('medicines');
  const [search, setSearch] = useState('');
  const [notificationSent, setNotificationSent] = useState<string | null>(null);

  const filteredMedicines = MEDICINES.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDiagnostics = DIAGNOSTICS.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleStockNotify = (medName: string) => {
    setNotificationSent(medName);
    setTimeout(() => setNotificationSent(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-neutral-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                <Pill className="w-3.5 h-3.5 text-teal-400" />
                <span>PHC Dispensary</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span className="text-[11px] text-neutral-400">Kanyakumari Sector</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'ta' ? 'மருந்துகள் & ஆய்வக சோதனைகள்' : lang === 'hi' ? 'दवाएं और नैदानिक परीक्षण' : 'Medicines & Clinical Diagnostics'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Available in Stock</span>
          </span>
        </div>
      </div>

      {/* Tab Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.05] border border-white/10 self-start">
          <button
            onClick={() => setActiveTab('medicines')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'medicines'
                ? 'bg-teal-500 text-black shadow-md shadow-teal-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>{lang === 'ta' ? 'அரசு மருந்துகள் (6)' : lang === 'hi' ? 'दवाएं भंडार (6)' : 'Essential Medicines (6)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'diagnostics'
                ? 'bg-teal-500 text-black shadow-md shadow-teal-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>{lang === 'ta' ? 'ஆய்வக சோதனைகள் (5)' : lang === 'hi' ? 'लैब परीक्षण (5)' : 'Diagnostic Lab Tests (5)'}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={
              activeTab === 'medicines'
                ? (lang === 'ta' ? 'மருந்து பெயர் தேடுக...' : lang === 'hi' ? 'दवा का नाम खोजें...' : 'Search medicine name...')
                : (lang === 'ta' ? 'சோதனை பெயர் தேடுக...' : lang === 'hi' ? 'परीक्षण का नाम खोजें...' : 'Search diagnostic test...')
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e141f] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      {notificationSent && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Restock alert registered for <strong>{notificationSent}</strong>. VHN Sister Anitha notified.</span>
        </div>
      )}

      {/* MEDICINES LIST */}
      {activeTab === 'medicines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedicines.map(med => (
            <div
              key={med.id}
              className="p-5 rounded-2xl bg-[#0f141f] border border-white/10 hover:border-teal-500/40 transition-all space-y-3.5 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                    {med.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    med.isLowStock 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {med.isLowStock ? 'Low Stock (<50)' : `${med.stockCount} Available`}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-1">
                  {med.name}
                </h3>
                <p className="text-xs font-mono text-teal-300 font-semibold">
                  Dosage: {med.dosage}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{med.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Available</span>
                </span>

                {med.isLowStock ? (
                  <button
                    onClick={() => handleStockNotify(med.name)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <BellRing className="w-3 h-3" />
                    <span>Notify VHN</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-neutral-400 font-mono">In Dispensary</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DIAGNOSTICS LIST */}
      {activeTab === 'diagnostics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDiagnostics.map(diag => (
            <div
              key={diag.id}
              className="p-5 rounded-2xl bg-[#0f141f] border border-white/10 hover:border-teal-500/40 transition-all space-y-3.5 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {diag.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Available Today
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-1">
                  {diag.name}
                </h3>

                <div className="space-y-1.5 mt-3 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    <span>Turnaround: <strong>{diag.turnaroundTime}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Sample: <strong className="text-neutral-300">{diag.sampleRequired}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-400">
                  Digital Report Ready
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  Room 7 Lab
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
