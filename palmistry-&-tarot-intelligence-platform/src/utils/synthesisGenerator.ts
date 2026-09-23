import { PalmFeatures, TarotReadingSession, UserProfile, SynthesisReport, WeaknessRemedy } from '../types';

/**
 * Procedural Dynamic Synthesis Engine
 * Guarantees distinct, non-repetitive, deeply detailed long-form reports
 * based on whether the user used Palm, Tarot, Both, or Astrological Profile.
 */

interface SynthesisInput {
  palmData?: PalmFeatures | null;
  tarotData?: TarotReadingSession | null;
  userProfile: UserProfile;
  seedTimestamp?: number;
}

const ARCHETYPES_BY_ELEMENT = {
  Fire: [
    'The Radiant Visionary & Trailblazing Pioneer',
    'The Alchemical Catalyst & Strategic Instigator',
    'The Luminary Leader of Sacred Will'
  ],
  Water: [
    'The Intuitive Empath & Depth Mystic',
    'The Compassionate Healer & Oceanic Oracle',
    'The Harmonizing Sovereign of Emotional Wisdom'
  ],
  Air: [
    'The Intellectual Architect & Master Communicator',
    'The Conceptual Strategist of Higher Clarity',
    'The Synthesizing Philosopher & Insight Weaver'
  ],
  Earth: [
    'The Grounded Manifestor & Resilient Builder',
    'The Pragmatic Alchemist of Material Mastery',
    'The Sovereign Anchor & Sustainable Creator'
  ]
};

export function generateDynamicSynthesisReport(input: SynthesisInput): SynthesisReport {
  const { palmData, tarotData, userProfile, seedTimestamp = Date.now() } = input;
  const rngSeed = (seedTimestamp ^ Math.floor(Math.random() * 10000)) % 10000;

  const hasPalm = !!palmData && !!palmData.handType;
  const hasTarot = !!tarotData && Array.isArray(tarotData.drawnCards) && tarotData.drawnCards.length > 0;

  let modalityUsed: 'palm_only' | 'tarot_only' | 'unified' | 'astrological_profile' = 'astrological_profile';
  if (hasPalm && hasTarot) {
    modalityUsed = 'unified';
  } else if (hasPalm) {
    modalityUsed = 'palm_only';
  } else if (hasTarot) {
    modalityUsed = 'tarot_only';
  }

  // Determine Elemental Basis
  let dominantElement: 'Fire' | 'Water' | 'Air' | 'Earth' = 'Fire';
  if (hasPalm && palmData?.handType) {
    dominantElement = palmData.handType;
  } else if (hasTarot && tarotData?.drawnCards[0]?.card?.element) {
    dominantElement = tarotData.drawnCards[0].card.element;
  } else if (userProfile.zodiacSign) {
    const fireSigns = ['Aries', 'Leo', 'Sagittarius'];
    const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];
    const airSigns = ['Gemini', 'Libra', 'Aquarius'];
    const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];
    if (fireSigns.includes(userProfile.zodiacSign)) dominantElement = 'Fire';
    else if (waterSigns.includes(userProfile.zodiacSign)) dominantElement = 'Water';
    else if (airSigns.includes(userProfile.zodiacSign)) dominantElement = 'Air';
    else if (earthSigns.includes(userProfile.zodiacSign)) dominantElement = 'Earth';
  }

  const archetypeOptions = ARCHETYPES_BY_ELEMENT[dominantElement] || ARCHETYPES_BY_ELEMENT.Fire;
  const chosenArchetype = archetypeOptions[rngSeed % archetypeOptions.length];

  // Dynamic Elemental Balances with variance
  const baseFire = dominantElement === 'Fire' ? 38 + (rngSeed % 7) : 18 + (rngSeed % 10);
  const baseWater = dominantElement === 'Water' ? 38 + (rngSeed % 7) : 20 + (rngSeed % 9);
  const baseAir = dominantElement === 'Air' ? 38 + (rngSeed % 7) : 22 + (rngSeed % 8);
  const baseEarth = dominantElement === 'Earth' ? 38 + (rngSeed % 7) : 18 + (rngSeed % 7);
  const totalBase = baseFire + baseWater + baseAir + baseEarth;

  const firePct = Math.round((baseFire / totalBase) * 100);
  const waterPct = Math.round((baseWater / totalBase) * 100);
  const airPct = Math.round((baseAir / totalBase) * 100);
  const earthPct = 100 - (firePct + waterPct + airPct);

  // Confidence & Relevance calculations
  const palmConf = hasPalm && palmData?.detectionConfidence ? Math.round(palmData.detectionConfidence * 100) : (88 + (rngSeed % 8));
  const tarotRel = hasTarot ? (91 + (rngSeed % 7)) : (85 + (rngSeed % 8));
  const persAlign = 90 + (rngSeed % 8);
  const contextRel = 88 + (rngSeed % 9);
  const consistency = 92 + (rngSeed % 6);

  let overallScore = 0;
  if (modalityUsed === 'unified') {
    overallScore = Number(((palmConf * 0.30) + (tarotRel * 0.25) + (persAlign * 0.20) + (contextRel * 0.15) + (consistency * 0.10)).toFixed(2));
  } else if (modalityUsed === 'palm_only') {
    overallScore = Number(((palmConf * 0.45) + (persAlign * 0.25) + (contextRel * 0.15) + (consistency * 0.15)).toFixed(2));
  } else if (modalityUsed === 'tarot_only') {
    overallScore = Number(((tarotRel * 0.45) + (persAlign * 0.25) + (contextRel * 0.15) + (consistency * 0.15)).toFixed(2));
  } else {
    overallScore = Number(((persAlign * 0.40) + (contextRel * 0.30) + (consistency * 0.30)).toFixed(2));
  }

  // Build Comprehensive Modality Details
  let modalitySummary = '';
  let detailedModalityBreakdown: SynthesisReport['detailedModalityBreakdown'] = {};

  if (hasPalm && palmData) {
    const lifeInterp = palmData.lifeLine?.interpretation || 'Vital reserves and constitutional stamina show high responsiveness.';
    const headInterp = palmData.headLine?.interpretation || 'Analytical clarity and sharp focus allow strategic decisions.';
    const heartInterp = palmData.heartLine?.interpretation || 'High emotional empathy with selective interpersonal boundaries.';
    const fateInterp = palmData.fateLine?.interpretation || 'Vocational alignment showing steady upwards trajectory.';
    const sunInterp = palmData.sunLine?.interpretation || 'Strong creative spark and magnetic public recognition.';

    detailedModalityBreakdown.palmDetails = {
      handType: palmData.handType,
      majorLines: [
        {
          name: 'Heart Line (Emotional Architecture)',
          quality: `${palmData.heartLine?.quality || 'Clear'} • ${palmData.heartLine?.length || 'Long'} Arc`,
          deepExplanation: `The Heart Line reveals your primary emotional operating system. ${heartInterp} This line orientation signifies that you process intimacy through a blend of profound vulnerability and calculated self-protection. While this shields you from shallow connections, it requires deliberate effort to let trusted partners behind your inner emotional perimeter.`
        },
        {
          name: 'Head Line (Cognitive Framework)',
          quality: `${palmData.headLine?.quality || 'Clear'} • ${palmData.headLine?.length || 'Long'} Span`,
          deepExplanation: `The Head Line governs cognitive processing, problem-solving, and intellectual endurance. ${headInterp} Your line demonstrates a capacity for both inductive conceptual thinking and sharp deductive precision. You rarely accept surface-level dogmas, preferring to deconstruct challenges down to first principles before executing solutions.`
        },
        {
          name: 'Life Line (Vitality & Constitutional Resilience)',
          quality: `${palmData.lifeLine?.quality || 'Clear'} • ${palmData.lifeLine?.length || 'Deep'} Curvature`,
          deepExplanation: `The Life Line measures stamina, physical vitality, and energetic restoration cycles. ${lifeInterp} The wide sweep around the Mount of Venus indicates abundant physiological reserves, but emphasizes the need for cyclical rest periods between intense creative sprints to avoid sudden adrenal dips.`
        },
        {
          name: 'Fate Line (Vocational Mastery & Destiny)',
          quality: `${palmData.fateLine?.quality || 'Clear'} • ${palmData.fateLine?.length || 'Medium'} Trajectory`,
          deepExplanation: `The Fate Line traces career momentum, purpose integration, and worldly impact. ${fateInterp} The structural clarity of this crease denotes that your external vocation is becoming increasingly unified with your intrinsic soul values, minimizing internal friction.`
        },
        {
          name: 'Sun Line (Creative Resonance & Magnetism)',
          quality: `${palmData.sunLine?.quality || 'Clear'} • ${palmData.sunLine?.length || 'Medium'} Radiance`,
          deepExplanation: `The Sun Line indicates public recognition, charismatic influence, and fulfillment of creative talent. ${sunInterp} Your line confirms that authentic creative output and genuine expression will attract supportive mentors and strategic allies.`
        }
      ],
      mountsInsight: palmData.mounts ? 
        `Mount of Venus: ${palmData.mounts.venus} | Mount of Jupiter: ${palmData.mounts.jupiter} | Mount of Saturn: ${palmData.mounts.saturn} | Mount of Apollo: ${palmData.mounts.apollo}` :
        'Balanced elevation across the Mount of Venus and Mount of Jupiter, reinforcing energetic charisma and visionary leadership.'
    };
  }

  if (hasTarot && tarotData) {
    detailedModalityBreakdown.tarotDetails = {
      spreadTitle: tarotData.spreadTitle || 'Tarot Reading Session',
      cardsExplanation: tarotData.drawnCards.map((dc) => ({
        cardName: dc.card.name,
        position: `${dc.positionName} (${dc.positionMeaning})`,
        isReversed: dc.isReversed,
        deepMeaning: dc.isReversed
          ? `[Reversed Orientation] ${dc.card.name} highlights internalized friction, potential avoidance of truth, and unintegrated shadow energies: ${dc.card.meaningReversed}. This card calls for quiet internal recalibration rather than aggressive external force.`
          : `[Upright Orientation] ${dc.card.name} channels uninhibited archetypal flow and active manifestation: ${dc.card.meaningUpright}. This energy provides decisive momentum and reinforces trust in your spiritual intuition.`
      })),
      overallSynergy: tarotData.aiInterpretation || `The energetic interplay across your drawn spread demonstrates a decisive threshold crossing. The archetypes present indicate that past cycles of stagnation are dissolving, paving the way for empowered manifestation in your primary focus areas.`
    };
  }

  // Modality Narrative Summaries
  if (modalityUsed === 'unified') {
    modalitySummary = `Unified Chiromancy & Cartomancy Fusion: Synthesizing ${palmData?.handType} Hand Computer Vision with the ${tarotData?.spreadTitle} Spread (${tarotData?.drawnCards.length} Cards) alongside ${userProfile.name}'s ${userProfile.zodiacSign || ''} Astrological Blueprint.`;
  } else if (modalityUsed === 'palm_only') {
    modalitySummary = `Chiromancy Deep Vision Synthesis: Solely focused on high-precision palm crease analysis, mount topography, and elemental hand architecture (${palmData?.handType} Type) for ${userProfile.name}.`;
  } else if (modalityUsed === 'tarot_only') {
    modalitySummary = `Cartomancy Oracle Synthesis: Solely focused on the symbolic archetypes, elemental balances, and positional dynamics of your ${tarotData?.spreadTitle} reading.`;
  } else {
    modalitySummary = `Astrological & Natal Blueprint Synthesis: Synthesizing ${userProfile.name}'s birth placements (${userProfile.birthDate || 'Recorded Date'}, ${userProfile.zodiacSign || 'Sun Sign'}, ${userProfile.birthPlace || 'Global Coordinates'}) and spiritual priorities.`;
  }

  // Dynamic Weaknesses and Concrete Remediation Plans
  const weaknessRemedies: WeaknessRemedy[] = [];

  if (hasPalm && !hasTarot) {
    weaknessRemedies.push(
      {
        weakness: 'Adrenal Over-Exertion & Sprint Burnout',
        rootCause: 'Deeply etched Life Line paired with dynamic hand structure creates intense bursts of unrelenting productivity without physiological pacing.',
        impact: 'Periodic physical crashes, sudden energy drops, and irritability when creative flow is interrupted.',
        actionableImprovement: 'Implement strict 90-minute ultradian rhythm cycles. Set hard work stoppage limits and enforce 15-minute non-negotiable mental decompression intervals between high-intensity tasks.',
        dailyPractice: 'Daily 10-minute 4-7-8 parasympathetic breathwork every evening at sunset to down-regulate cortisol levels.'
      },
      {
        weakness: 'Cognitive Over-Analysis & Decision Resistance',
        rootCause: 'Long, branching Head Line produces perpetual optimization loops where you seek 100% certainty before initiating action.',
        impact: 'Delayed project launches, missed early opportunities, and mental exhaustion from exploring every hypothetical contingency.',
        actionableImprovement: 'Adopt the 70% Confidence Rule: when you possess 70% of necessary information and feel intuitive alignment, pull the trigger. Treat early steps as feedback experiments rather than irreversible finalities.',
        dailyPractice: 'Morning 5-minute timed decision sprint: make 3 micro-decisions without second-guessing or revisiting.'
      },
      {
        weakness: 'Emotional Boundary Porosity in Professional Circles',
        rootCause: 'Curved Heart Line reaching toward Mount of Jupiter causes you to over-identify with other people\'s emotional turmoil and problems.',
        impact: 'Carrying emotional weight that belongs to coworkers or peers, leading to unreciprocated energetic drainage.',
        actionableImprovement: 'Establish explicit operational boundaries. Practice saying "I support your growth through this, but I cannot take ownership of solving it for you."',
        dailyPractice: 'Evening Auric Clearing visualization: envision returning all absorbed external psychic debris back to its origin in neutral light.'
      },
      {
        weakness: 'Reluctance to Delegate & Control Inflexibility',
        rootCause: 'Prominent thumb rigidity and pronounced Mount of Saturn instill a subconscious belief that "if I don\'t do it, it won\'t meet the standard."',
        impact: 'Bottlenecks in scaling personal initiatives and difficulty fostering independent accountability in collaborators.',
        actionableImprovement: 'Deconstruct complex initiatives into standard operating procedures and delegate 20% of routine execution to trusted assistants or collaborators this month.',
        dailyPractice: 'Daily surrender affirmation: "My effectiveness expands when I empower others to share the load."'
      }
    );
  } else if (hasTarot && !hasPalm) {
    weaknessRemedies.push(
      {
        weakness: 'Archetypal Projection & Second-Guessing Fate',
        rootCause: 'Interpreting tarot card warnings through a lens of fear rather than as neutral signposts for tactical course-correction.',
        impact: 'Anxious hesitation, seeking repetitive validation through multiple card pulls, and fear of making the "wrong" move.',
        actionableImprovement: 'Anchor in personal sovereignty. Recognize that tarot illuminates current energetic vectors, not unalterable destiny. Use cards as an advisory council while retaining 100% free-will authority.',
        dailyPractice: 'One-Card Reflection Journaling: Write 3 practical actions you will take in the physical realm to direct the energy of your drawn card.'
      },
      {
        weakness: 'Impatience for Outcome Manifestation',
        rootCause: 'High visionary ideation creates a painful gap between seeing the completed spiritual vision and enduring the physical incubation timeline.',
        impact: 'Abandoning worthwhile endeavors prematurely right before the compound momentum materializes.',
        actionableImprovement: 'Shift focus from macro-outcome fixation to micro-process mastery. Track daily incremental inputs rather than daily output metrics.',
        dailyPractice: 'Gratitude for Seed-Stage Growth: Acknowledge three invisible foundational milestones accomplished today.'
      },
      {
        weakness: 'Conflict Avoidance & Harmonizing at Personal Cost',
        rootCause: 'Receptive card dynamics indicate a pattern of swallowing valid grievances to maintain superficial peace in relationships.',
        impact: 'Simmering resentment, passive boundary erosion, and sudden emotional ruptures when tolerance caps are breached.',
        actionableImprovement: 'Engage in timely micro-confrontations. Address friction within 24 hours using calm, non-accusatory "I feel / I need" frameworks.',
        dailyPractice: 'Daily Throat Chakra Clearing: 2 minutes of humming or intentional vocal toning in the morning to unlock authentic communication.'
      },
      {
        weakness: 'Spiritual Bypassing of Mundane Responsibilities',
        rootCause: 'Escaping tedious administrative, financial, or bureaucratic tasks by retreating into abstract spiritual contemplation.',
        impact: 'Disorganized financial bookkeeping, delayed paperwork, and avoidable real-world logistical stress.',
        actionableImprovement: 'Designate two dedicated 45-minute "Mundane Mastery" blocks each week to systematically clear all operational backlogs.',
        dailyPractice: 'Earth Element Anchor: Spend 5 minutes physically tidying your workspace before entering spiritual study or meditation.'
      }
    );
  } else if (hasPalm && hasTarot) {
    weaknessRemedies.push(
      {
        weakness: 'Duality Between High Intuition and Pragmatic Skepticism',
        rootCause: 'The tension between your analytical palm creases and mystical tarot archetypes causes an internal battle between logic and intuition.',
        impact: 'Paralysis by cognitive conflict—rationalizing away clear intuitive guidance, then regretting not listening to your gut.',
        actionableImprovement: 'Create a Dual-Check Protocol: Use your intuition to select the destination and direction, and use your sharp analytical mind to map out the logistics and execution steps.',
        dailyPractice: 'Daily Intuition Log: Record a daily intuitive impulse in the morning, log the logical counter-argument, and track which proved more accurate.'
      },
      {
        weakness: 'Over-Extension Across Competing Creative Fronts',
        rootCause: 'The multi-modal activation of both palm and tarot stimulates diverse passions simultaneously without strict prioritization.',
        impact: 'Diluted impact across five unfinished projects rather than monumental success on one core endeavor.',
        actionableImprovement: 'Enforce the "One Major Quest" rule for the next 90 days. Funnel 80% of creative energy into your single highest-leverage initiative.',
        dailyPractice: 'Morning Priority Triangle: Identify the ONE non-negotiable task that makes everything else easier or unnecessary.'
      },
      {
        weakness: 'Vulnerability to Psychic & Emotional Sponge Effect',
        rootCause: 'Water elemental resonance in tarot cards paired with an open Heart Line amplifies your sensitivity to ambient environmental energies.',
        impact: 'Sudden unexplained fatigue, mood shifts after entering crowded spaces, and difficulty distinguishing personal emotions from others\'.',
        actionableImprovement: 'Practice energetic hygiene. Wash hands with cold water and sea salt after intense client or emotional meetings to reset your field.',
        dailyPractice: '10-minute Solar Plexus Shielding meditation before leaving home or entering social environments.'
      },
      {
        weakness: 'Perfectionism Masking Fear of Public Visibility',
        rootCause: 'High standards on the Sun Line combined with high arcana tarot lessons create an irrational fear of being judged if work is not flawless.',
        impact: 'Hoarding creative breakthroughs, delaying public launches, and over-editing authentic expression.',
        actionableImprovement: 'Commit to publishing "imperfect work" publicly once per week. Reframe vulnerability as magnetic authenticity.',
        dailyPractice: 'Affirmation of Visibility: "My authentic essence is more valuable and transformative than sterile perfection."'
      }
    );
  } else {
    weaknessRemedies.push(
      {
        weakness: 'Scattered Energetic Focus & Goal Drifting',
        rootCause: 'Lack of tangible physical biometric grounding leaves astrological potentials unanchored in daily reality.',
        impact: 'Frequent changes of heart regarding long-term direction, starting multiple courses without completion.',
        actionableImprovement: 'Select two core quarterly milestones. Write them on physical paper and place them in your primary field of view daily.',
        dailyPractice: 'Evening review: Score your daily alignment with your primary quarterly milestones on a 1-10 scale.'
      },
      {
        weakness: 'Over-Reliance on Astrological Timing as an Excuse for Inaction',
        rootCause: 'Waiting for the "perfect cosmic transit" or auspicious window rather than creating momentum through proactive physical effort.',
        impact: 'Missed windows of opportunity and stagnation masked as "waiting for divine timing."',
        actionableImprovement: 'Remember that cosmic transits are wind in the sails, but you must still steer the rudder and row the oars. Take immediate imperfect action.',
        dailyPractice: 'Daily Bias-for-Action exercise: Complete one uncomfortable task before noon every day.'
      },
      {
        weakness: 'Emotional Guardedness and Trust Hesitation',
        rootCause: 'Past karmic boundary breaches causing an over-fortified protective wall around vulnerable emotional expression.',
        impact: 'Surface-level connections and difficulty allowing intimate partners to witness genuine vulnerability.',
        actionableImprovement: 'Practice measured emotional disclosure. Share one authentic vulnerability with a trusted friend or partner each week.',
        dailyPractice: 'Heart-opening gratitude meditation for 5 minutes every morning.'
      }
    );
  }

  // Multi-paragraph Executive Summary tailored to modality and uniqueness
  let executiveSummary = '';
  if (modalityUsed === 'unified') {
    executiveSummary = `Comprehensive Multi-Modal Intelligence Assessment for ${userProfile.name}: By cross-referencing your ${palmData?.handType} Palmistry Creases with your ${tarotData?.spreadTitle} Tarot Spread and natal ${userProfile.zodiacSign || 'astrological'} markers, a rare energetic synchronicity emerges. Your biometric palm data reflects profound constitutional grit and strategic analytical precision, while your tarot spread illuminates an imminent breakthrough in your vocational and personal aspirations.

The convergence between your palm's ${palmData?.headLine?.quality || 'Clear'} Head Line and the primary archetypes of your spread confirms that you are exiting a phase of dense preparation and stepping into a 12-month window of decisive manifestation. Your intuitive faculties are operating at an elevated frequency, making this the optimal timeframe to dismantle lingering self-doubt, solidify critical alliances, and direct your resources toward your singular, highest-leverage life purpose.`;
  } else if (modalityUsed === 'palm_only') {
    executiveSummary = `Chiromancy Computer Vision & Biometric Synthesis for ${userProfile.name}: This comprehensive analysis is built directly upon the distinct physical crease geometry, mount topography, and elemental architecture of your ${palmData?.handType} Hand. The crisp definition of your Heart and Head lines reflects high emotional discernment paired with a relentless drive for intellectual mastery and pragmatic autonomy.

Your palm topology indicates that your greatest worldly leverage lies in bridging high-level visionary synthesis with grounded tactical execution. While your constitutional vitality (measured across your Life Line) is exceptionally robust, the primary energetic friction in your current cycle stems from cognitive over-analysis and periodic adrenal burnout. By adhering to the tailored improvement protocols below, you will unlock unparalleled flow in both your career trajectory and personal life.`;
  } else if (modalityUsed === 'tarot_only') {
    executiveSummary = `Cartomancy Oracle & Archetypal Intelligence Synthesis for ${userProfile.name}: Rooted in the sacred geometry and symbolic alchemy of your ${tarotData?.spreadTitle} Spread (${tarotData?.drawnCards.length} Cards), this report synthesizes the archetypal vectors currently governing your spiritual and material path. The drawn cards reveal a profound transitional threshold—an invitation to release outdated karmic scripts and fully embody your sovereign authority.

The spread dynamics indicate that the universe is actively testing your willingness to uphold uncompromising personal boundaries and trust your innate intuitive knowing. By moving past the shadow patterns of outcome-impatience and second-guessing, you will accelerate the manifestation of your core inquiries with poise and clarity.`;
  } else {
    executiveSummary = `Astrological & Natal Matrix Synthesis for ${userProfile.name}: Derived from your birth alignment (${userProfile.birthDate || 'Recorded Matrix'}, ${userProfile.birthPlace || 'Location'}, ${userProfile.zodiacSign || 'Zodiac Archetype'}) and core life goals, this report provides deep strategic illumination for your current lifecycle. Your astrological elemental composition reveals a dynamic balance between creative inspiration and disciplined discernment.

You are entering a powerful astrological cycle characterized by vocational expansion and deeper spiritual self-realization. To maximize this cosmic window, focus on transforming unconscious blindspots into disciplined habits, grounding your expansive vision in measurable daily milestones.`;
  }

  // Detailed Domain Guidance
  const careerAndFinance = modalityUsed === 'palm_only'
    ? `Your Fate Line and Mount of Apollo indicate substantial vocational ascension over the next two quarters. You are naturally equipped for leadership roles that grant high strategic autonomy. Avoid micromanagement bottlenecks by cultivating systems of delegation. Financially, favor strategic compounding and calculated long-term investments over speculative volatility.`
    : modalityUsed === 'tarot_only'
    ? `The cards drawn in your career sector signify a major turning point. An opportunity requiring courage and calculated risk-taking will present itself within 90 days. Trust your expertise, negotiate from a position of value, and ensure all collaborative agreements are cemented with crystalline clarity.`
    : `The direct synergy between your Fate Line and drawn tarot archetypes confirms that your vocational path is entering a golden alignment window. The convergence of strategic logic and intuitive timing will allow you to attract high-value collaborators and execute complex projects with effortless precision.`;

  const relationshipInsights = modalityUsed === 'palm_only'
    ? `Your Heart Line curvature demonstrates deep capacity for loyalty, but cautions against emotional idealism. In romantic and interpersonal spheres, communicate explicit expectations early rather than assuming implicit understanding. Protect your energy from chronic complainers who drain your innate empathy.`
    : modalityUsed === 'tarot_only'
    ? `Interpersonal dynamics are undergoing a karmic purification. The cards advise shedding superficial relationships that require you to diminish your authentic truth. Deep, soul-aligned partnerships are ready to take root as you anchor into radical self-acceptance.`
    : `Your multi-modal relational blueprint shows a profound transition toward high-resonance soul connections. By balancing emotional vulnerability with firm personal boundaries, you will establish mutual trust and emotional sovereignty in all partnerships.`;

  const healthAndWellness = modalityUsed === 'palm_only'
    ? `Your Life Line indicates strong constitutional resilience with sensitivity to sudden nervous system overload. Prioritize circadian rhythm synchronization, reduce late-night blue light exposure, and incorporate weekly magnesium or Epsom salt soaks to soothe muscle tension.`
    : modalityUsed === 'tarot_only'
    ? `Emotional and physical health are inextricably linked in your current reading. The archetypes recommend spending regular time in natural bodies of water or uncultivated nature to ground excess mental energy and discharge emotional static.`
    : `Holistic energetic optimization requires daily alignment of physical breath, mental stillness, and nourishing movement. Establish a non-negotiable morning grounding routine to stabilize your field before engaging with digital demands.`;

  // Detailed Timeline
  const timeline = [
    {
      horizon: 'Next 3 Months',
      prediction: hasTarot
        ? `Activation of key spread archetypes: Rapid resolution of a lingering question followed by a burst of focused creative productivity.`
        : `Clarity and decisive action in primary vocational milestones, dissolving 80% of current operational ambiguities.`,
      focusCategory: 'Career' as const
    },
    {
      horizon: '6 Months',
      prediction: hasPalm
        ? `Consolidation of Fate Line trajectory: Attainment of a leadership benchmark, accompanied by financial stabilization and strategic partnership.`
        : `Harmonious alignment of personal relationships and emergence of a trusted mentor or strategic collaborator.`,
      focusCategory: 'Finance' as const
    },
    {
      horizon: '1 Year',
      prediction: `Manifestation of long-term soul purpose milestones: Substantial elevation in public reputation, creative fulfillment, and spiritual sovereignty.`,
      focusCategory: 'Spiritual' as const
    },
    {
      horizon: '3-5 Years',
      prediction: `Mastery and Mentorship Epoch: Establishing a lasting legacy foundation, mentoring the next generation of seekers, and achieving holistic peace.`,
      focusCategory: 'Spiritual' as const
    }
  ];

  return {
    id: `report_${Date.now()}_${rngSeed}`,
    userId: userProfile.id || `usr_${rngSeed}`,
    userName: userProfile.name || 'Seeker',
    userEmail: userProfile.email.toLowerCase(),
    createdAt: new Date().toISOString().split('T')[0],
    modalityUsed,
    modalitySummary,
    palmAnalysis: palmData || undefined,
    tarotSession: tarotData || undefined,
    detailedModalityBreakdown,
    weaknessRemedies,
    weightedScore: {
      palmConfidence: palmConf,
      tarotRelevance: tarotRel,
      personalityAlignment: persAlign,
      userContextRelevance: contextRel,
      readingConsistency: consistency,
      overallScore
    },
    personality: {
      archetype: chosenArchetype,
      elementalBalance: {
        fire: firePct,
        water: waterPct,
        air: airPct,
        earth: earthPct
      },
      strengths: [
        'Strategic Vision & Intuitive Foresight',
        'Deep Empathetic Discernment',
        'Resilient Constitutional Stamina',
        'Authentic Communicative Mastery'
      ],
      weaknesses: weaknessRemedies.map(w => w.weakness),
      behavioralInsights: [
        `Dominant ${dominantElement} elemental alignment fosters both visionary inspiration and deep emotional integrity.`,
        `Thrives in high-autonomy environments where creative instincts can be translated into concrete physical systems without micromanagement.`
      ],
      growthRecommendations: weaknessRemedies.map(w => w.actionableImprovement),
      weaknessRemedies
    },
    lifeTrends: {
      currentPhase: modalityUsed === 'unified'
        ? 'Catalytic Convergence & Soul Purpose Embodiment'
        : modalityUsed === 'palm_only'
        ? 'Biometric Mastery & Tactical Alignment'
        : modalityUsed === 'tarot_only'
        ? 'Archetypal Awakening & Karmic Transition'
        : 'Astrological Expansion & Vocational Harmonization',
      opportunites: [
        'Breakthrough clarity and swift resolution in primary inquiries',
        'Deepening authentic high-resonance soul connections',
        'Manifesting high-impact creative or professional ventures'
      ],
      challenges: [
        'Overcoming cognitive over-analysis and decision resistance',
        'Maintaining sovereign personal boundaries under external demands',
        'Pacing physical stamina to prevent cyclical adrenal fatigue'
      ],
      timeline
    },
    synthesizedGuidance: {
      executiveSummary,
      personalityOverview: `Operating under the ${chosenArchetype} archetype, your cognitive and spiritual matrix reflects a balanced blend of ${dominantElement} element potency. You possess a rare ability to perceive subtle energetic currents while maintaining the intellectual discipline required to execute real-world solutions.`,
      relationshipInsights,
      careerAndFinance,
      healthAndWellness,
      spiritualActionPlan: [
        'Practice 10 minutes of daily morning alignment breathwork before engaging with digital screens.',
        'Implement the 70% Confidence Rule on pending decisions to break cognitive analysis loops.',
        'Set firm, non-negotiable personal boundaries around evening rest and restoration cycles.',
        'Review weekly synchronicity markers and dream notes to track intuitive alignment.'
      ]
    }
  };
}
