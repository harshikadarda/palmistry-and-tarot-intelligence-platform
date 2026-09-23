import { UserProfile, DailySpiritualAffirmation } from '../types';

/**
 * Goal-Specific Affirmation Bank with rich esoteric archetypes
 */
interface GoalAffirmationTemplate {
  goalKeywords: string[];
  affirmations: {
    affirmation: string;
    mantra: string;
    contemplation: string;
    chakraAlignment: string;
    element: 'Fire' | 'Water' | 'Air' | 'Earth' | 'Spirit' | 'Cosmic';
    suggestedAction: string;
  }[];
}

const GOAL_AFFIRMATION_TEMPLATES: GoalAffirmationTemplate[] = [
  {
    goalKeywords: ['career', 'purpose', 'vocation', 'profession', 'work', 'success', 'wealth', 'leadership'],
    affirmations: [
      {
        affirmation: "My vocational path is a sacred vehicle for my soul's highest expression; abundance and divine timing flow into all my creative undertakings.",
        mantra: "OM MANI PADME HUM • I AM ALIGNED PURPOSE",
        contemplation: "Notice where your daily tasks intersect with genuine joy today. When you honor your authentic calling, external validation ceases to dictate your inner worth.",
        chakraAlignment: "Solar Plexus & Crown Chakras",
        element: "Fire",
        suggestedAction: "Take one decisive, courageous action today on your primary long-term project before checking routine emails."
      },
      {
        affirmation: "I release the illusion of frantic hustle and anchor into sovereign mastery; purposeful opportunities naturally gravitate toward my authentic frequency.",
        mantra: "SAT NAM • MY ESSENCE IS TRUTH & MASTERY",
        contemplation: "True leadership is effortless presence rather than forced exertion. Ground your ambition in deep patience and disciplined execution.",
        chakraAlignment: "Root & Solar Plexus Chakras",
        element: "Earth",
        suggestedAction: "Write down your top 3 non-negotiable quarterly priorities and eliminate one low-leverage distraction."
      },
      {
        affirmation: "I am worthy of profound material prosperity and spiritual fulfillment; my labor enriches both my life and the collective consciousness.",
        mantra: "SHRIM BRZEE • ABUNDANCE FLOWS UNHINDERED",
        contemplation: "Wealth and spiritual integrity are harmonious allies. Receive compliments, compensation, and support with open, grateful grace.",
        chakraAlignment: "Heart & Solar Plexus Chakras",
        element: "Earth",
        suggestedAction: "Send a sincere note of appreciation to a mentor or collaborator who has supported your growth."
      }
    ]
  },
  {
    goalKeywords: ['intuition', 'psychic', 'inner knowing', 'perception', 'clarity', 'third eye', 'guidance', 'wisdom'],
    affirmations: [
      {
        affirmation: "I trust the quiet whispers of my inner oracle above the loud turbulence of the outside world; my intuitive sight is clear, sharp, and infallible.",
        mantra: "AUM • I WITNESS WITH THE THIRD EYE",
        contemplation: "Intuition speaks in gentle, immediate sensations rather than frantic arguments. Give space for silence to reveal the answers already residing within.",
        chakraAlignment: "Third Eye & Ajna Chakras",
        element: "Spirit",
        suggestedAction: "Spend 5 minutes in pure silence without digital devices before making any important decision today."
      },
      {
        affirmation: "Synchronicity is the language of the cosmos; I effortlessly perceive sacred patterns, signs, and opportune pathways unfolding around me.",
        mantra: "SO HUM • I AM THE OBSERVING WITNESS",
        contemplation: "Every coincidence is a subtle alignment pin dropped by the universe. Keep an open, playful curiosity toward repeating numbers, dreams, and encounters.",
        chakraAlignment: "Crown & Third Eye Chakras",
        element: "Cosmic",
        suggestedAction: "Log two synchronicities or unexpected coincidences in your journal before sunset."
      },
      {
        affirmation: "My mind is a tranquil pool reflecting higher wisdom; I release anxiety and step into crystalline intuitive certainty.",
        mantra: "HAMSA • I BREATHE IN DIVINE CLARITY",
        contemplation: "When the water's surface is agitated, the bottom cannot be seen. When the mind is still, truth appears without effort.",
        chakraAlignment: "Throat & Third Eye Chakras",
        element: "Water",
        suggestedAction: "Practice 3 rounds of alternate nostril (Nadi Shodhana) breathing to balance analytical logic and intuitive feeling."
      }
    ]
  },
  {
    goalKeywords: ['relationship', 'love', 'heart', 'harmony', 'compassion', 'connection', 'boundaries', 'soulmate'],
    affirmations: [
      {
        affirmation: "I cultivate relationships rooted in mutual reverence, sacred authenticity, and healthy energetic boundaries that allow love to expand safely.",
        mantra: "YAM • MY HEART IS AN UNBROKEN SANCTUARY",
        contemplation: "True intimacy does not require sacrificing personal sovereignty. You can love deeply while standing firmly within your own energetic perimeter.",
        chakraAlignment: "Heart & Sacral Chakras",
        element: "Water",
        suggestedAction: "Express authentic gratitude to someone close without expecting anything in return."
      },
      {
        affirmation: "I forgive past grievances and release karmic cords with gratitude; my heart remains open, magnetic, and receptive to profound soul connections.",
        mantra: "AHAM PREMA • I AM EMBODIED LOVE",
        contemplation: "Forgiveness is not condoning wrongdoing; it is reclaiming the emotional bandwidth that resentment holds hostage.",
        chakraAlignment: "Heart Chakra",
        element: "Air",
        suggestedAction: "Silently send unconditional light and peace to someone with whom you have experienced friction."
      }
    ]
  },
  {
    goalKeywords: ['peace', 'awakening', 'spiritual', 'chakra', 'healing', 'mindfulness', 'meditation', 'balance', 'vitality'],
    affirmations: [
      {
        affirmation: "I am a conduit of divine vitality and luminous peace; my physical vessel restores itself with every conscious, grounding breath.",
        mantra: "RA MA DA SA • SUN, MOON, EARTH & RESTORATION",
        contemplation: "Your body is your living temple. Honor its signals of fatigue and vigor as sacred communications from the soul.",
        chakraAlignment: "Root & Heart Chakras",
        element: "Earth",
        suggestedAction: "Walk barefoot on natural grass or soil for 10 minutes to discharge electromagnetic tension."
      },
      {
        affirmation: "I release the need to control the timeline of the universe; I rest in total trust that all things are ripening in divine perfection.",
        mantra: "OM NAMO BHAGAVATE • SURRENDER TO DIVINE FLOW",
        contemplation: "A seed does not bloom by being dug up and inspected daily. Trust the invisible incubation happening in the dark.",
        chakraAlignment: "Sacral & Crown Chakras",
        element: "Water",
        suggestedAction: "Place one hand over your heart, take three deep belly breaths, and consciously surrender a lingering worry."
      }
    ]
  }
];

const DEFAULT_AFFIRMATIONS = [
  {
    affirmation: "I stand centered in my sovereign truth; the cosmos conspires at every moment to illuminate my highest potential and authentic peace.",
    mantra: "TAT TVAM ASI • THOU ART THAT",
    contemplation: "Whatever you seek in the external world is already pulsating at the core of your being. Recognize your own luminous nature.",
    chakraAlignment: "Crown & Solar Plexus Chakras",
    element: "Cosmic" as const,
    suggestedAction: "Commit to one small act of radical self-kindness today."
  },
  {
    affirmation: "I harmonize my thoughts, words, and actions with universal love; my presence brings uplifting resonance to every space I enter.",
    mantra: "LOKAH SAMASTAH SUKHINO BHAVANTU",
    contemplation: "Your energetic vibration ripples outward into all beings. Radiate peace, and peace will return to you manifold.",
    chakraAlignment: "Throat & Heart Chakras",
    element: "Air" as const,
    suggestedAction: "Offer a sincere compliment or supportive smile to a stranger or colleague today."
  }
];

/**
 * Generate a deterministic or randomized daily affirmation based on user profile goals and date
 */
export function generatePersonalizedAffirmation(
  user: UserProfile, 
  dateStr?: string,
  forceSeed?: number
): DailySpiritualAffirmation {
  const targetDate = dateStr || new Date().toISOString().split('T')[0];
  
  // Create deterministic seed from email + date or forceSeed
  let seed = forceSeed !== undefined ? forceSeed : 0;
  if (forceSeed === undefined) {
    const seedSource = `${user.email.toLowerCase()}_${targetDate}`;
    for (let i = 0; i < seedSource.length; i++) {
      seed = (seed * 31 + seedSource.charCodeAt(i)) % 1000000;
    }
  }

  // Find relevant goal keywords
  const userGoalsText = [
    ...(user.spiritualGoals || []),
    ...(user.readingPreferences?.focusAreas || []),
    ...(user.interests || []),
    user.zodiacSign || ''
  ].join(' ').toLowerCase();

  let matchingTemplates = GOAL_AFFIRMATION_TEMPLATES.filter(tpl =>
    tpl.goalKeywords.some(kw => userGoalsText.includes(kw))
  );

  if (matchingTemplates.length === 0) {
    matchingTemplates = GOAL_AFFIRMATION_TEMPLATES;
  }

  const selectedTemplate = matchingTemplates[seed % matchingTemplates.length];
  const itemIndex = seed % selectedTemplate.affirmations.length;
  const selectedItem = selectedTemplate.affirmations[itemIndex] || DEFAULT_AFFIRMATIONS[seed % DEFAULT_AFFIRMATIONS.length];

  // Determine targeted goal label
  let targetedGoal = user.spiritualGoals?.[0] || user.readingPreferences?.focusAreas?.[0] || 'Soul Evolution & Harmonization';

  // Personalize affirmation with user's name or zodiac if appropriate
  let finalAffirmation = selectedItem.affirmation;
  if (user.zodiacSign && seed % 2 === 0) {
    finalAffirmation = `${finalAffirmation} Channeling the luminous clarity of ${user.zodiacSign} energy.`;
  }

  return {
    id: `aff_${user.id || 'usr'}_${targetDate}_${seed % 9999}`,
    date: targetDate,
    affirmation: finalAffirmation,
    mantra: selectedItem.mantra,
    contemplation: selectedItem.contemplation,
    targetedGoal,
    element: selectedItem.element,
    chakraAlignment: selectedItem.chakraAlignment,
    suggestedAction: selectedItem.suggestedAction,
    zodiacAttunement: user.zodiacSign,
    completed: false,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Storage helpers for 24-hour persistence and streak tracking
 */
const STORAGE_PREFIX = 'celestial_daily_affirmation_';
const STREAK_PREFIX = 'celestial_affirmation_streak_';

export function getStoredDailyAffirmation(email: string): {
  affirmation: DailySpiritualAffirmation;
  isNew: boolean;
  hoursRemaining: number;
} | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${email.toLowerCase()}`);
    if (!raw) return null;
    
    const parsed = JSON.parse(raw);
    const today = new Date().toISOString().split('T')[0];
    const genTime = new Date(parsed.generatedAt || parsed.date).getTime();
    const now = Date.now();
    const elapsedHours = (now - genTime) / (1000 * 60 * 60);

    const isSameDate = parsed.date === today;
    const isUnder24Hours = elapsedHours < 24;

    const hoursRemaining = Math.max(0, Math.round(24 - elapsedHours));

    if (isSameDate && isUnder24Hours) {
      return {
        affirmation: parsed,
        isNew: false,
        hoursRemaining
      };
    }
    return null;
  } catch (err) {
    return null;
  }
}

export function saveStoredDailyAffirmation(email: string, affirmation: DailySpiritualAffirmation): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${email.toLowerCase()}`, JSON.stringify(affirmation));
  } catch (err) {
    console.warn('Could not save daily affirmation to localStorage:', err);
  }
}

export function setDailyAffirmationCompleted(email: string, completed: boolean): void {
  try {
    const key = `${STORAGE_PREFIX}${email.toLowerCase()}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.completed = completed;
      localStorage.setItem(key, JSON.stringify(parsed));
    }

    if (completed) {
      const streakKey = `${STREAK_PREFIX}${email.toLowerCase()}`;
      const currentStreak = parseInt(localStorage.getItem(streakKey) || '0', 10);
      localStorage.setItem(streakKey, String(currentStreak + 1));
    }
  } catch (err) {
    console.warn('Error setting affirmation completed state:', err);
  }
}

export function getAffirmationStreakCount(email: string): number {
  try {
    const streakKey = `${STREAK_PREFIX}${email.toLowerCase()}`;
    const val = localStorage.getItem(streakKey);
    return val ? parseInt(val, 10) : 1;
  } catch (err) {
    return 1;
  }
}
