import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ConsultationBooking,
  UserProfile,
  PalmFeatures,
  TarotReadingSession,
  AstrologerRemedy,
  InCallChatMessage
} from '../types';
import {
  extendConsultationBooking,
  completeConsultationSession,
  handleAstrologerNoShow,
  generateIcsCalendarBlob
} from '../database/consultDatabase';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  Clock,
  PlusCircle,
  Layers,
  Hand,
  MessageSquare,
  FileText,
  Send,
  Star,
  Download,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Award,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
  Radio,
  Play,
  Compass,
  Zap,
  CheckCircle2,
  Volume1,
  Sparkles,
  Check,
  Copy,
  Calendar as CalendarIcon
} from 'lucide-react';

interface LiveVideoCallRoomProps {
  booking: ConsultationBooking;
  currentUser: UserProfile;
  attachedPalm?: PalmFeatures | null;
  attachedTarot?: TarotReadingSession | null;
  onLeaveCall: () => void;
  onTrialUpdated: () => void;
}

export const FALLBACK_PALM_REPORT: PalmFeatures = {
  handType: 'Fire',
  primaryMount: 'Mount of Jupiter',
  detectionConfidence: 0.96,
  landmarksCount: 21,
  overviewSummary: 'Deeply etched, unbroken Life Line curving broadly around the Mount of Venus, paired with an ambitious writer’s fork on the Head Line denoting dual strategic intellect and creative intuition.',
  lifeLine: {
    name: 'Life Line',
    length: 'Long',
    quality: 'Clear',
    interpretation: 'Robust vitality trajectory indicating enduring physical stamina and rapid recuperation.',
    confidence: 0.95
  },
  headLine: {
    name: 'Head Line',
    length: 'Long',
    quality: 'Forked',
    interpretation: 'Dual analytical cognition: acute business discernment balanced by imaginative vision.',
    confidence: 0.93
  },
  heartLine: {
    name: 'Heart Line',
    length: 'Long',
    quality: 'Clear',
    interpretation: 'Warm emotional sincerity, high devotion in partnerships, and grounded vulnerability.',
    confidence: 0.92
  },
  fateLine: {
    name: 'Fate Line',
    length: 'Medium',
    quality: 'Clear',
    interpretation: 'Steadfast career determination with ascending clarity.',
    confidence: 0.90
  },
  sunLine: {
    name: 'Sun Line',
    length: 'Medium',
    quality: 'Clear',
    interpretation: 'Artistic vitality and public reputation.',
    confidence: 0.88
  },
  fingerStructure: {
    thumbFlexibility: 'Flexible',
    indexLength: 'Long & Straight',
    ringToIndexRatio: '1:1 Balanced'
  },
  mounts: {
    jupiter: 'Prominently elevated (Natural leadership & high integrity)',
    apollo: 'Well-defined (Creative recognition & financial abundance)',
    venus: 'Full & radiant (Deep capacity for empathy and vitality)',
    saturn: 'Harmonious (Steadfast discipline through karmic cycles)'
  }
};

export const FALLBACK_TAROT_REPORT: TarotReadingSession = {
  id: 'session_tarot_live_ref',
  spreadId: 'three_card_karmic',
  spreadType: 'three_card',
  spreadTitle: 'Three-Card Cosmic Inflection Spread',
  aiInterpretation: 'The cards reveal that recent bottlenecks were clearing karmic clutter to make way for a major breakthrough. Through focused intent, decisive opportunities align within your next planetary transit.',
  summaryInterpretation: 'The cards reveal that recent bottlenecks were clearing karmic clutter to make way for a major breakthrough. Through focused intent, decisive opportunities align within your next planetary transit.',
  createdAt: '2025-01-01T00:00:00.000Z',
  drawnCards: [
    {
      positionName: 'Foundation / Core Energy',
      positionMeaning: 'Root cause and grounding reality',
      isReversed: false,
      card: {
        id: 'the_magician',
        name: 'The Magician',
        number: 1,
        arcana: 'Major',
        keywords: ['Manifestation', 'Resourcefulness', 'Willpower', 'Creation'],
        meaningUpright: 'Direct mastery of all elemental forces to manifest destiny.',
        meaningReversed: 'Untapped potential, blockages in manifestation.',
        description: 'The Magician bridges spiritual potential into material reality.',
        element: 'Air',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80'
      }
    },
    {
      positionName: 'Present Turning Point',
      positionMeaning: 'Active inflection energy',
      isReversed: false,
      card: {
        id: 'wheel_of_fortune',
        name: 'The Wheel of Fortune',
        number: 10,
        arcana: 'Major',
        keywords: ['Destiny Shift', 'Cycles', 'Good Karma', 'Pivot Point'],
        meaningUpright: 'A pivotal karmic pivot opening auspicious horizons.',
        meaningReversed: 'Resistance to cyclical transitions.',
        description: 'The cosmic wheel turns in your favor, bringing sudden favorable alignments.',
        element: 'Fire',
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80'
      }
    },
    {
      positionName: 'Outcome & Highest Potential',
      positionMeaning: 'Culmination trajectory',
      isReversed: false,
      card: {
        id: 'the_star',
        name: 'The Star',
        number: 17,
        arcana: 'Major',
        keywords: ['Hope', 'Inspiration', 'Serenity', 'Spiritual Clarity'],
        meaningUpright: 'Deep spiritual alignment, emotional renewal, and triumphant peace.',
        meaningReversed: 'Discouragement, need for renewal of trust.',
        description: 'Luminous inspiration offering renewal and unwavering peace.',
        element: 'Air',
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80'
      }
    }
  ]
};
FALLBACK_TAROT_REPORT.cards = FALLBACK_TAROT_REPORT.drawnCards;

const DEFAULT_REMEDIES: AstrologerRemedy[] = [
  {
    id: 'rem_1',
    type: 'gemstone',
    title: 'Natural Yellow Sapphire (Pukhraj)',
    planetOrSign: 'Jupiter (Brihaspati)',
    description: 'Strengthens Mount Jupiter and clears Saturnian delays in career & higher learning.',
    instructions: 'Wear in gold or punch-dhatu on the index finger of the right hand on a Thursday morning at sunrise.'
  },
  {
    id: 'rem_2',
    type: 'mantra',
    title: 'Brihaspati Gayatri & Maha Mrityunjaya Japa',
    planetOrSign: 'Planetary Harmony',
    description: 'Calms transit tensions and establishes psychic equilibrium for the Life Line.',
    instructions: 'Chant 108 times at dawn facing East during the waxing moon phase with focused intent.'
  },
  {
    id: 'rem_3',
    type: 'tarot_meditation',
    title: 'The Star / Ace of Cups Archetypal Meditation',
    planetOrSign: 'Elemental Water',
    description: 'Realigns emotional turbulence revealed in the Three-Card spread.',
    instructions: 'Spend 5 minutes before sleep visualizing violet healing light flowing into the palm center.'
  }
];

/**
 * Shared AudioContext singleton to avoid repeated creation and browser stalling
 */
let sharedAudioCtx: AudioContext | null = null;

const playSingingChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    const ctx = sharedAudioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz transformation frequency
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
    // ignore
  }
};

/**
 * Pre-cached SpeechSynthesis Voice picker
 */
let cachedVoice: SpeechSynthesisVoice | null = null;

const getAstrologerVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  const indianVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India') || v.name.includes('Hindi'));
  const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Samantha')));
  cachedVoice = indianVoice || englishVoice || voices[0] || null;
  return cachedVoice;
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    getAstrologerVoice();
  };
}

export const LiveVideoCallRoom: React.FC<LiveVideoCallRoomProps> = ({
  booking: initialBooking,
  currentUser,
  attachedPalm,
  attachedTarot,
  onLeaveCall,
  onTrialUpdated
}) => {
  const [booking, setBooking] = useState<ConsultationBooking>(initialBooking);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isAstrologerAudioMuted, setIsAstrologerAudioMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'notes' | 'chat' | 'remedies'>('telemetry');
  
  // Timer State (15 mins = 900 seconds)
  const initialSeconds = (booking.durationMinutes || 15) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const [isCallActive, setIsCallActive] = useState(true);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [extensionStatus, setExtensionStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Astrologer Presence & Video simulation
  const [astrologerStatus, setAstrologerStatus] = useState<'connecting' | 'connected' | 'delayed'>('connected');
  const [astrologerSpeaking, setAstrologerSpeaking] = useState(false);
  const [isAstrologerThinking, setIsAstrologerThinking] = useState(false);
  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [lastSpokenText, setLastSpokenText] = useState<string>('');

  // User Live Voice / Microphone Recognition State
  const [userInterimSpeech, setUserInterimSpeech] = useState<string>('');
  const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [micStatusNotice, setMicStatusNotice] = useState<string>('Microphone ready · Listening live');
  
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const safetyEndTimerRef = useRef<any>(null);
  const latestSpeechRef = useRef<string>('');
  const isProcessingRef = useRef<boolean>(false);
  const astrologerSpeakingRef = useRef<boolean>(false);

  // Chat & Notes state
  const [chatMessages, setChatMessages] = useState<InCallChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'system',
      senderName: 'System',
      text: 'Encrypted peer-to-peer session initiated. Astrologer has received your attached readings.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'msg_2',
      sender: 'expert',
      senderName: booking.expertName,
      text: `Namaste ${currentUser.name || 'Seeker'}, I am reviewing your chart. Let us examine your question on ${booking.topic.toUpperCase()}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  // Active Report References (Ensures reports are never empty)
  const activePalm: PalmFeatures = attachedPalm || FALLBACK_PALM_REPORT;
  const activeTarot: TarotReadingSession = attachedTarot || FALLBACK_TAROT_REPORT;

  // Interactive Remedies State
  const [appliedRemedies, setAppliedRemedies] = useState<Set<string>>(new Set(['rem_1']));
  const [japaCount, setJapaCount] = useState<number>(27);
  const [copiedRemedyId, setCopiedRemedyId] = useState<string | null>(null);
  const [activeRemedyId, setActiveRemedyId] = useState<string | null>('rem_1');
  const [summaryRefreshTick, setSummaryRefreshTick] = useState<number>(0);
  const [isSummaryUpdating, setIsSummaryUpdating] = useState<boolean>(false);

  // Turn counter ref for cycling different report answers
  const topicTurnRef = useRef<Record<string, number>>({});

  // Chat & Notes state
  const [chatInput, setChatInput] = useState('');
  const [liveNotes, setLiveNotes] = useState<string>(
    `• Consultation Topic: ${booking.topic.toUpperCase()}\n• Primary Observation: Strong Jupiter mount resonance with minor Saturn transit friction.\n• Line Quality: Clear Life Line trajectory with forked Head Line indicating dual creative and analytical aptitude.`
  );

  // Post-Session Summary state
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSummarySubmitted, setIsSummarySubmitted] = useState(false);

  // Video Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * Generates rich, report-driven astrologer answers cycling through different perspectives
   * Returns both fullText (for permanent chat record) and punchy speechText (for immediate voice)
   */
  const generateAstrologerAnswer = useCallback((query: string, explicitTopic?: string): { fullText: string; speechText: string } => {
    const q = query.toLowerCase();
    const name = currentUser.name || 'Seeker';
    const zodiac = currentUser.zodiacSign ? `${currentUser.zodiacSign}` : 'your astrological archetype';

    const getTurn = (key: string) => {
      const turn = topicTurnRef.current[key] || 0;
      topicTurnRef.current[key] = turn + 1;
      return turn;
    };

    // 1. Palmistry Insights (4 distinct angles based on the report)
    if (explicitTopic === 'palm' || q.includes('palm') || q.includes('hand') || q.includes('line') || q.includes('mount')) {
      const turn = getTurn('palm') % 4;
      if (turn === 0) {
        return {
          fullText: `Looking closely at your palm report, ${name}, your Life Line is ${activePalm.lifeLine?.length || 'deep and unbroken'}, sweeping broadly around the Mount of Venus. Chiromantically, this indicates robust physical vitality, strong stamina, and rapid recuperation from stressful phases.`,
          speechText: `Looking at your palm report, ${name}, your Life Line shows robust physical vitality, strong stamina, and rapid recuperation.`
        };
      } else if (turn === 1) {
        return {
          fullText: `Analyzing your Head Line from your scan, I see a ${activePalm.headLine?.quality || 'clear path with an intuitive branch toward Mount Luna'}. This is the Strategist’s Fork—it gives you dual talents: sharp logical decision-making paired with vivid creative instinct. Trust your analytical instincts.`,
          speechText: `Analyzing your Head Line, you have the Strategist’s Fork. This gives you sharp logical discernment paired with vivid creative instinct.`
        };
      } else if (turn === 2) {
        return {
          fullText: `Examining your Heart Line from the telemetry, it curves gracefully toward ${activePalm.primaryMount || 'the Mount of Jupiter'}. This indicates deep emotional loyalty, high moral integrity, and sincere warmth in relationships. You flourish when you communicate your authentic feelings.`,
          speechText: `Your Heart Line reaches toward the Mount of Jupiter, signifying high moral integrity, sincere emotional warmth, and deep loyalty in partnerships.`
        };
      } else {
        return {
          fullText: `Your hand disposition displays a ${activePalm.handType || 'Fire'} element signature with a prominent Mount of Jupiter. In Vedic Hastarekha, this indicates innate leadership authority, high ambition, and the ability to inspire trust in those around you.`,
          speechText: `Your hand has a ${activePalm.handType || 'Fire'} element signature with a prominent Jupiter Mount, showing innate leadership authority and high ambition.`
        };
      }
    }

    // 2. Tarot Spread Insights (4 distinct angles based on the report)
    if (explicitTopic === 'tarot' || q.includes('tarot') || q.includes('card') || q.includes('spread')) {
      const turn = getTurn('tarot') % 4;
      const cardsList = activeTarot.drawnCards || activeTarot.cards || [];
      const card1 = cardsList[0]?.card?.name || 'The Magician';
      const card2 = cardsList[1]?.card?.name || 'The Wheel of Fortune';
      const card3 = cardsList[2]?.card?.name || 'The Star';

      if (turn === 0) {
        return {
          fullText: `In your ${activeTarot.spreadTitle}, the foundation card is ${card1}. This Major Arcana energy emphasizes that you already possess all the tools, resources, and clarity required to initiate your next breakthrough. Focus your intent on one decisive priority.`,
          speechText: `In your Tarot spread, ${card1} is your foundation card. You already possess all the tools and clarity required for your next breakthrough.`
        };
      } else if (turn === 1) {
        return {
          fullText: `Looking at your second card, ${card2}, the cosmic energy signifies a pivotal karmic turning point. Situations that felt stagnant or repetitive are breaking open. New professional and personal doors will unlock as this month’s transit completes.`,
          speechText: `Your second card is ${card2}, signaling a pivotal karmic pivot. Stagnant situations are clearing, unlocking auspicious new doors.`
        };
      } else if (turn === 2) {
        return {
          fullText: `Your outcome card is ${card3}—one of the most luminous and auspicious omens in the Tarot deck. It promises spiritual renewal, deep emotional peace, and verified success after a period of dedication.`,
          speechText: `Your outcome card is ${card3}, bringing luminous promise of spiritual renewal, deep emotional peace, and verified success.`
        };
      } else {
        return {
          fullText: `Synthesizing your active spread: ${activeTarot.aiInterpretation || activeTarot.summaryInterpretation || 'Auspicious transitions aligned with destiny'}. The cards counsel disciplined faith—what seemed like obstacles were simply clearing away obsolete energetic clutter.`,
          speechText: `The cards reveal that recent hurdles were simply clearing away obsolete clutter to make way for your next auspicious chapter.`
        };
      }
    }

    // 3. Career & Wealth (3 distinct angles)
    if (explicitTopic === 'career' || q.includes('career') || q.includes('job') || q.includes('business') || q.includes('money') || q.includes('wealth') || q.includes('finance')) {
      const turn = getTurn('career') % 3;
      if (turn === 0) {
        return {
          fullText: `Aligning your Fate Line and Mount Apollo from the report, ${name}, a major professional turning point aligns within your next lunar transit. Channel your analytical drive into high-impact initiatives, as positive financial progression is strongly indicated.`,
          speechText: `Aligning your Fate Line and Mount Apollo, a major professional turning point aligns in your next transit. High-impact initiatives will yield strong progression.`
        };
      } else if (turn === 1) {
        return {
          fullText: `In career negotiations, your Head Line fork gives you a significant advantage in strategic negotiation. The astrological transits indicate that an opportunity for recognition or elevated responsibility is opening up this quarter.`,
          speechText: `Your Head Line gives you a powerful advantage in strategic negotiation. Significant professional recognition is opening up this quarter.`
        };
      } else {
        return {
          fullText: `Financially, your palm indicators show steady wealth retention along the Mercury line. Focusing on collaborative ventures rather than carrying burdens alone will yield the greatest material dividends.`,
          speechText: `Financially, your palm indicators show steady wealth retention. Focus on collaborative ventures for the highest material dividends.`
        };
      }
    }

    // 4. Love & Relationships (3 distinct angles)
    if (explicitTopic === 'love' || q.includes('love') || q.includes('marriage') || q.includes('relationship') || q.includes('partner') || q.includes('soulmate')) {
      const turn = getTurn('love') % 3;
      if (turn === 0) {
        return {
          fullText: `Examining your Heart Line, ${name}, I see great emotional depth, sincerity, and romantic loyalty. In your reading, the energy highlights open communication and trusting vulnerability. Harmonious relationship synastry is clearing ahead.`,
          speechText: `Your Heart Line shows warmth and grounded commitment. Open communication will bring a period of harmonious deepening in relationships.`
        };
      } else if (turn === 1) {
        return {
          fullText: `In terms of partnership timing, your Venusian aspects are entering a restorative phase over the next two months. Releasing lingering resentments from the past will invite deeply authentic soul connections.`,
          speechText: `Your elevated Mount of Venus reflects deep capacity for love. Maintaining healthy boundaries will keep your empathy vibrant and nourished.`
        };
      } else {
        return {
          fullText: `Your relationship indicators show that balance is key right now. Honor your personal boundaries while allowing trusted companionship to flourish without fear.`,
          speechText: `Your relationship indicators show balance is key right now. Honor personal boundaries while welcoming authentic companionship.`
        };
      }
    }

    // 5. Planetary Timing & Dasha (2 distinct angles)
    if (explicitTopic === 'dasha' || q.includes('timing') || q.includes('dasha') || q.includes('transit') || q.includes('saturn') || q.includes('rahu')) {
      const turn = getTurn('dasha') % 2;
      if (turn === 0) {
        return {
          fullText: `Regarding your astrological Dasha cycle, you are navigating an influential transit that rewards steady discipline over hurried shortcuts. Noticeable clarity and favorable momentum emerge right after the upcoming new moon.`,
          speechText: `Your current transit rewards steady discipline over shortcuts. Favorable clarity and momentum will emerge right after the new moon.`
        };
      } else {
        return {
          fullText: `Saturn’s transit aspects are testing your foundational systems to ensure long-term stability. What you build with patience and discernment now will stand secure for years to come.`,
          speechText: `Saturn's transit is solidifying your foundations. What you build with patience and discernment now will stand secure for years.`
        };
      }
    }

    // 6. Remedies (3 distinct angles)
    if (explicitTopic === 'remedies' || q.includes('remedy') || q.includes('gemstone') || q.includes('mantra') || q.includes('ritual') || q.includes('cure')) {
      const turn = getTurn('remedies') % 3;
      if (turn === 0) {
        return {
          fullText: `For your chart and planetary alignment, I prescribe wearing a natural Yellow Sapphire in gold on your right index finger on Thursday morning at sunrise. This directly energizes your Mount of Jupiter and dissolves karmic delays.`,
          speechText: `For your chart, I prescribe Yellow Sapphire on your right index finger to energize your Jupiter Mount and dissolve karmic delays.`
        };
      } else if (turn === 1) {
        return {
          fullText: `To clear mental fatigue and fortify your Life Line aura, practice 108 repetitions of the Brihaspati Gayatri & Maha Mrityunjaya Japa at sunrise facing East. You can use the 1-click counter in the Remedies tab.`,
          speechText: `To clear mental fatigue and fortify your Life Line aura, practice Brihaspati Gayatri Japa at sunrise. Use the 1-click counter in Remedies.`
        };
      } else {
        return {
          fullText: `I have also prescribed The Star archetypal meditation in your Remedies tab. Spending 5 minutes visualizing violet healing light into your palm center before sleep will harmonize your emotional equilibrium.`,
          speechText: `I have prescribed The Star meditation in your Remedies tab. Five minutes visualizing healing violet light will harmonize your emotional balance.`
        };
      }
    }

    // 7. Life Purpose (2 distinct angles)
    if (explicitTopic === 'purpose' || q.includes('purpose') || q.includes('calling') || q.includes('destiny') || q.includes('dharma')) {
      const turn = getTurn('purpose') % 2;
      if (turn === 0) {
        return {
          fullText: `Your palm structure and astrological archetype show that your true calling bridges mentorship, strategic leadership, and creative expression. You find deepest fulfillment when empowering others through your specialized knowledge.`,
          speechText: `Your palm structure reveals your calling bridges mentorship and strategic leadership. You find deepest fulfillment empowering others.`
        };
      } else {
        return {
          fullText: `Your astrological indicators emphasize that your life path is rooted in transformation. Trust your inner compass—the hurdles you have navigated are the exact foundation for your future mastery.`,
          speechText: `Your astrological indicators show a destiny of transformation. The hurdles you have navigated are the foundation of your future mastery.`
        };
      }
    }

    // Default contextual replies
    return {
      fullText: `I hear your question clearly, ${name}. Aligning your ${zodiac} archetype with your palm scan, the path ahead demands steady patience followed by bold, decisive action.`,
      speechText: `I hear your question clearly, ${name}. Aligning your archetype with your readings, the path ahead rewards steady patience and bold, decisive action.`
    };
  }, [activePalm, activeTarot, currentUser.name, currentUser.zodiacSign]);

  /**
   * Fast, optimized Spoken Astrologer Voice Function with cached voice and zero queue delay
   */
  const speakAstrologerVoice = useCallback((textToSpeak: string, chime: boolean = false) => {
    setLastSpokenText(textToSpeak);
    setCurrentCaption(textToSpeak);

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAstrologerSpeaking(false);
      astrologerSpeakingRef.current = false;
      setIsAstrologerThinking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      if (safetyEndTimerRef.current) {
        clearTimeout(safetyEndTimerRef.current);
      }

      if (isAstrologerAudioMuted) {
        setAstrologerSpeaking(false);
        astrologerSpeakingRef.current = false;
        setIsAstrologerThinking(false);
        isProcessingRef.current = false;
        return;
      }

      if (chime) {
        playSingingChime();
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      (window as any).__lastUtterance = utterance;

      const voice = getAstrologerVoice();
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = 'en-US';
      utterance.rate = 1.08; // Responsive, crisp, natural conversational cadence
      utterance.pitch = 1.02;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsAstrologerThinking(false);
        setAstrologerSpeaking(true);
        astrologerSpeakingRef.current = true;
        setCurrentCaption(textToSpeak);
      };

      utterance.onend = () => {
        setAstrologerSpeaking(false);
        astrologerSpeakingRef.current = false;
        setIsAstrologerThinking(false);
        isProcessingRef.current = false;
      };

      utterance.onerror = (e) => {
        console.warn('[SpeechSynthesis] Event notice:', e);
        setAstrologerSpeaking(false);
        astrologerSpeakingRef.current = false;
        setIsAstrologerThinking(false);
        isProcessingRef.current = false;
      };

      const estimatedDurationMs = Math.max(2000, textToSpeak.length * 65);
      safetyEndTimerRef.current = setTimeout(() => {
        setAstrologerSpeaking(false);
        astrologerSpeakingRef.current = false;
        setIsAstrologerThinking(false);
        isProcessingRef.current = false;
      }, estimatedDurationMs);

      // Microtask buffer to prevent Chromium cancel deadlock
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn('[SpeechSynthesis] Speak error:', err);
          setAstrologerSpeaking(false);
          astrologerSpeakingRef.current = false;
          setIsAstrologerThinking(false);
          isProcessingRef.current = false;
        }
      }, 15);
    } catch (err) {
      console.warn('[SpeechSynthesis] Exception:', err);
      setAstrologerSpeaking(false);
      astrologerSpeakingRef.current = false;
      setIsAstrologerThinking(false);
      isProcessingRef.current = false;
    }
  }, [isAstrologerAudioMuted]);

  /**
   * Fast, ultra-responsive Quick Ask trigger that cancels prior speech immediately
   * and provides a dynamic answer drawn from the report with instant execution.
   */
  const askAstrologerQuick = useCallback((topicCategory: 'palm' | 'tarot' | 'career' | 'love' | 'remedies' | 'dasha' | 'purpose') => {
    // 1. Immediately cancel any prior audio speech
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (safetyEndTimerRef.current) {
      clearTimeout(safetyEndTimerRef.current);
    }
    isProcessingRef.current = false;
    setUserInterimSpeech('');
    setIsUserSpeaking(false);

    // 2. Play subtle celestial wake chime
    playSingingChime();

    // 3. Construct contextual user inquiry label
    const questionLabels: Record<string, string> = {
      palm: 'Can you analyze the specific lines and mounts from my palm scan report?',
      tarot: 'What do the cards in my Tarot spread reveal about my next chapter?',
      career: 'What does my report forecast for my career, wealth, and promotions?',
      love: 'How does my Heart Line and reading align with love and relationship synastry?',
      dasha: 'What planetary transit or Dasha timing should I be mindful of?',
      remedies: 'Which personalized gemstones and mantras are recommended for my chart?',
      purpose: 'What does my combined Palm and Tarot reading indicate about my soul purpose?'
    };
    const userQueryText = questionLabels[topicCategory] || `Please guide me on ${topicCategory}.`;

    // 4. Generate distinct report-based answer immediately
    const astrologerReply = generateAstrologerAnswer(userQueryText, topicCategory);

    // 5. Post both User question and Astrologer reply to chat synchronously in ONE update
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: InCallChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'seeker',
      senderName: currentUser.name || 'You',
      text: userQueryText,
      timestamp: nowTime
    };
    const replyMsg: InCallChatMessage = {
      id: `exp_${Date.now() + 1}`,
      sender: 'expert',
      senderName: booking.expertName,
      text: astrologerReply.fullText,
      timestamp: nowTime
    };

    setChatMessages(prev => [...prev, userMsg, replyMsg]);
    setCurrentCaption(astrologerReply.speechText);
    setIsAstrologerThinking(true);

    // 6. Speak the punchy, direct response with zero delay
    speakAstrologerVoice(astrologerReply.speechText, false);
  }, [booking.expertName, currentUser.name, generateAstrologerAnswer, speakAstrologerVoice]);

  /**
   * Process a spoken question from the seeker and trigger the Astrologer's voice reply fast
   */
  const processUserQuestion = useCallback((spokenText: string) => {
    const cleanQuery = spokenText.trim();
    if (!cleanQuery) return;

    // If astrologer was speaking, cancel previous speech immediately
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (safetyEndTimerRef.current) {
      clearTimeout(safetyEndTimerRef.current);
    }
    isProcessingRef.current = false;
    setIsUserSpeaking(false);
    setUserInterimSpeech('');
    latestSpeechRef.current = '';

    playSingingChime();

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: InCallChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'seeker',
      senderName: currentUser.name || 'You (Voice)',
      text: cleanQuery,
      timestamp: nowTime
    };

    const astrologerReply = generateAstrologerAnswer(cleanQuery);
    const replyMsg: InCallChatMessage = {
      id: `exp_${Date.now() + 1}`,
      sender: 'expert',
      senderName: booking.expertName,
      text: astrologerReply.fullText,
      timestamp: nowTime
    };

    setChatMessages(prev => [...prev, userMsg, replyMsg]);
    setCurrentCaption(astrologerReply.speechText);
    setIsAstrologerThinking(true);

    speakAstrologerVoice(astrologerReply.speechText, false);
  }, [booking.expertName, currentUser.name, generateAstrologerAnswer, speakAstrologerVoice]);

  /**
   * Setup Web Speech Recognition for the Seeker's Microphone
   */
  useEffect(() => {
    if (!isCallActive || isSessionEnded || !isMicOn) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListeningMic(false);
      return;
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setMicStatusNotice('Microphone active (Type in chat or tap Ask chips)');
      setIsListeningMic(true);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListeningMic(true);
        setMicStatusNotice('Microphone listening live · Speak your question anytime');
      };

      recognition.onresult = (event: any) => {
        // If astrologer is currently speaking, do not capture computer speaker output as seeker input
        if (astrologerSpeakingRef.current) {
          return;
        }

        let interimStr = '';
        let finalStr = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalStr += transcript;
          } else {
            interimStr += transcript;
          }
        }

        const currentSpeech = (finalStr || interimStr).trim();
        if (currentSpeech) {
          setIsUserSpeaking(true);
          setUserInterimSpeech(currentSpeech);
          latestSpeechRef.current = currentSpeech;

          // If user interrupts or speaks, clear debounce and wait for brief pause
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // Trigger response on final result or 600ms of silence
          const waitTime = finalStr ? 250 : 600;
          silenceTimerRef.current = setTimeout(() => {
            const queryToSend = latestSpeechRef.current.trim();
            if (queryToSend.length >= 2 && !isProcessingRef.current) {
              processUserQuestion(queryToSend);
            }
          }, waitTime);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('[SpeechRecognition] notice:', event?.error);
        if (event.error === 'not-allowed') {
          setMicStatusNotice('Microphone permission needed in browser');
        }
      };

      recognition.onend = () => {
        if (isMicOn && isCallActive && !isSessionEnded) {
          try {
            recognition.start();
          } catch (e) {
            // Already started or active
          }
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('[SpeechRecognition] Init error:', err);
      setMicStatusNotice('Microphone active · Speak your question');
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [isCallActive, isMicOn, isSessionEnded, processUserQuestion]);

  // Initial WebRTC User Media Camera & Immediate Welcome Speech on Room Open
  useEffect(() => {
    let active = true;
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
            audio: false
          });
          if (active && localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        }
      } catch (err) {
        console.warn('[LiveVideo] Webcam access denied or fallback needed:', err);
      }
    }
    startCamera();

    // Trigger Astrologer Audible Spoken Greeting Immediately on Room Open (within 200ms)
    const seekerName = currentUser.name || 'Seeker';
    const welcomeSpeech = `Namaste ${seekerName}! I am ${booking.expertName}. I have your readings open before me. Please feel free to speak or click any option below.`;
    
    const initialSpeechTimer = setTimeout(() => {
      speakAstrologerVoice(welcomeSpeech, false);
    }, 200);

    return () => {
      active = false;
      clearTimeout(initialSpeechTimer);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [booking.expertName, currentUser.name, speakAstrologerVoice]);

  // Main Call Timer Countdown
  useEffect(() => {
    if (!isCallActive || isSessionEnded) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleEndCall(false);
          return 0;
        }
        // Spoken warning at 2 minutes remaining
        if (prev === 120) {
          setShowExtensionModal(true);
          speakAstrologerVoice(`We have two minutes remaining in our scheduled session. If you would like to continue our consultation, you can extend our session by ten minutes.`);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCallActive, isSessionEnded, speakAstrologerVoice]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle Camera
  const toggleCam = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(t => (t.enabled = !isCamOn));
    }
    setIsCamOn(!isCamOn);
  };

  // Toggle Mic
  const toggleMic = () => {
    const nextMic = !isMicOn;
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => (t.enabled = nextMic));
    }
    setIsMicOn(nextMic);
    if (!nextMic) {
      setUserInterimSpeech('');
      setIsUserSpeaking(false);
    }
  };

  // Toggle Astrologer Audio (Mute/Unmute)
  const toggleAstrologerAudio = () => {
    const nextMuted = !isAstrologerAudioMuted;
    setIsAstrologerAudioMuted(nextMuted);
    if (nextMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setAstrologerSpeaking(false);
    } else {
      speakAstrologerVoice("Astrologer voice audio unmuted. I am listening to you.");
    }
  };

  // Replay Last Spoken Voice
  const handleReplayAstrologerVoice = () => {
    const textToReplay = lastSpokenText || `Namaste ${currentUser.name || 'Seeker'}, I am ${booking.expertName}. I am listening to your voice live. Please speak any question aloud.`;
    speakAstrologerVoice(textToReplay);
  };

  // Handle Session Extension (+10 Mins Free)
  const handleExtendSession = () => {
    setExtensionStatus('processing');
    setTimeout(() => {
      const res = extendConsultationBooking(booking.id, 10, 0);
      if (res.ok && res.booking) {
        setBooking(res.booking);
        setSecondsRemaining(prev => prev + 600);
        setExtensionStatus('success');
        setChatMessages(msgs => [
          ...msgs,
          {
            id: `sys_${Date.now()}`,
            sender: 'system',
            senderName: 'System',
            text: 'Session successfully extended by +10 minutes (100% Free). Video and audio stream continuous.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        speakAstrologerVoice("Thank you. Our consultation has been extended by ten minutes at no charge. Let us continue exploring your astrological timing.");
        setTimeout(() => {
          setShowExtensionModal(false);
          setExtensionStatus('idle');
        }, 1200);
      }
    }, 800);
  };

  // Astrologer No-Show Restitution Handler
  const handleSimulateNoShow = () => {
    const res = handleAstrologerNoShow(booking.id);
    if (res.ok) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      onTrialUpdated();
      alert(`Astrologer delayed. Your free consultation session credit has been 100% restored to your account.`);
      onLeaveCall();
    }
  };

  // Handle End Call & Post-Session Wrap-Up
  const handleEndCall = (manual: boolean = true) => {
    setIsCallActive(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    completeConsultationSession(booking.id, {
      notes: liveNotes,
      remedies: DEFAULT_REMEDIES
    });
    setIsSessionEnded(true);
  };

  // Submit Feedback
  const handleSubmitSummary = () => {
    completeConsultationSession(booking.id, {
      notes: liveNotes,
      remedies: DEFAULT_REMEDIES,
      seekerRating: rating,
      seekerReview: feedbackText
    });
    setIsSummarySubmitted(true);
    setTimeout(() => {
      onTrialUpdated();
      onLeaveCall();
    }, 1500);
  };

  // Send Chat Message & Trigger Spoken Astrologer Response
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userQuery = chatInput.trim();
    setChatInput('');
    processUserQuestion(userQuery);
  };

  // Quick Astrological Speech Trigger buttons
  const handleTriggerSpeechTopic = (topicType: 'palm' | 'tarot' | 'remedy' | 'career' | 'love' | 'dasha' | 'purpose') => {
    askAstrologerQuick(topicType === 'remedy' ? 'remedies' : (topicType as any));
  };

  // Download ICS Calendar Invite
  const downloadIcs = () => {
    const link = document.createElement('a');
    link.href = generateIcsCalendarBlob(booking);
    link.download = `consultation-${booking.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Post Session Summary Dialog
  if (isSessionEnded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-2xl w-full bg-[#0A0A0F] border border-violet-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-violet-600 to-amber-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Session Completed with {booking.expertName}</h2>
            <p className="text-xs text-white/60">
              Duration: {booking.durationMinutes || 15} mins · Focus Area: {booking.topic.toUpperCase()}
            </p>
          </div>

          {/* Astrological Remedies Prescription */}
          <div className="space-y-3 bg-violet-950/20 border border-violet-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Prescribed Astrological Remedies
              </h3>
              <button
                type="button"
                onClick={downloadIcs}
                className="text-[10px] text-violet-300 hover:text-white flex items-center gap-1 font-mono uppercase underline"
              >
                <Download className="w-3 h-3" />
                Save .ics Reminder
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DEFAULT_REMEDIES.map(rem => (
                <div key={rem.id} className="bg-black/50 border border-white/10 rounded-xl p-3 space-y-1">
                  <div className="text-[10px] font-bold text-violet-400 uppercase">{rem.type}</div>
                  <div className="text-xs font-bold text-white">{rem.title}</div>
                  <div className="text-[10px] text-white/60">{rem.description}</div>
                  <div className="text-[9px] text-amber-300/80 font-mono mt-1 pt-1 border-t border-white/5">
                    {rem.instructions}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Astrologer Live Notes Summary */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-1.5">
            <div className="text-[10px] font-bold uppercase text-white/50 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Astrologer Session Notes & Key Dates
            </div>
            <pre className="text-xs text-white/80 font-sans whitespace-pre-wrap leading-relaxed">
              {liveNotes}
            </pre>
          </div>

          {/* Rating & Review */}
          {!isSummarySubmitted ? (
            <div className="space-y-4 border-t border-white/10 pt-4">
              <div className="text-center space-y-1.5">
                <p className="text-xs font-semibold text-white">Rate your reading with {booking.expertName}</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                placeholder="Write a brief reflection or feedback (optional)..."
                rows={2}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleSubmitSummary}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg"
                >
                  Save & Return to Platform
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-3 text-emerald-400 text-xs font-bold">
              ✓ Consultation summary saved to your permanent spiritual profile!
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#050507] text-[#E0E0E6] flex flex-col overflow-hidden font-sans">
      {/* Top Header Bar */}
      <header className="h-16 bg-[#0A0A0F]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600/30 border border-violet-500/50 flex items-center justify-center">
            <Compass className="w-4 h-4 text-violet-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{booking.expertName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Video & Audio Online
              </span>
            </div>
            <p className="text-[10px] text-white/50">Topic: {booking.topic.toUpperCase()} · Room: {booking.roomId.slice(0, 14)}...</p>
          </div>
        </div>

        {/* Live Countdown Timer & Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Astrologer Voice Status Beacon */}
          <button
            type="button"
            onClick={toggleAstrologerAudio}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              !isAstrologerAudioMuted
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300 hover:bg-rose-900/60'
            }`}
            title="Toggle Astrologer Voice Audio"
          >
            {!isAstrologerAudioMuted ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
            <span>{!isAstrologerAudioMuted ? 'Astrologer Voice: ON' : 'Voice Muted'}</span>
          </button>

          <button
            type="button"
            onClick={handleReplayAstrologerVoice}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-violet-950/60 hover:bg-violet-900/80 border border-violet-500/40 text-violet-200 text-xs font-semibold"
            title="Replay Astrologer Speech"
          >
            <Volume1 className="w-3.5 h-3.5 text-amber-300" />
            <span>Replay Voice</span>
          </button>

          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono text-xs font-bold transition-all ${
              secondsRemaining <= 120
                ? 'bg-rose-950/60 border-rose-500/80 text-rose-300 animate-pulse'
                : secondsRemaining <= 300
                ? 'bg-amber-950/60 border-amber-500/80 text-amber-300'
                : 'bg-black/60 border-white/10 text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowExtensionModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+10 Mins (Free)</span>
          </button>

          <button
            type="button"
            onClick={() => handleEndCall(true)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End Call</span>
          </button>
        </div>
      </header>

      {/* Main Split Layout: Video Viewport & Telemetry Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left: Video Area */}
        <div className="flex-1 bg-black flex flex-col relative p-4 justify-between">
          
          {/* Main Astrologer Video Container */}
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#101018] to-[#0A0A0F] border border-white/10 flex items-center justify-center shadow-2xl">
            <div className="w-full h-full relative flex items-center justify-center">
              
              {/* Seeker Microphone Live Listening Banner (Top Overlay) */}
              <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2">
                <div className={`px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-medium flex items-center gap-2 transition-all ${
                  isUserSpeaking
                    ? 'bg-amber-950/90 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/30'
                    : isMicOn
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                }`}>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isUserSpeaking ? 'bg-amber-400' : isMicOn ? 'bg-emerald-400' : 'bg-rose-400'
                    }`} />
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isUserSpeaking ? 'bg-amber-400' : isMicOn ? 'bg-emerald-400' : 'bg-rose-400'
                    }`} />
                  </span>
                  <span className="font-mono text-[11px]">
                    {isUserSpeaking
                      ? '🎙️ Listening to you... (Pause to send)'
                      : isMicOn
                      ? '🎙️ Microphone Live · Speak your question aloud anytime'
                      : '🔇 Microphone muted (Unmute to speak)'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReplayAstrologerVoice}
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-[10px] uppercase rounded-xl shadow flex items-center gap-1"
                    title="Click to hear astrologer voice"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Hear Astrologer Voice</span>
                  </button>

                  {userInterimSpeech && (
                    <button
                      type="button"
                      onClick={() => processUserQuestion(userInterimSpeech)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider text-[10px] rounded-lg shadow-lg flex items-center gap-1 shrink-0 animate-bounce"
                    >
                      <span>Ask Now</span>
                      <Send className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Simulated Astrologer Video Avatar / Feed */}
              <div className="relative text-center space-y-4">
                <div className="relative inline-block cursor-pointer" onClick={handleReplayAstrologerVoice}>
                  <img
                    src={booking.expertAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'}
                    alt={booking.expertName}
                    className="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-3xl border-2 border-violet-500/40 shadow-2xl"
                  />
                  {astrologerSpeaking && (
                    <div className="absolute -inset-2 rounded-3xl border-2 border-amber-400 animate-ping opacity-50 pointer-events-none" />
                  )}
                  <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md rounded-xl py-1 px-2.5 text-[11px] font-bold text-white flex items-center justify-between">
                    <span>{booking.expertName}</span>
                    <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                      {astrologerSpeaking ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>Speaking (Audible)</span>
                        </>
                      ) : isAstrologerThinking ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                          <span>Synthesizing Answer...</span>
                        </>
                      ) : isUserSpeaking ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                          <span>Hearing You...</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>Listening Live</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Audio Waveform Indicator */}
                <div className="flex items-center justify-center gap-1.5 h-6">
                  {[8, 16, 22, 14, 24, 12, 18, 10].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        astrologerSpeaking
                          ? 'bg-amber-400 shadow-sm shadow-amber-400 animate-pulse'
                          : isUserSpeaking
                          ? 'bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse'
                          : isAstrologerThinking
                          ? 'bg-violet-400 animate-pulse'
                          : 'bg-white/20'
                      }`}
                      style={{
                        height: astrologerSpeaking || isUserSpeaking || isAstrologerThinking
                          ? `${h}px`
                          : '4px'
                      }}
                    />
                  ))}
                </div>

                {/* Live Seeker Spoken Question Bubble */}
                {userInterimSpeech && (
                  <div className="max-w-md mx-auto bg-violet-950/95 backdrop-blur-md border border-violet-400/80 rounded-xl px-4 py-2 text-xs text-violet-100 shadow-2xl leading-relaxed animate-fade-in flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-violet-300 font-bold uppercase font-mono block mb-0.5 flex items-center gap-1">
                        <Mic className="w-3 h-3 text-amber-300 animate-pulse" /> You asked:
                      </span>
                      "{userInterimSpeech}"
                    </div>
                    <button
                      type="button"
                      onClick={() => processUserQuestion(userInterimSpeech)}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-black text-[10px] font-bold rounded-lg shrink-0"
                    >
                      Send
                    </button>
                  </div>
                )}

                {/* Live Spoken Captions Subtitle Box */}
                {currentCaption && !userInterimSpeech && (
                  <div className="max-w-md mx-auto bg-black/85 backdrop-blur-md border border-amber-500/40 rounded-xl px-4 py-2 text-xs text-amber-200 shadow-xl leading-relaxed animate-fade-in">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-amber-400 font-bold uppercase font-mono">
                        🎙️ {booking.expertName} speaking:
                      </span>
                      <button
                        type="button"
                        onClick={handleReplayAstrologerVoice}
                        className="text-[9px] text-amber-300 hover:text-white underline font-mono"
                      >
                        Replay
                      </button>
                    </div>
                    "{currentCaption}"
                  </div>
                )}

                {/* Quick Voice & Click Ask Action Chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-xl mx-auto">
                  <button
                    type="button"
                    onClick={() => askAstrologerQuick('palm')}
                    className="px-2.5 py-1.5 rounded-xl bg-violet-950/70 hover:bg-violet-900 border border-violet-500/40 text-[11px] font-semibold text-violet-200 flex items-center gap-1.5 transition-all shadow hover:scale-105 active:scale-95"
                    title="Ask about palm lines, mounts and vitality from report"
                  >
                    <Hand className="w-3.5 h-3.5 text-emerald-400" />
                    <span>✋ Palm Lines</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => askAstrologerQuick('tarot')}
                    className="px-2.5 py-1.5 rounded-xl bg-violet-950/70 hover:bg-violet-900 border border-violet-500/40 text-[11px] font-semibold text-violet-200 flex items-center gap-1.5 transition-all shadow hover:scale-105 active:scale-95"
                    title="Ask about Tarot cards and spread interpretation"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>🎴 Tarot Spread</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => askAstrologerQuick('career')}
                    className="px-2.5 py-1.5 rounded-xl bg-violet-950/70 hover:bg-violet-900 border border-violet-500/40 text-[11px] font-semibold text-violet-200 flex items-center gap-1.5 transition-all shadow hover:scale-105 active:scale-95"
                    title="Ask career and wealth forecast"
                  >
                    <Compass className="w-3.5 h-3.5 text-sky-400" />
                    <span>💼 Career & Wealth</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => askAstrologerQuick('love')}
                    className="px-2.5 py-1.5 rounded-xl bg-violet-950/70 hover:bg-violet-900 border border-violet-500/40 text-[11px] font-semibold text-violet-200 flex items-center gap-1.5 transition-all shadow hover:scale-105 active:scale-95"
                    title="Ask love and relationship synastry"
                  >
                    <HeartIcon className="w-3.5 h-3.5 text-pink-400" />
                    <span>❤️ Love & Synastry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => askAstrologerQuick('dasha')}
                    className="px-2.5 py-1.5 rounded-xl bg-violet-950/70 hover:bg-violet-900 border border-violet-500/40 text-[11px] font-semibold text-violet-200 flex items-center gap-1.5 transition-all shadow hover:scale-105 active:scale-95"
                    title="Ask about Dasha and planetary timing"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>🪐 Timing & Dasha</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => askAstrologerQuick('remedies')}
                    className="px-2.5 py-1.5 rounded-xl bg-violet-950/70 hover:bg-violet-900 border border-violet-500/40 text-[11px] font-semibold text-violet-200 flex items-center gap-1.5 transition-all shadow hover:scale-105 active:scale-95"
                    title="Ask for personalized gemstones and mantras"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>✨ Karmic Remedies</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => askAstrologerQuick('purpose')}
                    className="px-2.5 py-1.5 rounded-xl bg-violet-950/70 hover:bg-violet-900 border border-violet-500/40 text-[11px] font-semibold text-violet-200 flex items-center gap-1.5 transition-all shadow hover:scale-105 active:scale-95"
                    title="Ask about soul purpose and spiritual calling"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                    <span>🌟 Soul Purpose</span>
                  </button>
                </div>
              </div>

              {/* Floating Seeker PIP (Picture-in-Picture) */}
              <div className="absolute bottom-4 right-4 w-36 h-28 sm:w-48 sm:h-36 bg-[#050507] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                {isCamOn ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 text-white/50 text-[10px]">
                    <VideoOff className="w-5 h-5 mb-1" />
                    <span>Camera Off</span>
                  </div>
                )}
                <div className="absolute bottom-1 left-2 text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <span>You</span>
                  {isMicOn ? (
                    <span className="text-emerald-400">● Live Mic</span>
                  ) : (
                    <span className="text-rose-400">● Muted</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* In-Call Media Control Bar */}
          <div className="mt-3 bg-[#0A0A0F]/80 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-xl transition-all ${
                isMicOn ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/40' : 'bg-rose-600 text-white'
              }`}
              title={isMicOn ? 'Microphone is ON and listening · Click to Mute' : 'Microphone Muted · Click to Unmute'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={toggleCam}
              className={`p-3 rounded-xl transition-all ${
                isCamOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-600 text-white'
              }`}
              title={isCamOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isCamOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={toggleAstrologerAudio}
              className={`p-3 rounded-xl transition-all ${
                !isAstrologerAudioMuted ? 'bg-white/10 text-emerald-400 hover:bg-white/20' : 'bg-rose-600 text-white'
              }`}
              title={!isAstrologerAudioMuted ? 'Mute Astrologer Audio' : 'Unmute Astrologer Audio'}
            >
              {!isAstrologerAudioMuted ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <div className="h-6 w-[1px] bg-white/10 mx-1" />

            <button
              type="button"
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                activeTab === 'telemetry'
                  ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/50'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Summary & Data</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                activeTab === 'notes'
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                activeTab === 'chat'
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('remedies')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                activeTab === 'remedies'
                  ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/50'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Remedies</span>
            </button>
          </div>
        </div>

        {/* Right: Telemetry & Interactive Astrologer Side Panel */}
        <div className="w-full lg:w-96 bg-[#0A0A0F] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col h-80 lg:h-auto overflow-hidden">
          
          {/* Panel Header */}
          <div className="p-3 border-b border-white/10 bg-black/40 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
              {activeTab === 'telemetry' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              {activeTab === 'notes' && <FileText className="w-3.5 h-3.5 text-amber-400" />}
              {activeTab === 'chat' && <MessageSquare className="w-3.5 h-3.5 text-sky-400" />}
              {activeTab === 'remedies' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
              {activeTab === 'telemetry' ? 'AI SUMMARY & REPORT DATA' : activeTab.toUpperCase()}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Sync
            </span>
          </div>

          {/* Panel Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            
            {/* TAB 1: AI Summary of Zoom Call & Underlying Report Data */}
            {activeTab === 'telemetry' && (
              <div className="space-y-4">
                
                {/* 1. Real-Time Zoom Call AI Summary Box */}
                <div className="bg-gradient-to-br from-violet-950/40 via-black/60 to-[#0F0B18] border border-violet-500/30 rounded-2xl p-4 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-violet-600/30 border border-violet-500/40 text-amber-300">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">Live Zoom Call AI Summary</h4>
                        <span className="text-[9px] text-white/50 font-mono">Real-time consultation synthesis</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSummaryUpdating(true);
                        playSingingChime();
                        setTimeout(() => {
                          setSummaryRefreshTick(t => t + 1);
                          setIsSummaryUpdating(false);
                        }, 400);
                      }}
                      className="px-2 py-1 bg-violet-900/40 hover:bg-violet-800/60 border border-violet-500/30 rounded-lg text-[10px] text-violet-200 flex items-center gap-1 font-mono transition-all"
                      title="Update AI synthesis with latest call discussion"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSummaryUpdating ? 'animate-spin text-amber-300' : ''}`} />
                      <span>{isSummaryUpdating ? 'Synthesizing...' : 'Refresh'}</span>
                    </button>
                  </div>

                  {/* Dynamic Conversation Discussion Points */}
                  <div className="space-y-2 bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] leading-relaxed">
                    <div className="text-[10px] uppercase font-mono text-amber-400 font-bold flex items-center justify-between">
                      <span>Topics Covered in Call ({chatMessages.filter(m => m.sender === 'seeker').length} Inquiries)</span>
                      <span className="text-white/40">{Math.round((initialSeconds - secondsRemaining) / 60)} Mins Elapsed</span>
                    </div>

                    {chatMessages.filter(m => m.sender === 'seeker').length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        {chatMessages
                          .filter(m => m.sender === 'seeker')
                          .slice(-4)
                          .map((msg, i) => (
                            <div key={msg.id || i} className="flex items-start gap-1.5 text-white/80">
                              <span className="text-violet-400 shrink-0 font-bold">↳</span>
                              <span className="truncate">"{msg.text}"</span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-white/50 text-[10px] italic">
                        No inquiries asked yet. Astrologer has opened your readings—speak aloud or tap any quick question chip to synthesize live answers!
                      </p>
                    )}
                  </div>

                  {/* Synthesized Forecast Takeaways */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <div className="text-white/40">Transit Window</div>
                      <div className="font-semibold text-emerald-300 font-mono">Next 4–8 Weeks</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <div className="text-white/40">Core Advantage</div>
                      <div className="font-semibold text-amber-300 font-mono">
                        {activePalm.handType || 'Fire'} Stamina + Fork
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-violet-950/30 border border-violet-500/20 text-[10px] text-violet-200">
                    <strong className="text-white block mb-0.5">Astrologer Takeaway:</strong>
                    "The Life Line and Tarot spread align on clearing self-limiting hesitation. Channel your strategic fork into high-leverage initiatives."
                  </div>
                </div>

                {/* 2. Active AI Palm Scan Report Used */}
                <div className="bg-black/50 border border-white/10 rounded-2xl p-3.5 space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between text-violet-300 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <Hand className="w-3.5 h-3.5 text-emerald-400" />
                      Active Palm Scan Report
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {Math.round((activePalm.detectionConfidence || 0.96) * 100)}% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-white/40">Life Line</div>
                      <div className="font-semibold text-white">{activePalm.lifeLine?.length || 'Long & Resilient'}</div>
                      <div className="text-[9px] text-white/50">{activePalm.lifeLine?.quality || 'High Vitality'}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-white/40">Head Line</div>
                      <div className="font-semibold text-white">{activePalm.headLine?.length || 'Clear with Fork'}</div>
                      <div className="text-[9px] text-white/50">{activePalm.headLine?.quality || 'Dual Intelligence'}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-white/40">Heart Line</div>
                      <div className="font-semibold text-white">{activePalm.heartLine?.length || 'Deep & Reaching'}</div>
                      <div className="text-[9px] text-white/50">{activePalm.heartLine?.quality || 'Loyal & Warm'}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-white/40">Hand Element</div>
                      <div className="font-semibold text-amber-300">{activePalm.handType || 'Fire'} Element</div>
                      <div className="text-[9px] text-white/50">{activePalm.primaryMount || 'Jupiter Mount'}</div>
                    </div>
                  </div>

                  <p className="text-[10px] text-white/70 leading-relaxed italic bg-white/[0.02] p-2 rounded-lg border border-white/5">
                    {activePalm.overviewSummary}
                  </p>
                </div>

                {/* 3. Active Tarot Reading Spread Report Used */}
                <div className="bg-black/50 border border-white/10 rounded-2xl p-3.5 space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between text-violet-300 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      Active Tarot Spread Report
                    </span>
                    <span className="text-[10px] font-mono text-amber-300">{activeTarot.spreadTitle}</span>
                  </div>

                  <div className="space-y-1.5">
                    {(activeTarot.drawnCards || activeTarot.cards || []).slice(0, 3).map((c, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/5 p-2 rounded-lg text-[10px]">
                        <div>
                          <span className="font-bold text-white mr-1.5">{c.card.name}</span>
                          <span className="text-[9px] text-white/40">({c.positionName || `Position ${i + 1}`})</span>
                        </div>
                        <span className="text-amber-300 font-mono text-[9px] bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {c.isReversed ? 'Reversed ↺' : 'Upright ↑'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-white/70 leading-relaxed italic bg-white/[0.02] p-2 rounded-lg border border-white/5">
                    {activeTarot.aiInterpretation || activeTarot.summaryInterpretation}
                  </p>
                </div>

              </div>
            )}

            {/* TAB 2: Live Astrologer Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-2">
                <p className="text-[10px] text-white/50">Live notes being drafted during your reading:</p>
                <textarea
                  value={liveNotes}
                  onChange={e => setLiveNotes(e.target.value)}
                  rows={10}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-violet-500"
                />
              </div>
            )}

            {/* TAB 3: Chat */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full space-y-3">
                <div className="flex-1 space-y-2 overflow-y-auto max-h-56">
                  {chatMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-xl text-xs space-y-0.5 ${
                        msg.sender === 'seeker'
                          ? 'bg-violet-950/60 border border-violet-500/30 ml-4 text-violet-100'
                          : msg.sender === 'expert'
                          ? 'bg-black/60 border border-white/10 mr-4 text-white'
                          : 'bg-amber-950/30 border border-amber-500/20 text-amber-200 text-[10px]'
                      }`}
                    >
                      <div className="flex justify-between text-[9px] opacity-60">
                        <span>{msg.senderName}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div>{msg.text}</div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type or speak a question aloud..."
                    className="flex-1 bg-black/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: 1-Click Interactive Prescribed Remedies */}
            {activeTab === 'remedies' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    1-Click Interactive Remedies
                  </span>
                  <span className="text-[9px] text-white/40 font-mono">Tap any card to hear advice</span>
                </div>

                {DEFAULT_REMEDIES.map(rem => {
                  const isApplied = appliedRemedies.has(rem.id);
                  const isFocused = activeRemedyId === rem.id;

                  return (
                    <div
                      key={rem.id}
                      onClick={() => {
                        setActiveRemedyId(rem.id);
                        const speechText = `For the ${rem.title} remedy, ${rem.instructions}. This helps ${rem.description.toLowerCase()}`;
                        speakAstrologerVoice(speechText);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2.5 relative ${
                        isFocused
                          ? 'bg-violet-950/40 border-amber-400/80 shadow-lg shadow-amber-950/30'
                          : 'bg-black/50 border-white/10 hover:border-white/30 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded-full bg-violet-950 text-amber-300 border border-violet-700/50">
                              {rem.type.replace('_', ' ')}
                            </span>
                            <span className="text-[9px] text-white/50 font-mono">{rem.planetOrSign}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-1">{rem.title}</h4>
                        </div>

                        {isApplied && (
                          <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3" />
                            Active in Sadhana
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-white/70 leading-relaxed">
                        {rem.description}
                      </p>

                      <div className="text-[10px] text-amber-300/90 font-mono bg-black/60 p-2 rounded-xl border border-white/5">
                        <strong className="text-white block mb-0.5">Muhurat / Instructions:</strong>
                        {rem.instructions}
                      </div>

                      {/* 1-Click Mantra Chanting Counter (For Mantras) */}
                      {rem.type === 'mantra' && (
                        <div
                          className="bg-violet-950/50 border border-violet-500/30 p-2.5 rounded-xl space-y-1.5"
                          onClick={e => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-white/70 font-medium">Interactive Japa Chanting:</span>
                            <span className="font-mono text-amber-300 font-bold">{japaCount} / 108 Repetitions</span>
                          </div>
                          <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/10">
                            <div
                              className="bg-gradient-to-r from-violet-500 to-amber-400 h-full rounded-full transition-all"
                              style={{ width: `${Math.min(100, Math.round((japaCount / 108) * 100))}%` }}
                            />
                          </div>
                          <div className="flex gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                playSingingChime();
                                setJapaCount(c => Math.min(108, c + 1));
                              }}
                              className="flex-1 py-1.5 bg-gradient-to-r from-amber-500 to-violet-600 hover:from-amber-400 hover:to-violet-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shadow flex items-center justify-center gap-1"
                            >
                              <span>+1 Chant Bead</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                playSingingChime();
                                setJapaCount(c => Math.min(108, c + 9));
                              }}
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-[10px] font-mono"
                            >
                              +9 Mala
                            </button>
                            {japaCount >= 108 && (
                              <button
                                type="button"
                                onClick={() => setJapaCount(0)}
                                className="px-2 py-1.5 text-[9px] text-white/40 hover:text-white underline font-mono"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 1-Click Interactive Action Controls */}
                      <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveRemedyId(rem.id);
                            const speechText = `For the ${rem.title} remedy, ${rem.instructions}. This directly helps ${rem.description.toLowerCase()}`;
                            speakAstrologerVoice(speechText);
                          }}
                          className="px-2.5 py-1 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-200 rounded-lg text-[10px] font-semibold flex items-center gap-1"
                        >
                          <Volume2 className="w-3 h-3 text-amber-300" />
                          <span>Hear Astrologer Guide</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAppliedRemedies(prev => {
                              const next = new Set(prev);
                              if (next.has(rem.id)) {
                                next.delete(rem.id);
                              } else {
                                next.add(rem.id);
                                playSingingChime();
                              }
                              return next;
                            });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 border transition-all ${
                            isApplied
                              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{isApplied ? 'Applied in Routine' : '1-Click Activate'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const text = `${rem.title} (${rem.planetOrSign})\nInstructions: ${rem.instructions}\nBenefit: ${rem.description}`;
                            navigator.clipboard.writeText(text);
                            setCopiedRemedyId(rem.id);
                            setTimeout(() => setCopiedRemedyId(null), 1500);
                          }}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 rounded-lg text-[10px] flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3 text-white/50" />
                          <span>{copiedRemedyId === rem.id ? 'Copied!' : 'Copy'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={downloadIcs}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 rounded-lg text-[10px] flex items-center gap-1"
                          title="Save remedy Muhurat to calendar"
                        >
                          <CalendarIcon className="w-3 h-3 text-amber-300" />
                          <span>Save Muhurat (.ics)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Real-time In-Call Extension Prompt Modal */}
      <AnimatePresence>
        {showExtensionModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full bg-[#0A0A0F] border border-emerald-500/50 rounded-3xl p-6 space-y-5 shadow-2xl"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Extend Free Consultation?</h3>
                <p className="text-xs text-white/60">
                  Your reading with {booking.expertName} will end in {formatTime(secondsRemaining)}. Add +10 minutes seamlessly without disconnecting.
                </p>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">+10 Minutes Live Video Session</div>
                  <div className="text-[10px] text-white/40">Includes live remedies & question answering</div>
                </div>
                <div className="font-mono text-base font-bold text-emerald-400">100% Free</div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowExtensionModal(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold"
                >
                  Continue As-Is
                </button>
                <button
                  type="button"
                  onClick={handleExtendSession}
                  disabled={extensionStatus === 'processing'}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-violet-600 hover:from-emerald-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5"
                >
                  {extensionStatus === 'processing' ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Extend Session (+10 Mins Free)</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper inline heart icon for love questions
const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
