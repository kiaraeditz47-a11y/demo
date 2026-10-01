import React, { useState } from 'react';
import { 
  Building2, 
  Stethoscope, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CheckCircle2, 
  QrCode, 
  Download, 
  CalendarPlus, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Phone,
  RefreshCw
} from 'lucide-react';
import { Language } from '../types';
import { FACILITIES } from '../data/healthcareData';
import { downloadAppointmentPassPDF, downloadCalendarEvent } from '../utils/pdfGenerator';

interface AppointmentBookingSectionProps {
  lang: Language;
  onAppointmentBooked: (apt: {
    facility: string;
    department: string;
    doctor: string;
    date: string;
    time: string;
    token: string;
  }) => void;
  onBack?: () => void;
}

export const AppointmentBookingSection: React.FC<AppointmentBookingSectionProps> = ({
  lang,
  onAppointmentBooked,
  onBack,
}) => {
  // Step 1: Facilities in Kanyakumari (all 16 across 4 tiers)
  const facilities = FACILITIES.map(f => ({
    id: f.id,
    name: f.name,
    type: f.type,
    location: f.location,
    distance: f.distance,
    queue: f.queueCount,
  }));

  // Step 2: Healthcare Departments (including dental, maternal etc. as explicitly requested)
  const departments = [
    { id: 'dental', name: 'Dental Care & Oral Surgery', icon: '🦷', doctor: 'Dr. K. Anand, BDS, MDS' },
    { id: 'maternal', name: 'Maternal & Antenatal (ANC / PNC)', icon: '🤰', doctor: 'Dr. Meena R., MBBS, DGO' },
    { id: 'general', name: 'General Medicine & OPD', icon: '🩺', doctor: 'Dr. P. Sundaram, MD (Gen Med)' },
    { id: 'ortho', name: 'Orthopaedics & Fracture Clinic', icon: '🦴', doctor: 'Dr. Siva K., MS (Ortho)' },
    { id: 'pediatrics', name: 'Pediatrics & Child Immunization', icon: '👶', doctor: 'Dr. Lakshmi N., MD (Ped)' },
    { id: 'ophthalmology', name: 'Ophthalmology (Eye Clinic)', icon: '👁️', doctor: 'Dr. R. Kavitha, MS (Ophth)' },
    { id: 'ent', name: 'ENT (Ear, Nose & Throat)', icon: '👂', doctor: 'Dr. T. Murugan, DLO' },
    { id: 'ncd', name: 'NCD, Diabetes & Hypertension', icon: '🩸', doctor: 'Dr. A. Joseph, MBBS' },
  ];

  // Step 3: Date with Day
  const dates = [
    { id: 'd-1', day: 'Mon', date: '22 Sep 2026', fullDay: 'Monday' },
    { id: 'd-2', day: 'Tue', date: '23 Sep 2026', fullDay: 'Tuesday' },
    { id: 'd-3', day: 'Wed', date: '24 Sep 2026', fullDay: 'Wednesday' },
    { id: 'd-4', day: 'Thu', date: '25 Sep 2026', fullDay: 'Thursday' },
    { id: 'd-5', day: 'Fri', date: '26 Sep 2026', fullDay: 'Friday' },
    { id: 'd-6', day: 'Sat', date: '27 Sep 2026', fullDay: 'Saturday' },
  ];

  // Step 4: Time Slots
  const timeSlots = [
    { slot: '09:00 AM - 09:30 AM', period: 'Morning' },
    { slot: '09:30 AM - 10:00 AM', period: 'Morning' },
    { slot: '10:00 AM - 10:30 AM', period: 'Morning' },
    { slot: '10:30 AM - 11:00 AM', period: 'Morning' },
    { slot: '11:00 AM - 11:30 AM', period: 'Morning' },
    { slot: '02:00 PM - 02:30 PM', period: 'Afternoon' },
    { slot: '02:30 PM - 03:00 PM', period: 'Afternoon' },
    { slot: '03:00 PM - 03:30 PM', period: 'Afternoon' },
    { slot: '03:30 PM - 04:00 PM', period: 'Afternoon' },
  ];

  // State
  const [selectedFacility, setSelectedFacility] = useState(facilities[0].name);
  const [selectedDept, setSelectedDept] = useState(departments[1]); // Default Maternal
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 10:30 AM');
  
  // Patient details state
  const [patientName, setPatientName] = useState('Devi S.');
  const [abhaId, setAbhaId] = useState('91-4458-1209');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [reason, setReason] = useState('Routine checkup & consultation');

  // Confirmed Appointment state
  const [confirmedApt, setConfirmedApt] = useState<{
    token: string;
    facility: string;
    department: string;
    doctor: string;
    date: string;
    day: string;
    timeSlot: string;
    patientName: string;
    abhaId: string;
    bookedAt: string;
  } | null>(null);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tokenNum = `#${Math.floor(Math.random() * 15) + 14}`;
    const newApt = {
      token: tokenNum,
      facility: selectedFacility,
      department: selectedDept.name,
      doctor: selectedDept.doctor,
      date: selectedDate.date,
      day: selectedDate.fullDay,
      timeSlot: selectedSlot,
      patientName,
      abhaId,
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConfirmedApt(newApt);
    
    // Also notify parent to update the "Today Appointment" card
    onAppointmentBooked({
      facility: selectedFacility,
      department: selectedDept.name,
      doctor: selectedDept.doctor,
      date: `${selectedDate.fullDay}, ${selectedDate.date}`,
      time: selectedSlot.split(' - ')[0],
      token: tokenNum,
    });
  };

  return (
    <section id="booking-section" className="py-6 scroll-mt-20">
      {/* Back button if in dedicated view */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>{lang === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Dashboard'}</span>
        </button>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ta' ? 'மருத்துவ நியமனம் பதிவு செய்ய' : 'Book an Appointment'}
          </h2>
        </div>
      </div>

      {confirmedApt ? (
        /* ================= APPOINTMENT DETAILS DISPLAY ================= */
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-[30px] bg-gradient-to-b from-[#161224] via-[#120f1e] to-[#0a0814] border border-purple-500/40 shadow-2xl shadow-purple-950/60 text-white space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-2xl">
                ✓
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                  {lang === 'ta' ? 'முன்பதிவு உறுதியானது' : 'Confirmed & Generated'}
                </span>
                <h3 className="text-xl font-black text-white">
                  {lang === 'ta' ? 'மருத்துவ நியமன அனுமதி சீட்டு' : 'Appointment Digital Pass'}
                </h3>
              </div>
            </div>

            {/* Token Highlight */}
            <div className="text-center px-4 py-2 rounded-2xl bg-purple-500/20 border border-purple-500/40">
              <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Token</div>
              <div className="text-3xl font-black text-white">{confirmedApt.token}</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
              <div className="text-neutral-400 font-medium">{lang === 'ta' ? 'சுகாதார நிலையம்' : 'Healthcare Facility'}</div>
              <div className="text-white font-bold text-sm">{confirmedApt.facility}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
              <div className="text-neutral-400 font-medium">{lang === 'ta' ? 'மருத்துவ துறை' : 'Healthcare Department'}</div>
              <div className="text-white font-bold text-sm">{confirmedApt.department}</div>
              <div className="text-[11px] text-purple-300">Consultant: {confirmedApt.doctor}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
              <div className="text-neutral-400 font-medium">{lang === 'ta' ? 'தேதி மற்றும் கிழமை' : 'Date with Day'}</div>
              <div className="text-white font-bold text-sm">{confirmedApt.day}, {confirmedApt.date}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
              <div className="text-neutral-400 font-medium">{lang === 'ta' ? 'நேர இடைவெளி' : 'Time Slot'}</div>
              <div className="text-white font-bold text-sm">{confirmedApt.timeSlot}</div>
            </div>
          </div>

          {/* Patient Card Bar */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
            <div>
              <div className="text-neutral-400">Patient: <strong className="text-white">{confirmedApt.patientName}</strong></div>
              <div className="text-neutral-400">ABHA Health ID: <span className="text-neutral-200 font-mono">{confirmedApt.abhaId}</span></div>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-10 h-10 text-white/90 p-1 bg-white/10 rounded-lg" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  downloadAppointmentPassPDF({
                    token: confirmedApt.token,
                    facility: confirmedApt.facility,
                    department: confirmedApt.department,
                    doctor: confirmedApt.doctor,
                    date: `${confirmedApt.day}, ${confirmedApt.date}`,
                    time: confirmedApt.timeSlot,
                    patientName: confirmedApt.patientName,
                    abhaId: confirmedApt.abhaId,
                    estWait: '~20 mins',
                  });
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'ta' ? 'அனுமதி சீட்டு PDF' : lang === 'hi' ? 'पास डाउनलोड करें' : 'Download Pass (PDF)'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  downloadCalendarEvent({
                    token: confirmedApt.token,
                    facility: confirmedApt.facility,
                    department: confirmedApt.department,
                    doctor: confirmedApt.doctor,
                    date: confirmedApt.date,
                    time: confirmedApt.timeSlot,
                    patientName: confirmedApt.patientName,
                    abhaId: confirmedApt.abhaId,
                    estWait: '~20 mins',
                  });
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-neutral-200 flex items-center gap-1.5 transition-colors active:scale-95"
              >
                <CalendarPlus className="w-4 h-4 text-purple-400" />
                <span>{lang === 'ta' ? 'நாட்காட்டியில் சேர்க்க' : lang === 'hi' ? 'कैलेंडर में जोड़ें' : 'Add to Calendar (.ics)'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setConfirmedApt(null)}
              className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-neutral-200 font-bold text-xs flex items-center gap-1.5 border border-white/10 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'மற்றொரு பதிவு' : lang === 'hi' ? 'अन्य बुक करें' : 'Book Another'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* ================= BOOKING FORM INTERFACE ================= */
        <form onSubmit={handleBookSubmit} className="space-y-8">
          {/* STEP 1: CHOOSE FACILITY */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center justify-center font-bold">1</span>
              <span>{lang === 'ta' ? 'சுகாதார நிலையத்தைத் தேர்ந்தெடுக்கவும்' : '1. Select Healthcare Facility'}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {facilities.map(fac => {
                const isSelected = selectedFacility === fac.name;
                return (
                  <div
                    key={fac.id}
                    onClick={() => setSelectedFacility(fac.name)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-600/15 border-purple-500 text-white shadow-lg shadow-purple-600/20 ring-1 ring-purple-500'
                        : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-purple-300 font-semibold">{fac.type}</span>
                        <span className="text-neutral-400">{fac.distance}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{fac.name}</h4>
                      <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span>{fac.location}</span>
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-neutral-400 flex items-center justify-between">
                      <span>Current Queue:</span>
                      <strong className="text-teal-400">{fac.queue} waiting</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: CHOOSE HEALTHCARE DEPARTMENT (like dental, maternal etc.) */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center justify-center font-bold">2</span>
              <span>{lang === 'ta' ? 'மருத்துவ துறையைத் தேர்ந்தெடுக்கவும் (பல், தாய்மை நலம் போன்றவை)' : '2. Select Healthcare Department (like Dental, Maternal, etc.)'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {departments.map(dept => {
                const isSelected = selectedDept.id === dept.id;
                return (
                  <div
                    key={dept.id}
                    onClick={() => setSelectedDept(dept)}
                    className={`p-3.5 rounded-2xl cursor-pointer border transition-all duration-200 ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-600/25 ring-1 ring-purple-500'
                        : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="text-2xl mb-1.5">{dept.icon}</div>
                    <h5 className="font-bold text-xs sm:text-sm text-white leading-tight">{dept.name}</h5>
                    <p className="text-[10px] text-neutral-400 mt-1 truncate">{dept.doctor}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3 & STEP 4: DATE WITH DAY & TIME SLOT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date with Day */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center justify-center font-bold">3</span>
                <span>{lang === 'ta' ? 'தேதி மற்றும் கிழமை' : '3. Select Date with Day'}</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {dates.map(d => {
                  const isSelected = selectedDate.id === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`p-3 rounded-xl text-center border transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white font-bold border-purple-400 shadow-md shadow-purple-600/30'
                          : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs uppercase font-extrabold tracking-wider">{d.day}</div>
                      <div className="text-xs font-semibold mt-1 text-neutral-300">{d.date.split(' ')[0]} {d.date.split(' ')[1]}</div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-neutral-400 font-medium">
                Selected: <strong className="text-white">{selectedDate.fullDay}, {selectedDate.date}</strong>
              </p>
            </div>

            {/* Time Slot */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center justify-center font-bold">4</span>
                <span>{lang === 'ta' ? 'நேர இடைவெளி' : '4. Select Time Slot'}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map(ts => {
                  const isSelected = selectedSlot === ts.slot;
                  return (
                    <button
                      key={ts.slot}
                      type="button"
                      onClick={() => setSelectedSlot(ts.slot)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white font-bold border-purple-400 shadow-md shadow-purple-600/30'
                          : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:border-white/20'
                      }`}
                    >
                      {ts.slot}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-neutral-400 font-medium">
                Preferred: <strong className="text-white">{selectedSlot}</strong>
              </p>
            </div>
          </div>

          {/* STEP 5: PATIENT DETAILS */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              <span>{lang === 'ta' ? 'நோயாளர் விவரங்கள் & ABHA எண்' : 'Patient Information & ABHA Health Card'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-neutral-400 mb-1 block">Patient Full Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="text-neutral-400 mb-1 block">ABHA ID (Digital Health ID)</label>
                <input
                  type="text"
                  value={abhaId}
                  onChange={e => setAbhaId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="text-neutral-400 mb-1 block">Phone / Mobile</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Symptoms or Purpose of Visit (Optional)</label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Dental tooth pain, routine maternal ultrasound checkup, joint check"
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Official Government Public Health Booking • Instant Token Verification</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>{lang === 'ta' ? 'முன்பதிவை உறுதி செய்' : 'Confirm & Generate Appointment Pass'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
