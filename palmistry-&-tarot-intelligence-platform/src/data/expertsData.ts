import { ConsultTimeSlot, ExpertProfile } from '../types';

export const LIVE_EXPERTS: ExpertProfile[] = [
  {
    id: 'exp_priya',
    name: 'Acharya Priya Sharma',
    title: 'Senior Vedic Astrologer & Palm Line Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    specialties: ['vedic', 'palm'],
    languages: ['Hindi', 'English'],
    bio: 'Vedic Jyotish scholar with 14+ years studying Kundali charts & palmistry. Expert in Dasha timing, career pivot analysis, and gemstone remedies.',
    ratingAvg: 4.96,
    ratingCount: 528,
    acceptsTrials: true,
    rateInr: 1499,
    timezone: 'Asia/Kolkata',
    presence: 'online',
    city: 'Varanasi',
    experienceYears: 14,
    badge: '🌟 Top Rated Vedic Seer',
    accentColor: '#F59E0B'
  },
  {
    id: 'exp_arjun',
    name: 'Arjun Mehta',
    title: 'Grandmaster Tarot Reader & Intuitive Empath',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialties: ['tarot'],
    languages: ['English', 'Hindi', 'Gujarati'],
    bio: 'Rider-Waite-Smith & Thoth tarot interpreter specializing in twin flame dynamics, karmic blockages, and career transitions.',
    ratingAvg: 4.91,
    ratingCount: 412,
    acceptsTrials: true,
    rateInr: 1299,
    timezone: 'Asia/Kolkata',
    presence: 'online',
    city: 'Mumbai',
    experienceYears: 9,
    badge: '⚡ Instant Connection Available',
    accentColor: '#8B5CF6'
  },
  {
    id: 'exp_kavita',
    name: 'Dr. Kavita Rao',
    title: 'Clinical Chiromancy & Dermatoglyphics Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    specialties: ['palm', 'vedic'],
    languages: ['English', 'Telugu', 'Hindi'],
    bio: 'Combines traditional Hastarekha Shastra with modern palm ridge analysis. Explains life, head, heart, and fate lines with scientific clarity.',
    ratingAvg: 4.98,
    ratingCount: 684,
    acceptsTrials: true,
    rateInr: 1899,
    timezone: 'Asia/Kolkata',
    presence: 'busy',
    city: 'Hyderabad',
    experienceYears: 16,
    badge: '🔬 Master Chiromancer',
    accentColor: '#10B981'
  },
  {
    id: 'exp_celeste',
    name: 'Madame Celeste Beaumont',
    title: 'Hermetic Tarot Reader & Western Astrologer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    specialties: ['tarot', 'western'],
    languages: ['English', 'French'],
    bio: 'Specialist in Celtic Cross spreads, astrological houses, and Saturn return guidance. Known for empathetic, accurate predictive readings.',
    ratingAvg: 4.93,
    ratingCount: 570,
    acceptsTrials: true,
    rateInr: 1699,
    timezone: 'Asia/Kolkata',
    presence: 'online',
    city: 'Bengaluru',
    experienceYears: 11,
    badge: '🔮 Celtic Tarot Expert',
    accentColor: '#EC4899'
  },
  {
    id: 'exp_meera',
    name: 'Sister Meera D’Souza',
    title: 'Western Natal Astrologer & Synastry Guide',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    specialties: ['western'],
    languages: ['English', 'Marathi'],
    bio: 'Tropical astrology, transits, and psychological natal chart work. Best for Western birth-chart seekers and relationship compatibility.',
    ratingAvg: 4.87,
    ratingCount: 310,
    acceptsTrials: false,
    rateInr: 1399,
    timezone: 'Asia/Kolkata',
    presence: 'offline',
    city: 'Pune',
    experienceYears: 8,
    badge: 'Natal Specialist',
    accentColor: '#3B82F6'
  }
];

const SLOT_HOURS_IST = [10, 14, 18, 20];

export const generateSlotsForExpert = (expert: ExpertProfile): ConsultTimeSlot[] => {
  const slots: ConsultTimeSlot[] = [];
  const now = new Date();

  if (expert.presence === 'online') {
    const start = new Date(now.getTime() + 12 * 60 * 1000);
    const end = new Date(start.getTime() + 20 * 60 * 1000);
    slots.push({
      id: `${expert.id}_instant`,
      expertId: expert.id,
      startUtc: start.toISOString(),
      endUtc: end.toISOString(),
      type: 'instant'
    });
  }

  for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
    for (const hour of SLOT_HOURS_IST) {
      const start = new Date(now);
      start.setUTCDate(start.getUTCDate() + dayOffset);
      // 10:00 IST = 04:30 UTC
      start.setUTCHours(hour - 5, 30, 0, 0);
      if (start.getTime() <= now.getTime() + 30 * 60 * 1000) continue;
      const end = new Date(start.getTime() + 20 * 60 * 1000);
      slots.push({
        id: `${expert.id}_${start.toISOString()}`,
        expertId: expert.id,
        startUtc: start.toISOString(),
        endUtc: end.toISOString(),
        type: 'scheduled'
      });
    }
  }

  return slots;
};
