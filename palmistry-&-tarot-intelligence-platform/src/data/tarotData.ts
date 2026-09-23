import { TarotCard, SpreadType } from '../types';

export const TAROT_CARDS: TarotCard[] = [
  {
    id: 'm0',
    name: 'The Fool',
    number: 0,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&q=80',
    keywords: ['New Beginnings', 'Innocence', 'Spontaneity', 'Free Spirit', 'Leap of Faith'],
    element: 'Air',
    astrology: 'Uranus',
    meaningUpright: 'Embrace new starts with a clear heart. Trust the path ahead and step into unknown opportunities with optimism.',
    meaningReversed: 'Recklessness, taking unnecessary risks, hesitation before a new journey, or naive oversight.',
    description: 'A youth stands at the edge of a cliff, eager to step into adventure with open arms.'
  },
  {
    id: 'm1',
    name: 'The Magician',
    number: 1,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
    keywords: ['Manifestation', 'Resourcefulness', 'Power', 'Inspired Action', 'Skill'],
    element: 'Air',
    astrology: 'Mercury',
    meaningUpright: 'You have all the tools needed to manifest your dreams. Channel your willpower and turn visions into reality.',
    meaningReversed: 'Unrealized potential, manipulation, misdirection, or scattered concentration.',
    description: 'A figure holding a wand pointing to heaven and earth, surrounded by elements of wands, cups, swords, and pentacles.'
  },
  {
    id: 'm2',
    name: 'The High Priestess',
    number: 2,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    keywords: ['Intuition', 'Sacred Knowledge', 'Divine Feminine', 'Subconscious Mind', 'Inner Voice'],
    element: 'Water',
    astrology: 'Moon',
    meaningUpright: 'Listen to your inner wisdom and intuition. Hidden truths will reveal themselves when you quiet your mind.',
    meaningReversed: 'Secrets, disconnected intuition, superficiality, or ignored gut feelings.',
    description: 'Seated between pillars of light and darkness, holding the scroll of esoteric wisdom.'
  },
  {
    id: 'm3',
    name: 'The Empress',
    number: 3,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400&q=80',
    keywords: ['Abundance', 'Nurturing', 'Fertility', 'Creativity', 'Nature'],
    element: 'Earth',
    astrology: 'Venus',
    meaningUpright: 'A period of rich growth, creative abundance, and flourishing harmony in your life.',
    meaningReversed: 'Creative block, over-dependence, smothering energy, or neglect of self-care.',
    description: 'A regal mother figure crowned with stars sitting in a lush wheatfield of growth.'
  },
  {
    id: 'm4',
    name: 'The Emperor',
    number: 4,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    keywords: ['Authority', 'Structure', 'Control', 'Leadership', 'Stability'],
    element: 'Fire',
    astrology: 'Aries',
    meaningUpright: 'Establish order, set healthy boundaries, and lead your life with strong discipline and wisdom.',
    meaningReversed: 'Rigidity, lack of discipline, abuse of power, or chaos due to absent structure.',
    description: 'A ruler enthroned on stone carved with rams, representing stability and foundation.'
  },
  {
    id: 'm5',
    name: 'The Hierophant',
    number: 5,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=400&q=80',
    keywords: ['Spiritual Wisdom', 'Tradition', 'Mentorship', 'Conformity', 'Shared Values'],
    element: 'Earth',
    astrology: 'Taurus',
    meaningUpright: 'Seek guidance from spiritual traditions, higher learning, or trusted mentors.',
    meaningReversed: 'Challenging outdated beliefs, personal spiritual path, unconventional wisdom.',
    description: 'A revered teacher sitting between sacred pillars giving blessings to seekers.'
  },
  {
    id: 'm6',
    name: 'The Lovers',
    number: 6,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80',
    keywords: ['Partnership', 'Harmony', 'Value Alignment', 'Choices', 'Dual Soul'],
    element: 'Air',
    astrology: 'Gemini',
    meaningUpright: 'Deep alignment of heart and mind, soulful connections, and choices guided by true personal values.',
    meaningReversed: 'Disharmony, misaligned values, conflict of heart, or hasty decisions.',
    description: 'Two souls standing blessed under the protective wings of Raphael.'
  },
  {
    id: 'm7',
    name: 'The Chariot',
    number: 7,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    keywords: ['Willpower', 'Triumph', 'Determination', 'Direction', 'Focus'],
    element: 'Water',
    astrology: 'Cancer',
    meaningUpright: 'Overcome obstacles through sheer focus, emotional discipline, and unwavering determination.',
    meaningReversed: 'Lack of direction, losing control, feeling overwhelmed by opposing forces.',
    description: 'A warrior guiding two opposing sphinxes forward with concentrated mental strength.'
  },
  {
    id: 'm8',
    name: 'Strength',
    number: 8,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80',
    keywords: ['Inner Strength', 'Compassion', 'Courage', 'Patience', 'Gentle Power'],
    element: 'Fire',
    astrology: 'Leo',
    meaningUpright: 'True power lies in gentle patience, self-mastery, and quiet confidence over force.',
    meaningReversed: 'Self-doubt, emotional vulnerability, raw anger, or lack of internal balance.',
    description: 'A woman gracefully soothing a lion with soft hands and a crown of flowers.'
  },
  {
    id: 'm9',
    name: 'The Hermit',
    number: 9,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&q=80',
    keywords: ['Soul Searching', 'Introspection', 'Inner Guidance', 'Solitude', 'Wisdom'],
    element: 'Earth',
    astrology: 'Virgo',
    meaningUpright: 'Withdraw into quiet reflection to discover your inner truth and illuminate your personal path.',
    meaningReversed: 'Loneliness, isolation, paranoia, or ignoring key self-reflection opportunities.',
    description: 'An elder holding a glowing lantern atop a mountain peak guiding travelers.'
  },
  {
    id: 'm10',
    name: 'Wheel of Fortune',
    number: 10,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80',
    keywords: ['Cycles', 'Karma', 'Destiny', 'Turning Point', 'Inevitable Change'],
    element: 'Fire',
    astrology: 'Jupiter',
    meaningUpright: 'The universe is turning in your favor. Embrace cycles of change and trust karmic momentum.',
    meaningReversed: 'Bad luck, resistance to change, breaking negative repeating loops.',
    description: 'A cosmic wheel surrounded by mythical creatures writing sacred destiny.'
  },
  {
    id: 'm11',
    name: 'Justice',
    number: 11,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
    keywords: ['Fairness', 'Truth', 'Cause and Effect', 'Accountability', 'Law'],
    element: 'Air',
    astrology: 'Libra',
    meaningUpright: 'Truth and fairness will prevail. Make decisions with clarity, integrity, and objectivity.',
    meaningReversed: 'Unfair treatment, refusal to accept responsibility, dishonesty.',
    description: 'A figure holding upright scales and an upright sword balancing truth.'
  },
  {
    id: 'm12',
    name: 'The Hanged Man',
    number: 12,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
    keywords: ['Pause', 'Surrender', 'New Perspective', 'Letting Go', 'Enlightenment'],
    element: 'Water',
    astrology: 'Neptune',
    meaningUpright: 'Pause active striving to gain a new perspective. Surrender releases breakthrough insight.',
    meaningReversed: 'Stalling, needless sacrifice, resistance to letting go of old paradigms.',
    description: 'A haloed figure suspended comfortably upside down from a living tree.'
  },
  {
    id: 'm13',
    name: 'Death',
    number: 13,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400&q=80',
    keywords: ['Transformation', 'Endings', 'Metamorphosis', 'New Era', 'Transition'],
    element: 'Water',
    astrology: 'Scorpio',
    meaningUpright: 'The natural end of a chapter clears space for profound rebirth and spiritual transformation.',
    meaningReversed: 'Fear of change, holding on to dead situations, stagnation.',
    description: 'A knight on a white horse bringing dusk before a glorious sunrise.'
  },
  {
    id: 'm14',
    name: 'Temperance',
    number: 14,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80',
    keywords: ['Balance', 'Moderation', 'Patience', 'Alchemy', 'Inner Peace'],
    element: 'Fire',
    astrology: 'Sagittarius',
    meaningUpright: 'Synthesize opposing forces into calm harmony. Practice patience and moderate emotions.',
    meaningReversed: 'Imbalance, excess, conflicting desires, lack of patience.',
    description: 'An angel pouring liquid gracefully between two golden chalices.'
  },
  {
    id: 'm15',
    name: 'The Devil',
    number: 15,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&q=80',
    keywords: ['Shadow Self', 'Attachment', 'Limiting Beliefs', 'Materialism', 'Awakening'],
    element: 'Earth',
    astrology: 'Capricorn',
    meaningUpright: 'Examine self-imposed limitations, unhealthy attachments, or illusions of helplessness.',
    meaningReversed: 'Breaking free from addiction, release of bondage, conquering fear.',
    description: 'Two figures loosely chained to an altar realizing they can remove the chains anytime.'
  },
  {
    id: 'm16',
    name: 'The Tower',
    number: 16,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80',
    keywords: ['Sudden Shift', 'Revelation', 'Breakthrough', 'Awakening', 'Liberation'],
    element: 'Fire',
    astrology: 'Mars',
    meaningUpright: 'A sudden bolt of truth shatters false foundations to reveal ultimate freedom.',
    meaningReversed: 'Avoiding necessary upheaval, delaying transformation, fear of collapse.',
    description: 'Lightning striking a stone tower, shedding false structures so truth remains.'
  },
  {
    id: 'm17',
    name: 'The Star',
    number: 17,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    keywords: ['Hope', 'Inspiration', 'Renewal', 'Serenity', 'Cosmic Faith'],
    element: 'Air',
    astrology: 'Aquarius',
    meaningUpright: 'A blessing of hope, spiritual renewal, and calm clarity following turbulent times.',
    meaningReversed: 'Hopelessness, lack of faith, cynicism, uninspired outlook.',
    description: 'A maiden pouring waters of renewal beneath eight shining cosmic stars.'
  },
  {
    id: 'm18',
    name: 'The Moon',
    number: 18,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400&q=80',
    keywords: ['Illusion', 'Subconscious', 'Dreams', 'Intuition', 'Uncertainty'],
    element: 'Water',
    astrology: 'Pisces',
    meaningUpright: 'Navigate twilight realms with intuition. Things may not be as they seem on the surface.',
    meaningReversed: 'Release of fear, clarity through illusions, overcoming anxiety.',
    description: 'A wolf and dog howling at a luminous moon over a winding path.'
  },
  {
    id: 'm19',
    name: 'The Sun',
    number: 19,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400&q=80',
    keywords: ['Joy', 'Success', 'Vitality', 'Radiance', 'Truth'],
    element: 'Fire',
    astrology: 'Sun',
    meaningUpright: 'Pure positivity, joyful energy, success, and glowing confidence illuminate your path.',
    meaningReversed: 'Temporary gloom, overly pessimistic outlook, delayed joy.',
    description: 'A child riding a white horse joyfully under a giant glowing golden sun.'
  },
  {
    id: 'm20',
    name: 'Judgement',
    number: 20,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=400&q=80',
    keywords: ['Rebirth', 'Inner Calling', 'Absolution', 'Forgiveness', 'Evaluation'],
    element: 'Fire',
    astrology: 'Pluto',
    meaningUpright: 'Listen to your higher calling, forgive past mistakes, and step into spiritual rebirth.',
    meaningReversed: 'Self-judgment, doubt, ignoring a soul calling, reluctance to forgive.',
    description: 'An archangel sounding the trumpet of awakening calling souls to rise.'
  },
  {
    id: 'm21',
    name: 'The World',
    number: 21,
    arcana: 'Major',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80',
    keywords: ['Completion', 'Wholeness', 'Accomplishment', 'Travel', 'Fulfillment'],
    element: 'Earth',
    astrology: 'Saturn',
    meaningUpright: 'You have reached a significant milestone. Universal wholeness, joy, and mastery.',
    meaningReversed: 'Incomplete goals, lack of closure, lingering loose ends.',
    description: 'A dancing figure encircled in a laurel wreath of cosmic achievement.'
  },
  // Representative Minor Arcana Cards
  {
    id: 'w1',
    name: 'Ace of Wands',
    number: 1,
    arcana: 'Minor',
    suit: 'Wands',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80',
    keywords: ['Inspiration', 'Spark', 'Passion', 'New Opportunity'],
    element: 'Fire',
    meaningUpright: 'A surge of creative fire and sudden inspiration. Pursue new passions with vigor.',
    meaningReversed: 'Delays, lack of direction, creative exhaustion.',
    description: 'A hand holding a sprouting wooden staff reaching out from clouds.'
  },
  {
    id: 'c1',
    name: 'Ace of Cups',
    number: 1,
    arcana: 'Minor',
    suit: 'Cups',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80',
    keywords: ['Love', 'Emotional Overflow', 'Intuition', 'Compassion'],
    element: 'Water',
    meaningUpright: 'An outpouring of unconditional love, deep emotional healing, and spiritual grace.',
    meaningReversed: 'Emotional blockage, feeling drained, repressed feelings.',
    description: 'A chalice overflowing with five streams of living water into a lotus lily pond.'
  },
  {
    id: 's1',
    name: 'Ace of Swords',
    number: 1,
    arcana: 'Minor',
    suit: 'Swords',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
    keywords: ['Clarity', 'Breakthrough', 'Mental Power', 'Truth'],
    element: 'Air',
    meaningUpright: 'Piercing mental clarity, intellectual triumph, and speaking razor-sharp truth.',
    meaningReversed: 'Confusion, harsh words, distorted perspective.',
    description: 'An upright sword encircled by a golden crown and palm branches.'
  },
  {
    id: 'p1',
    name: 'Ace of Pentacles',
    number: 1,
    arcana: 'Minor',
    suit: 'Pentacles',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400&q=80',
    keywords: ['Abundance', 'Financial Opportunity', 'Manifestation', 'Stability'],
    element: 'Earth',
    meaningUpright: 'A tangible opportunity for financial growth, material stability, and practical wealth.',
    meaningReversed: 'Lost financial opportunity, poor planning, insecurity.',
    description: 'A golden coin held above a lush flowering garden pathway.'
  }
];

export const SPREAD_CONFIGS: Record<SpreadType, {
  name: string;
  description: string;
  cardCount: number;
  positions: { title: string; meaning: string }[];
}> = {
  single: {
    name: 'Single Card Reading',
    description: 'Ideal for quick daily guidance, single-focus questions, or instant spiritual insight.',
    cardCount: 1,
    positions: [
      { title: 'Core Guidance', meaning: 'The central message, energy, or lesson for your current moment.' }
    ]
  },
  three_card: {
    name: 'Three Card Spread',
    description: 'Classic Past, Present, and Future timeline evaluation.',
    cardCount: 3,
    positions: [
      { title: 'Past Foundation', meaning: 'Influences and choices that shaped your current situation.' },
      { title: 'Present State', meaning: 'Current energies, mindset, and immediate atmosphere.' },
      { title: 'Future Potential', meaning: 'The likely trajectory if current actions continue.' }
    ]
  },
  relationship: {
    name: 'Relationship Harmony Spread',
    description: 'Deep dive into connection dynamics between two souls or partners.',
    cardCount: 3,
    positions: [
      { title: 'Your Perspective', meaning: 'How you view and contribute to the relationship.' },
      { title: 'Partner Perspective', meaning: 'The other party’s current energy and feelings.' },
      { title: 'Harmonious Synthesis', meaning: 'The shared potential and guidance for mutual growth.' }
    ]
  },
  career: {
    name: 'Career & Purpose Spread',
    description: 'Analyze professional path, obstacles, and financial potential.',
    cardCount: 4,
    positions: [
      { title: 'Current Vocational State', meaning: 'Where you stand right now in your career.' },
      { title: 'Hidden Talents / Opportunity', meaning: 'An untapped strength or emerging opportunity.' },
      { title: 'Potential Obstacle', meaning: 'A challenge to navigate or boundary to set.' },
      { title: 'Recommended Vocational Action', meaning: 'The best strategic step to take next.' }
    ]
  },
  celtic_cross: {
    name: 'Celtic Cross Spread (10 Cards)',
    description: 'The master tarot layout offering a comprehensive 360-degree spiritual audit.',
    cardCount: 10,
    positions: [
      { title: '1. Present Environment', meaning: 'The core theme of your current inquiry.' },
      { title: '2. The Crossing Challenge', meaning: 'The immediate obstacle or catalyst.' },
      { title: '3. Root / Unconscious', meaning: 'Deep underlying sub-conscious motivation.' },
      { title: '4. The Past Foundation', meaning: 'Recent events passing behind you.' },
      { title: '5. Higher Conscious Crown', meaning: 'Your best possible goal or potential.' },
      { title: '6. Immediate Future', meaning: 'Energies arriving in the near term.' },
      { title: '7. Self Stance', meaning: 'Your attitude, confidence, and self-perception.' },
      { title: '8. External Influences', meaning: 'Environmental factors and people around you.' },
      { title: '9. Hopes & Hidden Fears', meaning: 'Deepest desires and internal anxieties.' },
      { title: '10. Ultimate Outcome', meaning: 'The synthesized long-term resolution.' }
    ]
  },
  life_path: {
    name: 'Life Path & Spiritual Alignment',
    description: 'Connect with your higher purpose, elemental balance, and life evolution.',
    cardCount: 5,
    positions: [
      { title: 'Soul Calling', meaning: 'Your true overarching spiritual direction.' },
      { title: 'Mind Alignment', meaning: 'Intellectual clarity and belief patterns.' },
      { title: 'Heart Alignment', meaning: 'Emotional health and passion.' },
      { title: 'Physical Grounding', meaning: 'Body wellness and practical wealth.' },
      { title: 'Spiritual Synthesis', meaning: 'Integration of all dimensions into wholeness.' }
    ]
  }
};
