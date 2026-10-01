import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { VibrantSixBoxes } from './components/VibrantSixBoxes';
import { HomeQuickCards } from './components/HomeQuickCards';
import { AppointmentBookingSection } from './components/AppointmentBookingSection';
import { EmergencyModal } from './components/EmergencyModal';
import { FooterTicker } from './components/FooterTicker';

// Full-page views replacing popup modals as requested
import { FindHealthcareView } from './components/views/FindHealthcareView';
import { AiTriageView } from './components/views/AiTriageView';
import { TeleconsultationView } from './components/views/TeleconsultationView';
import { ReferralsView } from './components/views/ReferralsView';
import { MedicinesDiagnosticsView } from './components/views/MedicinesDiagnosticsView';
import { PatientRecordsView } from './components/views/PatientRecordsView';
import { HighRiskFollowUpView } from './components/views/HighRiskFollowUpView';

import { 
  Language, 
  UserRole, 
  ServiceId 
} from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [userRole, setUserRole] = useState<UserRole>('patient');
  
  // Single-source full-page view state:
  // 'home' | 'appointments' | 'find_healthcare' | 'ai_triage' | 'teleconsultation' | 'referrals' | 'medicines_diagnostics' | 'patient_records' | 'high_risk_followup'
  const [currentView, setCurrentView] = useState<'home' | 'appointments' | ServiceId>('home');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Kanyakumari District');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Active appointment state displayed in Quick Card 1
  const [activeAppointment, setActiveAppointment] = useState({
    token: '#12',
    facility: 'Kanyakumari PHC',
    doctor: 'Dr. Meena R.',
    time: '10:30 AM',
    department: 'General Medicine & Maternal',
    date: 'Today, 21 Sept 2026',
  });

  // Handle appointment confirmation
  const handleAppointmentBooked = (apt: {
    facility: string;
    department: string;
    doctor: string;
    date: string;
    time: string;
    token: string;
  }) => {
    setActiveAppointment({
      token: apt.token,
      facility: apt.facility,
      doctor: apt.doctor,
      time: apt.time,
      department: apt.department,
      date: apt.date,
    });
  };

  // Switch views - all options open as a full page
  const handleNavigate = (view: 'home' | 'appointments' | ServiceId) => {
    setCurrentView(view);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (id: ServiceId) => {
    handleNavigate(id);
  };

  return (
    <div className={`min-h-screen bg-[#07090e] text-neutral-100 flex flex-col md:flex-row ${lang === 'ta' ? 'tamil-font' : ''}`}>
      {/* 
        ========================================================================
        1. LIST OF CONTENTS AT THE LEFT (Sidebar):
           - Branded "ArogyaConnect" with 5 district sectors
           - Full-page navigation buttons
           - Offline-ready indicator
           - Emergency 108 direct access
        ========================================================================
      */}
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Desktop & Mobile Sidebar Container */}
      <div 
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar
          currentView={currentView}
          activeServiceId={typeof currentView === 'string' && currentView !== 'home' && currentView !== 'appointments' ? currentView as ServiceId : null}
          onNavigate={handleNavigate}
          lang={lang}
          selectedLocation={selectedLocation}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          isOffline={true}
        />
      </div>

      {/* 
        ========================================================================
        2. MAIN CONTENT AREA:
        ========================================================================
      */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* 
          TOP DASHBOARD BAR:
          - "Patient Dashboard • Kanyakumari Healthcare Network"
          - 5 Locations dropdown beside Emergency Help:
            [ 📍 5 Locations ▾ ] [ 🚨 Emergency Help ] [ 🌐 Language ▾ (English/தமிழ்/हिन्दी) ] [ 🔔 2 ] [ [D] Devi S. ▾ ]
        */}
        <DashboardHeader
          lang={lang}
          onSelectLang={setLang}
          userRole={userRole}
          onToggleRole={setUserRole}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          onToggleSidebarMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />

        {/* Dynamic Full-Page Views Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* 1. APPOINTMENT BOOKING FULL PAGE */}
          {currentView === 'appointments' && (
            <div className="animate-fadeIn">
              <AppointmentBookingSection
                lang={lang}
                onAppointmentBooked={handleAppointmentBooked}
                onBack={() => handleNavigate('home')}
              />
            </div>
          )}

          {/* 2. FIND HEALTHCARE FULL PAGE */}
          {currentView === 'find_healthcare' && (
            <div className="animate-fadeIn">
              <FindHealthcareView
                lang={lang}
                onBack={() => handleNavigate('home')}
                onBookFacility={() => handleNavigate('appointments')}
              />
            </div>
          )}

          {/* 3. AI TRIAGE FULL PAGE (Multi-symptoms 2-3 supported) */}
          {currentView === 'ai_triage' && (
            <div className="animate-fadeIn">
              <AiTriageView
                lang={lang}
                onBack={() => handleNavigate('home')}
                onNavigateToAppointment={() => handleNavigate('appointments')}
                onNavigateToTeleconsult={() => handleNavigate('teleconsultation')}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            </div>
          )}

          {/* 4. TELECONSULTATION FULL PAGE (Video call & localized chat) */}
          {currentView === 'teleconsultation' && (
            <div className="animate-fadeIn">
              <TeleconsultationView
                lang={lang}
                onBack={() => handleNavigate('home')}
              />
            </div>
          )}

          {/* 5. REFERRALS FULL PAGE (Longitudinal tracking + View Case File) */}
          {currentView === 'referrals' && (
            <div className="animate-fadeIn">
              <ReferralsView
                lang={lang}
                onBack={() => handleNavigate('home')}
              />
            </div>
          )}

          {/* 6. MEDICINES & DIAGNOSTICS FULL PAGE */}
          {currentView === 'medicines_diagnostics' && (
            <div className="animate-fadeIn">
              <MedicinesDiagnosticsView
                lang={lang}
                onBack={() => handleNavigate('home')}
              />
            </div>
          )}

          {/* 7. PATIENT RECORDS FULL PAGE (Real PDF generation & download) */}
          {currentView === 'patient_records' && (
            <div className="animate-fadeIn">
              <PatientRecordsView
                lang={lang}
                onBack={() => handleNavigate('home')}
              />
            </div>
          )}

          {/* 8. HIGH-RISK FOLLOW-UP FULL PAGE (Working Call simulation & Log Visit) */}
          {currentView === 'high_risk_followup' && (
            <div className="animate-fadeIn">
              <HighRiskFollowUpView
                lang={lang}
                onBack={() => handleNavigate('home')}
              />
            </div>
          )}

          {/* 9. HOME DASHBOARD VIEW */}
          {currentView === 'home' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Greeting Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 pb-1">
                <h1 className="text-2xl sm:text-3xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                  <span>
                    {lang === 'ta' 
                      ? (userRole === 'patient' ? 'காலை வணக்கம், தேவி' : 'காலை வணக்கம், சகோதரி அனிதா')
                      : lang === 'hi'
                      ? (userRole === 'patient' ? 'शुभ प्रभात, देवी' : 'शुभ प्रभात, सिस्टर अनिता')
                      : (userRole === 'patient' ? 'Good morning, Devi' : 'Good morning, Sister Anitha')}
                  </span>
                  <span className="inline-block transform hover:rotate-12 transition-transform select-none">👋</span>
                </h1>

                <div className="text-xs text-neutral-400 font-medium">
                  {selectedLocation} • {lang === 'ta' ? 'முதன்மை பொது சுகாதாரம்' : lang === 'hi' ? 'प्राथमिक सार्वजनिक स्वास्थ्य' : 'Primary Public Healthcare'}
                </div>
              </div>

              {/* 
                THE 6 VIBRANT BOXES (Below the Top Dashboard Bar):
                - Find Healthcare (Cyan)
                - Appointments (Purple)
                - AI Triage (Sunset Amber)
                - Teleconsultation (Emerald)
                - Referrals (Cobalt Blue)
                - Medicines & Diagnostics (Rose Crimson)
                Clicking ANY of these opens that feature as a FULL PAGE!
              */}
              <VibrantSixBoxes
                lang={lang}
                onSelectService={handleSelectService}
              />

              {/* 
                THE 3 QUICK CARDS FROM IMAGE 3:
                - 📅 Today Appointment (#12, Kanyakumari PHC, Dr. Meena R., 10:30 AM)
                - 🔄 Active Referral (In Progress, PHC → Rural Hospital → District)
                - ⚠️ Follow-up Due (Overdue, Maternal ANC Visit)
              */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
                    {lang === 'ta' ? 'செயலில் உள்ள மருத்துவ சுருக்கம்' : lang === 'hi' ? 'सक्रिय रोगी केस सारांश' : 'Active Patient Case Summary'}
                  </h3>
                  <span className="text-xs text-teal-400 font-medium">
                    {lang === 'ta' ? 'நேரலை புதுப்பிப்பு' : lang === 'hi' ? 'रीयल-टाइम अपडेट' : 'Updated Real-Time'}
                  </span>
                </div>

                <HomeQuickCards
                  lang={lang}
                  onSelectService={handleSelectService}
                  activeToken={activeAppointment.token}
                  activeFacility={activeAppointment.facility}
                  activeDoctor={activeAppointment.doctor}
                  activeTime={activeAppointment.time}
                />
              </div>

              {/* Live District Healthcare Ticker */}
              <FooterTicker lang={lang} />
            </div>
          )}
        </main>
      </div>

      {/* Emergency 108 / 104 Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        lang={lang}
      />
    </div>
  );
}
