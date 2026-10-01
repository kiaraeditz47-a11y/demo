import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ClipboardList, 
  Download, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  User, 
  Activity, 
  CheckCircle2, 
  Heart, 
  Search,
  Filter
} from 'lucide-react';
import { Language, PatientRecord } from '../../types';
import { PATIENT_RECORDS } from '../../data/healthcareData';
import { downloadPatientRecordPDF } from '../../utils/pdfGenerator';

interface PatientRecordsViewProps {
  lang: Language;
  onBack: () => void;
}

export const PatientRecordsView: React.FC<PatientRecordsViewProps> = ({
  lang,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filteredRecords = PATIENT_RECORDS.filter(r => {
    const matchesFilter = filterType === 'all' || r.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch = r.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.facility.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDownloadSummary = () => {
    downloadPatientRecordPDF('Devi S.', '91-4458-1209');
    setDownloadSuccess('Complete ABHA Health Summary PDF downloaded to your device!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadRecord = (record: PatientRecord) => {
    downloadPatientRecordPDF('Devi S.', '91-4458-1209');
    setDownloadSuccess(`${record.type} PDF downloaded successfully!`);
    setTimeout(() => setDownloadSuccess(null), 4000);
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
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'ta' ? 'நோயாளி மருத்துவ பதிவுகள் & வரலாறு' : lang === 'hi' ? 'रोगी स्वास्थ्य रिकॉर्ड एवं इतिहास' : 'Patient Health Records & Clinical History'}
            </h1>
          </div>
        </div>

        {/* Master Download Button */}
        <button
          onClick={handleDownloadSummary}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-600/30 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{lang === 'ta' ? 'முழு மருத்துவ அறிக்கை PDF' : lang === 'hi' ? 'पूर्ण स्वास्थ्य रिकॉर्ड PDF' : 'Download Health Record (PDF)'}</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Patient Bio & Vitals Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#131d27] to-[#0a1017] border border-teal-500/30 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center font-black text-xl">
              DS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Devi S.</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300">
                  Female • 32 Yrs
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Kottaram Sector • Kanyakumari District
              </p>
              <p className="text-[11px] text-neutral-400">
                Assigned VHN: Sister Anitha (PHC Kottaram) • Blood Group: O+
              </p>
            </div>
          </div>

          <div className="text-right p-3 rounded-2xl bg-white/[0.04] border border-white/10">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Maternal Cohort</span>
            <span className="text-sm font-bold text-amber-300">ANC 28 Weeks</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">High-Risk Regular Tracking</span>
          </div>
        </div>

        {/* Vitals Grid */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Blood Pressure</span>
            <span className="text-base font-bold text-white mt-1 block">118/76 <small className="text-xs font-normal text-neutral-400">mmHg</small></span>
            <span className="text-[9px] text-emerald-400 font-semibold">Normal Gestational</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Pulse Rate</span>
            <span className="text-base font-bold text-white mt-1 block">74 <small className="text-xs font-normal text-neutral-400">bpm</small></span>
            <span className="text-[9px] text-emerald-400 font-semibold">Regular Sinus</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Weight</span>
            <span className="text-base font-bold text-white mt-1 block">58.2 <small className="text-xs font-normal text-neutral-400">kg</small></span>
            <span className="text-[9px] text-teal-300 font-semibold">+1.2 kg this month</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Hemoglobin (Hb)</span>
            <span className="text-base font-bold text-white mt-1 block">11.4 <small className="text-xs font-normal text-neutral-400">g/dL</small></span>
            <span className="text-[9px] text-emerald-400 font-semibold">Target achieved with IFA</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', labelEn: 'All Records (4)', labelTa: 'அனைத்தும்', labelHi: 'सभी' },
            { id: 'opd', labelEn: 'OPD Visits', labelTa: 'OPD', labelHi: 'ओपीडी' },
            { id: 'referral', labelEn: 'Referrals', labelTa: 'பரிந்துரை', labelHi: 'रेफरल' },
            { id: 'lab', labelEn: 'Lab Reports', labelTa: 'ஆய்வகம்', labelHi: 'लैब' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === f.id
                  ? 'bg-teal-500 text-black shadow-md shadow-teal-500/30'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 border border-white/10'
              }`}
            >
              {lang === 'ta' ? f.labelTa : lang === 'hi' ? f.labelHi : f.labelEn}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search records, doctor, notes..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0e141f] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      {/* Records Timeline List */}
      <div className="space-y-3.5">
        {filteredRecords.map(record => (
          <div
            key={record.id}
            className="p-5 rounded-2xl bg-[#0f141f] border border-white/10 hover:border-teal-500/30 transition-all space-y-3 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {record.type}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {record.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadRecord(record)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-neutral-200 border border-white/10 flex items-center gap-1.5 transition-colors active:scale-95"
                >
                  <Download className="w-3.5 h-3.5 text-teal-400" />
                  <span>{lang === 'ta' ? 'PDF பதிவிறக்குக' : lang === 'hi' ? 'पीडीएफ डाउनलोड' : 'Download PDF'}</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                {record.summary}
              </h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                {record.details}
              </p>
            </div>

            <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="text-teal-300 font-medium">{record.facility}</span>
              <span className="italic">{record.doctor}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
