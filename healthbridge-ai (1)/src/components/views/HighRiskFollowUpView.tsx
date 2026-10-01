import React, { useState } from 'react';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Phone, 
  FileText, 
  CheckCircle2, 
  Clock, 
  User, 
  Calendar, 
  Activity, 
  X, 
  Mic, 
  Volume2, 
  PhoneOff, 
  Plus
} from 'lucide-react';
import { Language, HighRiskFollowUp } from '../../types';
import { HIGH_RISK_FOLLOWUPS } from '../../data/healthcareData';

interface HighRiskFollowUpViewProps {
  lang: Language;
  onBack: () => void;
}

export const HighRiskFollowUpView: React.FC<HighRiskFollowUpViewProps> = ({
  lang,
  onBack,
}) => {
  const [followups, setFollowups] = useState<HighRiskFollowUp[]>(HIGH_RISK_FOLLOWUPS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Call simulation modal state
  const [callingPatient, setCallingPatient] = useState<HighRiskFollowUp | null>(null);
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');
  const [callDuration, setCallDuration] = useState(0);

  // Log Visit modal state
  const [loggingVisitFor, setLoggingVisitFor] = useState<HighRiskFollowUp | null>(null);
  const [bpValue, setBpValue] = useState('118/76');
  const [fetalHeartRate, setFetalHeartRate] = useState('142');
  const [weightValue, setWeightValue] = useState('58.2');
  const [notesValue, setNotesValue] = useState('Patient compliant with IFA and Calcium. Fetal movement active.');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const filteredList = followups.filter(f => {
    if (activeFilter === 'all') return true;
    return f.status === activeFilter;
  });

  const handleStartCall = (item: HighRiskFollowUp) => {
    setCallingPatient(item);
    setCallStatus('ringing');
    setCallDuration(0);

    // Transition to connected after 1.8 seconds
    setTimeout(() => {
      setCallStatus('connected');
    }, 1800);
  };

  const handleEndCall = () => {
    setCallingPatient(null);
    setCallStatus('ringing');
  };

  const handleOpenLogVisit = (item: HighRiskFollowUp) => {
    setLoggingVisitFor(item);
  };

  const handleSaveVisitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggingVisitFor) return;

    // Update the follow-up record in state
    setFollowups(prev => prev.map(item => {
      if (item.id === loggingVisitFor.id) {
        return {
          ...item,
          status: 'dueToday',
          scheduledDate: `Completed Today (${new Date().toLocaleDateString()})`,
          actionNotes: `Logged by VHN Sister Anitha: BP ${bpValue}, FHR ${fetalHeartRate} bpm, Wt ${weightValue}kg. ${notesValue}`,
        };
      }
      return item;
    }));

    setSuccessBanner(`Clinical visit successfully recorded for ${loggingVisitFor.patientName}! ABHA longitudinal records updated.`);
    setLoggingVisitFor(null);
    setTimeout(() => setSuccessBanner(null), 4500);
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
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Maternal & High-Risk Cohort Registry</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              <span className="text-[11px] text-neutral-400">VHN Kottaram Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'ta' ? 'அதிமுக்கிய கண்காணிப்பு' : lang === 'hi' ? 'उच्च-जोखिम फॉलो-अप' : 'High-Risk Follow-Up'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-rose-400" />
            <span>{followups.filter(f => f.status === 'overdue').length} Overdue Attention Required</span>
          </span>
        </div>
      </div>

      {successBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', labelEn: 'All Cohort (3)', labelTa: 'அனைத்தும் (3)', labelHi: 'सभी (3)' },
          { id: 'overdue', labelEn: '🚨 Overdue (1)', labelTa: '🚨 தாமதமானது (1)', labelHi: '🚨 अतिदेय (1)' },
          { id: 'dueToday', labelEn: '📅 Due Today (1)', labelTa: '📅 இன்று (1)', labelHi: '📅 आज देय (1)' },
          { id: 'upcoming', labelEn: 'Upcoming (1)', labelTa: 'வரவிருப்பது (1)', labelHi: 'आगामी (1)' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === f.id
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 border border-white/10'
            }`}
          >
            {lang === 'ta' ? f.labelTa : lang === 'hi' ? f.labelHi : f.labelEn}
          </button>
        ))}
      </div>

      {/* Followup Cards Grid */}
      <div className="space-y-4">
        {filteredList.map(item => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all space-y-4 shadow-xl ${
              item.status === 'overdue'
                ? 'bg-gradient-to-b from-[#251014] to-[#14080a] border-rose-500/40'
                : item.status === 'dueToday'
                ? 'bg-gradient-to-b from-[#21170d] to-[#120c06] border-amber-500/40'
                : 'bg-[#0f141f] border-white/10'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    item.status === 'overdue'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : item.status === 'dueToday'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    {item.scheduledDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-1.5">
                  {item.patientName} — <span className="text-neutral-300 font-medium">{item.condition}</span>
                </h3>

                <p className="text-xs text-neutral-300 mt-1">
                  Field In-Charge: <strong className="text-teal-300">{item.vhnWorker}</strong> • Contact: {item.phone}
                </p>
              </div>

              {/* Action Buttons: Call and Log Visit */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => handleStartCall(item)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
                  title="Call Patient / Health Worker"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{lang === 'ta' ? 'அழைக்க' : lang === 'hi' ? 'कॉल करें' : 'Call'}</span>
                </button>

                <button
                  onClick={() => handleOpenLogVisit(item)}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-600/30 active:scale-95 transition-all"
                  title="Log Field Visit Vitals"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'ta' ? 'பார்வை பதிவு' : lang === 'hi' ? 'दौरा दर्ज करें' : 'Log Visit'}</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 text-xs text-neutral-300">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">Clinical Protocol Notes:</span>
              <p>{item.actionNotes}</p>
            </div>
          </div>
        ))}
      </div>

      {/* INTERACTIVE CALL DIALOG */}
      {callingPatient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#101723] border border-white/20 rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl animate-scaleUp">
            <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-1">
              <div className="w-full h-full rounded-full bg-[#0a1017] flex items-center justify-center text-3xl">
                👩‍⚕️
              </div>
              {callStatus === 'connected' && (
                <div className="absolute -bottom-1 inset-x-0 flex justify-center gap-1">
                  <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-4 bg-teal-300 rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                {callingPatient.vhnWorker}
              </h3>
              <p className="text-xs text-emerald-300 font-medium">
                {callingPatient.patientName} Follow-up Line
              </p>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                {callingPatient.phone}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.05] text-xs font-mono text-neutral-300">
              {callStatus === 'ringing' ? (
                <span className="text-amber-300 animate-pulse">Ringing secure line...</span>
              ) : (
                <span className="text-emerald-400 font-bold">Connected (00:14) • HD Voice</span>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button className="p-3 rounded-2xl bg-white/[0.1] text-white">
                <Mic className="w-4 h-4" />
              </button>
              <button className="p-3 rounded-2xl bg-white/[0.1] text-white">
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleEndCall}
                className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE LOG VISIT MODAL */}
      {loggingVisitFor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveVisitLog}
            className="bg-[#10141d] border border-white/20 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp"
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Field VHN Encounter Log
                </span>
                <h3 className="text-lg font-bold text-white">
                  Log Field Visit: {loggingVisitFor.patientName}
                </h3>
                <p className="text-xs text-neutral-400">
                  {loggingVisitFor.condition}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLoggingVisitFor(null)}
                className="p-2 rounded-xl bg-white/[0.05] text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  value={bpValue}
                  onChange={e => setBpValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Fetal Heart Rate (bpm)</label>
                <input
                  type="text"
                  value={fetalHeartRate}
                  onChange={e => setFetalHeartRate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Weight (kg)</label>
                <input
                  type="text"
                  value={weightValue}
                  onChange={e => setWeightValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Hemoglobin Status</label>
                <input
                  type="text"
                  defaultValue="11.4 g/dL (Adequate)"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-neutral-400 mb-1 font-semibold">Clinical Observation & Action Taken</label>
              <textarea
                value={notesValue}
                onChange={e => setNotesValue(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white"
                required
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setLoggingVisitFor(null)}
                className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-black font-bold text-xs shadow-lg shadow-teal-600/30 active:scale-95 transition-all"
              >
                Save Clinical Visit Log
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
