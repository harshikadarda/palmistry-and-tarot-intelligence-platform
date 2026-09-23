import React, { useMemo, useState } from 'react';
import {
  ConsultIntent,
  ConsultTopic,
  ConsultTimeSlot,
  ExpertPresence,
  ExpertProfile,
  ExpertSpecialty,
  UserProfile,
  ConsultationBooking,
  ConsultArtifactRef,
  PalmFeatures,
  TarotReadingSession
} from '../types';
import { LIVE_EXPERTS, generateSlotsForExpert } from '../data/expertsData';
import {
  confirmConsultationBooking,
  getBookingsForEmail,
  getOrCreateTrialAccount,
  verifyTrialPhone,
  generateIcsCalendarBlob
} from '../database/consultDatabase';
import { formatIstSlot } from '../utils/inr';
import { LiveVideoCallRoom } from './LiveVideoCallRoom';
import {
  Calendar,
  CheckCircle2,
  Filter,
  MapPin,
  Star,
  Video,
  Wallet,
  Clock,
  ShieldCheck,
  Zap,
  Phone,
  Layers,
  Hand,
  Compass,
  ArrowRight,
  Download,
  AlertCircle,
  Search,
  Check
} from 'lucide-react';

interface LiveExpertsStudioProps {
  currentUser: UserProfile;
  intent?: ConsultIntent | null;
  currentPalm?: PalmFeatures | null;
  currentTarot?: TarotReadingSession | null;
  onTrialChanged: () => void;
}

const SPECIALTY_FILTERS: { id: ExpertSpecialty | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Astrologers', icon: '🪐' },
  { id: 'palm', label: 'Palmistry & Chiromancy', icon: '✋' },
  { id: 'tarot', label: 'Tarot Masters', icon: '🎴' },
  { id: 'vedic', label: 'Vedic Jyotish', icon: '♈' },
  { id: 'western', label: 'Western Natal', icon: '🌐' }
];

const TOPICS: { id: ConsultTopic; label: string; desc: string }[] = [
  { id: 'career', label: 'Career & Wealth', desc: 'Promotions, business pivots & financial timing' },
  { id: 'love', label: 'Love & Marriage', desc: 'Relationship synastry, soulmates & timing' },
  { id: 'timing', label: 'Dasha & Mahadasha', desc: 'Saturn, Rahu-Ketu transit clarity' },
  { id: 'karmic_remedies', label: 'Karmic Remedies', desc: 'Gemstones, mantras & energization' },
  { id: 'general', label: 'General Life Path', desc: 'Holistic destiny & spiritual calling' }
];

export const LiveExpertsStudio: React.FC<LiveExpertsStudioProps> = ({
  currentUser,
  intent,
  currentPalm,
  currentTarot,
  onTrialChanged
}) => {
  const [specialty, setSpecialty] = useState<ExpertSpecialty | 'all'>(intent?.specialty || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<ExpertProfile | null>(null);
  
  // Booking Drawer Steps
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [selectedSlot, setSelectedSlot] = useState<ConsultTimeSlot | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<ConsultTopic>('career');
  const [attachPalmScan, setAttachPalmScan] = useState<boolean>(true);
  const [attachTarotSpread, setAttachTarotSpread] = useState<boolean>(true);
  
  // Verification state
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  
  // Active Consultation / Room State
  const [activeBookingForCall, setActiveBookingForCall] = useState<ConsultationBooking | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBooking | null>(null);

  const trial = getOrCreateTrialAccount(currentUser.email);
  const bookings = getBookingsForEmail(currentUser.email);

  // Filter Experts
  const filteredExperts = useMemo(() => {
    return LIVE_EXPERTS.filter(e => {
      const matchesSpecialty = specialty === 'all' ? true : e.specialties.includes(specialty);
      const matchesOnline = onlyOnline ? e.presence === 'online' : true;
      const matchesSearch = searchQuery
        ? e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.languages.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      return matchesSpecialty && matchesOnline && matchesSearch;
    });
  }, [specialty, onlyOnline, searchQuery]);

  const slots = selectedExpert ? generateSlotsForExpert(selectedExpert) : [];
  const canUseTrial = true;
  const standardPrice = 0;
  const duePriceInr = 0;

  // Build Attached Artifacts Array
  const compileAttachedArtifacts = (): ConsultArtifactRef[] => {
    const list: ConsultArtifactRef[] = [];
    if (intent?.artifact) {
      list.push(intent.artifact);
    }
    if (attachPalmScan && currentPalm) {
      list.push({
        type: 'palm_scan',
        id: `palm_${currentPalm.scannedAt || Date.now()}`,
        label: `${currentPalm.handType || 'Right'} Hand Palm Analysis`,
        previewSnippet: currentPalm.overviewSummary?.slice(0, 100)
      });
    }
    if (attachTarotSpread && currentTarot) {
      list.push({
        type: 'tarot_session',
        id: currentTarot.id,
        label: currentTarot.spreadTitle,
        previewSnippet: currentTarot.summaryInterpretation?.slice(0, 100)
      });
    }
    return list;
  };

  // Step 1: Open Booking for Expert
  const handleStartBooking = (expert: ExpertProfile, isInstant: boolean = false) => {
    setSelectedExpert(expert);
    setError('');
    const expertSlots = generateSlotsForExpert(expert);
    if (isInstant && expert.presence === 'online') {
      const instantSlot = expertSlots.find(s => s.type === 'instant') || expertSlots[0];
      setSelectedSlot(instantSlot);
      setBookingStep(2);
    } else {
      setSelectedSlot(expertSlots[0] || null);
      setBookingStep(1);
    }
  };

  // Step 3: Complete Booking Confirmation
  const handleConfirmBooking = () => {
    setError('');
    if (!selectedExpert || !selectedSlot) {
      setError('Please select a valid consultation slot.');
      return;
    }

    const { booking } = confirmConsultationBooking({
      seekerEmail: currentUser.email.toLowerCase(),
      seekerName: currentUser.name || 'Seeker',
      expertId: selectedExpert.id,
      expertName: selectedExpert.name,
      expertAvatar: selectedExpert.avatarUrl,
      slot: selectedSlot,
      topic: selectedTopic,
      attachedArtifacts: compileAttachedArtifacts(),
      listPriceInr: 0,
      amountDueInr: 0,
      trialApplied: true,
      durationMinutes: 15
    });

    setConfirmedBooking(booking);
    onTrialChanged();
  };

  // If in active Video Call
  if (activeBookingForCall) {
    return (
      <LiveVideoCallRoom
        booking={activeBookingForCall}
        currentUser={currentUser}
        attachedPalm={currentPalm}
        attachedTarot={currentTarot}
        onLeaveCall={() => setActiveBookingForCall(null)}
        onTrialUpdated={onTrialChanged}
      />
    );
  }

  // Booking Confirmation Screen
  if (confirmedBooking) {
    return (
      <div className="max-w-xl mx-auto bg-[#0A0A0F] border border-emerald-500/40 rounded-3xl p-8 space-y-6 text-center shadow-2xl">
        <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">Booking Confirmed</span>
          <h2 className="text-2xl font-bold text-white">Your Reading is Locked with {confirmedBooking.expertName}</h2>
          <p className="text-xs text-white/60">
            {formatIstSlot(confirmedBooking.slot.startUtc)} IST · Topic: {confirmedBooking.topic.toUpperCase()}
          </p>
        </div>

        <div className="bg-black/50 border border-white/10 rounded-2xl p-4 text-xs space-y-2 text-left">
          <div className="flex justify-between text-white/70">
            <span>Session Duration</span>
            <span className="font-mono text-white">15 Minutes (HD Video)</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Consultation Access</span>
            <span className="font-mono text-emerald-400 font-bold">
              100% Free (Zero Charges)
            </span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Attached Readings</span>
            <span className="text-violet-300 font-semibold">{confirmedBooking.attachedArtifacts.length} Context Scans Attached</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveBookingForCall(confirmedBooking)}
            className="flex-1 py-3.5 bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
          >
            <Video className="w-4 h-4" />
            <span>Launch Live Video Room Now</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              const link = document.createElement('a');
              link.href = generateIcsCalendarBlob(confirmedBooking);
              link.download = `consultation-${confirmedBooking.id}.ics`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Save .ics</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setConfirmedBooking(null);
            setSelectedExpert(null);
            setSelectedSlot(null);
            setBookingStep(1);
          }}
          className="text-[11px] text-white/40 hover:text-white underline pt-2"
        >
          Return to Astrologer Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Hero Header & Trial Counter */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#100D22] via-[#0A0A0F] to-[#150A1A] border border-violet-500/20 rounded-3xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Human Expert Layer
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                ● Live Video Consultations
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-light text-white leading-tight">
              Consult Verified Astrologers & <span className="font-bold bg-gradient-to-r from-amber-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">Palm Masters</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Connect 1-on-1 with master seers in real-time HD video. Your attached AI Palm scans and Tarot spreads are analyzed live to provide astrological remedies and timing forecasts.
            </p>
          </div>

          {/* 100% Free Video Consultations Banner */}
          <div className="bg-black/60 border border-emerald-500/40 rounded-2xl p-5 shrink-0 flex flex-col items-center text-center space-y-2 shadow-xl">
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              100% Free Video Access
            </div>
            <div className="text-2xl font-bold text-emerald-300 font-mono tracking-tight">
              All Calls Free
            </div>
            <div className="text-[11px] text-white/70">
              Unlimited Live Astrologer Sessions
            </div>
            <div className="text-[9px] text-white/40 font-mono border-t border-white/10 pt-1 w-full">
              No Payment Required · HD Video & Voice
            </div>
          </div>
        </div>

        {intent?.artifact && (
          <div className="mt-6 border border-violet-500/40 bg-violet-950/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-violet-200">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Escalated Context: <strong className="text-white">{intent.artifact.label}</strong> is ready to attach.</span>
            </div>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
              Ready for Expert Review
            </span>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Specialty Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          {SPECIALTY_FILTERS.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSpecialty(f.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                specialty === f.id
                  ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-[#0A0A0F] border-white/10 text-white/70 hover:text-white hover:border-white/25'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Live Filter & Search */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOnlyOnline(!onlyOnline)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              onlyOnline
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                : 'bg-[#0A0A0F] border-white/10 text-white/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Online Seers Only</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, city..."
              className="bg-[#0A0A0F] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      {/* Astrologers Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperts.map(expert => {
          const isSelected = selectedExpert?.id === expert.id;
          const acceptsFreeTrial = expert.acceptsTrials && trial.trialRemaining > 0;

          return (
            <div
              key={expert.id}
              className={`bg-[#0A0A0F] border rounded-3xl p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-violet-500 shadow-2xl shadow-violet-950/50 bg-violet-950/20'
                  : 'border-white/10 hover:border-white/25 hover:bg-white/[0.02]'
              }`}
            >
              {/* Top Row: Avatar & Presence */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={expert.avatarUrl}
                        alt={expert.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 shadow-md"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0A0A0F] ${
                          expert.presence === 'online'
                            ? 'bg-emerald-400'
                            : expert.presence === 'busy'
                            ? 'bg-amber-400'
                            : 'bg-white/30'
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{expert.name}</h3>
                      <p className="text-[11px] text-white/50">{expert.title}</p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-300 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-bold">{expert.ratingAvg}</span>
                        <span className="text-white/40">({expert.ratingCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio & Details */}
                <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
                  {expert.bio}
                </p>

                {/* Specialties & Languages */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {expert.specialties.map(s => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono uppercase text-violet-300"
                    >
                      {s}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/50">
                    {expert.experienceYears}+ Yrs Exp
                  </span>
                </div>

                {/* Free Session Pill */}
                <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Free Consultation Eligible
                  </span>
                  <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider">Free</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-sm font-bold text-emerald-400">
                    100% Free Call
                  </div>
                  <div className="text-[9px] text-white/40">15 min video consultation</div>
                </div>

                <div className="flex gap-2">
                  {expert.presence === 'online' ? (
                    <button
                      type="button"
                      onClick={() => handleStartBooking(expert, true)}
                      className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-violet-600 hover:from-emerald-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Instant</span>
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => handleStartBooking(expert, false)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Book</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Booking & Checkout Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-[#0A0A0F] border border-violet-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedExpert.avatarUrl}
                  alt={selectedExpert.name}
                  className="w-10 h-10 rounded-xl object-cover border border-white/10"
                />
                <div>
                  <h3 className="font-bold text-white text-sm">Consult {selectedExpert.name}</h3>
                  <p className="text-[10px] text-white/50">{selectedExpert.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExpert(null)}
                className="text-white/40 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            {/* Step 1: Slot Selection */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Step 1: Choose Consultation Slot (Timezone: IST)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto">
                  {slots.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSlot(s)}
                      className={`p-3 rounded-xl text-left text-xs border transition-all ${
                        selectedSlot?.id === s.id
                          ? 'border-violet-500 bg-violet-950/60 text-white font-bold'
                          : 'border-white/10 bg-black/40 text-white/70 hover:border-white/30'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-mono text-amber-400">
                        {s.type === 'instant' ? '⚡ Instant Connection' : '📅 Scheduled Slot'}
                      </div>
                      <div className="mt-0.5">{formatIstSlot(s.startUtc)} IST</div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setBookingStep(2)}
                  disabled={!selectedSlot}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Proceed to Focus Topic & Context</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Focus Area & Context Attachment */}
            {bookingStep === 2 && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  Step 2: Focus Question & Attach AI Scans
                </div>

                {/* Topic Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] text-white/50 uppercase">Select Primary Topic</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TOPICS.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTopic(t.id)}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          selectedTopic === t.id
                            ? 'border-violet-500 bg-violet-950/60 text-white'
                            : 'border-white/10 bg-black/40 text-white/60 hover:border-white/30'
                        }`}
                      >
                        <div className="text-xs font-bold">{t.label}</div>
                        <div className="text-[10px] text-white/40">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Context Scans Attachment */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="text-[10px] text-white/50 uppercase">Attach Readings for Live Astrologer</label>
                  <div className="space-y-2">
                    {currentPalm && (
                      <label className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-white/10 cursor-pointer">
                        <div className="flex items-center space-x-2 text-xs">
                          <Hand className="w-4 h-4 text-emerald-400" />
                          <span>Attach AI Palm Scan ({currentPalm.handType || 'Right'} Hand)</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={attachPalmScan}
                          onChange={e => setAttachPalmScan(e.target.checked)}
                          className="accent-violet-600 rounded"
                        />
                      </label>
                    )}

                    {currentTarot && (
                      <label className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-white/10 cursor-pointer">
                        <div className="flex items-center space-x-2 text-xs">
                          <Layers className="w-4 h-4 text-amber-400" />
                          <span>Attach Tarot Spread ({currentTarot.spreadTitle})</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={attachTarotSpread}
                          onChange={e => setAttachTarotSpread(e.target.checked)}
                          className="accent-violet-600 rounded"
                        />
                      </label>
                    )}

                    {!currentPalm && !currentTarot && (
                      <p className="text-[11px] text-white/40 italic">
                        No prior readings generated yet. Astrologer will perform a direct fresh reading on the call.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(1)}
                    className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingStep(3)}
                    className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Session Confirmation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Free Consultation Confirmation */}
            {bookingStep === 3 && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Step 3: Confirm Free Consultation Session
                </div>

                {/* Session Breakdown */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-white/70">Consultation Access</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">100% Free</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Selected Astrologer</span>
                    <span className="font-medium text-white">{selectedExpert.name}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Scheduled Timing</span>
                    <span className="font-mono text-amber-300">{selectedSlot ? formatIstSlot(selectedSlot.startUtc) : 'Instant'} IST</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Primary Topic</span>
                    <span className="text-violet-300 font-semibold uppercase font-mono">{selectedTopic}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Session Duration</span>
                    <span className="text-white font-mono">15 Minutes (HD Video)</span>
                  </div>
                  <div className="flex justify-between text-white/70 border-t border-white/10 pt-2">
                    <span>Context Scans</span>
                    <span className="text-white font-medium">
                      {[attachPalmScan && currentPalm ? 'Palm Scan' : null, attachTarotSpread && currentTarot ? 'Tarot Spread' : null].filter(Boolean).join(' + ') || 'Direct live reading'}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-[11px] text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-violet-600 hover:from-emerald-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm Free Consultation Session</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* User Bookings History Drawer */}
      {bookings.length > 0 && (
        <div className="bg-[#0A0A0F] border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              Your Consultation Bookings ({bookings.length})
            </h3>
            <span className="text-[10px] font-mono text-white/50">Stored in account vault</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map(b => (
              <div
                key={b.id}
                className="bg-black/50 border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{b.expertName}</span>
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        b.status === 'completed'
                          ? 'bg-white/10 text-white/60'
                          : 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/50">{formatIstSlot(b.slot.startUtc)} IST</p>
                  <p className="text-[10px] text-violet-300 font-semibold">Topic: {b.topic.toUpperCase()}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveBookingForCall(b)}
                    className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-[11px] font-bold uppercase flex items-center justify-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Room</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generateIcsCalendarBlob(b);
                      link.download = `consultation-${b.id}.ics`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 rounded-xl text-xs"
                    title="Download .ics Calendar Invite"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
