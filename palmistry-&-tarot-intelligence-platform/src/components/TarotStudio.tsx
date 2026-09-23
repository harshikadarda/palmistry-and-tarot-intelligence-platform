import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TarotCard, SpreadType, DrawnTarotCard, TarotReadingSession } from '../types';
import { TAROT_CARDS, SPREAD_CONFIGS } from '../data/tarotData';
import { 
  Layers, 
  RotateCw, 
  Eye, 
  HelpCircle, 
  Compass, 
  CheckCircle2, 
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';

import { ExpertCtaBanner } from './ExpertCtaBanner';

interface TarotStudioProps {
  onTarotAnalyzed: (session: TarotReadingSession) => void;
  userContext?: string;
  trialsLeft?: number;
  onTalkToExpert?: (session: TarotReadingSession | null) => void;
}

export const TarotStudio: React.FC<TarotStudioProps> = ({
  onTarotAnalyzed,
  userContext,
  trialsLeft = 2,
  onTalkToExpert
}) => {
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>('three_card');
  const [question, setQuestion] = useState<string>('What energy should I align with for career and spiritual growth?');
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [drawnCards, setDrawnCards] = useState<DrawnTarotCard[]>([]);
  const [isInterpreting, setIsInterpreting] = useState<boolean>(false);
  const [activeCardDetail, setActiveCardDetail] = useState<TarotCard | null>(null);
  const [currentSession, setCurrentSession] = useState<TarotReadingSession | null>(null);

  const spreadConfig = SPREAD_CONFIGS[selectedSpread];

  // Shuffle & Draw Cards Function
  const handleShuffleAndDraw = () => {
    setIsShuffling(true);
    setDrawnCards([]);
    setCurrentSession(null);

    setTimeout(() => {
      // Pick random cards without duplicates
      const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random());
      const neededCount = spreadConfig.cardCount;
      const selected = shuffled.slice(0, neededCount);

      const drawn: DrawnTarotCard[] = selected.map((card, idx) => {
        const pos = spreadConfig.positions[idx] || {
          title: `Position ${idx + 1}`,
          meaning: 'Key Energy'
        };
        const isReversed = Math.random() < 0.25; // 25% chance of reversed
        return {
          card,
          positionName: pos.title,
          positionMeaning: pos.meaning,
          isReversed
        };
      });

      setDrawnCards(drawn);
      setIsShuffling(false);
      triggerInterpretation(drawn);
    }, 1200);
  };

  // Call Gemini AI Tarot Interpretation
  const triggerInterpretation = async (cards: DrawnTarotCard[]) => {
    setIsInterpreting(true);
    try {
      const res = await fetch('/api/tarot/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadType: selectedSpread,
          spreadTitle: spreadConfig.name,
          drawnCards: cards,
          question,
          userContext: userContext || 'Seeking career and spiritual balance'
        })
      });

      const data = await res.json();
      const aiText = data.interpretation?.summary || 
        `The ${cards.length} cards drawn offer a profound message of spiritual alignment and purposeful action.`;

      const session: TarotReadingSession = {
        id: `tarot_session_${Date.now()}`,
        spreadType: selectedSpread,
        spreadTitle: spreadConfig.name,
        drawnCards: cards,
        question,
        aiInterpretation: aiText,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setCurrentSession(session);
      onTarotAnalyzed(session);
    } catch (err) {
      console.error('Tarot interpretation failed:', err);
    } finally {
      setIsInterpreting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Banner */}
      <div className="bg-[#0A0A0F] rounded-2xl p-6 border border-white/10 shadow-2xl text-[#E0E0E6] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-violet-400 font-mono text-[10px] tracking-[0.25em] uppercase mb-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Rider-Waite 78-Card Deck & Spreads</span>
          </div>
          <h2 className="text-2xl font-light text-white italic serif">
            Interactive <span className="font-bold not-italic">Tarot Studio</span>
          </h2>
          <p className="text-xs text-white/50 max-w-2xl mt-1">
            Simulate card shuffling, draw full multi-card spreads (Celtic Cross, Relationship, Life Path), and receive Gemini AI interpretation.
          </p>
        </div>

        <button
          onClick={handleShuffleAndDraw}
          disabled={isShuffling}
          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold uppercase tracking-[0.2em] text-xs rounded-xl sleek-glow-violet transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
          <span>{isShuffling ? 'Shuffling Deck...' : 'Shuffle & Draw Cards'}</span>
        </button>
      </div>

      {/* Configuration Bar */}
      <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-5 text-[#E0E0E6] space-y-4 shadow-xl">
        
        {/* Spread Selector */}
        <div>
          <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] mb-2">
            Select Tarot Spread Layout
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {(Object.keys(SPREAD_CONFIGS) as SpreadType[]).map((st) => {
              const conf = SPREAD_CONFIGS[st];
              return (
                <button
                  key={st}
                  onClick={() => {
                    setSelectedSpread(st);
                    setDrawnCards([]);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedSpread === st
                      ? 'bg-violet-950/50 border-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                      : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold text-xs text-white truncate mb-1">{conf.name}</div>
                  <div className="text-[10px] font-mono text-amber-400">{conf.cardCount} Cards</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Intent / Question Input */}
        <div>
          <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] mb-1 flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Spiritual Intent or Inquiry</span>
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What guidance do I need for my career shift this month?"
            className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500 font-sans"
          />
        </div>

      </div>

      {/* Drawn Cards Layout View */}
      <AnimatePresence mode="wait">
        {drawnCards.length > 0 ? (
          <motion.div 
            key="drawn-cards-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-violet-400 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Drawn Cards ({spreadConfig.name})</span>
              </h3>
              <span className="text-[10px] font-mono text-white/40">Click any card for full symbology</span>
            </div>

            <div className={`grid gap-4 ${
              drawnCards.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
              drawnCards.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
              drawnCards.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
              drawnCards.length === 5 ? 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-5' :
              'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
            }`}>
              {drawnCards.map((drawn, idx) => (
                <motion.div
                  key={`${drawn.card.id}_${idx}`}
                  initial={{ opacity: 0, y: 40, scale: 0.82, rotateY: 90 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: idx * 0.12,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.03,
                    boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.3)'
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCardDetail(drawn.card)}
                  className="group relative bg-gradient-to-b from-[#1A1A24] to-[#0D0D14] border border-white/10 hover:border-violet-500/80 rounded-xl p-4 transition-colors duration-300 shadow-2xl cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Glowing Color Accent Bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400/40 via-violet-400/40 to-indigo-400/40"></div>

                  {/* Position Badge */}
                  <div className="mb-2 border-b border-white/10 pb-2">
                    <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                      {drawn.positionName}
                    </div>
                    <div className="text-[10px] text-white/50 truncate">{drawn.positionMeaning}</div>
                  </div>

                  {/* Card Image */}
                  <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden mb-3 border border-white/10 bg-black shadow-inner group-hover:border-violet-500/50">
                    <img
                      src={drawn.card.imageUrl}
                      alt={drawn.card.name}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        drawn.isReversed ? 'rotate-180' : ''
                      }`}
                    />
                    {drawn.isReversed && (
                      <div className="absolute top-2 right-2 bg-rose-950/90 text-rose-300 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-rose-700 uppercase">
                        Reversed
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div>
                    <div className="font-bold text-xs text-white uppercase tracking-wider flex items-center justify-between">
                      <span className="truncate">{drawn.card.name}</span>
                      <span className="text-[9px] font-mono text-violet-400 ml-1">{drawn.card.element}</span>
                    </div>
                    <div className="text-[11px] text-white/60 mt-1 line-clamp-2 leading-tight italic">
                      {drawn.isReversed ? drawn.card.meaningReversed : drawn.card.meaningUpright}
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>

            {/* AI Interpretation Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: drawnCards.length * 0.12 + 0.15 }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md text-[#E0E0E6]"
            >
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-white">AI Synthesis Report</h4>
                </div>
                {isInterpreting && (
                  <span className="text-[10px] font-mono text-amber-400 animate-pulse flex items-center space-x-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>SYNTHESIZING_CARDS...</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-white/80 leading-relaxed font-sans whitespace-pre-line">
                {currentSession?.aiInterpretation || 'Drawing cards... Your AI interpretation will appear here momentarily.'}
              </p>
            </motion.div>

            {onTalkToExpert && currentSession && (
              <ExpertCtaBanner
                trialsLeft={trialsLeft}
                contextLabel="tarot spread"
                onTalkToExpert={() => onTalkToExpert(currentSession)}
              />
            )}

          </motion.div>
        ) : (
          /* Empty Prompt State */
          <motion.div 
            key="empty-cards-state"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0A0A0F] border border-white/10 border-dashed rounded-2xl p-12 text-center text-white/40 space-y-3"
          >
            <Layers className="w-10 h-10 text-violet-400 mx-auto opacity-70" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">No Cards Drawn Yet</h3>
            <p className="text-xs max-w-md mx-auto text-white/50">
              Select your spread layout above, enter your question, then click "Shuffle & Draw Cards" to begin your reading.
            </p>
            <button
              onClick={handleShuffleAndDraw}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold uppercase tracking-[0.15em] sleek-glow-violet transition-all inline-flex items-center space-x-2"
            >
              <Layers className="w-4 h-4" />
              <span>Start Tarot Reading</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single Card Detail Modal */}
      <AnimatePresence>
        {activeCardDetail && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 shadow-2xl text-[#E0E0E6] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">{activeCardDetail.name} ({activeCardDetail.arcana} Arcana)</h3>
                <button
                  onClick={() => setActiveCardDetail(null)}
                  className="text-white/40 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <div className="flex space-x-4">
                <img src={activeCardDetail.imageUrl} alt={activeCardDetail.name} className="w-28 h-40 object-cover rounded-xl border border-white/10" />
                <div className="space-y-2 text-xs">
                  <div><span className="font-mono text-white/40 uppercase text-[10px]">Element:</span> {activeCardDetail.element}</div>
                  {activeCardDetail.astrology && (
                    <div><span className="font-mono text-white/40 uppercase text-[10px]">Astrology:</span> {activeCardDetail.astrology}</div>
                  )}
                  <div>
                    <span className="font-mono text-white/40 uppercase text-[10px]">Keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activeCardDetail.keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-violet-950/60 text-violet-300 rounded border border-violet-800/50 text-[10px] font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-white/10">
                <div>
                  <span className="font-bold text-emerald-400">Upright Meaning:</span>
                  <p className="text-white/70 mt-0.5">{activeCardDetail.meaningUpright}</p>
                </div>
                <div>
                  <span className="font-bold text-rose-400">Reversed Meaning:</span>
                  <p className="text-white/70 mt-0.5">{activeCardDetail.meaningReversed}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
