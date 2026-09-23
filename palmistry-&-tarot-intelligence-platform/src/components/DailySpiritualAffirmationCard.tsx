import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, DailySpiritualAffirmation } from '../types';
import { 
  getStoredDailyAffirmation, 
  saveStoredDailyAffirmation, 
  generatePersonalizedAffirmation,
  setDailyAffirmationCompleted,
  getAffirmationStreakCount
} from '../utils/affirmationGenerator';
import { 
  Flame, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  Volume2, 
  Compass, 
  Target, 
  Sun, 
  Moon, 
  Heart, 
  Activity, 
  Wind, 
  Clock, 
  Share2, 
  Award,
  Zap,
  BookOpen,
  ShieldCheck
} from 'lucide-react';

interface DailySpiritualAffirmationCardProps {
  currentUser: UserProfile;
  onOpenProfile?: () => void;
}

export const DailySpiritualAffirmationCard: React.FC<DailySpiritualAffirmationCardProps> = ({
  currentUser,
  onOpenProfile
}) => {
  const [affirmation, setAffirmation] = useState<DailySpiritualAffirmation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showBreathingGuide, setShowBreathingGuide] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [streak, setStreak] = useState<number>(() => getAffirmationStreakCount(currentUser.email));
  const [timeRemainingText, setTimeRemainingText] = useState<string>('');

  // Calculate remaining time until 24-hour cycle reset
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diffMs = endOfDay.getTime() - now.getTime();
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemainingText(`${hours}h ${minutes}m`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch or Load from cache for current user & date
  const fetchAffirmation = async (forceRefresh: boolean = false) => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    if (!forceRefresh) {
      const cached = getStoredDailyAffirmation(currentUser.email);
      if (cached && cached.affirmation) {
        setAffirmation(cached.affirmation);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/ai/daily-affirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: currentUser,
          date: today,
          forceSeed: forceRefresh ? Date.now() : undefined
        })
      });

      const data = await res.json();
      if (data.success && data.affirmation) {
        setAffirmation(data.affirmation);
        saveStoredDailyAffirmation(currentUser.email, data.affirmation);
      } else {
        const fallback = generatePersonalizedAffirmation(
          currentUser, 
          today, 
          forceRefresh ? Date.now() : undefined
        );
        setAffirmation(fallback);
        saveStoredDailyAffirmation(currentUser.email, fallback);
      }
    } catch (err) {
      console.warn('Daily affirmation API error, using local generator:', err);
      const fallback = generatePersonalizedAffirmation(
        currentUser, 
        today, 
        forceRefresh ? Date.now() : undefined
      );
      setAffirmation(fallback);
      saveStoredDailyAffirmation(currentUser.email, fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffirmation();
    setStreak(getAffirmationStreakCount(currentUser.email));
  }, [currentUser.email, currentUser.spiritualGoals]);

  // Handle Complete / Meditate
  const handleToggleComplete = () => {
    if (!affirmation) return;
    const newState = !affirmation.completed;
    const updated = { ...affirmation, completed: newState };
    setAffirmation(updated);
    setDailyAffirmationCompleted(currentUser.email, newState);
    setStreak(getAffirmationStreakCount(currentUser.email));
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (!affirmation) return;
    const textToCopy = `Today's Celestial Spiritual Affirmation\n\n"${affirmation.affirmation}"\n\n🙏 Mantra: ${affirmation.mantra}\n🎯 Goal Alignment: ${affirmation.targetedGoal}\n🔮 Chakra: ${affirmation.chakraAlignment}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Text to Speech
  const handleSpeak = () => {
    if (!affirmation) return;
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(
        `Today's spiritual affirmation: ${affirmation.affirmation}. Sacred mantra: ${affirmation.mantra}. Suggested reflection: ${affirmation.contemplation}`
      );
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Breathing Guide Loop
  useEffect(() => {
    if (!showBreathingGuide) return;
    const phases: Array<'Inhale' | 'Hold' | 'Exhale'> = ['Inhale', 'Hold', 'Exhale'];
    let currentIdx = 0;

    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % phases.length;
      setBreathPhase(phases[currentIdx]);
    }, 4000);

    return () => clearInterval(interval);
  }, [showBreathingGuide]);

  if (!affirmation && loading) {
    return (
      <div className="bg-[#0D0B18] border border-violet-500/20 rounded-3xl p-8 text-center text-white/50 animate-pulse flex items-center justify-center space-x-3">
        <RefreshCw className="w-5 h-5 animate-spin text-violet-400" />
        <span className="text-sm font-mono uppercase tracking-widest">Attuning to your spiritual frequency...</span>
      </div>
    );
  }

  if (!affirmation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#130E26] via-[#0B0A14] to-[#07060B] border border-violet-500/30 p-6 sm:p-8 shadow-[0_10px_35px_rgba(139,92,246,0.15)] text-[#E0E0E6]"
    >
      {/* Ambient background glow points */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Strip */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400/20 to-violet-600/30 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.25)]">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                Daily Spiritual Affirmation
              </span>
              <span className="text-[9px] font-mono bg-violet-950/80 text-violet-300 px-2 py-0.5 rounded-full border border-violet-700/50">
                24H CYCLE
              </span>
            </div>
            <div className="text-[11px] text-white/50 flex items-center space-x-2 mt-0.5 font-mono">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Next refresh: {timeRemainingText}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls (Audio, Copy, Recalibrate) */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={handleSpeak}
            title={isPlayingAudio ? "Stop Reading" : "Listen to Affirmation"}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center space-x-1 ${
              isPlayingAudio
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[10px] uppercase font-mono">{isPlayingAudio ? 'Listening...' : 'Voice'}</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copy Affirmation"
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-xl transition-all text-xs flex items-center space-x-1"
          >
            <Copy className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[10px] uppercase font-mono">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={() => fetchAffirmation(true)}
            disabled={loading}
            title="Recalibrate for Today"
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-xl transition-all text-xs flex items-center space-x-1 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline text-[10px] uppercase font-mono">Recalibrate</span>
          </button>
        </div>
      </div>

      {/* Goal & Astrological Alignment Anchor Banner */}
      <div className="relative z-10 my-4 flex flex-wrap items-center gap-2 text-xs">
        <div className="px-3 py-1 bg-violet-950/40 border border-violet-500/30 text-violet-300 rounded-lg flex items-center space-x-1.5 font-medium">
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span>Attuned to: <strong className="text-white">{affirmation.targetedGoal}</strong></span>
        </div>

        {affirmation.zodiacAttunement && (
          <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg flex items-center space-x-1 font-mono text-[11px]">
            <Sun className="w-3 h-3 text-amber-400" />
            <span>{affirmation.zodiacAttunement} Energy</span>
          </div>
        )}

        <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg flex items-center space-x-1 font-mono text-[11px]">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>{affirmation.chakraAlignment}</span>
        </div>

        {onOpenProfile && (
          <button
            onClick={onOpenProfile}
            className="text-[11px] text-white/40 hover:text-violet-300 underline font-mono ml-auto transition-colors"
          >
            Adjust Goals
          </button>
        )}
      </div>

      {/* Main Affirmation Quote Box */}
      <div className="relative z-10 py-3 space-y-4">
        <div className="relative">
          <span className="absolute -top-4 -left-3 text-5xl font-serif text-white/10 select-none">“</span>
          <p className="text-lg sm:text-xl md:text-2xl font-light text-white italic serif leading-relaxed tracking-wide text-center sm:text-left px-2 sm:px-4">
            {affirmation.affirmation}
          </p>
          <span className="absolute -bottom-6 -right-1 text-5xl font-serif text-white/10 select-none">”</span>
        </div>

        {/* Sacred Mantra Strip */}
        <div className="p-3.5 bg-black/50 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              SACRED MANTRA
            </span>
            <span className="text-xs font-mono font-bold text-amber-200 tracking-wider">
              {affirmation.mantra}
            </span>
          </div>
          <span className="text-[10px] font-mono text-white/40">Repeat 3x with deep diaphragmatic breath</span>
        </div>
      </div>

      {/* Contemplative Reflection & Grounding Action */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
        <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
          <div className="font-bold text-violet-300 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
            <BookOpen className="w-3.5 h-3.5 text-violet-400" />
            <span>Daily Contemplative Reflection</span>
          </div>
          <p className="text-white/70 leading-relaxed text-[11px] sm:text-xs">
            {affirmation.contemplation}
          </p>
        </div>

        <div className="p-3.5 bg-emerald-950/20 rounded-xl border border-emerald-500/20 space-y-1">
          <div className="font-bold text-emerald-400 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Today's Grounding Micro-Ritual</span>
          </div>
          <p className="text-emerald-200/90 leading-relaxed text-[11px] sm:text-xs">
            {affirmation.suggestedAction}
          </p>
        </div>
      </div>

      {/* Interactive Meditation & Breathing Footer */}
      <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Breathing Guide Button */}
        <button
          onClick={() => setShowBreathingGuide(!showBreathingGuide)}
          className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-all ${
            showBreathingGuide
              ? 'bg-violet-600/30 border-violet-500 text-violet-200 shadow-md'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white'
          }`}
        >
          <Wind className={`w-3.5 h-3.5 ${showBreathingGuide ? 'animate-spin' : ''}`} />
          <span>{showBreathingGuide ? 'Hide Breath Anchor' : '1-Min Guided Breath Anchor'}</span>
        </button>

        {/* Complete Today's Affirmation Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleToggleComplete}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center space-x-2 shadow-lg ${
            affirmation.completed
              ? 'bg-emerald-600 text-white border border-emerald-400'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${affirmation.completed ? 'text-white' : 'text-black'}`} />
          <span>{affirmation.completed ? 'Meditation Completed for Today' : 'Anchor & Complete Meditation'}</span>
        </motion.button>
      </div>

      {/* Guided Breathing Overlay / Drawer */}
      <AnimatePresence>
        {showBreathingGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 mt-4 p-4 bg-black/70 border border-violet-500/30 rounded-2xl flex flex-col items-center justify-center space-y-3 text-center"
          >
            <div className="text-[10px] font-mono uppercase text-violet-400 tracking-[0.2em]">
              Somatic Breath Entrainment (4-4-4 Cycle)
            </div>

            <motion.div
              animate={{
                scale: breathPhase === 'Inhale' ? 1.35 : breathPhase === 'Hold' ? 1.35 : 0.85,
                borderColor: breathPhase === 'Inhale' ? '#A78BFA' : breathPhase === 'Hold' ? '#FBBF24' : '#34D399'
              }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="w-24 h-24 rounded-full border-4 border-violet-400 bg-violet-600/10 flex items-center justify-center shadow-[0_0_25px_rgba(167,139,250,0.3)]"
            >
              <span className="font-bold text-sm uppercase text-white font-mono tracking-wider">
                {breathPhase}
              </span>
            </motion.div>

            <p className="text-xs text-white/70 max-w-sm">
              As you {breathPhase.toLowerCase()}, silently repeat: <span className="text-amber-300 font-semibold italic font-serif">"{affirmation.affirmation.slice(0, 50)}..."</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
