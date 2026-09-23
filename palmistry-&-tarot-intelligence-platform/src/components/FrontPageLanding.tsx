import React from 'react';
import { UserProfile } from '../types';
import { DailySpiritualAffirmationCard } from './DailySpiritualAffirmationCard';
import { 
  Layers, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  BookOpen, 
  Award, 
  User, 
  Calendar, 
  MapPin, 
  Clock, 
  Globe,
  ScanLine
} from 'lucide-react';

interface FrontPageLandingProps {
  currentUser: UserProfile;
  onNavigate: (tab: 'palm' | 'tarot' | 'synthesis' | 'dashboard' | 'experts') => void;
  onOpenProfile: () => void;
}

export const FrontPageLanding: React.FC<FrontPageLandingProps> = ({
  currentUser,
  onNavigate,
  onOpenProfile
}) => {
  const hasBirthDetails = Boolean(currentUser.birthDate || currentUser.zodiacSign);

  return (
    <div className="space-y-10 animate-fade-in pb-8">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#120F1D] via-[#0A0A0F] to-[#050507] border border-white/10 p-8 sm:p-12 shadow-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Glow ambient circle background */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl space-y-4 relative z-10">
          <h1 className="text-3xl sm:text-5xl font-light text-white italic serif leading-tight">
            Discover Your Path Through <br className="hidden sm:inline" />
            <span className="font-bold not-italic bg-gradient-to-r from-amber-200 via-white to-violet-400 bg-clip-text text-transparent">
              Palmistry & Tarot AI
            </span>
          </h1>

          <p className="text-sm text-white/70 leading-relaxed font-sans max-w-xl">
            Welcome, <span className="text-violet-300 font-semibold">{currentUser.name}</span>! Celestial AI merges high-precision MediaPipe hand landmark computer vision with Rider-Waite tarot archetypes and astrological personal profiling to deliver deep, actionable life guidance.
          </p>

          {/* User Quick Details Strip */}
          <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
            {currentUser.zodiacSign && (
              <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-md flex items-center space-x-1">
                <Compass className="w-3 h-3 text-amber-400" />
                <span>Zodiac: {currentUser.zodiacSign}</span>
              </span>
            )}
            {currentUser.birthDate && (
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/80 rounded-md flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-violet-400" />
                <span>Born: {currentUser.birthDate}</span>
              </span>
            )}
            {currentUser.birthPlace && (
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/80 rounded-md flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{currentUser.birthPlace}</span>
              </span>
            )}
            <button
              onClick={onOpenProfile}
              className="px-2.5 py-1 bg-violet-950/60 hover:bg-violet-900/80 border border-violet-500/40 text-violet-300 rounded-md flex items-center space-x-1 transition-colors"
            >
              <User className="w-3 h-3" />
              <span>{hasBirthDetails ? 'Edit Details' : '+ Add Birth & Zodiac Details'}</span>
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-3 justify-center md:justify-start">
            <button
              onClick={() => onNavigate('palm')}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl sleek-glow-violet transition-all flex items-center space-x-2"
            >
              <ScanLine className="w-4 h-4 text-amber-300" />
              <span>Explore Palmistry</span>
            </button>
            <button
              onClick={() => onNavigate('tarot')}
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl border border-white/10 transition-all flex items-center space-x-2"
            >
              <Layers className="w-4 h-4 text-violet-400" />
              <span>Launch Tarot Studio</span>
            </button>
          </div>
        </div>

        {/* Feature Visual Card */}
        <div className="relative shrink-0 w-full md:w-80 bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 shadow-2xl text-left space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-violet-400">System Capabilities</span>
            <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">ONLINE</span>
          </div>
          
          <div className="space-y-3 text-xs">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-violet-600/20 text-violet-300 rounded-lg shrink-0 mt-0.5 border border-violet-500/30">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">AI Palm Line Tracing</div>
                <div className="text-[11px] text-white/50">Crease detection & major palm line vector analysis.</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg shrink-0 mt-0.5 border border-amber-500/30">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">78-Card Rider-Waite Deck</div>
                <div className="text-[11px] text-white/50">Full Arcana spreads & Gemini AI symbolic decoding.</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg shrink-0 mt-0.5 border border-emerald-500/30">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">5-Tier Weighted Scoring</div>
                <div className="text-[11px] text-white/50">Cross-verifies palm lines with tarot card draws.</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Daily Spiritual Affirmation Component (24-Hour Personalized Cycle) */}
      <DailySpiritualAffirmationCard 
        currentUser={currentUser}
        onOpenProfile={onOpenProfile}
      />

      {/* Main Feature Cards Grid: Palmistry vs. Tarot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* About Palmistry Section */}
        <div className="bg-[#0A0A0F] border border-white/10 hover:border-violet-500/50 rounded-2xl p-8 shadow-xl transition-all flex flex-col justify-between group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-violet-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <ScanLine className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                Chiromancy Core
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                About AI Palmistry
              </h2>
              <p className="text-xs text-white/60 leading-relaxed mt-2">
                Palmistry (Chiromancy) is the ancient science of reading the physical contours, lines, mounts, and finger ratios of the human hand to unlock character traits, emotional vitality, and life trajectories.
              </p>
            </div>

            <div className="space-y-2 text-xs text-white/80">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                <span><strong className="text-white">Life Line:</strong> Vitality, physical endurance & life events</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span><strong className="text-white">Head Line:</strong> Mental focus, decision framework & logic</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                <span><strong className="text-white">Heart Line:</strong> Emotional depth, empathy & relationship bonds</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">Elements & Mounts:</strong> Fire, Water, Air, Earth palm shapes</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10">
            <button
              onClick={() => onNavigate('palm')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-[0.15em] text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Scan Your Palm Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* About Tarot Studio Section */}
        <div className="bg-[#0A0A0F] border border-white/10 hover:border-violet-500/50 rounded-2xl p-8 shadow-xl transition-all flex flex-col justify-between group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded border border-violet-500/20">
                78-Card Archetypes
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">
                About Tarot Reading
              </h2>
              <p className="text-xs text-white/60 leading-relaxed mt-2">
                Tarot is a symbolic mirror of the subconscious mind. Featuring the classic 78-Card Rider-Waite deck, it maps Major Arcana life lessons and Minor Arcana daily choices into multi-card spreads.
              </p>
            </div>

            <div className="space-y-2 text-xs text-white/80">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span><strong className="text-white">22 Major Arcana:</strong> Soul archetypes & major life milestones</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">56 Minor Arcana:</strong> Wands, Cups, Swords, Pentacles elements</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-white">Multiple Spreads:</strong> Celtic Cross, 3-Card, Relationship, Life Path</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span><strong className="text-white">Gemini AI Synthesis:</strong> Context-aware card energy decoding</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10">
            <button
              onClick={() => onNavigate('tarot')}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl sleek-glow-violet transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Enter Tarot Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Synthesis Section Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-[#0A0A0F] to-violet-950/40 border border-white/10 rounded-2xl p-8 shadow-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 text-emerald-400 font-mono text-[10px] tracking-[0.2em] uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>Cross-Verification Engine</span>
          </div>
          <h3 className="text-xl font-bold text-white">Unified Spiritual Intelligence Synthesis</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            Why choose between Palmistry and Tarot? Celestial AI cross-references your palm line measurements with drawn tarot cards and astrological birth details to generate a 5-year trend forecast.
          </p>
        </div>

        <button
          onClick={() => onNavigate('synthesis')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl shadow-lg transition-all shrink-0 flex items-center space-x-2"
        >
          <Compass className="w-4 h-4" />
          <span>View Unified Synthesis</span>
        </button>
      </div>

      <div className="bg-[#0A0A0F] border border-amber-500/25 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="text-emerald-400 font-mono text-[10px] tracking-[0.2em] uppercase">Live human experts · 100% Free</div>
          <h3 className="text-xl font-bold text-white">Video consultation with an astrologer</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            Connect live with master astrologers and palm readers in HD video at zero cost. Share your AI palm or tarot result with the expert when you book.
          </p>
        </div>
        <button
          onClick={() => onNavigate('experts')}
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl transition-all shrink-0"
        >
          Meet an expert
        </button>
      </div>

    </div>
  );
};
