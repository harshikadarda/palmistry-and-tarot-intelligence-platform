import { UserProfile, SynthesisReport, SystemNotification, PlatformAnalytics, TarotReadingSession } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr_1',
    name: 'Aria Vance',
    email: 'user@palmistry.ai',
    role: 'user',
    ageGroup: '25-34',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    spiritualGoals: ['Align Career with Soul Purpose', 'Enhance Daily Intuition', 'Harmonize Relationships'],
    interests: ['Palmistry Line Analysis', 'Rider-Waite Tarot', 'Astrological Timelines', 'Chakra Balancing'],
    readingPreferences: {
      preferredDeck: 'Rider-Waite Classic',
      focusAreas: ['Career Growth', 'Life Purpose', 'Relationships'],
      dailyAlerts: true
    },
    createdAt: '2026-01-15',
    birthDate: '1997-04-18',
    zodiacSign: 'Aries',
    country: 'United States',
    birthPlace: 'Los Angeles, CA',
    birthTime: '10:45',
    gender: 'Female',
    isLoggedIn: true
  },
  {
    id: 'usr_2',
    name: 'Madame Celeste',
    email: 'reader@palmistry.ai',
    role: 'reader',
    ageGroup: '35-44',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    spiritualGoals: ['Guide Seekers with Precision', 'Master Celtic Cross Interpretations'],
    interests: ['Tarot Symbology', 'Esoteric Studies', 'Tarot Spread Optimization'],
    readingPreferences: {
      preferredDeck: 'Rider-Waite Classic',
      focusAreas: ['Relationship Guidance', 'Spiritual Awakening'],
      dailyAlerts: true
    },
    createdAt: '2025-11-20',
    birthDate: '1988-11-04',
    zodiacSign: 'Scorpio',
    country: 'France',
    birthPlace: 'Paris',
    birthTime: '22:15',
    gender: 'Female',
    isLoggedIn: true
  },
  {
    id: 'usr_3',
    name: 'Dr. Seraphina Moon',
    email: 'consultant@palmistry.ai',
    role: 'consultant',
    ageGroup: '45-54',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
    spiritualGoals: ['Holistic Life Trend Coaching', 'Empower Leadership Trajectories'],
    interests: ['Palm Mount Analysis', 'Jungian Archetypes', 'Life Trend Forecasting'],
    readingPreferences: {
      preferredDeck: 'Golden Thread Tarot',
      focusAreas: ['Executive Growth', 'Life Path Alignment'],
      dailyAlerts: false
    },
    createdAt: '2025-09-10',
    birthDate: '1979-08-22',
    zodiacSign: 'Leo',
    country: 'United Kingdom',
    birthPlace: 'London',
    birthTime: '06:30',
    gender: 'Female',
    isLoggedIn: true
  },
  {
    id: 'usr_4',
    name: 'Alexander Sterling (Admin)',
    email: 'admin@palmistry.ai',
    role: 'admin',
    ageGroup: '35-44',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    spiritualGoals: ['Platform Integrity & AI Model Quality'],
    interests: ['AI Accuracy Metrics', 'User Retention', 'Computer Vision Pipeline'],
    readingPreferences: {
      preferredDeck: 'Rider-Waite Classic',
      focusAreas: ['System Performance', 'Analytics'],
      dailyAlerts: true
    },
    createdAt: '2025-01-01',
    birthDate: '1985-02-14',
    zodiacSign: 'Aquarius',
    country: 'Canada',
    birthPlace: 'Toronto',
    birthTime: '15:00',
    gender: 'Male',
    isLoggedIn: true
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif_1',
    userId: 'usr_1',
    userEmail: 'user@palmistry.ai',
    title: 'Daily Guidance: High Solar Energy',
    message: 'Your Sun Line indicates a favorable window for creative presentations today. Trust your intuition!',
    type: 'daily_guidance',
    read: false,
    createdAt: '2026-08-03 08:00'
  },
  {
    id: 'notif_2',
    userId: 'usr_1',
    userEmail: 'user@palmistry.ai',
    title: 'Weekly Life Trend Forecast Ready',
    message: 'Your 3-Month career trajectory update has been synthesized. Check your dashboard.',
    type: 'insight_update',
    read: false,
    createdAt: '2026-08-02 18:30'
  },
  {
    id: 'notif_3',
    userId: 'usr_1',
    userEmail: 'user@palmistry.ai',
    title: 'Consultant Note Added',
    message: 'Dr. Seraphina Moon added a private spiritual guidance note to your last Celtic Cross reading.',
    type: 'growth_alert',
    read: true,
    createdAt: '2026-08-01 14:15'
  }
];

export const INITIAL_REPORTS: SynthesisReport[] = [
  {
    id: 'report_101',
    userId: 'usr_1',
    userName: 'Aria Vance',
    userEmail: 'user@palmistry.ai',
    createdAt: '2026-08-01',
    weightedScore: {
      palmConfidence: 92,
      tarotRelevance: 88,
      personalityAlignment: 90,
      userContextRelevance: 85,
      readingConsistency: 94,
      overallScore: 89.95
    },
    personality: {
      archetype: 'The Inspired Catalyst',
      elementalBalance: { fire: 35, water: 25, air: 25, earth: 15 },
      strengths: ['Visionary Thinking', 'Strong Empathy', 'Quick Adaptability', 'Natural Charisma'],
      weaknesses: ['Over-committing to multiple projects', 'Occasional impatience with slow routines'],
      behavioralInsights: [
        'Responds best to creative freedom and collaborative team autonomy.',
        'High intuitive leap capability when backed by logical structure.'
      ],
      growthRecommendations: [
        'Incorporate 10 minutes of daily breathwork grounding.',
        'Establish firm weekly boundary limits on new project commitments.'
      ]
    },
    lifeTrends: {
      currentPhase: 'Emergence & Creative Expansion',
      opportunites: [
        'Prominent professional leadership offer in Q3',
        'Deepening bond with key creative collaborator'
      ],
      challenges: [
        'Managing fatigue during periods of rapid growth',
        'Filtering distractions from non-aligned external offers'
      ],
      timeline: [
        {
          horizon: 'Next 3 Months',
          prediction: 'Major breakthrough in career project; public recognition increases.',
          focusCategory: 'Career'
        },
        {
          horizon: '6 Months',
          prediction: 'Harmonious relationship consolidation and shared financial investment.',
          focusCategory: 'Relationships'
        },
        {
          horizon: '1 Year',
          prediction: 'Establishment of a permanent creative studio or long-term endeavor.',
          focusCategory: 'Life Purpose' as any
        }
      ]
    },
    synthesizedGuidance: {
      executiveSummary: 'A powerful alignment between your Fire Palm structure and The Magician tarot energy. You are poised to manifest a long-standing vocational dream into practical reality.',
      personalityOverview: 'Your palm’s long Head Line paired with Ace of Swords highlights a sharp intellectual breakthrough window. Embrace clarity without doubt.',
      relationshipInsights: 'The Lovers card in your present state highlights deep mutual trust. Be open and authentic in your communication.',
      careerAndFinance: 'Fate Line clarity at age 32 signals a pivotal career upgrade. Capitalize on upcoming high-visibility projects.',
      healthAndWellness: 'Prioritize physical grounding routines to balance your high mental and fire energy.',
      spiritualActionPlan: [
        'Perform morning visual meditation focusing on manifestation.',
        'Keep a daily intuitive journal to track repeating synchronicities.',
        'Review career goals bi-weekly against your core soul purpose.'
      ]
    }
  }
];

export const INITIAL_ANALYTICS: PlatformAnalytics = {
  totalReadingsCount: 14820,
  palmReadingsCount: 8430,
  tarotReadingsCount: 6390,
  activeUsersCount: 3240,
  avgSatisfactionScore: 4.88,
  avgResponseTimeMs: 420,
  topSpreads: [
    { name: 'Three Card Spread', count: 3210 },
    { name: 'Celtic Cross (10 Cards)', count: 1890 },
    { name: 'Single Card Daily', count: 1420 },
    { name: 'Career & Purpose Spread', count: 1250 }
  ],
  popularInterests: [
    { name: 'Career Guidance', percentage: 38 },
    { name: 'Relationships & Compatibility', percentage: 32 },
    { name: 'Spiritual Life Path', percentage: 18 },
    { name: 'Financial Horizon', percentage: 12 }
  ]
};
