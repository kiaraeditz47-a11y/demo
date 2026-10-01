import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Send, 
  ShieldCheck, 
  Building2, 
  Clock, 
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { Language } from '../../types';

interface TeleconsultationViewProps {
  lang: Language;
  onBack: () => void;
}

interface Doctor {
  id: string;
  name: string;
  initial: string;
  avatarColor: string;
  specialty: string;
  qualification: string;
  facility: string;
  waitMinutes: number;
  status: 'available' | 'busy';
  statusLabel: string;
  greetingMsg: {
    en: string;
    ta: string;
    hi: string;
  };
}

const DOCTORS: Doctor[] = [
  {
    id: 'arun-kumar',
    name: 'Dr. Arun Kumar, MD',
    initial: 'A',
    avatarColor: 'bg-[#00897b]',
    specialty: 'General Medicine',
    qualification: 'MD (Internal Medicine), MMC Chennai',
    facility: 'Kanyakumari District Hospital',
    waitMinutes: 8,
    status: 'available',
    statusLabel: 'Available now',
    greetingMsg: {
      en: 'வணக்கம் Devi. How are you feeling today with your blood pressure?',
      ta: 'வணக்கம் தேவி. உங்கள் ரத்த அழுத்தம் மற்றும் உடல்நிலை இன்று எப்படி உள்ளது?',
      hi: 'नमस्ते देवी। आज आपका रक्तचाप और स्वास्थ्य कैसा लग रहा है?',
    },
  },
  {
    id: 'malathi-sundaram',
    name: 'Dr. Malathi Sundaram, MS, DGO',
    initial: 'M',
    avatarColor: 'bg-[#e91e63]',
    specialty: 'Obstetrics & Gynaecology',
    qualification: 'MS (OBG), Tirunelveli Medical College',
    facility: 'Agastheeswaram Rural Hospital',
    waitMinutes: 12,
    status: 'available',
    statusLabel: 'Available now',
    greetingMsg: {
      en: 'Vanakkam Devi! I am reviewing your 28-week maternal records. How are you feeling today?',
      ta: 'வணக்கம் தேவி! உங்கள் 28-வார தாய்மை மருத்துவ குறிப்புகளைப் பார்த்தேன். இன்று உங்கள் உடல்நிலை எப்படி உள்ளது?',
      hi: 'नमस्ते देवी! मैंने आपकी 28-सप्ताह की मातृत्व रिपोर्ट देखी है। आज आप कैसा महसूस कर रही हैं?',
    },
  },
  {
    id: 'rajesh-kannan',
    name: 'Dr. Rajesh Kannan, MD (Paed)',
    initial: 'R',
    avatarColor: 'bg-[#1976d2]',
    specialty: 'Paediatrics & Neonatology',
    qualification: 'MD (Paediatrics), Madurai Medical College',
    facility: 'District Headquarters Hospital',
    waitMinutes: 20,
    status: 'busy',
    statusLabel: 'Busy in OPD',
    greetingMsg: {
      en: 'Hello Devi. I am completing pediatric rounds and can review your case right now. Any concerns?',
      ta: 'வணக்கம் தேவி. நான் குழந்தைகளுக்கான வார்டு சுற்றை முடித்துவிட்டேன். உங்கள் கேள்விகளைக் கூறலாம்.',
      hi: 'नमस्ते देवी। मैं राउंड्स पूरा कर रहा हूँ और आपकी स्थिति की समीक्षा कर सकता हूँ। क्या कोई परेशानी है?',
    },
  },
  {
    id: 'shalini-mohan',
    name: 'Dr. Shalini Mohan, MD',
    initial: 'S',
    avatarColor: 'bg-[#9c27b0]',
    specialty: 'Dermatology & Leprosy',
    qualification: 'MD (DVL), Stanley Medical College',
    facility: 'District Hospital Telemedicine Wing',
    waitMinutes: 15,
    status: 'available',
    statusLabel: 'Available now',
    greetingMsg: {
      en: 'Hello Devi. I am available for tele-dermatology and clinical review. How may I assist you?',
      ta: 'வணக்கம் தேவி. தோல் மற்றும் பொது மருத்துவ ஆலோசனைக்கு நான் தயாராக உள்ளேன்.',
      hi: 'नमस्ते देवी। मैं त्वचा एवं क्लिनिकल परामर्श के लिए उपलब्ध हूँ। मैं आपकी क्या सहायता कर सकती हूँ?',
    },
  },
];

export const TeleconsultationView: React.FC<TeleconsultationViewProps> = ({
  lang,
  onBack,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(DOCTORS[0]);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(true);
  const [callSeconds, setCallSeconds] = useState(145);
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize messages based on selected doctor
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string; isDoctor: boolean }>>([
    {
      sender: DOCTORS[0].name,
      text: DOCTORS[0].greetingMsg[lang] || DOCTORS[0].greetingMsg.en,
      time: '10:31 AM',
      isDoctor: true,
    },
    {
      sender: lang === 'ta' ? 'தேவி எஸ். (நீங்கள்)' : lang === 'hi' ? 'देवी एस. (आप)' : 'Devi S. (You)',
      text: lang === 'ta' ? 'வணக்கம் மருத்துவர், காலையில் லேசான தலைசுற்றல் இருந்தது, இப்போது பரவாயில்லை.' : lang === 'hi' ? 'नमस्ते डॉक्टर, सुबह थोड़ी थकान थी, अब बेहतर महसूस हो रहा है।' : 'Good morning doctor, feeling much better after breakfast.',
      time: '10:32 AM',
      isDoctor: false,
    },
  ]);

  // When doctor changes
  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setCallSeconds(10);
    setIsCallActive(true);
    setMessages([
      {
        sender: doc.name,
        text: doc.greetingMsg[lang] || doc.greetingMsg.en,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDoctor: true,
      },
    ]);
  };

  // Timer simulation
  useEffect(() => {
    if (!isCallActive) return;
    const interval = setInterval(() => {
      setCallSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Quick reply chips
  const quickReplies: Record<Language, string[]> = {
    ta: [
      'மாத்திரைகளை தவறாமல் எடுக்கிறேன்',
      'அடுத்த பரிசோதனை எப்போது?',
      'உணவு முறையில் ஏதேனும் மாற்றம் தேவையா?',
    ],
    hi: [
      'दवाएं नियमित रूप से ले रही हूँ',
      'अगली जांच कब करवानी है?',
      'खान-पान में कोई विशेष बदलाव?',
    ],
    en: [
      'Taking prescribed tablets regularly',
      'When is the next checkup scheduled?',
      'Any dietary precautions to follow?',
    ],
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: lang === 'ta' ? 'தேவி எஸ். (நீங்கள்)' : lang === 'hi' ? 'देवी एस. (आप)' : 'Devi S. (You)',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDoctor: false,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Doctor auto response in the selected language
    setTimeout(() => {
      let doctorResponse = '';
      if (lang === 'ta') {
        doctorResponse = `சரி தேவி. நான் (${selectedDoctor.name}) உங்கள் குறிப்புகளில் இதை பதிவு செய்துள்ளேன். ஏதேனும் திடீர் அசதி இருப்பின் உடனடியாக தெரிவிக்கவும்.`;
      } else if (lang === 'hi') {
        doctorResponse = `ठीक है देवी। मैंने (${selectedDoctor.name}) आपकी स्वास्थ्य डायरी में यह नोट कर लिया है। किसी भी परेशानी में तुरंत संपर्क करें।`;
      } else {
        doctorResponse = `Noted Devi. I (${selectedDoctor.name}) have logged your consultation notes. Continue your regimen and reach out if symptoms change.`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: selectedDoctor.name,
          text: doctorResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDoctor: true,
        },
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Bar */}
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
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                {lang === 'ta' ? 'நேரலை தொலை மருத்துவம்' : lang === 'hi' ? 'लाइव टेलीकंसल्टेशन' : 'Live Teleconsultation'}
              </span>
              <span className="text-[11px] text-neutral-400">• Kanyakumari Healthcare District</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'ta' ? 'மருத்துவர் தேர்வு & தொலை ஆலோசனை' : lang === 'hi' ? 'डॉक्टर चुनें एवं वीडियो परामर्श' : 'Select Doctor & Teleconsultation'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-bit Encrypted Telemedicine</span>
          </span>
        </div>
      </div>

      {/* 4 DOCTOR CARDS GRID FOR PATIENT SELECTION */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            {lang === 'ta' ? 'ஆலோசனைக்கு கிடைக்கக்கூடிய மருத்துவர்கள்' : lang === 'hi' ? 'उपलब्ध चिकित्सा अधिकारी' : 'Available Government Doctors'}
          </h2>
          <span className="text-xs text-teal-400 font-medium">
            {lang === 'ta' ? 'மருத்துவரை தேர்வு செய்து ஆலோசனை தொடங்கவும்' : lang === 'hi' ? 'परामर्श शुरू करने के लिए डॉक्टर चुनें' : 'Choose a doctor to begin consultation'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DOCTORS.map((doc) => {
            const isSelected = selectedDoctor.id === doc.id;
            return (
              <div
                key={doc.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#111927] border-teal-400 shadow-xl shadow-teal-500/10 ring-2 ring-teal-400/40'
                    : 'bg-[#0f141d] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Avatar & Status */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-12 h-12 rounded-full ${doc.avatarColor} text-white font-black text-xl flex items-center justify-center shadow-md`}>
                      {doc.initial}
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border ${
                      doc.status === 'available'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${doc.status === 'available' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      <span>{doc.statusLabel}</span>
                    </span>
                  </div>

                  {/* Doctor Info */}
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                    {doc.name}
                  </h3>
                  <p className="text-xs font-semibold text-teal-400 mt-0.5">
                    {doc.specialty}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                    {doc.qualification}
                  </p>

                  {/* Facility & Wait */}
                  <div className="mt-3.5 pt-3 border-t border-white/10 space-y-1.5 text-xs text-neutral-300">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="truncate">{doc.facility}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                      <Clock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span>Estimated wait: <strong className="text-white font-semibold">{doc.waitMinutes} min</strong></span>
                    </div>
                  </div>
                </div>

                {/* Start Consultation Button */}
                <div className="mt-4">
                  <button
                    onClick={() => handleSelectDoctor(doc)}
                    className={`w-full py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                      isSelected
                        ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/30 ring-1 ring-white/20'
                        : 'bg-[#00838f] hover:bg-[#0097a7] text-white'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Start Consultation</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TELECONSULTATION ROOM FOR SELECTED DOCTOR */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0c1018] border border-white/10 space-y-5 shadow-2xl">
        {/* Room Header Banner */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
            <Video className="w-5 h-5 text-teal-400" />
            <span>Teleconsultation Room • {selectedDoctor.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 font-medium">
              Active Call Channel
            </span>
          </div>
        </div>

        {/* 3-Column Layout: Doctor Profile Left, Video Room Center, Chat Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Doctor Profile Badge */}
          <div className="lg:col-span-3 p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center text-center justify-center space-y-3">
            <div className={`w-16 h-16 rounded-full ${selectedDoctor.avatarColor} text-white font-black text-2xl flex items-center justify-center shadow-lg`}>
              {selectedDoctor.initial}
            </div>
            <div>
              <h4 className="font-bold text-white text-base">{selectedDoctor.name}</h4>
              <p className="text-xs font-semibold text-teal-400">{selectedDoctor.specialty}</p>
              <p className="text-[11px] text-neutral-400 mt-1">{selectedDoctor.qualification}</p>
              <p className="text-[11px] text-neutral-400">{selectedDoctor.facility}</p>
            </div>

            <div className="pt-2 w-full border-t border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>Fee</span>
                <span className="font-bold text-emerald-400">Free (Govt Telemedicine)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>Status</span>
                <span className="text-white font-medium capitalize">{selectedDoctor.statusLabel}</span>
              </div>
            </div>
          </div>

          {/* Middle Column: Video Stream Container */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#141d26] to-[#080d14] border border-white/10 shadow-2xl aspect-video flex flex-col justify-between p-4 sm:p-5">
              {/* Call Info Header Overlay */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
                  <span className="text-xs font-mono font-bold text-white tracking-wider">
                    REC {formatTimer(callSeconds)}
                  </span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <span>HD 1080p</span>
                </div>
              </div>

              {/* Video Center View */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                {isCallActive ? (
                  <div className="text-center space-y-3">
                    <div className={`relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full ${selectedDoctor.avatarColor} p-1 shadow-2xl shadow-teal-500/20 flex items-center justify-center text-white text-3xl font-black`}>
                      {selectedDoctor.initial}
                      <div className="absolute -bottom-2 inset-x-0 flex items-center justify-center gap-1">
                        <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce"></span>
                        <span className="w-1 h-5 bg-teal-300 rounded-full animate-pulse"></span>
                        <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {selectedDoctor.name}
                      </h3>
                      <p className="text-xs text-teal-300 font-medium">
                        {selectedDoctor.specialty}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {selectedDoctor.facility}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <div className="text-3xl">📴</div>
                    <div className="text-sm font-bold text-white">Consultation Ended</div>
                    <p className="text-xs text-neutral-400">Summary saved to your digital health profile.</p>
                  </div>
                )}
              </div>

              {/* Patient Self-View PiP */}
              {isCallActive && (
                <div className="relative z-10 self-end w-20 sm:w-28 aspect-video rounded-2xl overflow-hidden bg-black/80 border border-white/20 shadow-xl flex items-center justify-center text-white text-xs">
                  {isVideoOn ? (
                    <div className="w-full h-full bg-[#1e293b] flex flex-col items-center justify-center p-1">
                      <span className="text-base">🧑‍🦱</span>
                      <span className="text-[9px] text-neutral-300 font-medium truncate">Devi (You)</span>
                    </div>
                  ) : (
                    <div className="text-[9px] text-neutral-400 flex items-center gap-1">
                      <VideoOff className="w-3 h-3" />
                      <span>Cam Off</span>
                    </div>
                  )}
                </div>
              )}

              {/* Video Controls Bar */}
              <div className="relative z-10 flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    isMicOn
                      ? 'bg-white/[0.1] hover:bg-white/[0.15] text-white border-white/20'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}
                  title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    isVideoOn
                      ? 'bg-white/[0.1] hover:bg-white/[0.15] text-white border-white/20'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}
                  title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsCallActive(!isCallActive)}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                    isCallActive
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/40'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/40'
                  }`}
                >
                  {isCallActive ? (
                    <>
                      <PhoneOff className="w-4 h-4" />
                      <span>{lang === 'ta' ? 'அழைப்பை முடிக்க' : lang === 'hi' ? 'समाप्त करें' : 'End Call'}</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>{lang === 'ta' ? 'மீண்டும் தொடங்க' : lang === 'hi' ? 'पुनः कनेक्ट' : 'Start Call'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Vitals Info Bar */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase font-bold">BP</span>
                <span className="text-white font-bold">118/76 mmHg</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase font-bold">Pulse</span>
                <span className="text-white font-bold">78 bpm</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase font-bold">Status</span>
                <span className="text-emerald-400 font-bold">Stable</span>
              </div>
            </div>
          </div>

          {/* Right Column: Consultation Notes & Chat */}
          <div className="lg:col-span-4 flex flex-col h-[460px] rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="p-3.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <h4 className="text-xs font-bold text-white">Consultation Notes & Chat</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Live
              </span>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 no-scrollbar">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.isDoctor ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mb-1 px-1">
                    <span className="font-semibold text-neutral-300">{m.sender}</span>
                    <span>•</span>
                    <span>{m.time}</span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs max-w-[90%] leading-relaxed ${
                      m.isDoctor
                        ? 'bg-white/[0.06] text-neutral-100 border border-white/10 rounded-tl-sm'
                        : 'bg-teal-600 text-white font-medium rounded-tr-sm shadow-md shadow-teal-900/30'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Replies */}
            <div className="p-2 border-t border-white/5 bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickReplies[lang].map((qr, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(qr)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-neutral-300 whitespace-nowrap border border-white/10 transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-2.5 border-t border-white/10 bg-[#0e131d] flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder={
                  lang === 'ta' 
                    ? 'மருத்துவரிடம் செய்தி அனுப்பவும்...' 
                    : lang === 'hi'
                    ? 'डॉक्टर को संदेश भेजें...'
                    : 'Type message to doctor...'
                }
                className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-colors active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
