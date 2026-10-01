import React, { useState } from 'react';
import { 
  ArrowLeft, 
  GitFork, 
  FileText, 
  ChevronRight, 
  Download, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Activity, 
  X, 
  AlertCircle,
  QrCode,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Language, Referral } from '../../types';
import { REFERRALS } from '../../data/healthcareData';
import { downloadReferralCaseSlipPDF } from '../../utils/pdfGenerator';

interface ReferralsViewProps {
  lang: Language;
  onBack: () => void;
}

export const ReferralsView: React.FC<ReferralsViewProps> = ({
  lang,
  onBack,
}) => {
  const [selectedCaseFile, setSelectedCaseFile] = useState<Referral | null>(null);

  // Longitudinal multi-tier stages for the primary referral
  const longitudinalTimeline = [
    {
      tier: 'Tier 1: Health Sub-Centre (HSC Kottaram)',
      tierTa: 'நிலை 1: சுகாதார துணை மையம் (கொட்டாரம்)',
      tierHi: 'स्तर 1: उप-स्वास्थ्य केंद्र (कोट्टारम)',
      date: '17 Sept 2026 • 09:30 AM',
      provider: 'Sister Anitha (VHN Worker)',
      notes: 'Patient presented with acute right wrist strain following domestic slip. Local ice compression applied; suspected distal hairline fracture. Digital referral initiated.',
      vitals: 'BP 116/74 mmHg • Pulse 76 bpm',
      status: 'completed',
    },
    {
      tier: 'Tier 2: Primary Health Centre (Kanyakumari Govt PHC)',
      tierTa: 'நிலை 2: அரசு ஆரம்ப சுகாதார நிலையம் (கன்னியாகுமரி)',
      tierHi: 'स्तर 2: प्राथमिक स्वास्थ्य केंद्र (कन्याकुमारी)',
      date: '18 Sept 2026 • 11:15 AM',
      provider: 'Dr. Meena R., MBBS, DGO',
      notes: 'Clinical palpation revealed localized tenderness over radial styloid. Analgesic Paracetamol 500mg prescribed. Radiography requisition issued to Agastheeswaram Rural Hospital.',
      vitals: 'BP 118/76 mmHg • Hb 11.4 g/dL',
      status: 'completed',
    },
    {
      tier: 'Tier 3: Rural Hospital (Agastheeswaram RH)',
      tierTa: 'நிலை 3: ஊரக அரசு மருத்துவமனை (அகஸ்தீஸ்வரம்)',
      tierHi: 'स्तर 3: ग्रामीण सरकारी अस्पताल (अगस्तीश्वरम)',
      date: '19 Sept 2026 • 02:45 PM',
      provider: 'Dr. Siva K., MS (Ortho)',
      notes: 'Digital X-ray confirmed nondisplaced hairline fracture of distal radius. Forearm splint immobilizer applied. Advised orthopedic cast review and bone healing scan.',
      vitals: 'Splint stable • Pain scale 3/10',
      status: 'active',
    },
    {
      tier: 'Tier 4: District Govt Medical College Hospital (Asaripallam)',
      tierTa: 'நிலை 4: மாவட்ட அரசு மருத்துவக் கல்லூரி மருத்துவமனை',
      tierHi: 'स्तर 4: जिला सरकारी मेडिकल कॉलेज अस्पताल (असारिपल्लम)',
      date: 'Scheduled: 24 Sept 2026',
      provider: 'Department of Orthopedics & Trauma',
      notes: 'Tertiary review slot reserved. Digital case files pre-transferred via ABDM ArogyaConnect network.',
      vitals: 'Queue Slot #06 Pre-Allocated',
      status: 'upcoming',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
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
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5 text-purple-400" />
                <span>{lang === 'ta' ? 'பரிந்துரை கண்காணிப்பு' : lang === 'hi' ? 'रेफरल ट्रैकिंग' : 'Referral Tracking'}</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'ta' ? 'பரிந்துரை கண்காணிப்பு' : lang === 'hi' ? 'रेफरल ट्रैकिंग' : 'Referral Tracking'}
            </h1>
          </div>
        </div>
      </div>

      {/* Primary Referral Overview Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#161224] to-[#0c0a14] border border-purple-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                REF-2026-KK-0847
              </span>
              <span className="text-xs text-neutral-400">
                Patient: <strong>Devi S. (32y)</strong>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1.5">
              Right Distal Radius Hairline Fracture Review & Casting Check
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCaseFile(REFERRALS[0])}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>{lang === 'ta' ? 'வழக்கு ஆவணம் காண்க' : lang === 'hi' ? 'केस फाइल देखें' : 'View Case File'}</span>
            </button>

            <button
              onClick={() => downloadReferralCaseSlipPDF('REF-2026-KK-0847')}
              className="p-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-neutral-200 border border-white/10 transition-colors"
              title="Download Referral Slip PDF"
            >
              <Download className="w-4 h-4 text-purple-300" />
            </button>
          </div>
        </div>

        {/* Longitudinal Care Pathway Timeline */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-5">
            {lang === 'ta' ? 'நீண்டகால மருத்துவ கண்காணிப்பு காலவரிசை' : lang === 'hi' ? 'अनुदैर्ध्य देखभाल प्रगति रेखा' : 'Longitudinal Clinical Care Continuum'}
          </h3>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-teal-500 before:to-neutral-700">
            {longitudinalTimeline.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Node Icon on Timeline */}
                <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border text-xs ${
                  step.status === 'completed'
                    ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-600/50'
                    : step.status === 'active'
                    ? 'bg-teal-500 border-teal-300 text-black font-bold animate-pulse shadow-md shadow-teal-500/50'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : step.status === 'active' ? (
                    '3'
                  ) : (
                    '4'
                  )}
                </div>

                {/* Content Box */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-colors space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-white">
                      {lang === 'ta' ? step.tierTa : lang === 'hi' ? step.tierHi : step.tier}
                    </h4>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {step.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-purple-300 font-medium">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{step.provider}</span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {step.notes}
                  </p>

                  <div className="pt-2 flex items-center gap-3 text-[11px] text-neutral-400 border-t border-white/5">
                    <span className="font-semibold text-teal-300">Recorded Vitals:</span>
                    <span>{step.vitals}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Referral Card: High Risk Maternal */}
      <div className="p-5 rounded-2xl bg-[#0f121a] border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                URGENT MATERNAL
              </span>
              <span className="text-xs text-neutral-400">REF-2026-KK-0902</span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              Severe Gestational Hypertension (160/105) — Specialist Doppler
            </h4>
            <p className="text-xs text-neutral-400">
              Anitha M. • Kottaram HSC → Kanyakumari PHC → Asaripallam Medical College
            </p>
          </div>

          <button
            onClick={() => setSelectedCaseFile(REFERRALS[1])}
            className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-neutral-200 border border-white/10 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>{lang === 'ta' ? 'வழக்கு கோப்பு' : lang === 'hi' ? 'केस विवरण' : 'View Case Slip'}</span>
          </button>
        </div>
      </div>

      {/* CASE FILE MODAL / DRAWER */}
      {selectedCaseFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10141d] border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleUp p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">
                  Referral Case File: {selectedCaseFile.id}
                </h3>
                <p className="text-xs text-neutral-400">
                  {selectedCaseFile.patientName}
                </p>
              </div>
              <button
                onClick={() => setSelectedCaseFile(null)}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Case Details */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
                <span className="text-neutral-400 font-semibold block uppercase text-[10px]">Clinical Diagnosis</span>
                <p className="text-white font-medium text-sm">{selectedCaseFile.diagnosis}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.03]">
                  <span className="text-neutral-400 text-[10px] uppercase font-bold block">Origin Facility</span>
                  <span className="text-white font-medium">{selectedCaseFile.originFacility}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03]">
                  <span className="text-neutral-400 text-[10px] uppercase font-bold block">Current Location</span>
                  <span className="text-teal-300 font-medium">{selectedCaseFile.currentFacility}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                <span className="text-purple-300 font-bold uppercase text-[10px] block">Target Tertiary Facility</span>
                <p className="text-white font-bold">{selectedCaseFile.targetFacility}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={() => downloadReferralCaseSlipPDF(selectedCaseFile.id)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'ta' ? 'அதிகாரப்பூர்வ PDF பதிவிறக்குக' : lang === 'hi' ? 'केस स्लिप पीडीएफ डाउनलोड करें' : 'Download Case Slip (PDF)'}</span>
              </button>

              <button
                onClick={() => setSelectedCaseFile(null)}
                className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
