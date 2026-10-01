import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Brain, 
  Video, 
  GitFork, 
  Pill,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { ServiceId, Language } from '../types';

interface Top3DCarouselProps {
  onSelectService: (id: ServiceId) => void;
  lang: Language;
}

export const Top3DCarousel: React.FC<Top3DCarouselProps> = ({ onSelectService, lang }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // The exact 6 boxes requested by user:
  // "healthcare, appointment, ai triage, teleconsultaion, referrals, medicine & diagnostics"
  const items: {
    id: ServiceId;
    title: string;
    titleTa: string;
    sub: string;
    badge?: string;
    icon: any;
    theme: 'teal' | 'purple' | 'amber' | 'emerald' | 'blue' | 'rose';
    imageGrad: string;
    glowGrad: string;
  }[] = [
    {
      id: 'find_healthcare',
      title: 'Healthcare',
      titleTa: 'சுகாதாரம்',
      sub: 'Facilities & PHCs',
      badge: '24/7',
      icon: MapPin,
      theme: 'teal',
      imageGrad: 'from-cyan-900/60 via-slate-900/80 to-[#0c131d]',
      glowGrad: 'rgba(6, 182, 212, 0.4)',
    },
    {
      id: 'appointments',
      title: 'Appointment',
      titleTa: 'நியமனம்',
      sub: 'Token #12 Active',
      badge: '1',
      icon: Calendar,
      theme: 'purple',
      imageGrad: 'from-purple-900/60 via-slate-900/80 to-[#140e22]',
      glowGrad: 'rgba(168, 85, 247, 0.45)',
    },
    {
      id: 'ai_triage',
      title: 'AI Triage',
      titleTa: 'AI அறிகுறி ஆய்வு',
      sub: 'Symptom Checker',
      badge: 'AI',
      icon: Brain,
      theme: 'amber',
      imageGrad: 'from-amber-900/60 via-slate-900/80 to-[#1f1509]',
      glowGrad: 'rgba(245, 158, 11, 0.45)',
    },
    {
      id: 'teleconsultation',
      title: 'Teleconsultation',
      titleTa: 'தொலை மருத்துவம்',
      sub: '3 Doctors Live',
      badge: 'Live',
      icon: Video,
      theme: 'emerald',
      imageGrad: 'from-emerald-900/60 via-slate-900/80 to-[#0c1c14]',
      glowGrad: 'rgba(16, 185, 129, 0.45)',
    },
    {
      id: 'referrals',
      title: 'Referrals',
      titleTa: 'பரிந்துரைகள்',
      sub: 'Multi-Tier Path',
      badge: 'Active',
      icon: GitFork,
      theme: 'blue',
      imageGrad: 'from-blue-900/60 via-slate-900/80 to-[#0e1628]',
      glowGrad: 'rgba(59, 130, 246, 0.45)',
    },
    {
      id: 'medicines_diagnostics',
      title: 'Medicine & Diagnostics',
      titleTa: 'மருந்துகள் & ஆய்வகம்',
      sub: 'Free Dispensary',
      badge: 'Stocked',
      icon: Pill,
      theme: 'rose',
      imageGrad: 'from-rose-900/60 via-slate-900/80 to-[#1e0f17]',
      glowGrad: 'rgba(244, 63, 94, 0.45)',
    },
  ];

  return (
    <div className="relative w-full pt-4 pb-6 overflow-hidden select-none">
      {/* Top Center Glowing Button like "See prices" in Image 2 */}
      <div className="flex justify-center mb-6">
        <button 
          onClick={() => onSelectService('appointments')}
          className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-blue-950/80 border border-cyan-400/40 shadow-[0_0_24px_rgba(6,182,212,0.35)] hover:shadow-[0_0_32px_rgba(6,182,212,0.6)] text-xs font-bold text-white tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>{lang === 'ta' ? 'அனைத்து சேவைகள்' : 'See Services'}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          
          {/* Subtle top specular border highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent rounded-t-2xl"></div>
        </button>
      </div>

      {/* 3D Arc / Perspective Carousel of the 6 Boxes */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4">
        {/* Perspective Container */}
        <div 
          className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 overflow-x-auto py-4 px-2 no-scrollbar"
          style={{ perspective: '1200px' }}
        >
          {items.map((item, index) => {
            const isHovered = hoveredId === item.id;
            const Icon = item.icon;
            
            // Calculate 3D arc rotation for perspective feel like Image 2
            const offset = index - 2.5; // -2.5, -1.5, -0.5, 0.5, 1.5, 2.5
            const rotateY = isHovered ? 0 : offset * 5;
            const translateY = isHovered ? -8 : Math.abs(offset) * 4;
            const scale = isHovered ? 1.05 : 1 - Math.abs(offset) * 0.02;

            return (
              <div
                key={item.id}
                onClick={() => onSelectService(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  transform: `perspective(1000px) rotateY(${rotateY}deg) translateY(${translateY}px) scale(${scale})`,
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isHovered 
                    ? `0 20px 40px -10px ${item.glowGrad}, 0 0 0 1px rgba(255,255,255,0.3)` 
                    : '0 10px 25px -5px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
                }}
                className="group relative flex-shrink-0 w-36 sm:w-44 md:w-48 h-48 sm:h-56 md:h-60 rounded-[24px] p-4 flex flex-col justify-between cursor-pointer overflow-hidden bg-gradient-to-b from-[#11141c] via-[#10131b] to-[#0a0d14]"
              >
                {/* Background ambient radial gradient */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-b ${item.imageGrad} opacity-40 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none`}
                />
                
                {/* Bottom radiant glow */}
                <div 
                  className="absolute inset-x-0 bottom-0 h-24 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(120% 80% at 50% 100%, ${item.glowGrad} 0%, transparent 80%)`
                  }}
                />

                {/* Top glossy edge reflection */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                {/* Card Top Row: Icon + Badge */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/15 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-white/10 text-white/90 border border-white/15 backdrop-blur-sm">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Card Bottom: Label & Subtitle */}
                <div className="relative z-10 text-left mt-auto">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight group-hover:text-white transition-colors">
                    {lang === 'ta' ? item.titleTa : item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1 group-hover:text-neutral-300 transition-colors">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
