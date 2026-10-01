import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Brain, 
  Video, 
  GitFork, 
  Pill,
  ArrowRight
} from 'lucide-react';
import { ServiceId, Language } from '../types';

interface VibrantSixBoxesProps {
  onSelectService: (id: ServiceId) => void;
  lang: Language;
}

export const VibrantSixBoxes: React.FC<VibrantSixBoxesProps> = ({ onSelectService, lang }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // The 6 boxes with the exact vibrant color grading from image 1, with English, Tamil, and Hindi
  const boxes: {
    id: ServiceId;
    title: string;
    titleTa: string;
    titleHi: string;
    description: string;
    descriptionTa: string;
    descriptionHi: string;
    actionLabel: string;
    actionLabelTa: string;
    actionLabelHi: string;
    badge?: string;
    badgeColor?: string;
    icon: any;
    background: string;
    hoverGlow: string;
    accentColor: string;
    indexNum: string;
  }[] = [
    {
      id: 'find_healthcare',
      title: 'Find Healthcare',
      titleTa: 'சுகாதாரம் கண்டறி',
      titleHi: 'स्वास्थ्य केंद्र खोजें',
      description: 'Instant directory of Sub-Centres, PHCs, Rural & District hospitals with live wait times.',
      descriptionTa: 'துணை மையங்கள், ஆரம்ப சுகாதார நிலையங்கள் மற்றும் மருத்துவமனை காத்திருப்பு நேரங்கள்.',
      descriptionHi: 'उप-केंद्रों, पीएचसी, ग्रामीण और जिला अस्पतालों की वास्तविक प्रतीक्षा समय के साथ निर्देशिका।',
      actionLabel: 'Explore Facilities',
      actionLabelTa: 'நிலையங்களை காண்க',
      actionLabelHi: 'केंद्र देखें',
      badge: '24/7',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      icon: MapPin,
      background: 'linear-gradient(180deg, #101216 0%, #101a1f 45%, #0d2f3d 70%, #0891b2 88%, #38bdf8 100%)',
      hoverGlow: 'rgba(6, 182, 212, 0.45)',
      accentColor: '#38bdf8',
      indexNum: '01',
    },
    {
      id: 'appointments',
      title: 'Appointments',
      titleTa: 'நியமனங்கள்',
      titleHi: 'अपॉइंटमेंट',
      description: 'Reserve token slots, check real-time queue numbers, and monitor doctors on duty.',
      descriptionTa: 'டோக்கன் முன்பதிவு செய்து வரிசை எண் மற்றும் மருத்துவர் வருகையை அறியலாம்.',
      descriptionHi: 'टोकन स्लॉट बुक करें, कतार संख्या जांचें और ड्यूटी पर डॉक्टरों की स्थिति देखें।',
      actionLabel: 'View Appointments',
      actionLabelTa: 'முன்பதிவு காண்க',
      actionLabelHi: 'अपॉइंटमेंट देखें',
      badge: '1',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: Calendar,
      background: 'linear-gradient(180deg, #101216 0%, #161322 45%, #251642 70%, #7c3aed 88%, #c084fc 100%)',
      hoverGlow: 'rgba(147, 51, 234, 0.45)',
      accentColor: '#c084fc',
      indexNum: '02',
    },
    {
      id: 'ai_triage',
      title: 'AI Triage',
      titleTa: 'AI அறிகுறி ஆய்வு',
      titleHi: 'AI लक्षण ट्रायज',
      description: 'Clinical-grade symptom evaluation to guide you to primary, urgent, or home care.',
      descriptionTa: 'மருத்துவ வழிகாட்டுதலுடன் அறிகுறிகளை ஆய்வு செய்து சரியான சிகிச்சை பெறலாம்.',
      descriptionHi: 'प्राथमिक, आपातकालीन या घरेलू देखभाल के लिए क्लिनिकल-ग्रेड लक्षण मूल्यांकन।',
      actionLabel: 'Start AI Triage',
      actionLabelTa: 'ஆய்வைத் தொடங்கு',
      actionLabelHi: 'ट्रायज शुरू करें',
      badge: 'AI',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: Brain,
      background: 'linear-gradient(180deg, #101216 0%, #15161b 45%, #2a150c 70%, #d95713 88%, #facc15 100%)',
      hoverGlow: 'rgba(234, 88, 12, 0.45)',
      accentColor: '#facc15',
      indexNum: '03',
    },
    {
      id: 'teleconsultation',
      title: 'Teleconsultation',
      titleTa: 'தொலை மருத்துவம்',
      titleHi: 'टेलीकंसल्टेशन',
      description: 'Direct audio-video consultations with government medical officers and specialists.',
      descriptionTa: 'அரசு மருத்துவர்கள் மற்றும் சிறப்பு நிபுணர்களுடன் நேரடி வீடியோ ஆலோசனை.',
      descriptionHi: 'सरकारी चिकित्सा अधिकारियों और विशेषज्ञों के साथ सीधा ऑडियो-वीडियो परामर्श।',
      actionLabel: 'Connect Online',
      actionLabelTa: 'இணையத்தில் இணைய',
      actionLabelHi: 'ऑनलाइन जुड़ें',
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: Video,
      background: 'linear-gradient(180deg, #101216 0%, #121915 45%, #0e2e1e 70%, #16a34a 88%, #4ade80 100%)',
      hoverGlow: 'rgba(34, 197, 94, 0.45)',
      accentColor: '#4ade80',
      indexNum: '04',
    },
    {
      id: 'referrals',
      title: 'Referrals',
      titleTa: 'பரிந்துரைகள்',
      titleHi: 'रेफरल',
      description: 'Track seamless escalation pathways from village Sub-Centre to District Hospital.',
      descriptionTa: 'துணை மையத்திலிருந்து மாவட்ட அரசு தலைமை மருத்துவமனை வரையிலான பரிந்துரை கண்காணிப்பு.',
      descriptionHi: 'उप-केंद्र से जिला अस्पताल तक निर्बाध रेफरल पथ को ट्रैक करें।',
      actionLabel: 'Track Referral',
      actionLabelTa: 'பரிந்துரையை காண்க',
      actionLabelHi: 'रेफरल ट्रैक करें',
      badge: 'Active',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: GitFork,
      background: 'linear-gradient(180deg, #101216 0%, #121622 45%, #132448 70%, #2563eb 88%, #60a5fa 100%)',
      hoverGlow: 'rgba(37, 99, 235, 0.45)',
      accentColor: '#60a5fa',
      indexNum: '05',
    },
    {
      id: 'medicines_diagnostics',
      title: 'Medicines & Diagnostics',
      titleTa: 'மருந்துகள் & ஆய்வகம்',
      titleHi: 'दवाएं और निदान',
      description: 'Check verified dispensary stock counts and diagnostic lab turnaround schedules.',
      descriptionTa: 'மருந்தக கையிருப்பு எண்ணிக்கை மற்றும் ஆய்வக சோதனை முடிவுகள்.',
      descriptionHi: 'औषधालय में उपलब्ध स्टॉक संख्या और नैदानिक लैब परीक्षण समय-सारणी जांचें।',
      actionLabel: 'Browse Inventory',
      actionLabelTa: 'கையிருப்பை காண்க',
      actionLabelHi: 'इन्वेंट्री देखें',
      badge: 'Stocked',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: Pill,
      background: 'linear-gradient(180deg, #101216 0%, #1a1216 45%, #351323 70%, #e11d48 88%, #fb7185 100%)',
      hoverGlow: 'rgba(225, 29, 72, 0.45)',
      accentColor: '#fb7185',
      indexNum: '06',
    },
  ];

  return (
    <div className="w-full my-4">
      {/* 6 Vibrant Boxes Grid matching image 1's exact color grading */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-4.5">
        {boxes.map((box) => {
          const isHovered = hoveredId === box.id;
          const Icon = box.icon;

          const title = lang === 'ta' ? box.titleTa : lang === 'hi' ? box.titleHi : box.title;
          const desc = lang === 'ta' ? box.descriptionTa : lang === 'hi' ? box.descriptionHi : box.description;
          const action = lang === 'ta' ? box.actionLabelTa : lang === 'hi' ? box.actionLabelHi : box.actionLabel;

          return (
            <div
              key={box.id}
              id={`vibrant-box-${box.id}`}
              onClick={() => onSelectService(box.id)}
              onMouseEnter={() => setHoveredId(box.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: box.background,
                boxShadow: isHovered 
                  ? `0 20px 45px -10px ${box.hoverGlow}, 0 0 0 1px rgba(255, 255, 255, 0.25)` 
                  : '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHovered ? 'translateY(-5px)' : 'translateY(0px)',
              }}
              className="group relative cursor-pointer overflow-hidden rounded-[26px] p-5 flex flex-col justify-between min-h-[290px] select-none"
            >
              {/* Top glossy specular glare reflection */}
              <div 
                className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" 
              />

              {/* Card Top: Icon + Badge */}
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>

                {box.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border backdrop-blur-md ${box.badgeColor}`}>
                    {box.badge}
                  </span>
                )}
              </div>

              {/* Middle Content */}
              <div className="my-auto pt-3">
                <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-white transition-colors">
                  {title}
                </h3>
                <p className="text-xs text-neutral-300/80 mt-1.5 leading-relaxed line-clamp-3 group-hover:text-neutral-200 transition-colors">
                  {desc}
                </p>
              </div>

              {/* Bottom Action Row with Divider */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-white/90">
                <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5 text-[11px] font-bold text-white">
                  <span>{action}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-white/80" />
                </span>
                <span className="text-[10px] font-mono opacity-50 text-white/60">
                  {box.indexNum}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
