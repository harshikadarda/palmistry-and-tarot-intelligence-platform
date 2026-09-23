export type UserRole = 'user' | 'reader' | 'consultant' | 'admin';

export type AppTab = 'home' | 'palm' | 'tarot' | 'synthesis' | 'dashboard' | 'admin' | 'experts';

export type ExpertSpecialty = 'tarot' | 'palm' | 'vedic' | 'western';
export type ExpertPresence = 'online' | 'busy' | 'offline';
export type ConsultTopic = 'career' | 'love' | 'timing' | 'health' | 'general' | 'karmic_remedies';
export type ArtifactType = 'palm_scan' | 'tarot_session' | 'synthesis_report';

export interface AstrologerRemedy {
  id: string;
  type: 'gemstone' | 'mantra' | 'rudraksha' | 'ritual' | 'tarot_meditation';
  title: string;
  description: string;
  planetOrSign?: string;
  instructions: string;
}

export interface ExpertProfile {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
  specialties: ExpertSpecialty[];
  languages: string[];
  bio: string;
  ratingAvg: number;
  ratingCount: number;
  acceptsTrials: boolean;
  rateInr: number;
  timezone: string;
  presence: ExpertPresence;
  city: string;
  experienceYears: number;
  accentColor?: string;
  badge?: string;
}

export interface ConsultTimeSlot {
  id: string;
  expertId: string;
  startUtc: string;
  endUtc: string;
  type: 'instant' | 'scheduled';
}

export interface ConsultArtifactRef {
  type: ArtifactType;
  id: string;
  label: string;
  previewSnippet?: string;
  createdAt?: string;
}

export interface ConsultationBooking {
  id: string;
  seekerEmail: string;
  seekerName?: string;
  expertId: string;
  expertName: string;
  expertAvatar?: string;
  slot: ConsultTimeSlot;
  topic: ConsultTopic;
  attachedArtifacts: ConsultArtifactRef[];
  listPriceInr: number;
  amountDueInr: number;
  trialApplied: boolean;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show_expert' | 'no_show_seeker';
  roomId: string;
  sessionNotes?: string;
  prescribedRemedies?: AstrologerRemedy[];
  seekerRating?: number;
  seekerReview?: string;
  durationMinutes: number;
  extendedMinutes?: number;
  createdAt: string;
  completedAt?: string;
}

export interface TrialAccount {
  email: string;
  verifiedPhoneE164: string;
  deviceFingerprint?: string;
  trialGranted: number;
  trialRemaining: number;
  trialConsumed: number;
  bonusCreditsInr?: number;
  updatedAt: string;
}

export interface InCallChatMessage {
  id: string;
  sender: 'seeker' | 'expert' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ConsultIntent {
  specialty?: ExpertSpecialty | 'all';
  artifact?: ConsultArtifactRef;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ageGroup: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  avatarUrl?: string;
  spiritualGoals: string[];
  interests: string[];
  readingPreferences: {
    preferredDeck: string;
    focusAreas: string[];
    dailyAlerts: boolean;
  };
  createdAt: string;
  birthDate?: string;
  zodiacSign?: string;
  country?: string;
  birthPlace?: string;
  birthTime?: string;
  gender?: string;
  isLoggedIn?: boolean;
  isFirstTime?: boolean;
}

export interface PalmLineAnalysis {
  name: string;
  length: 'Short' | 'Medium' | 'Long' | 'Deep';
  quality: 'Clear' | 'Chained' | 'Faint' | 'Forked' | 'Broken';
  interpretation: string;
  confidence: number;
}

export interface PalmFeatures {
  handType: 'Earth' | 'Air' | 'Fire' | 'Water';
  lifeLine: PalmLineAnalysis;
  headLine: PalmLineAnalysis;
  heartLine: PalmLineAnalysis;
  fateLine: PalmLineAnalysis;
  sunLine: PalmLineAnalysis;
  fingerStructure: {
    thumbFlexibility: string;
    indexLength: string;
    ringToIndexRatio: string;
  };
  mounts: {
    venus: string;
    jupiter: string;
    saturn: string;
    apollo: string;
  };
  detectionConfidence: number;
  landmarksCount: number;
  overviewSummary?: string;
  primaryMount?: string;
  userEmail?: string;
  userId?: string;
  scannedAt?: string;
}

export interface TarotCard {
  id: string;
  name: string;
  number: number;
  arcana: 'Major' | 'Minor';
  suit?: 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
  imageUrl: string;
  keywords: string[];
  element: 'Fire' | 'Water' | 'Air' | 'Earth';
  astrology?: string;
  meaningUpright: string;
  meaningReversed: string;
  description: string;
}

export type SpreadType = 
  | 'single' 
  | 'three_card' 
  | 'relationship' 
  | 'career' 
  | 'celtic_cross' 
  | 'life_path';

export interface DrawnTarotCard {
  card: TarotCard;
  positionName: string;
  positionMeaning: string;
  isReversed: boolean;
}

export interface TarotReadingSession {
  id: string;
  spreadType: SpreadType;
  spreadTitle: string;
  drawnCards: DrawnTarotCard[];
  cards?: DrawnTarotCard[];
  spreadId?: string;
  question?: string;
  aiInterpretation: string;
  summaryInterpretation?: string;
  createdAt: string;
  userEmail?: string;
  userId?: string;
}

export interface WeightedScoreBreakdown {
  palmConfidence: number;      // 30%
  tarotRelevance: number;      // 25%
  personalityAlignment: number;// 20%
  userContextRelevance: number;// 15%
  readingConsistency: number;  // 10%
  overallScore: number;
}

export interface WeaknessRemedy {
  weakness: string;
  rootCause: string;
  impact: string;
  actionableImprovement: string;
  dailyPractice: string;
}

export interface PersonalityIntelligence {
  archetype: string;
  elementalBalance: {
    fire: number;
    water: number;
    air: number;
    earth: number;
  };
  strengths: string[];
  weaknesses: string[];
  behavioralInsights: string[];
  growthRecommendations: string[];
  weaknessRemedies?: WeaknessRemedy[];
}

export interface LifeTrendForecast {
  currentPhase: string;
  opportunites: string[];
  challenges: string[];
  timeline: {
    horizon: string; // 'Next 3 Months', '6 Months', '1 Year', '3-5 Years'
    prediction: string;
    focusCategory: 'Career' | 'Relationships' | 'Finance' | 'Spiritual' | 'Health';
  }[];
}

export interface SynthesisReport {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  createdAt: string;
  modalityUsed?: 'palm_only' | 'tarot_only' | 'unified' | 'astrological_profile';
  modalitySummary?: string;
  palmAnalysis?: PalmFeatures;
  tarotSession?: TarotReadingSession;
  weightedScore: WeightedScoreBreakdown;
  personality: PersonalityIntelligence;
  weaknessRemedies?: WeaknessRemedy[];
  detailedModalityBreakdown?: {
    palmDetails?: {
      handType: string;
      majorLines: { name: string; quality: string; deepExplanation: string }[];
      mountsInsight: string;
    };
    tarotDetails?: {
      spreadTitle: string;
      cardsExplanation: { cardName: string; position: string; deepMeaning: string; isReversed: boolean }[];
      overallSynergy: string;
    };
  };
  lifeTrends: LifeTrendForecast;
  synthesizedGuidance: {
    executiveSummary: string;
    personalityOverview: string;
    relationshipInsights: string;
    careerAndFinance: string;
    healthAndWellness: string;
    spiritualActionPlan: string[];
  };
}

export interface SystemNotification {
  id: string;
  userId: string;
  userEmail?: string;
  title: string;
  message: string;
  type: 'daily_guidance' | 'reminder' | 'insight_update' | 'growth_alert' | 'announcement';
  read: boolean;
  createdAt: string;
}

export interface DailySpiritualAffirmation {
  id: string;
  date: string; // YYYY-MM-DD
  affirmation: string;
  mantra: string;
  contemplation: string;
  targetedGoal: string;
  element: 'Fire' | 'Water' | 'Air' | 'Earth' | 'Spirit' | 'Cosmic';
  chakraAlignment: string;
  suggestedAction: string;
  zodiacAttunement?: string;
  completed?: boolean;
  generatedAt: string;
}

export interface PlatformAnalytics {
  totalReadingsCount: number;
  palmReadingsCount: number;
  tarotReadingsCount: number;
  activeUsersCount: number;
  avgSatisfactionScore: number;
  avgResponseTimeMs: number;
  topSpreads: { name: string; count: number }[];
  popularInterests: { name: string; percentage: number }[];
}
