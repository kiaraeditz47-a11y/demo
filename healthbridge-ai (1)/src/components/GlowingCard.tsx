import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Brain, 
  Video, 
  GitFork, 
  Pill, 
  ClipboardList, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { ServiceCardDef, Language } from '../types';

interface GlowingCardProps {
  service: ServiceCardDef;
  lang: Language;
  onClick: () => void;
  index: number;
}

export const GlowingCard: React.FC<GlowingCardProps> = ({
  service,
  lang,
  onClick,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Render matching icon
  const renderIcon = () => {
    const iconProps = { className: "w-5 h-5 text-white stroke-[2.2]" };
    switch (service.iconType) {
      case 'map-pin':
        return <MapPin {...iconProps} />;
      case 'calendar':
        return <Calendar {...iconProps} />;
      case 'brain':
        return <Brain {...iconProps} />;
      case 'video':
        return <Video {...iconProps} />;
      case 'git-fork':
        return <GitFork {...iconProps} />;
      case 'pill':
        return <Pill {...iconProps} />;
      case 'clipboard':
        return <ClipboardList {...iconProps} />;
      case 'alert-triangle':
        return <AlertTriangle {...iconProps} />;
      default:
        return <MapPin {...iconProps} />;
    }
  };

  // Gradient styles corresponding to the reference image styles
  const getGradientTheme = () => {
    switch (service.glowTheme) {
      case 'sunset': // Card 1 in reference image: sunset / flame amber
        return {
          background: 'linear-gradient(180deg, #101216 0%, #15161b 45%, #2a150c 70%, #d95713 88%, #facc15 100%)',
          hoverGlow: 'rgba(234, 88, 12, 0.45)',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          arrowHover: 'group-hover:text-amber-200',
        };
      case 'cobalt': // Card 2 in reference image: electric cobalt blue
        return {
          background: 'linear-gradient(180deg, #101216 0%, #121622 45%, #132448 70%, #2563eb 88%, #60a5fa 100%)',
          hoverGlow: 'rgba(37, 99, 235, 0.45)',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          arrowHover: 'group-hover:text-blue-200',
        };
      case 'emerald': // Card 3 in reference image: electric neon emerald green
        return {
          background: 'linear-gradient(180deg, #101216 0%, #121915 45%, #0e2e1e 70%, #16a34a 88%, #4ade80 100%)',
          hoverGlow: 'rgba(34, 197, 94, 0.45)',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          arrowHover: 'group-hover:text-emerald-200',
        };
      case 'cyan': // Oceanic cyan / teal
        return {
          background: 'linear-gradient(180deg, #101216 0%, #101a1f 45%, #0d2f3d 70%, #0891b2 88%, #38bdf8 100%)',
          hoverGlow: 'rgba(6, 182, 212, 0.45)',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          arrowHover: 'group-hover:text-cyan-200',
        };
      case 'purple': // Royal purple / indigo (Appointments)
        return {
          background: 'linear-gradient(180deg, #101216 0%, #161322 45%, #251642 70%, #7c3aed 88%, #c084fc 100%)',
          hoverGlow: 'rgba(147, 51, 234, 0.45)',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          arrowHover: 'group-hover:text-purple-200',
        };
      case 'rose': // Vivid rose / crimson (Medicines)
        return {
          background: 'linear-gradient(180deg, #101216 0%, #1a1216 45%, #351323 70%, #e11d48 88%, #fb7185 100%)',
          hoverGlow: 'rgba(225, 29, 72, 0.45)',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          arrowHover: 'group-hover:text-rose-200',
        };
      case 'amber': // Warm gold / amber (Records)
        return {
          background: 'linear-gradient(180deg, #101216 0%, #181613 45%, #332410 70%, #d97706 88%, #fde047 100%)',
          hoverGlow: 'rgba(245, 158, 11, 0.45)',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          arrowHover: 'group-hover:text-amber-200',
        };
      default:
        return {
          background: 'linear-gradient(180deg, #101216 0%, #15161b 45%, #2a150c 70%, #d95713 88%, #facc15 100%)',
          hoverGlow: 'rgba(234, 88, 12, 0.45)',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          arrowHover: 'group-hover:text-amber-200',
        };
    }
  };

  const theme = getGradientTheme();
  const title = lang === 'ta' ? service.titleTa : service.title;
  const description = lang === 'ta' ? service.descriptionTa : service.description;
  const actionLabel = lang === 'ta' ? service.actionLabelTa : service.actionLabel;

  return (
    <div
      id={`box-${service.id}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: theme.background,
        boxShadow: isHovered 
          ? `0 24px 50px -12px ${theme.hoverGlow}, 0 0 0 1px rgba(255, 255, 255, 0.25)` 
          : '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0px)',
      }}
      className="group relative cursor-pointer overflow-hidden rounded-[30px] p-7 md:p-8 flex flex-col justify-between min-h-[360px] md:min-h-[390px] select-none"
    >
      {/* Top soft specular glare */}
      <div 
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" 
      />

      {/* Top Row: Icon squircle + Badge */}
      <div>
        <div className="flex items-center justify-between">
          {/* Squircle Icon container like in 2nd image */}
          <div className="w-12 h-12 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:border-white/30 transition-transform duration-300">
            {renderIcon()}
          </div>

          {/* Optional Badge */}
          {service.badge && (
            <div className="flex items-center gap-1.5">
              {service.badgeType === 'live' && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-sm ${theme.badgeColor}`}>
                {service.badge}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold tracking-tight text-white mt-6 mb-2.5 group-hover:text-white transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-300/80 font-normal leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      {/* Action CTA link with arrow like in the reference image */}
      <div className="pt-6 mt-auto flex items-center justify-between border-t border-white/10">
        <span className={`inline-flex items-center gap-2 text-sm font-semibold text-white/95 ${theme.arrowHover} transition-colors`}>
          {actionLabel}
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
        <span className="text-[11px] text-white/40 font-mono tracking-wider">
          0{index + 1}
        </span>
      </div>
    </div>
  );
};
