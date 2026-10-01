import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Video, 
  MessageSquare, 
  FileText, 
  ArrowRight,
  Shield,
  Activity,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { 
  ServiceId, 
  Language, 
  UserRole,
  Facility,
  Appointment
} from '../types';
import { 
  FACILITIES, 
  APPOINTMENTS, 
  DOCTORS, 
  REFERRALS, 
  MEDICINES, 
  DIAGNOSTICS, 
  PATIENT_RECORDS, 
  HIGH_RISK_FOLLOWUPS 
} from '../data/healthcareData';

interface ServiceModalProps {
  serviceId: ServiceId | null;
  onClose: () => void;
  lang: Language;
  userRole: UserRole;
  onOpenEmergency: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  serviceId,
  onClose,
  lang,
  userRole,
  onOpenEmergency
}) => {
  // Facility filter
  const [facilityFilter, setFacilityFilter] = useState<string>('all');
  const [facilitySearch, setFacilitySearch] = useState<string>('');

  // Appointments state
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(APPOINTMENTS);
  const [showBookingForm, setShowBookingForm] = useState<boolean>(false);
  const [bookingFacility, setBookingFacility] = useState('Kanyakumari Government PHC');
  const [bookingDept, setBookingDept] = useState('General Medicine');
  const [bookedSuccess, setBookedSuccess] = useState(false);

  // AI Triage state
  const [triageStep, setTriageStep] = useState<number>(0);
  const [selectedSymptom, setSelectedSymptom] = useState<string>('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe' | ''>('');
  const [duration, setDuration] = useState<'today' | '1-3' | '3+' | ''>('');

  // Teleconsult state
  const [activeCallDoc, setActiveCallDoc] = useState<string | null>(null);
  const [callConnected, setCallConnected] = useState<boolean>(false);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatLog, setChatLog] = useState<{ sender: string; text: string }[]>([
    { sender: 'Dr. Meena R.', text: 'Vanakkam Devi, I am reviewing your 28-week maternal records. How are you feeling today?' }
  ]);

  // Medicines state
  const [medSearch, setMedSearch] = useState<string>('');
  const [medTab, setMedTab] = useState<'medicines' | 'diagnostics'>('medicines');
  const [requestedItem, setRequestedItem] = useState<string | null>(null);

  // Follow-up state
  const [followupFilter, setFollowupFilter] = useState<'all' | 'maternal' | 'child' | 'chronic'>('all');

  if (!serviceId) return null;

  // Handle new appointment booking
  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      facility: bookingFacility,
      department: bookingDept,
      doctor: 'Dr. Meena R., MBBS',
      date: 'Tomorrow, 22 Sept 2026',
      time: '11:00 AM',
      token: `#${Math.floor(Math.random() * 20) + 15}`,
      currentServing: '#02',
      patientsAhead: 13,
      estWait: '~40 mins',
      status: 'upcoming',
    };
    setAppointmentsList([newApt, ...appointmentsList]);
    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setShowBookingForm(false);
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatLog(prev => [
      ...prev,
      { sender: 'You (Devi)', text: chatMessage },
      { sender: 'Dr. Meena R.', text: 'Understood. Ensure you take your iron supplement after lunch with lemon water for optimal absorption.' }
    ]);
    setChatMessage('');
  };

  // Content renderers
  const renderFindHealthcare = () => {
    const filtered = FACILITIES.filter(f => {
      const matchFilter = facilityFilter === 'all' || f.type.toLowerCase().includes(facilityFilter.toLowerCase());
      const matchSearch = f.name.toLowerCase().includes(facilitySearch.toLowerCase()) || f.location.toLowerCase().includes(facilitySearch.toLowerCase());
      return matchFilter && matchSearch;
    });

    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={facilitySearch}
              onChange={e => setFacilitySearch(e.target.value)}
              placeholder={lang === 'ta' ? 'மருத்துவமனைகள் அல்லது ஆரம்ப சுகாதார நிலையங்களைத் தேடுக...' : 'Search hospitals, PHCs, or services...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'sub-centre', 'phc', 'rural', 'district'].map(filt => (
              <button
                key={filt}
                onClick={() => setFacilityFilter(filt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  facilityFilter === filt 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                    : 'bg-white/[0.04] text-neutral-400 border border-white/5 hover:text-white'
                }`}
              >
                {filt === 'all' ? (lang === 'ta' ? 'அனைத்தும்' : 'All') : filt}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(fac => (
            <div 
              key={fac.id}
              className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {fac.type}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1.5">{fac.name}</h4>
                    <p className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{fac.location} • <strong className="text-cyan-300">{fac.distance}</strong></span>
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    fac.isOpen ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'
                  }`}>
                    {fac.isOpen ? (lang === 'ta' ? 'திறந்துள்ளது' : 'Open Now') : 'Closed'}
                  </span>
                </div>

                <div className="mt-3 py-2 px-3 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">{lang === 'ta' ? 'தற்போதைய புறநோயாளி வரிசை:' : 'Current Outpatient Queue:'}</span>
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    {fac.queueCount} {lang === 'ta' ? 'நபர்கள்' : 'Patients Waiting'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {fac.services.map((srv, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/[0.05] text-[10px] font-medium text-neutral-300">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                <a 
                  href={`tel:${fac.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{fac.phone}</span>
                </a>
                <button 
                  onClick={() => {
                    setBookingFacility(fac.name);
                    setShowBookingForm(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20"
                >
                  {lang === 'ta' ? 'நியமனம் பதிவு' : 'Book Appointment'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-white">
            {lang === 'ta' ? 'உங்கள் மருத்துவ நியமனங்கள் & டோக்கன் வரிசை' : 'Active Appointments & Queue Token'}
          </h4>
          <p className="text-xs text-neutral-400">
            {lang === 'ta' ? 'நேரலை டோக்கன் அழைப்பு மற்றும் வருகை நேரம்' : 'Real-time live queue tracking and token display'}
          </p>
        </div>
        <button
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>{showBookingForm ? (lang === 'ta' ? 'ரத்து செய்' : 'Cancel') : (lang === 'ta' ? 'புதிய பதிவு' : 'Book New Token')}</span>
        </button>
      </div>

      {showBookingForm && (
        <form onSubmit={handleBookAppointment} className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-4 animate-fadeIn">
          <h5 className="font-bold text-purple-200 text-sm">
            {lang === 'ta' ? 'புதிய மருத்துவ நியமன டோக்கன் பெறுக' : 'Reserve Fast-Track OPD Queue Token'}
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-neutral-300 font-semibold mb-1 block">Facility</label>
              <select 
                value={bookingFacility} 
                onChange={e => setBookingFacility(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {FACILITIES.map(f => (
                  <option key={f.id} value={f.name} className="bg-neutral-900">{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-300 font-semibold mb-1 block">Department</label>
              <select 
                value={bookingDept} 
                onChange={e => setBookingDept(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="General Medicine" className="bg-neutral-900">General Medicine</option>
                <option value="Maternal & Antenatal (ANC)" className="bg-neutral-900">Maternal & Antenatal (ANC)</option>
                <option value="Orthopaedics" className="bg-neutral-900">Orthopaedics</option>
                <option value="Pediatrics & Child Care" className="bg-neutral-900">Pediatrics & Child Care</option>
                <option value="NCD & Diabetes Clinic" className="bg-neutral-900">NCD & Diabetes Clinic</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-opacity"
          >
            {bookedSuccess ? '✓ Token Reserved Successfully!' : (lang === 'ta' ? 'டோக்கன் உறுதி செய்' : 'Confirm & Generate OPD Token')}
          </button>
        </form>
      )}

      {/* Existing Appointments */}
      <div className="space-y-4">
        {appointmentsList.map(apt => (
          <div 
            key={apt.id}
            className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                  {apt.department}
                </span>
                <span className="text-xs text-neutral-400">📅 {apt.date} • {apt.time}</span>
              </div>
              <h4 className="text-lg font-bold text-white">{apt.facility}</h4>
              <p className="text-xs text-neutral-400">Consulting: <strong className="text-neutral-200">{apt.doctor}</strong></p>
              
              <div className="flex items-center gap-4 text-xs pt-1">
                <span className="text-neutral-400">
                  {lang === 'ta' ? 'தற்போது அழைக்கப்படும் எண்:' : 'Now Calling:'} <strong className="text-emerald-400 font-bold">{apt.currentServing}</strong>
                </span>
                <span className="text-neutral-400">•</span>
                <span className="text-amber-400 font-medium">
                  {apt.patientsAhead} {lang === 'ta' ? 'நபர்கள் முன்னிலையில்' : 'patients ahead'} ({apt.estWait})
                </span>
              </div>
            </div>

            {/* Token Badge Display */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
              <div className="text-center px-5 py-3 rounded-2xl bg-purple-500/15 border border-purple-500/40">
                <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                  {lang === 'ta' ? 'உங்கள் டோக்கன்' : 'YOUR TOKEN'}
                </div>
                <div className="text-3xl font-black text-white tracking-tight">
                  {apt.token}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => alert(`Showing Token ${apt.token} QR Code for automated entry scanning at ${apt.facility}.`)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition-all"
                >
                  {lang === 'ta' ? 'பாஸ் காண்க' : 'Digital Pass'}
                </button>
                <button 
                  onClick={() => alert('Appointment rescheduled notification sent.')}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition-colors"
                >
                  {lang === 'ta' ? 'நேரம் மாற்று' : 'Reschedule'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAITriage = () => {
    const symptoms = [
      { name: 'Fever & Chills', icon: '🌡️' },
      { name: 'Headache & Dizziness', icon: '🤕' },
      { name: 'Chest Pain or Tightness', icon: '🫀' },
      { name: 'Difficulty Breathing', icon: '🫁' },
      { name: 'Severe Abdominal Pain', icon: '🩹' },
      { name: 'Cough, Cold & Sore Throat', icon: '🗣️' },
      { name: 'Joint Pain & Swelling', icon: '🦴' },
      { name: 'Skin Rash or Allergic Itch', icon: '✨' },
    ];

    const isUrgent = severity === 'severe' || selectedSymptom.includes('Chest') || selectedSymptom.includes('Breathing');
    const isMild = severity === 'mild';

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Govt. Public Health Clinical Decision Protocol v2.4 • Guidance only; not a substitute for professional evaluation.</span>
          </div>
        </div>

        {triageStep === 0 && (
          <div className="space-y-4 animate-fadeIn">
            <h4 className="text-base font-bold text-white">
              {lang === 'ta' ? 'படி 1: நீங்கள் என்ன அறிகுறிகளை உணர்கிறீர்கள்?' : 'Step 1: What primary symptom are you experiencing?'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {symptoms.map(s => (
                <button
                  key={s.name}
                  onClick={() => setSelectedSymptom(s.name)}
                  className={`p-4 rounded-2xl text-center border transition-all ${
                    selectedSymptom === s.name
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold shadow-lg shadow-amber-500/20'
                      : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-1.5">{s.icon}</div>
                  <div className="text-xs leading-tight">{s.name}</div>
                </button>
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <button
                disabled={!selectedSymptom}
                onClick={() => setTriageStep(1)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-black font-bold text-xs flex items-center gap-2 transition-all"
              >
                <span>{lang === 'ta' ? 'அடுத்த கேள்வி' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {triageStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <h4 className="text-base font-bold text-white">
              {lang === 'ta' ? 'படி 2: தீவிரத்தன்மை மற்றும் தொடங்கிய காலம்' : 'Step 2: Severity & Timeline'}
            </h4>
            
            <div className="space-y-2">
              <label className="text-xs text-neutral-300 font-semibold">How severe is the discomfort?</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'mild', label: 'Mild', desc: 'Can continue daily routine' },
                  { id: 'moderate', label: 'Moderate', desc: 'Disrupts normal activity' },
                  { id: 'severe', label: 'Severe', desc: 'Intense or unbearable' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSeverity(item.id as any)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      severity === item.id
                        ? 'bg-amber-500/20 border-amber-500 text-white'
                        : 'bg-white/[0.04] border-white/10 text-neutral-400'
                    }`}
                  >
                    <div className="text-sm font-bold text-white">{item.label}</div>
                    <div className="text-[10px] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-neutral-300 font-semibold">When did the symptoms begin?</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'today', label: 'Today', desc: 'Started in last 12 hrs' },
                  { id: '1-3', label: '1 - 3 Days', desc: 'Persistent over few days' },
                  { id: '3+', label: '3+ Days', desc: 'Ongoing prolonged episode' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDuration(item.id as any)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      duration === item.id
                        ? 'bg-amber-500/20 border-amber-500 text-white'
                        : 'bg-white/[0.04] border-white/10 text-neutral-400'
                    }`}
                  >
                    <div className="text-sm font-bold text-white">{item.label}</div>
                    <div className="text-[10px] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setTriageStep(0)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold"
              >
                ← Back
              </button>
              <button
                disabled={!severity || !duration}
                onClick={() => setTriageStep(2)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 disabled:opacity-40 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <span>Generate Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {triageStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Assessment Result Card */}
            <div className={`p-6 rounded-[24px] border ${
              isUrgent 
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-100'
                : isMild 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-100'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-100'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold ${
                  isUrgent ? 'bg-rose-600 text-white' : isMild ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {isUrgent ? '🚨' : isMild ? '🏠' : '🏥'}
                </div>
                <div>
                  <h4 className="text-lg font-black tracking-tight text-white">
                    {isUrgent 
                      ? (lang === 'ta' ? 'உடனடி அவசர மருத்துவ சிகிச்சையை நாடுங்கள்' : 'Seek Urgent Medical Attention')
                      : isMild 
                        ? (lang === 'ta' ? 'வீட்டுப் பராமரிப்பு & கண்காணிப்பு பரிந்துரைக்கப்படுகிறது' : 'Home Monitoring & Primary Support Recommended')
                        : (lang === 'ta' ? 'ஆரம்ப சுகாதார நிலைய வருகை பரிந்துரைக்கப்படுகிறது' : 'Scheduled Outpatient Healthcare Visit Recommended')}
                  </h4>
                  <p className="text-xs opacity-80">
                    Symptom: <strong>{selectedSymptom}</strong> • Severity: <strong>{severity}</strong> • Onset: <strong>{duration}</strong>
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-black/30 text-xs leading-relaxed space-y-1.5 border border-white/10">
                <div className="font-bold text-white">Recommended Clinical Pathway:</div>
                {isUrgent ? (
                  <p>Due to red-flag symptoms, please do not delay. Direct evaluation at Agastheeswaram Rural Hospital Trauma wing or 108 emergency dispatch is strongly advised.</p>
                ) : isMild ? (
                  <p>Continue adequate hydration, rest, and monitor temperature/vitals. If symptoms escalate or persist past 48 hours, consult Kottaram Sub-Centre or Kanyakumari PHC.</p>
                ) : (
                  <p>Book an outpatient consultation token with Dr. Meena R. at Kanyakumari Government PHC today or tomorrow for physical clinical examination.</p>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {isUrgent ? (
                  <button
                    onClick={onOpenEmergency}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/40"
                  >
                    <span>Emergency Ambulance (108)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setTriageStep(0);
                      // switch to appointments
                      setBookingFacility('Kanyakumari Government PHC');
                      setShowBookingForm(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <span>Book Recommended OPD Token</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setTriageStep(0);
                    setSelectedSymptom('');
                    setSeverity('');
                    setDuration('');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 text-xs font-semibold"
                >
                  Start New Evaluation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTeleconsultation = () => (
    <div className="space-y-5">
      {activeCallDoc ? (
        <div className="p-6 rounded-2xl bg-black/60 border border-emerald-500/40 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Active Teleconsultation: {activeCallDoc}</h4>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Encrypted GovHealth Video Stream • Session Active
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveCallDoc(null)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
            >
              End Session
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Video preview simulation */}
            <div className="h-64 rounded-xl bg-neutral-900 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-emerald-600/30 border-2 border-emerald-400/60 flex items-center justify-center text-3xl font-bold text-emerald-300">
                👨‍⚕️
              </div>
              <div className="mt-3 text-xs font-bold text-white">{activeCallDoc}</div>
              <div className="text-[10px] text-neutral-400">Senior Medical Officer • PHC Kanyakumari</div>
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-[10px] text-emerald-400 font-mono">
                HD 720p • 48ms
              </div>
            </div>

            {/* Chat & Clinical Notes */}
            <div className="flex flex-col h-64 bg-white/[0.03] rounded-xl border border-white/10 p-3">
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                {chatLog.map((c, i) => (
                  <div key={i} className={`p-2.5 rounded-xl ${c.sender.includes('Dr') ? 'bg-emerald-500/15 border border-emerald-500/30' : 'bg-white/10'}`}>
                    <div className="font-bold text-[10px] text-neutral-400 mb-0.5">{c.sender}</div>
                    <div className="text-white leading-relaxed">{c.text}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  placeholder="Type health question or vitals update..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button type="submit" className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white">
              {lang === 'ta' ? 'அரசு மருத்துவர்கள் நேரடி ஆலோசனை' : 'Available Medical Officers on Teleconsultation Duty'}
            </h4>
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              3 Doctors Available Now
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DOCTORS.map(doc => (
              <div key={doc.id} className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 transition-all flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-white text-sm">{doc.name}</h5>
                    <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-bold">
                      ★ {doc.rating}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-300 font-medium">{doc.specialty}</p>
                  <p className="text-xs text-neutral-400">{doc.facility}</p>
                  <p className="text-[11px] text-neutral-500">{doc.experience}</p>
                </div>
                <div>
                  <button
                    disabled={!doc.isAvailable}
                    onClick={() => setActiveCallDoc(doc.name)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{doc.isAvailable ? 'Connect Now' : 'Offline'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderReferrals = () => (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-between text-xs text-blue-200">
        <div>
          <h4 className="font-bold text-white text-sm">District Multi-Tier Referral Escalation Network</h4>
          <p className="text-xs text-neutral-400">Sub-Centre (Village) → PHC (Primary) → Rural Hospital (Secondary) → District Hospital (Tertiary)</p>
        </div>
      </div>

      {REFERRALS.map(ref => (
        <div key={ref.id} className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-blue-500/30 transition-all space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {ref.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  ref.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {ref.priority} Priority
                </span>
              </div>
              <h5 className="font-bold text-white text-base mt-2">{ref.diagnosis}</h5>
              <p className="text-xs text-neutral-400 mt-0.5">Patient: <strong className="text-neutral-200">{ref.patientName}</strong></p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-500/30 self-start sm:self-auto">
              Status: {ref.status}
            </span>
          </div>

          {/* Visual Step Progress Bar */}
          <div className="py-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 mb-2">
              <span className={ref.step >= 1 ? 'text-blue-300 font-bold' : ''}>1. Origin: {ref.originFacility}</span>
              <span className={ref.step >= 2 ? 'text-blue-300 font-bold' : ''}>2. Transfer: {ref.currentFacility}</span>
              <span className={ref.step >= 3 ? 'text-blue-300 font-bold' : ''}>3. Destination: {ref.targetFacility}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${(ref.step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-white/5">
            <span>Logged on: {ref.date}</span>
            <button 
              onClick={() => alert(`Tracking details for ${ref.id}: Digital case notes transferred to Dr. Siva K. at Agastheeswaram.`)}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>View Case File</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMedicines = () => (
    <div className="space-y-5">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setMedTab('medicines')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            medTab === 'medicines' 
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          {lang === 'ta' ? 'அரசு மருந்துகள் இருப்பு' : 'Essential Medicines Inventory (Free)'}
        </button>
        <button
          onClick={() => setMedTab('diagnostics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            medTab === 'diagnostics' 
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          {lang === 'ta' ? 'ஆய்வக சோதனைகள்' : 'Diagnostic Lab Tests'}
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={medSearch}
          onChange={e => setMedSearch(e.target.value)}
          placeholder={medTab === 'medicines' ? 'Search medicines by generic name or category...' : 'Search diagnostic laboratory tests...'}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
        />
      </div>

      {requestedItem && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold text-center animate-fadeIn">
          ✓ Request recorded for {requestedItem}. PHC Pharmacist notified for dispensing.
        </div>
      )}

      {medTab === 'medicines' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MEDICINES.filter(m => m.name.toLowerCase().includes(medSearch.toLowerCase()) || m.category.toLowerCase().includes(medSearch.toLowerCase())).map(med => (
            <div key={med.id} className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  {med.category}
                </span>
                <h5 className="font-bold text-white text-sm mt-0.5">{med.name}</h5>
                <p className="text-xs text-neutral-400">{med.dosage} • {med.location}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    med.isLowStock 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {med.isLowStock ? 'Low Stock Warning' : 'In Stock'}
                  </span>
                  <span className="text-xs text-neutral-300 font-mono font-bold">
                    {med.stockCount} units
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setRequestedItem(med.name);
                  setTimeout(() => setRequestedItem(null), 3000);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors whitespace-nowrap"
              >
                Request Refill
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DIAGNOSTICS.filter(d => d.name.toLowerCase().includes(medSearch.toLowerCase())).map(diag => (
            <div key={diag.id} className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {diag.category}
                </span>
                <h5 className="font-bold text-white text-sm mt-0.5">{diag.name}</h5>
                <p className="text-xs text-neutral-400">Turnaround: <strong className="text-neutral-200">{diag.turnaroundTime}</strong></p>
                <p className="text-[11px] text-neutral-500">Sample: {diag.sampleRequired}</p>
              </div>
              <button
                onClick={() => {
                  setRequestedItem(diag.name);
                  setTimeout(() => setRequestedItem(null), 3000);
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors whitespace-nowrap"
              >
                Book Lab Slot
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPatientRecords = () => (
    <div className="space-y-5">
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-white text-sm">Unified Digital Health Record (ABHA: 91-4458-1209)</h4>
          <p className="text-xs text-amber-200">Patient: Devi S. • Female • 32 Years • Blood Group: O+</p>
        </div>
        <button 
          onClick={() => alert('Exporting encrypted ABHA health summary PDF...')}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors"
        >
          Download PDF
        </button>
      </div>

      <div className="relative pl-6 border-l-2 border-white/10 space-y-6">
        {PATIENT_RECORDS.map(rec => (
          <div key={rec.id} className="relative">
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-[#11141a]"></div>
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 transition-all space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 uppercase tracking-wider">{rec.type}</span>
                <span className="text-neutral-400">{rec.date}</span>
              </div>
              <h5 className="font-bold text-white text-base">{rec.summary}</h5>
              <p className="text-xs text-neutral-300 leading-relaxed">{rec.details}</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-white/5">
                <span>Facility: {rec.facility}</span>
                <span>Signed by: {rec.doctor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHighRisk = () => (
    <div className="space-y-5">
      <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center justify-between">
        <div>
          <h4 className="font-bold text-white text-sm">Proactive Community Health Worker (VHN) Alert Board</h4>
          <p className="text-xs text-neutral-300">Monitored high-risk pregnancies, infant immunization cycles, and vulnerable seniors.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs">
          2 Overdue Cases
        </span>
      </div>

      <div className="flex gap-2">
        {(['all', 'maternal', 'chronic'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFollowupFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
              followupFilter === f 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {HIGH_RISK_FOLLOWUPS.filter(h => followupFilter === 'all' || h.category === followupFilter).map(item => (
          <div key={item.id} className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-rose-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h5 className="font-bold text-white text-sm">{item.patientName}</h5>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  item.status === 'overdue' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {item.status === 'overdue' ? 'Overdue Action' : 'Due Today'}
                </span>
              </div>
              <p className="text-xs text-neutral-200 font-medium">{item.condition}</p>
              <p className="text-xs text-neutral-400">Assigned: {item.vhnWorker} • {item.actionNotes}</p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <a 
                href={`tel:${item.phone}`}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span>Call Patient</span>
              </a>
              <button 
                onClick={() => alert(`Marking ${item.patientName} home visit as completed by VHN Sister Anitha.`)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20"
              >
                Log Visit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getTitle = () => {
    switch (serviceId) {
      case 'find_healthcare':
        return lang === 'ta' ? 'சுகாதார சேவையைத் தேடுங்கள்' : 'Find Healthcare Facilities';
      case 'appointments':
        return lang === 'ta' ? 'மருத்துவ நியமனங்கள் & டோக்கன்' : 'Appointments & OPD Queue';
      case 'ai_triage':
        return lang === 'ta' ? 'AI அறிகுறி ஆய்வு மையம்' : 'AI Clinical Symptom Triage';
      case 'teleconsultation':
        return lang === 'ta' ? 'தொலை மருத்துவ ஆலோசனை' : 'Government Teleconsultation';
      case 'referrals':
        return lang === 'ta' ? 'பரிந்துரை கண்காணிப்பு' : 'Multi-Tier Referral Tracking';
      case 'medicines_diagnostics':
        return lang === 'ta' ? 'மருந்துகள் & ஆய்வகம்' : 'Dispensary & Diagnostic Labs';
      case 'patient_records':
        return lang === 'ta' ? 'நோயாளர் பதிவுகள்' : 'ABHA Digital Health Records';
      case 'high_risk_followup':
        return lang === 'ta' ? 'அதி-தீவிர தொடர் கண்காணிப்பு' : 'High-Risk Care Follow-Up';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-[28px] bg-[#101217] border border-white/15 shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
              <Activity className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">{getTitle()}</h3>
              <p className="text-xs text-neutral-400">Kanyakumari Public Health Network • Connected Care</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {serviceId === 'find_healthcare' && renderFindHealthcare()}
          {serviceId === 'appointments' && renderAppointments()}
          {serviceId === 'ai_triage' && renderAITriage()}
          {serviceId === 'teleconsultation' && renderTeleconsultation()}
          {serviceId === 'referrals' && renderReferrals()}
          {serviceId === 'medicines_diagnostics' && renderMedicines()}
          {serviceId === 'patient_records' && renderPatientRecords()}
          {serviceId === 'high_risk_followup' && renderHighRisk()}
        </div>

        {/* Footer info strip */}
        <div className="px-6 py-3.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <span>District Health Department, Government of Tamil Nadu</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
