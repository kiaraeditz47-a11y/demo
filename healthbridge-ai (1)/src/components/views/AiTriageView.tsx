import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Brain, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Video, 
  PhoneCall, 
  Download, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { Language } from '../../types';
import jsPDF from 'jspdf';

interface AiTriageViewProps {
  lang: Language;
  onBack: () => void;
  onNavigateToAppointment?: () => void;
  onNavigateToTeleconsult?: () => void;
  onOpenEmergency?: () => void;
}

export const AiTriageView: React.FC<AiTriageViewProps> = ({
  lang,
  onBack,
  onNavigateToAppointment,
  onNavigateToTeleconsult,
  onOpenEmergency,
}) => {
  // Step: 0 = Symptoms, 1 = Severity & Duration, 2 = Clinical Assessment Result
  const [step, setStep] = useState<number>(0);
  
  // Multi-symptom selection: user can choose 2 to 3 symptoms
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['fever', 'cough']);
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [duration, setDuration] = useState<'today' | '1-3' | '3+'>('1-3');
  const [hasMaternalCondition, setHasMaternalCondition] = useState<boolean>(true);

  // 8 Clinical Symptoms with Tamil & Hindi translations
  const symptomsList = [
    {
      id: 'fever',
      titleEn: 'Fever / Chills',
      titleTa: 'காய்ச்சல் / நடுக்கம்',
      titleHi: 'बुखार / कंपकंपी',
      descEn: 'Body temperature above 99.5°F',
      descTa: 'உடல் வெப்பம் 99.5°F க்கு மேல்',
      descHi: 'शरीर का तापमान 99.5°F से अधिक',
      icon: '🌡️',
    },
    {
      id: 'cough',
      titleEn: 'Persistent Cough / Breathlessness',
      titleTa: 'தொடர் இருமல் / மூச்சுத்திணறல்',
      titleHi: 'लगातार खांसी / सांस फूलना',
      descEn: 'Dry or phlegm cough for >2 days',
      descTa: 'இருமல் மற்றும் சளி தொல்லை',
      descHi: '2 दिन से अधिक सूखी या बलगम वाली खांसी',
      icon: '😷',
    },
    {
      id: 'headache',
      titleEn: 'Severe Headache / Dizziness',
      titleTa: 'கடுமையான தலைவலி / தலைச்சுற்றல்',
      titleHi: 'तेज सिरदर्द / चक्कर आना',
      descEn: 'Throbbing pressure or vertigo',
      descTa: 'தாங்க முடியாத தலைவலி அல்லது மயக்கம்',
      descHi: 'सिर में भारीपन या चक्कर आना',
      icon: '🤕',
    },
    {
      id: 'abdominal',
      titleEn: 'Abdominal Cramping / Maternal Pain',
      titleTa: 'வயிற்று வலி / கர்ப்பகால வலி',
      titleHi: 'पेट दर्द / मातृ ऐंठन',
      descEn: 'Lower pelvic cramps or nausea',
      descTa: 'அடிவயிற்று சுளுக்கு அல்லது அசதி',
      descHi: 'निचले पेट में दर्द या मिचली',
      icon: '🤰',
    },
    {
      id: 'joint',
      titleEn: 'Joint Pain / Fracture Strain',
      titleTa: 'மூட்டு வலி / சுளுக்கு வீக்கம்',
      titleHi: 'जोड़ों का दर्द / मोच व सूजन',
      descEn: 'Pain in wrist, ankle, or knee',
      descTa: 'கை, கால் மணிக்கட்டு வலி',
      descHi: 'कलाई, टखने या घुटने में दर्द',
      icon: '🦴',
    },
    {
      id: 'chest',
      titleEn: 'Chest Heaviness / Palpitations',
      titleTa: 'மார்பு இறுக்கம் / படபடப்பு',
      titleHi: 'सीने में भारीपन / घबराहट',
      descEn: 'Pressure or racing heartbeat',
      descTa: 'நெஞ்சு வலி அல்லது படபடப்பு',
      descHi: 'सीने में दबाव या दिल की तेज धड़कन',
      icon: '💓',
    },
    {
      id: 'dehydration',
      titleEn: 'Vomiting / Dehydration',
      titleTa: 'வாந்தி / நீர்ச்சத்து குறைவு',
      titleHi: 'उल्टी / निर्जलीकरण (डिहाइड्रेशन)',
      descEn: 'Excessive thirst or fluid loss',
      descTa: 'அடிக்கடி வாந்தி மற்றும் சோர்வு',
      descHi: 'अत्यधिक प्यास या तरल पदार्थ की कमी',
      icon: '💧',
    },
    {
      id: 'rash',
      titleEn: 'Skin Rash / Allergic Swelling',
      titleTa: 'தோல் தடிப்பு / ஒவ்வாமை வீக்கம்',
      titleHi: 'त्वचा पर चकत्ते / एलर्जी सूजन',
      descEn: 'Itchy redness or facial puffiness',
      descTa: 'அரிப்பு மற்றும் சிவப்பு தடிப்புகள்',
      descHi: 'खुजली वाले लाल दाने या चेहरे पर सूजन',
      icon: '🩹',
    },
  ];

  const handleToggleSymptom = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  // Compute clinical triage score based on selected combination
  const isEmergency = selectedSymptoms.includes('chest') && severity === 'severe';
  const isMaternalHighRisk = selectedSymptoms.includes('abdominal') && hasMaternalCondition;

  const downloadTriagePDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(15, 15, 180, 36, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('ArogyaConnect AI Clinical Triage Summary', 22, 28);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Clinical Decision Support • Kanyakumari District Healthcare Protocol', 22, 36);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Patient: Devi S. (ABHA: 91-4458-1209)', 15, 62);
    doc.text(`Triage Date: ${new Date().toLocaleDateString()}`, 130, 62);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Multi-Symptom Cluster (${selectedSymptoms.length} reported):`, 15, 75);
    
    selectedSymptoms.forEach((s, idx) => {
      const match = symptomsList.find(item => item.id === s);
      doc.text(`• ${match ? match.titleEn : s}`, 22, 85 + idx * 8);
    });

    let currentY = 115;
    doc.text(`Severity: ${severity.toUpperCase()}`, 15, currentY);
    doc.text(`Duration: ${duration === 'today' ? 'Less than 24 hours' : duration === '1-3' ? '1 to 3 days' : 'More than 3 days'}`, 80, currentY);

    currentY += 15;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(15, currentY, 180, 40, 2, 2, 'F');
    doc.setTextColor(13, 148, 136);
    doc.setFont('helvetica', 'bold');
    doc.text('RECOMMENDED CLINICAL CARE PATHWAY:', 20, currentY + 10);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(
      isEmergency 
        ? 'CRITICAL ALERT: Call 108 immediately. Proceed to Emergency Department.'
        : isMaternalHighRisk
        ? 'HIGH-RISK MATERNAL ATTENTION: Report to Kanyakumari PHC Maternity Ward within 2 hours.'
        : 'PRIMARY HEALTHCARE OPD: Consultation recommended with Dr. Meena R. at Kanyakumari PHC.',
      20, currentY + 22
    );

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text('Generated electronically by ArogyaConnect AI Engine based on Tamil Nadu Public Health guidelines.', 15, 260);

    doc.save('ArogyaConnect_AI_Triage_Report.pdf');
  };

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
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ta' ? 'AI மருத்துவ வழிகாட்டி' : lang === 'hi' ? 'AI क्लिनिकल ट्रायज' : 'AI Clinical Triage'}</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'ta' ? 'அறிவார்ந்த அறிகுறி ஆய்வு' : lang === 'hi' ? 'बुद्धिमान लक्षण एवं प्राथमिकता विश्लेषण' : 'Intelligent AI Symptom Evaluation'}
            </h1>
          </div>
        </div>
      </div>

      {/* Progress Steps Header */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-xl mx-auto py-2">
        {[
          { id: 0, labelEn: '1. Choose Symptoms', labelTa: '1. அறிகுறிகள் தேர்வு', labelHi: '1. लक्षण चुनें' },
          { id: 1, labelEn: '2. Severity & Timeline', labelTa: '2. தீவிரம் & நாட்கள்', labelHi: '2. गंभीरता व अवधि' },
          { id: 2, labelEn: '3. Clinical Care Plan', labelTa: '3. சிகிச்சை பரிந்துரை', labelHi: '3. क्लिनिकल योजना' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => s.id <= step && setStep(s.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              step === s.id
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : step > s.id
                ? 'bg-white/10 text-neutral-200 border border-white/15'
                : 'bg-white/[0.04] text-neutral-500 border border-white/5 cursor-not-allowed'
            }`}
          >
            {lang === 'ta' ? s.labelTa : lang === 'hi' ? s.labelHi : s.labelEn}
          </button>
        ))}
      </div>

      {/* STEP 0: Select Symptoms */}
      {step === 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {symptomsList.map((item) => {
              const isSelected = selectedSymptoms.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleSymptom(item.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all select-none relative flex flex-col justify-between min-h-[140px] ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#2a1e12] to-[#1f150b] border-amber-500/60 shadow-xl shadow-amber-950/40 transform scale-[1.02]'
                      : 'bg-[#10141d] hover:bg-[#141a26] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-amber-500 border-amber-400 text-black font-black' 
                        : 'border-white/20 bg-white/5'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className={`text-sm font-bold leading-tight ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                      {lang === 'ta' ? item.titleTa : lang === 'hi' ? item.titleHi : item.titleEn}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                      {lang === 'ta' ? item.descTa : lang === 'hi' ? item.descHi : item.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action to Step 1 */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs text-neutral-400">
              {lang === 'ta' 
                ? `${selectedSymptoms.length} அறிகுறிகள் தேர்ந்தெடுக்கப்பட்டுள்ளன` 
                : lang === 'hi'
                ? `${selectedSymptoms.length} लक्षण चुने गए हैं`
                : `${selectedSymptoms.length} symptoms selected`}
            </span>
            <button
              onClick={() => setStep(1)}
              disabled={selectedSymptoms.length === 0}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                selectedSymptoms.length > 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/30 active:scale-95'
                  : 'bg-white/10 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <span>{lang === 'ta' ? 'அடுத்த படிக்குச் செல்க →' : lang === 'hi' ? 'अगला कदम →' : 'Continue to Severity →'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: Severity & Duration */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto space-y-6 bg-[#0f141f] p-6 rounded-3xl border border-white/10 shadow-2xl">
          <h2 className="text-lg font-bold text-white">
            {lang === 'ta' ? 'அறிகுறிகளின் தீவிரம் மற்றும் கால அளவு' : lang === 'hi' ? 'लक्षणों की गंभीरता और समय' : 'Assess Severity & Timeline'}
          </h2>

          {/* Selected Summary Chips */}
          <div>
            <div className="text-xs text-neutral-400 mb-2">
              {lang === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட அறிகுறிகள்:' : lang === 'hi' ? 'चुने गए लक्षण:' : 'Your selected symptoms:'}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((s) => {
                const item = symptomsList.find(i => i.id === s);
                return (
                  <span key={s} className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5">
                    <span>{item?.icon}</span>
                    <span>{lang === 'ta' ? item?.titleTa : lang === 'hi' ? item?.titleHi : item?.titleEn}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Severity selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              {lang === 'ta' ? 'வலி அல்லது தீவிர நிலை:' : lang === 'hi' ? 'तीव्रता का स्तर:' : 'Severity Level:'}
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { id: 'mild', labelEn: 'Mild (Manageable)', labelTa: 'லேசானது', labelHi: 'हल्का' },
                { id: 'moderate', labelEn: 'Moderate (Affects Work)', labelTa: 'நடுத்தரமானது', labelHi: 'मध्यम' },
                { id: 'severe', labelEn: 'Severe (Unbearable)', labelTa: 'கடுமையானது', labelHi: 'गंभीर' },
              ].map(sev => (
                <button
                  key={sev.id}
                  onClick={() => setSeverity(sev.id as any)}
                  className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
                    severity === sev.id
                      ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-md'
                      : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  {lang === 'ta' ? sev.labelTa : lang === 'hi' ? sev.labelHi : sev.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Duration selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              {lang === 'ta' ? 'எத்தனை நாட்களாக உள்ளது?' : lang === 'hi' ? 'कितने दिनों से है?' : 'Duration:'}
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { id: 'today', labelEn: '< 24 Hours', labelTa: 'இன்று முதல்', labelHi: '< 24 घंटे' },
                { id: '1-3', labelEn: '1 - 3 Days', labelTa: '1 - 3 நாட்கள்', labelHi: '1 - 3 दिन' },
                { id: '3+', labelEn: '3+ Days (Chronic)', labelTa: '3 நாட்களுக்கு மேல்', labelHi: '3+ दिन' },
              ].map(dur => (
                <button
                  key={dur.id}
                  onClick={() => setDuration(dur.id as any)}
                  className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
                    duration === dur.id
                      ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-md'
                      : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  {lang === 'ta' ? dur.labelTa : lang === 'hi' ? dur.labelHi : dur.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Maternal / Pregnancy checkbox */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
            <span className="text-xs text-neutral-200">
              {lang === 'ta' ? 'கர்ப்பகாலம் (ANC 28 வாரங்கள்) தொடர்பானதா?' : lang === 'hi' ? 'क्या यह गर्भावस्था (28 सप्ताह) से संबंधित है?' : 'Related to Pregnancy / Maternal Care?'}
            </span>
            <input
              type="checkbox"
              checked={hasMaternalCondition}
              onChange={e => setHasMaternalCondition(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setStep(0)}
              className="px-4 py-2 rounded-xl text-xs text-neutral-300 hover:text-white"
            >
              ← {lang === 'ta' ? 'பின்செல்க' : lang === 'hi' ? 'पीछे' : 'Back to Symptoms'}
            </button>
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
            >
              {lang === 'ta' ? 'முடிவுகளைக் காண்க →' : lang === 'hi' ? 'परिणाम देखें →' : 'Generate Clinical Plan →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Clinical Assessment Outcome */}
      {step === 2 && (() => {
        const isSevereCondition = severity === 'severe' || isEmergency || (hasMaternalCondition && severity !== 'mild') || (selectedSymptoms.includes('chest') && severity !== 'mild');

        return (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Card Outcome */}
            <div className={`p-6 rounded-3xl border shadow-2xl ${
              isSevereCondition
                ? 'bg-gradient-to-b from-[#2a1012] to-[#1a080a] border-rose-500/50 shadow-rose-950/40'
                : 'bg-gradient-to-b from-[#0f1f1a] to-[#091410] border-emerald-500/40 shadow-emerald-950/40'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    isSevereCondition
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {isSevereCondition
                      ? (lang === 'ta' ? 'உடல்நல பாதிப்பு: தீவிரமானது (SEVERE)' : lang === 'hi' ? 'रोग की स्थिति: गंभीर (SEVERE)' : 'Ailment Status: Severe')
                      : (lang === 'ta' ? 'உடல்நல பாதிப்பு: தீவிரமானது அல்ல (NOT SEVERE)' : lang === 'hi' ? 'रोग की स्थिति: गंभीर नहीं (NOT SEVERE)' : `Ailment Status: Not Severe (${severity.toUpperCase()})`)}
                  </span>

                  <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                    {isSevereCondition
                      ? (lang === 'ta' ? 'மருத்துவ மதிப்பீடு: தீவிரமான நிலை (Severe Condition)' : lang === 'hi' ? 'चिकित्सीय मूल्यांकन: गंभीर स्थिति (Severe Condition)' : 'Clinical Assessment: Severe Condition Detected')
                      : (lang === 'ta' ? 'மருத்துவ மதிப்பீடு: தீவிரமானது அல்ல (Not Severe)' : lang === 'hi' ? 'चिकित्सीय मूल्यांकन: सामान्य / मध्यम स्थिति (Not Severe)' : `Clinical Assessment: Not Severe (${severity === 'mild' ? 'Mild Condition' : 'Moderate Condition'})`)}
                  </h2>

                  <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                    {isSevereCondition
                      ? (lang === 'ta' 
                          ? 'நீங்கள் தெரிவித்த அறிகுறிகள் மற்றும் தீவிரத்தின் அடிப்படையில், இந்த பாதிப்பு தீவிரமானது என வகைப்படுத்தப்படுகிறது. தாமதமின்றி மருத்துவ கவனிப்பு அல்லது அவசர உதவி தேவைப்படலாம். மூச்சுத்திணறல், தீவிர வலி போன்ற எச்சரிக்கை அறிகுறிகளைக் கவனிக்கவும்.'
                          : lang === 'hi'
                          ? 'बताए गए लक्षणों और तीव्रता के आधार पर, यह बीमारी गंभीर मानी गई है। सांस लेने में तकलीफ या निरंतर तीव्र दर्द जैसे गंभीर लक्षणों पर तत्काल ध्यान देने की आवश्यकता है।'
                          : 'Based on the reported symptoms and high severity indicators, this ailment is classified as Severe. Clinical indicators suggest high clinical risk; close monitoring for red-flag symptoms such as breathlessness, severe continuous pain, or palpitations is critical.')
                      : (lang === 'ta'
                          ? 'உங்கள் அறிகுறிகள் தீவிரமானவை அல்ல. இவை பொதுவான அல்லது மிதமான பாதிப்பாக வகைப்படுத்தப்பட்டுள்ளன. போதுமான ஓய்வு, சத்தான உணவு மற்றும் நீர்ச்சத்து எடுத்துக்கொண்டு நிலைமையை கண்காணிக்கவும்.'
                          : lang === 'hi'
                          ? 'आपकी स्थिति गंभीर नहीं है। लक्षण सामान्य या मध्यम श्रेणी के अंतर्गत आते हैं। पर्याप्त आराम, तरल पदार्थ और नियमित निगरानी से स्वास्थ्य में सुधार संभव है।'
                          : 'Your symptoms are classified as Not Severe. The clinical indicators suggest a mild to moderate manageable condition. Continue hydration, adequate rest, and seek consultation if symptoms worsen unexpectedly.')}
                  </p>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-3xl flex-shrink-0">
                  {isSevereCondition ? '🚨' : '✅'}
                </div>
              </div>

              {/* Reported Symptoms Breakdown */}
              <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.04]">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                    {lang === 'ta' ? 'அறிகுறிகள்' : lang === 'hi' ? 'लक्षण' : 'Symptoms Evaluated'}
                  </span>
                  <span className="text-white font-bold mt-0.5 block">
                    {selectedSymptoms.map(s => s.toUpperCase()).join(' + ')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.04]">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                    {lang === 'ta' ? 'தீவிரம் & காலம்' : lang === 'hi' ? 'तीव्रता व अवधि' : 'Severity & Duration'}
                  </span>
                  <span className="text-white font-bold mt-0.5 block capitalize">
                    {severity} ({duration})
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.04]">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                    {lang === 'ta' ? 'தீவிர நிலை' : lang === 'hi' ? 'गंभीरता श्रेणी' : 'Severity Assessment'}
                  </span>
                  <span className={`font-bold mt-0.5 block ${isSevereCondition ? 'text-rose-300' : 'text-emerald-300'}`}>
                    {isSevereCondition 
                      ? (lang === 'ta' ? 'தீவிரமானது (Severe)' : lang === 'hi' ? 'गंभीर (Severe)' : 'Severe (High Risk)') 
                      : (lang === 'ta' ? 'தீவிரமானது அல்ல (Not Severe)' : lang === 'hi' ? 'गंभीर नहीं (Not Severe)' : 'Not Severe (Manageable)')}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {isSevereCondition ? (
                <button
                  onClick={onOpenEmergency}
                  className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/40 active:scale-95 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{lang === 'ta' ? '108 அவசர ஆம்புலன்ஸ்' : lang === 'hi' ? '108 एम्बुलेंस कॉल करें' : 'Call 108 Ambulance'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setStep(0);
                    setSelectedSymptoms(['fever', 'cough']);
                  }}
                  className="p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-neutral-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 text-neutral-400" />
                  <span>{lang === 'ta' ? 'மீண்டும் பரிசோதிக்க' : lang === 'hi' ? 'पुनः मूल्यांकन' : 'Re-evaluate'}</span>
                </button>
              )}

              <button
                onClick={onNavigateToTeleconsult}
                className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
              >
                <Video className="w-4 h-4" />
                <span>{lang === 'ta' ? 'வீடியோ ஆலோசனை' : lang === 'hi' ? 'वीडियो परामर्श शुरू करें' : 'Start Video Consult'}</span>
              </button>

              <button
                onClick={downloadTriagePDF}
                className="p-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-neutral-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ta' ? 'PDF பதிவிறக்குக' : lang === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download Triage PDF'}</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setStep(0);
                  setSelectedSymptoms(['fever', 'cough']);
                }}
                className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ta' ? 'மீண்டும் புதிதாகத் தொடங்க' : lang === 'hi' ? 'फिर से शुरू करें' : 'Start New Evaluation'}</span>
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
