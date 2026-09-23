import { PalmFeatures } from '../types';

export interface SamplePalmDatasetItem {
  id: string;
  name: string;
  handSide: 'Right Hand' | 'Left Hand';
  imageUrl: string;
  description: string;
  landmarks: { x: number; y: number; id: number; name: string }[];
  palmFeatures: PalmFeatures;
}

// MediaPipe 21 Hand Landmark relative coordinates normalized (0.0 to 1.0)
export const SAMPLE_PALMS: SamplePalmDatasetItem[] = [
  {
    id: 'freihand_sample_1',
    name: 'Right Palm - Balanced Explorer (FreiHAND Sample #102)',
    handSide: 'Right Hand',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
    description: 'A deep, well-defined Life Line and elevated Mount of Jupiter indicating strong leadership and high vitality.',
    landmarks: [
      { id: 0, name: 'WRIST', x: 0.5, y: 0.85 },
      { id: 1, name: 'THUMB_CMC', x: 0.38, y: 0.75 },
      { id: 2, name: 'THUMB_MCP', x: 0.28, y: 0.65 },
      { id: 3, name: 'THUMB_IP', x: 0.22, y: 0.52 },
      { id: 4, name: 'THUMB_TIP', x: 0.18, y: 0.42 },
      { id: 5, name: 'INDEX_FINGER_MCP', x: 0.38, y: 0.45 },
      { id: 6, name: 'INDEX_FINGER_PIP', x: 0.35, y: 0.32 },
      { id: 7, name: 'INDEX_FINGER_DIP', x: 0.33, y: 0.22 },
      { id: 8, name: 'INDEX_FINGER_TIP', x: 0.31, y: 0.12 },
      { id: 9, name: 'MIDDLE_FINGER_MCP', x: 0.50, y: 0.44 },
      { id: 10, name: 'MIDDLE_FINGER_PIP', x: 0.50, y: 0.28 },
      { id: 11, name: 'MIDDLE_FINGER_DIP', x: 0.50, y: 0.18 },
      { id: 12, name: 'MIDDLE_FINGER_TIP', x: 0.50, y: 0.08 },
      { id: 13, name: 'RING_FINGER_MCP', x: 0.62, y: 0.46 },
      { id: 14, name: 'RING_FINGER_PIP', x: 0.65, y: 0.31 },
      { id: 15, name: 'RING_FINGER_DIP', x: 0.66, y: 0.21 },
      { id: 16, name: 'RING_FINGER_TIP', x: 0.68, y: 0.11 },
      { id: 17, name: 'PINKY_MCP', x: 0.72, y: 0.50 },
      { id: 18, name: 'PINKY_PIP', x: 0.77, y: 0.40 },
      { id: 19, name: 'PINKY_DIP', x: 0.80, y: 0.32 },
      { id: 20, name: 'PINKY_TIP', x: 0.82, y: 0.25 }
    ],
    palmFeatures: {
      handType: 'Fire',
      lifeLine: {
        name: 'Life Line',
        length: 'Long',
        quality: 'Clear',
        interpretation: 'Robust physical vitality, great resilience under stress, and long emotional stamina.',
        confidence: 0.94
      },
      headLine: {
        name: 'Head Line',
        length: 'Long',
        quality: 'Clear',
        interpretation: 'Exceptional analytical capability, logical clarity, and long-term strategic focus.',
        confidence: 0.91
      },
      heartLine: {
        name: 'Heart Line',
        length: 'Long',
        quality: 'Forked',
        interpretation: 'Warm, passionate nature with a healthy balance of romantic ideals and practical loyalty.',
        confidence: 0.89
      },
      fateLine: {
        name: 'Fate Line',
        length: 'Medium',
        quality: 'Clear',
        interpretation: 'Self-made career path; major professional shifts occurring around age 32.',
        confidence: 0.86
      },
      sunLine: {
        name: 'Sun Line (Apollo)',
        length: 'Medium',
        quality: 'Clear',
        interpretation: 'Strong creative flair, artistic appreciation, and good social recognition.',
        confidence: 0.82
      },
      fingerStructure: {
        thumbFlexibility: 'Flexible (Creative & Adaptable)',
        indexLength: 'Long (Natural Leader)',
        ringToIndexRatio: '1.02 (Balanced Risk Taker)'
      },
      mounts: {
        venus: 'Prominent - Warm, empathetic & generous',
        jupiter: 'Elevated - Strong ambition & social drive',
        saturn: 'Flat - Grounded, responsible, reflective',
        apollo: 'Well-formed - Aesthetic sense & public charm'
      },
      detectionConfidence: 0.92,
      landmarksCount: 21
    }
  },
  {
    id: 'freihand_sample_2',
    name: 'Left Palm - Intuitive Visionary (FreiHAND Sample #214)',
    handSide: 'Left Hand',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80',
    description: 'Sloping Head Line into Mount of Moon with prominent Sun Line indicating high creative intuition.',
    landmarks: [
      { id: 0, name: 'WRIST', x: 0.5, y: 0.85 },
      { id: 1, name: 'THUMB_CMC', x: 0.62, y: 0.75 },
      { id: 2, name: 'THUMB_MCP', x: 0.72, y: 0.65 },
      { id: 3, name: 'THUMB_IP', x: 0.78, y: 0.52 },
      { id: 4, name: 'THUMB_TIP', x: 0.82, y: 0.42 },
      { id: 5, name: 'INDEX_FINGER_MCP', x: 0.62, y: 0.45 },
      { id: 6, name: 'INDEX_FINGER_PIP', x: 0.65, y: 0.32 },
      { id: 7, name: 'INDEX_FINGER_DIP', x: 0.67, y: 0.22 },
      { id: 8, name: 'INDEX_FINGER_TIP', x: 0.69, y: 0.12 },
      { id: 9, name: 'MIDDLE_FINGER_MCP', x: 0.50, y: 0.44 },
      { id: 10, name: 'MIDDLE_FINGER_PIP', x: 0.50, y: 0.28 },
      { id: 11, name: 'MIDDLE_FINGER_DIP', x: 0.50, y: 0.18 },
      { id: 12, name: 'MIDDLE_FINGER_TIP', x: 0.50, y: 0.08 },
      { id: 13, name: 'RING_FINGER_MCP', x: 0.38, y: 0.46 },
      { id: 14, name: 'RING_FINGER_PIP', x: 0.35, y: 0.31 },
      { id: 15, name: 'RING_FINGER_DIP', x: 0.34, y: 0.21 },
      { id: 16, name: 'RING_FINGER_TIP', x: 0.32, y: 0.11 },
      { id: 17, name: 'PINKY_MCP', x: 0.28, y: 0.50 },
      { id: 18, name: 'PINKY_PIP', x: 0.23, y: 0.40 },
      { id: 19, name: 'PINKY_DIP', x: 0.20, y: 0.32 },
      { id: 20, name: 'PINKY_TIP', x: 0.18, y: 0.25 }
    ],
    palmFeatures: {
      handType: 'Water',
      lifeLine: {
        name: 'Life Line',
        length: 'Long',
        quality: 'Forked',
        interpretation: 'Deep connection to travel, desire for spiritual exploration, and versatile energy.',
        confidence: 0.92
      },
      headLine: {
        name: 'Head Line',
        length: 'Long',
        quality: 'Chained',
        interpretation: 'Highly imaginative, intuitive thinker with rich artistic sensitivity and vivid dreaming.',
        confidence: 0.88
      },
      heartLine: {
        name: 'Heart Line',
        length: 'Long',
        quality: 'Clear',
        interpretation: 'Deep empathy and unconditional emotional openness; strong instinct for healing.',
        confidence: 0.90
      },
      fateLine: {
        name: 'Fate Line',
        length: 'Long',
        quality: 'Clear',
        interpretation: 'Steadfast sense of purpose starting early in life; high career consistency.',
        confidence: 0.87
      },
      sunLine: {
        name: 'Sun Line (Apollo)',
        length: 'Long',
        quality: 'Clear',
        interpretation: 'High potential for public acclaim, personal charisma, and artistic fulfillment.',
        confidence: 0.85
      },
      fingerStructure: {
        thumbFlexibility: 'Very Flexible (High Intuition)',
        indexLength: 'Medium (Collaborative Spirit)',
        ringToIndexRatio: '0.98 (Thoughtful & Measured)'
      },
      mounts: {
        venus: 'Moderate - High emotional discernment',
        jupiter: 'Well-formed - Gentle wisdom',
        saturn: 'Prominent - Serious dedication',
        apollo: 'High Mount - Glowing creativity'
      },
      detectionConfidence: 0.90,
      landmarksCount: 21
    }
  }
];

export const PALM_ELEMENT_TYPES = {
  Earth: {
    title: 'Earth Palm (Practical & Grounded)',
    traits: 'Square palm with short fingers. Honest, hardworking, stable, and deeply connected to nature and physical reality.',
    color: 'emerald'
  },
  Air: {
    title: 'Air Palm (Intellectual & Communicative)',
    traits: 'Square palm with long fingers. Analytical, articulate, inquisitive, and thrives on intellectual connection.',
    color: 'sky'
  },
  Fire: {
    title: 'Fire Palm (Dynamic & Passionate)',
    traits: 'Long palm with short fingers. Energetic, charismatic, bold, driven by passion and immediate action.',
    color: 'amber'
  },
  Water: {
    title: 'Water Palm (Sensitive & Intuitive)',
    traits: 'Long palm with long graceful fingers. Highly imaginative, empathetic, attuned to spiritual currents and fine art.',
    color: 'indigo'
  }
};
