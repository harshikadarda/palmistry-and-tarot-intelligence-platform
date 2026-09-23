import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PalmFeatures, TarotReadingSession, SynthesisReport, UserProfile } from '../types';
import { getReportsForUserDB, saveReportForUserDB } from '../database/userDatabase';
import { generateDynamicSynthesisReport } from '../utils/synthesisGenerator';
import { jsPDF } from 'jspdf';
import { 
  Compass, 
  Award, 
  TrendingUp, 
  Download, 
  CheckCircle2, 
  Heart, 
  Briefcase, 
  ShieldCheck,
  Calendar,
  Layers,
  Mail,
  ScanLine,
  Flame,
  Activity,
  AlertTriangle,
  Wrench,
  BookOpen,
  RefreshCw,
  Zap,
  ArrowRight,
  ChevronRight,
  User,
  Info
} from 'lucide-react';
import { ExpertCtaBanner } from './ExpertCtaBanner';

interface UnifiedReadingViewProps {
  currentPalm: PalmFeatures | null;
  currentTarot: TarotReadingSession | null;
  currentUser: UserProfile;
  selectedReport?: SynthesisReport | null;
  onNavigateToPalm?: () => void;
  onNavigateToTarot?: () => void;
  trialsLeft?: number;
  onTalkToExpert?: () => void;
}

export const UnifiedReadingView: React.FC<UnifiedReadingViewProps> = ({
  currentPalm,
  currentTarot,
  currentUser,
  selectedReport,
  onNavigateToPalm,
  onNavigateToTarot,
  trialsLeft = 2,
  onTalkToExpert
}) => {
  const getInitialReport = (): SynthesisReport => {
    if (selectedReport) return selectedReport;
    const userReports = getReportsForUserDB(currentUser.email);
    if (userReports.length > 0) return userReports[0];
    
    // Fallback personalized report generated dynamically for this user
    return generateDynamicSynthesisReport({
      palmData: currentPalm,
      tarotData: currentTarot,
      userProfile: currentUser,
      seedTimestamp: Date.now()
    });
  };

  const [report, setReport] = useState<SynthesisReport>(getInitialReport);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'modality' | 'weaknesses' | 'timeline' | 'guidance'>('all');

  useEffect(() => {
    if (selectedReport) {
      setReport(selectedReport);
    } else {
      setReport(getInitialReport());
    }
  }, [selectedReport, currentUser.email]);

  // Trigger Dynamic Synthesis with guaranteed freshness
  const handleSynthesize = async () => {
    setIsGenerating(true);
    const currentSeed = Date.now();
    try {
      const res = await fetch('/api/ai/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          palmData: currentPalm || report.palmAnalysis,
          tarotData: currentTarot || report.tarotSession,
          userProfile: currentUser,
          seedTimestamp: currentSeed
        })
      });

      const data = await res.json();
      if (data.success && data.report) {
        const enrichedReport: SynthesisReport = {
          ...data.report,
          userEmail: currentUser.email.toLowerCase(),
          userId: currentUser.id,
          userName: currentUser.name
        };
        setReport(enrichedReport);
        saveReportForUserDB(currentUser.email, enrichedReport);
      } else {
        // Direct dynamic procedural fallback
        const fallback = generateDynamicSynthesisReport({
          palmData: currentPalm || report.palmAnalysis,
          tarotData: currentTarot || report.tarotSession,
          userProfile: currentUser,
          seedTimestamp: currentSeed
        });
        setReport(fallback);
        saveReportForUserDB(currentUser.email, fallback);
      }
    } catch (err) {
      console.warn('Synthesis API error, generating dynamic report locally:', err);
      const fallback = generateDynamicSynthesisReport({
        palmData: currentPalm || report.palmAnalysis,
        tarotData: currentTarot || report.tarotSession,
        userProfile: currentUser,
        seedTimestamp: currentSeed
      });
      setReport(fallback);
      saveReportForUserDB(currentUser.email, fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate & Download Comprehensive PDF Report via jsPDF
  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = 210;
    const margin = 14;
    const maxTextWidth = pageWidth - (margin * 2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Palmistry & Tarot Synthesis Intelligence Report', margin, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Client: ${report.userName} | Email: ${report.userEmail || currentUser.email}`, margin, 28);
    doc.text(`Date of Synthesis: ${report.createdAt} | Overall Insight Alignment: ${report.weightedScore.overallScore}%`, margin, 34);
    doc.text(`Modality Source: ${report.modalitySummary || (report.palmAnalysis && report.tarotSession ? 'Unified Chiromancy & Cartomancy' : report.palmAnalysis ? 'Palmistry Vision' : 'Tarot Cartomancy')}`, margin, 40);

    doc.setLineWidth(0.5);
    doc.line(margin, 44, pageWidth - margin, 44);

    let y = 52;

    // 1. Executive Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('1. Executive Multi-Modal Synthesis:', margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const summaryLines = doc.splitTextToSize(report.synthesizedGuidance.executiveSummary, maxTextWidth);
    doc.text(summaryLines, margin, y);
    y += (summaryLines.length * 5) + 8;

    // 2. Personality & Archetype
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('2. Personality Intelligence & Elemental Balance:', margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(`Archetype Classification: ${report.personality.archetype}`, margin, y);
    y += 5;
    doc.text(`Elemental Distribution: Fire ${report.personality.elementalBalance.fire}% | Water ${report.personality.elementalBalance.water}% | Air ${report.personality.elementalBalance.air}% | Earth ${report.personality.elementalBalance.earth}%`, margin, y);
    y += 5;
    doc.text(`Key Strengths: ${report.personality.strengths.join(', ')}`, margin, y);
    y += 9;

    // 3. Weaknesses & How to Improve It
    if (report.weaknessRemedies && report.weaknessRemedies.length > 0) {
      if (y > 230) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('3. Identified Shadow Patterns & Step-by-Step Improvement Blueprint:', margin, y);
      y += 7;

      report.weaknessRemedies.forEach((remedy, idx) => {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`[Weakness ${idx + 1}] ${remedy.weakness}`, margin, y);
        y += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const rootLines = doc.splitTextToSize(`• Root Cause: ${remedy.rootCause}`, maxTextWidth - 5);
        doc.text(rootLines, margin + 4, y);
        y += (rootLines.length * 4.5);

        const impLines = doc.splitTextToSize(`• How to Improve: ${remedy.actionableImprovement}`, maxTextWidth - 5);
        doc.text(impLines, margin + 4, y);
        y += (impLines.length * 4.5);

        const pracLines = doc.splitTextToSize(`• Daily Practice: ${remedy.dailyPractice}`, maxTextWidth - 5);
        doc.text(pracLines, margin + 4, y);
        y += (pracLines.length * 4.5) + 4;
      });
    }

    // 4. Strategic Timeline Forecast
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('4. 4-Horizon Strategic Timeline Forecast:', margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    report.lifeTrends.timeline.forEach((tl) => {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.text(`• ${tl.horizon} (${tl.focusCategory}): ${tl.prediction}`, margin + 4, y);
      y += 6;
    });
    y += 6;

    // 5. Dimensional Guidance
    if (y > 220) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('5. Multi-Dimensional Guidance:', margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    const careerLines = doc.splitTextToSize(`Career & Wealth: ${report.synthesizedGuidance.careerAndFinance}`, maxTextWidth);
    doc.text(careerLines, margin, y);
    y += (careerLines.length * 4.5) + 3;

    const relLines = doc.splitTextToSize(`Relationships: ${report.synthesizedGuidance.relationshipInsights}`, maxTextWidth);
    doc.text(relLines, margin, y);
    y += (relLines.length * 4.5) + 3;

    const healthLines = doc.splitTextToSize(`Health & Vitality: ${report.synthesizedGuidance.healthAndWellness}`, maxTextWidth);
    doc.text(healthLines, margin, y);
    y += (healthLines.length * 4.5) + 5;

    doc.setFont('helvetica', 'bold');
    doc.text('Spiritual Action Protocol:', margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    report.synthesizedGuidance.spiritualActionPlan.forEach((ap) => {
      doc.text(`- ${ap}`, margin + 4, y);
      y += 5;
    });

    doc.save(`Synthesis_Report_${report.userName.replace(/\s+/g, '_')}_${report.createdAt}.pdf`);
  };

  const hasPalmData = !!report.palmAnalysis || !!currentPalm;
  const hasTarotData = !!report.tarotSession || !!currentTarot;
  const isUnified = hasPalmData && hasTarotData;

  const palmDetails = report.detailedModalityBreakdown?.palmDetails || (report.palmAnalysis ? {
    handType: report.palmAnalysis.handType,
    majorLines: [
      { name: 'Heart Line (Emotional Topology)', quality: `${report.palmAnalysis.heartLine.quality} • ${report.palmAnalysis.heartLine.length}`, deepExplanation: report.palmAnalysis.heartLine.interpretation },
      { name: 'Head Line (Cognitive Framework)', quality: `${report.palmAnalysis.headLine.quality} • ${report.palmAnalysis.headLine.length}`, deepExplanation: report.palmAnalysis.headLine.interpretation },
      { name: 'Life Line (Vitality & Resilience)', quality: `${report.palmAnalysis.lifeLine.quality} • ${report.palmAnalysis.lifeLine.length}`, deepExplanation: report.palmAnalysis.lifeLine.interpretation },
      { name: 'Fate Line (Vocational Mastery)', quality: `${report.palmAnalysis.fateLine.quality} • ${report.palmAnalysis.fateLine.length}`, deepExplanation: report.palmAnalysis.fateLine.interpretation },
      { name: 'Sun Line (Creative Resonance)', quality: `${report.palmAnalysis.sunLine.quality} • ${report.palmAnalysis.sunLine.length}`, deepExplanation: report.palmAnalysis.sunLine.interpretation }
    ],
    mountsInsight: 'Mount of Venus & Mount of Jupiter reflect active vital leadership and magnetic resonance.'
  } : null);

  const tarotDetails = report.detailedModalityBreakdown?.tarotDetails || (report.tarotSession ? {
    spreadTitle: report.tarotSession.spreadTitle,
    cardsExplanation: report.tarotSession.drawnCards.map((dc) => ({
      cardName: dc.card.name,
      position: `${dc.positionName} (${dc.positionMeaning})`,
      isReversed: dc.isReversed,
      deepMeaning: dc.isReversed
        ? `[Reversed Orientation] Indicates internal friction, potential subconscious resistance, or shadow recalibration: ${dc.card.meaningReversed}`
        : `[Upright Orientation] Channels direct archetypal empowerment and outward creative manifestation: ${dc.card.meaningUpright}`
    })),
    overallSynergy: report.tarotSession.aiInterpretation
  } : null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#0A0A0F] rounded-2xl p-6 border border-white/10 shadow-2xl text-[#E0E0E6] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center space-x-2 text-violet-400 font-mono text-[10px] tracking-[0.25em] uppercase mb-1">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Multi-Modal Synthesis • Deep Explanatory Engine</span>
          </div>
          <h2 className="text-2xl font-light text-white italic serif">
            Synthesis <span className="font-bold not-italic">Intelligence Report</span>
          </h2>
          <p className="text-xs text-white/50 max-w-2xl mt-1">
            {report.modalitySummary || 'Synthesizing your biometric palm crease geometry and tarot archetypes into an actionable strategic roadmap.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSynthesize}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold uppercase tracking-[0.15em] sleek-glow-violet transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-amber-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Synthesize Reading'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={exportPDF}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center space-x-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export PDF</span>
          </motion.button>
        </div>
      </motion.div>

      {onTalkToExpert && (
        <ExpertCtaBanner
          trialsLeft={trialsLeft}
          contextLabel="synthesis report"
          onTalkToExpert={onTalkToExpert}
        />
      )}

      {/* Modality Status & Source Banner */}
      <div className="bg-[#0B0B14] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-white/40 font-mono uppercase text-[10px] tracking-wider">Active Modality:</span>
          {isUnified ? (
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold rounded-full flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Unified Fusion (Palmistry + Tarot)</span>
            </span>
          ) : hasPalmData ? (
            <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-300 font-semibold rounded-full flex items-center space-x-1.5">
              <ScanLine className="w-3.5 h-3.5 text-violet-400" />
              <span>Palmistry Chiromancy Exclusive</span>
            </span>
          ) : hasTarotData ? (
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold rounded-full flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tarot Cartomancy Exclusive</span>
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold rounded-full flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Astrological Natal Blueprint</span>
            </span>
          )}

          <span className="text-white/20">•</span>
          <span className="text-white/60">
            Weighted Score: <strong className="text-emerald-400 font-mono">{report.weightedScore.overallScore}%</strong>
          </span>
        </div>

        {/* Suggest adding missing modality if only one is present */}
        <div className="flex items-center gap-2">
          {!hasPalmData && onNavigateToPalm && (
            <button
              onClick={onNavigateToPalm}
              className="px-3 py-1 bg-violet-950/40 hover:bg-violet-900/50 border border-violet-700/40 text-violet-300 rounded-lg text-[11px] font-medium flex items-center space-x-1 transition-all"
            >
              <ScanLine className="w-3 h-3 text-violet-400" />
              <span>Add Palm Scan to Unify</span>
            </button>
          )}
          {!hasTarotData && onNavigateToTarot && (
            <button
              onClick={onNavigateToTarot}
              className="px-3 py-1 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-700/40 text-indigo-300 rounded-lg text-[11px] font-medium flex items-center space-x-1 transition-all"
            >
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>Add Tarot Spread to Unify</span>
            </button>
          )}
          <div className="text-white/40 text-[11px] font-mono flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{report.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'all'
              ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
              : 'text-white/50 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          Comprehensive Overview
        </button>
        <button
          onClick={() => setActiveTab('modality')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
            activeTab === 'modality'
              ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
              : 'text-white/50 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Modality Deep Explanations</span>
        </button>
        <button
          onClick={() => setActiveTab('weaknesses')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
            activeTab === 'weaknesses'
              ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40'
              : 'text-white/50 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Weaknesses & How to Improve</span>
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
            activeTab === 'timeline'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
              : 'text-white/50 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strategic Timeline</span>
        </button>
        <button
          onClick={() => setActiveTab('guidance')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
            activeTab === 'guidance'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
              : 'text-white/50 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Life Guidance</span>
        </button>
      </div>

      {/* SECTION 1: EXECUTIVE MULTI-MODAL SYNTHESIS */}
      {(activeTab === 'all' || activeTab === 'guidance') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 text-[#E0E0E6] shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white">
                Executive Multi-Modal Synthesis
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-violet-950 text-violet-300 px-2.5 py-1 rounded-full border border-violet-800">
              ALIGNMENT_INDEX: {report.weightedScore.overallScore}%
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-white/80 text-sm leading-relaxed whitespace-pre-line space-y-3">
            {report.synthesizedGuidance.executiveSummary}
          </div>

          {/* 5-Tier Weighted Score Breakdown */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-2">
              5-Tier Weighted Scoring Model
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 bg-black rounded-xl border border-white/10">
                <div className="text-violet-400 font-bold font-mono text-sm">{report.weightedScore.palmConfidence}%</div>
                <div className="text-[9px] text-white/40 uppercase font-mono">Palm Conf. (30%)</div>
              </div>
              <div className="p-2.5 bg-black rounded-xl border border-white/10">
                <div className="text-indigo-400 font-bold font-mono text-sm">{report.weightedScore.tarotRelevance}%</div>
                <div className="text-[9px] text-white/40 uppercase font-mono">Tarot Rel. (25%)</div>
              </div>
              <div className="p-2.5 bg-black rounded-xl border border-white/10">
                <div className="text-amber-400 font-bold font-mono text-sm">{report.weightedScore.personalityAlignment}%</div>
                <div className="text-[9px] text-white/40 uppercase font-mono">Personality (20%)</div>
              </div>
              <div className="p-2.5 bg-black rounded-xl border border-white/10">
                <div className="text-sky-400 font-bold font-mono text-sm">{report.weightedScore.userContextRelevance}%</div>
                <div className="text-[9px] text-white/40 uppercase font-mono">Context (15%)</div>
              </div>
              <div className="p-2.5 bg-black rounded-xl border border-white/10">
                <div className="text-emerald-400 font-bold font-mono text-sm">{report.weightedScore.readingConsistency}%</div>
                <div className="text-[9px] text-white/40 uppercase font-mono">Consistency (10%)</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* SECTION 2: PERSONALITY & ARCHETYPAL BLUEPRINT */}
      {(activeTab === 'all' || activeTab === 'guidance') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-6 bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 text-[#E0E0E6] shadow-xl space-y-4"
          >
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
              <Award className="w-4 h-4 text-violet-400" />
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white">Personality Intelligence</h3>
            </div>

            <div className="p-3.5 bg-violet-950/30 border border-violet-500/30 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[9px] font-mono uppercase text-violet-400 font-bold">Archetype Classification</div>
                <div className="text-base font-extrabold text-white">{report.personality.archetype}</div>
              </div>
              <div className="text-[10px] font-mono bg-violet-600/30 text-violet-300 px-3 py-1 rounded-full border border-violet-500/40">
                DOMINANT_MATRIX
              </div>
            </div>

            {/* Elemental Balance */}
            <div>
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-2">Elemental Balance Matrix</div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 bg-black rounded-xl border border-white/10">
                  <div className="text-amber-400 font-bold font-mono">{report.personality.elementalBalance.fire}%</div>
                  <div className="text-[9px] text-white/40 uppercase font-mono">Fire</div>
                </div>
                <div className="p-2.5 bg-black rounded-xl border border-white/10">
                  <div className="text-sky-400 font-bold font-mono">{report.personality.elementalBalance.water}%</div>
                  <div className="text-[9px] text-white/40 uppercase font-mono">Water</div>
                </div>
                <div className="p-2.5 bg-black rounded-xl border border-white/10">
                  <div className="text-indigo-400 font-bold font-mono">{report.personality.elementalBalance.air}%</div>
                  <div className="text-[9px] text-white/40 uppercase font-mono">Air</div>
                </div>
                <div className="p-2.5 bg-black rounded-xl border border-white/10">
                  <div className="text-emerald-400 font-bold font-mono">{report.personality.elementalBalance.earth}%</div>
                  <div className="text-[9px] text-white/40 uppercase font-mono">Earth</div>
                </div>
              </div>
            </div>

            {/* Key Strengths & Behavioral Insights */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#050507] rounded-xl border border-white/10">
                <div className="font-bold text-emerald-400 mb-1.5 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Innate Strengths</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-white/70">
                  {report.personality.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              {report.personality.behavioralInsights && (
                <div className="p-3.5 bg-[#050507] rounded-xl border border-white/10">
                  <div className="font-bold text-violet-400 mb-1.5 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-violet-400" />
                    <span>Behavioral Insights</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-white/70">
                    {report.personality.behavioralInsights.map((bi, idx) => (
                      <li key={idx}>{bi}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-6 bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 text-[#E0E0E6] shadow-xl space-y-4"
          >
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white">Lifecycle Phase & Strategic Horizon</h3>
            </div>

            <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
              <div className="text-[9px] font-mono uppercase text-emerald-400 font-bold">Current Lifecycle Phase</div>
              <div className="text-base font-extrabold text-white">{report.lifeTrends.currentPhase}</div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">
                4-Horizon Strategic Timeline Forecast
              </div>
              {report.lifeTrends.timeline.map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 4 }}
                  className="p-3 bg-black rounded-xl border border-white/10 flex items-start space-x-3 text-xs transition-colors"
                >
                  <div className="px-2 py-1 bg-violet-950 text-violet-300 rounded border border-violet-800 font-mono text-[10px] font-bold shrink-0">
                    {item.horizon}
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center space-x-1.5">
                      <span>{item.focusCategory} Focus</span>
                    </div>
                    <div className="text-white/70 mt-0.5 leading-relaxed">{item.prediction}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* SECTION 3: DEDICATED DETAILED MODALITY BREAKDOWN */}
      {(activeTab === 'all' || activeTab === 'modality') && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Palmistry Chiromancy Deep Dive if present */}
          {palmDetails && (
            <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 text-[#E0E0E6] shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <ScanLine className="w-4 h-4 text-violet-400" />
                  <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white">
                    Palmistry Chiromancy Deep Dive • {palmDetails.handType} Hand Architecture
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-violet-950 text-violet-300 px-2.5 py-1 rounded-full border border-violet-800">
                  BIOMETRIC_VISION
                </span>
              </div>

              <p className="text-xs text-white/60">
                Comprehensive explanation of detected major crease geometry, mount elevations, and physiological stamina markers.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {palmDetails.majorLines.map((line, idx) => (
                  <div key={idx} className="p-4 bg-black/60 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-violet-300 text-xs">{line.name}</span>
                      <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {line.quality}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">{line.deepExplanation}</p>
                  </div>
                ))}
              </div>

              {palmDetails.mountsInsight && (
                <div className="p-3.5 bg-violet-950/20 border border-violet-500/20 rounded-xl text-xs text-violet-200">
                  <strong className="text-violet-400 font-mono uppercase text-[10px] block mb-1">Mount Topography Insights</strong>
                  {palmDetails.mountsInsight}
                </div>
              )}
            </div>
          )}

          {/* Tarot Cartomancy Deep Dive if present */}
          {tarotDetails && (
            <div className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 text-[#E0E0E6] shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white">
                    Tarot Cartomancy Deep Dive • {tarotDetails.spreadTitle}
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-800">
                  ARCHETYPAL_SPREAD
                </span>
              </div>

              <p className="text-xs text-white/60">
                In-depth breakdown of each drawn archetype, upright/reversed dynamics, and positional resonance within your spread.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tarotDetails.cardsExplanation.map((card, idx) => (
                  <div key={idx} className="p-4 bg-black/60 rounded-xl border border-white/10 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-indigo-300 text-xs">{card.cardName}</span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                          card.isReversed 
                            ? 'bg-rose-950/60 border-rose-700/50 text-rose-300' 
                            : 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300'
                        }`}>
                          {card.isReversed ? 'Reversed' : 'Upright'}
                        </span>
                      </div>
                      <div className="text-[10px] text-white/40 font-mono mb-2">{card.position}</div>
                      <p className="text-xs text-white/70 leading-relaxed">{card.deepMeaning}</p>
                    </div>
                  </div>
                ))}
              </div>

              {tarotDetails.overallSynergy && (
                <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-indigo-200">
                  <strong className="text-indigo-400 font-mono uppercase text-[10px] block mb-1">Spread Energetic Synergy</strong>
                  {tarotDetails.overallSynergy}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* SECTION 4: IDENTIFIED WEAKNESSES & STEP-BY-STEP IMPROVEMENT BLUEPRINT */}
      {(activeTab === 'all' || activeTab === 'weaknesses') && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 text-[#E0E0E6] shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white">
                Identified Weaknesses & Step-by-Step Improvement Blueprint
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-rose-950 text-rose-300 px-2.5 py-1 rounded-full border border-rose-800">
              SHADOW_REMEDIATION
            </span>
          </div>

          <p className="text-xs text-white/60">
            Every spiritual strength carries an energetic shadow. Below is an exhaustive breakdown of your identified vulnerabilities alongside actionable protocols on how to overcome and improve them.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(report.weaknessRemedies && report.weaknessRemedies.length > 0 ? report.weaknessRemedies : [
              {
                weakness: 'Adrenal Over-Exertion & Sprint Burnout',
                rootCause: 'Intense drive paired with deep palm Life Line creates energetic sprints without scheduled restorative intervals.',
                impact: 'Sudden fatigue dips and irritability during creative blocks.',
                actionableImprovement: 'Implement strict 90-minute focused work blocks followed by 15 minutes of offline walking or breathwork.',
                dailyPractice: '10-minute parasympathetic 4-7-8 breathing at sunset.'
              },
              {
                weakness: 'Cognitive Over-Analysis & Decision Resistance',
                rootCause: 'Long analytical Head Line seeks 100% certainty before initiating action, creating decision bottlenecks.',
                impact: 'Delayed project launches and mental overthinking.',
                actionableImprovement: 'Apply the 70% Confidence Rule: when 70% of clarity is present, execute early experiments.',
                dailyPractice: 'Morning 5-minute timed micro-decision sprint.'
              },
              {
                weakness: 'Emotional Boundary Porosity',
                rootCause: 'Receptive Heart Line and empathetic tarot archetypes absorb ambient emotional distress from others.',
                impact: 'Feeling energetically drained after group meetings or difficult conversations.',
                actionableImprovement: 'Establish verbal boundary frameworks: "I support your process, but cannot solve this for you."',
                dailyPractice: 'Evening visual auric clearing and cold water hand rinse.'
              },
              {
                weakness: 'Reluctance to Delegate & Control Inflexibility',
                rootCause: 'Prominent Mount of Saturn creates subconscious belief that only self-execution meets perfection standards.',
                impact: 'Scaling bottlenecks and team frustration.',
                actionableImprovement: 'Document routine processes and delegate 20% of repetitive operational tasks this month.',
                dailyPractice: 'Affirmation: "My capacity expands as I empower collaborators."'
              }
            ]).map((remedy, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                className="p-5 bg-black/70 rounded-xl border border-rose-900/30 hover:border-rose-500/40 transition-all space-y-3"
              >
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-rose-950 flex items-center justify-center text-xs border border-rose-800">
                    {idx + 1}
                  </span>
                  <span>{remedy.weakness}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-[#0D0D18] p-2.5 rounded-lg border border-white/5">
                    <span className="text-white/40 font-mono text-[10px] uppercase block mb-0.5">Root Cause & Trigger:</span>
                    <p className="text-white/70 leading-relaxed">{remedy.rootCause}</p>
                  </div>

                  <div className="bg-[#0D0D18] p-2.5 rounded-lg border border-white/5">
                    <span className="text-amber-400 font-mono text-[10px] uppercase block mb-0.5">Life & Energy Impact:</span>
                    <p className="text-white/70 leading-relaxed">{remedy.impact}</p>
                  </div>

                  <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wider mb-1">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>How to Improve (Step-by-Step)</span>
                    </div>
                    <p className="text-emerald-200 leading-relaxed">{remedy.actionableImprovement}</p>
                  </div>

                  <div className="bg-violet-950/20 p-2.5 rounded-lg border border-violet-500/20 flex items-start space-x-2">
                    <Compass className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-violet-300 font-bold text-[10px] uppercase block">Daily Practice / Ritual:</span>
                      <p className="text-violet-200/80 leading-relaxed text-[11px]">{remedy.dailyPractice}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* SECTION 5: DIMENSIONAL LIFE GUIDANCE & SPIRITUAL ACTION PLAN */}
      {(activeTab === 'all' || activeTab === 'guidance') && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A0A0F] border border-white/10 rounded-2xl p-6 text-[#E0E0E6] shadow-xl space-y-4"
        >
          <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-violet-400 border-b border-white/10 pb-3 flex items-center space-x-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Multi-Dimensional Life Guidance & Action Protocol</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 transition-colors hover:border-purple-500/40"
            >
              <div className="font-bold text-purple-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <Briefcase className="w-4 h-4" />
                <span>Career & Wealth Dynamics</span>
              </div>
              <p className="text-white/70 leading-relaxed">{report.synthesizedGuidance.careerAndFinance}</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 transition-colors hover:border-pink-500/40"
            >
              <div className="font-bold text-pink-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <Heart className="w-4 h-4" />
                <span>Relationships & Soul Connections</span>
              </div>
              <p className="text-white/70 leading-relaxed">{report.synthesizedGuidance.relationshipInsights}</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 transition-colors hover:border-emerald-500/40"
            >
              <div className="font-bold text-emerald-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Spiritual Action Protocol</span>
              </div>
              <ul className="list-disc list-inside text-white/70 space-y-1.5">
                {report.synthesizedGuidance.spiritualActionPlan.map((ap, i) => (
                  <li key={i}>{ap}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
};
