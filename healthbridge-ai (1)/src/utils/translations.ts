import { Language } from '../types';

export const t = (
  lang: Language,
  enText: string,
  taText: string,
  hiText: string
): string => {
  if (lang === 'ta') return taText;
  if (lang === 'hi') return hiText;
  return enText;
};

export const COMMON_TRANSLATIONS = {
  appName: {
    en: 'ArogyaConnect',
    ta: 'ஆரோக்யா கனெக்ட்',
    hi: 'आरोग्य कनेक्ट',
  },
  districtTitle: {
    en: 'Kanyakumari Healthcare Network',
    ta: 'கன்னியாகுமரி மாவட்ட சுகாதார கட்டமைப்பு',
    hi: 'कन्याकुमारी जिला स्वास्थ्य नेटवर्क',
  },
  emergencyBtn: {
    en: 'Emergency Help 108',
    ta: 'அவசர உதவி 108',
    hi: 'आपातकालीन सहायता 108',
  },
  backToDashboard: {
    en: 'Back to Dashboard',
    ta: 'முகப்பிற்குத் திரும்பு',
    hi: 'डैशबोर्ड पर वापस जाएं',
  },
  downloadPdf: {
    en: 'Download PDF',
    ta: 'PDF பதிவிறக்குக',
    hi: 'पीडीएफ डाउनलोड करें',
  },
  offlineReady: {
    en: 'Offline Ready (Local Cache Active)',
    ta: 'ஆஃப்லைனில் இயங்கும் (உள்ளூர் தரவு தயார்)',
    hi: 'ऑफ़लाइन सक्रिय (स्थानीय डेटा सुरक्षित)',
  },
};
