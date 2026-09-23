import React, { useState, useEffect } from 'react';
import { UserProfile, SynthesisReport, PalmFeatures, TarotReadingSession } from '../../types';
import { 
  getReportsForUserDB, 
  getPalmScansForUserDB, 
  getTarotSessionsForUserDB, 
  saveSpiritualGoalsForUserDB,
  deleteReportForUserDB,
  deletePalmScanForUserDB,
  deleteTarotSessionForUserDB
} from '../../database/userDatabase';
import { 
  BookOpen, 
  Compass, 
  Plus, 
  Check, 
  Calendar, 
  Award,
  ChevronRight,
  TrendingUp,
  FileText,
  Layers,
  Trash2,
  Lock,
  Mail,
  ShieldCheck,
  Search,
  Filter,
  AlertTriangle,
  X,
  ScanLine,
  Video
} from 'lucide-react';

interface UserDashboardProps {
  currentUser: UserProfile;
  savedReports?: SynthesisReport[];
  onOpenReport: (report: SynthesisReport) => void;
  onStartReading?: (tab: 'palm' | 'tarot') => void;
  onDeleteReport?: (reportId: string) => void;
  onTalkToExpert?: (report: SynthesisReport) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ 
  currentUser, 
  savedReports: propSavedReports, 
  onOpenReport, 
  onStartReading,
  onDeleteReport,
  onTalkToExpert
}) => {
  const [goals, setGoals] = useState<string[]>(currentUser.spiritualGoals || []);
  const [newGoal, setNewGoal] = useState<string>('');
  const [historyTab, setHistoryTab] = useState<'synthesis' | 'palm' | 'tarot'>('synthesis');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Local state for this specific user's private data
  const [userReports, setUserReports] = useState<SynthesisReport[]>([]);
  const [userPalmScans, setUserPalmScans] = useState<PalmFeatures[]>([]);
  const [userTarotSessions, setUserTarotSessions] = useState<TarotReadingSession[]>([]);

  // Delete modal confirmation state
  const [reportToDelete, setReportToDelete] = useState<SynthesisReport | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Strictly reload records for the logged-in user's email whenever currentUser changes
  useEffect(() => {
    if (currentUser?.email) {
      const email = currentUser.email.trim().toLowerCase();
      const reports = getReportsForUserDB(email);
      const palmScans = getPalmScansForUserDB(email);
      const tarotSessions = getTarotSessionsForUserDB(email);

      setUserReports(reports);
      setUserPalmScans(palmScans);
      setUserTarotSessions(tarotSessions);
      setGoals(currentUser.spiritualGoals || []);
    }
  }, [currentUser, propSavedReports]);

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      const updated = [...goals, newGoal.trim()];
      setGoals(updated);
      setNewGoal('');
      if (currentUser.email) {
        saveSpiritualGoalsForUserDB(currentUser.email, updated);
      }
    }
  };

  const confirmDeleteReport = () => {
    if (!reportToDelete || !currentUser.email) return;
    const reportId = reportToDelete.id;

    // Delete from database
    deleteReportForUserDB(currentUser.email, reportId);
    
    // Update local state
    setUserReports(prev => prev.filter(r => r.id !== reportId));
    
    // Notify parent
    if (onDeleteReport) {
      onDeleteReport(reportId);
    }

    setReportToDelete(null);
    setFeedbackMessage('Report deleted successfully.');
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleDeletePalmScan = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (!currentUser.email) return;
    deletePalmScanForUserDB(currentUser.email, index);
    setUserPalmScans(prev => prev.filter((_, idx) => idx !== index));
    setFeedbackMessage('Palm scan record deleted.');
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleDeleteTarotSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!currentUser.email) return;
    deleteTarotSessionForUserDB(currentUser.email, sessionId);
    setUserTarotSessions(prev => prev.filter(s => s.id !== sessionId));
    setFeedbackMessage('Tarot session record deleted.');
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Filter lists based on search query
  const filteredReports = userReports.filter(r => 
    (r.personality?.archetype || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.createdAt || '').includes(searchQuery) ||
    (r.synthesizedGuidance?.executiveSummary || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPalmScans = userPalmScans.filter(p => 
    (p.handType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.lifeLine?.interpretation || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTarotSessions = userTarotSessions.filter(t => 
    (t.spreadTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.question || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.aiInterpretation || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-[#E0E0E6]">
      
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-emerald-400/60 hover:text-emerald-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Profile & User Email Vault Overview (Photo part removed) */}
      <div className="bg-gradient-to-r from-violet-950/60 via-[#0A0A12] to-amber-950/30 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs font-semibold uppercase">
              {currentUser.role}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-white/60 mt-1">
            <span className="flex items-center space-x-1 font-mono text-violet-300">
              <Mail className="w-3.5 h-3.5 text-violet-400" />
              <span>{currentUser.email}</span>
            </span>
            <span>•</span>
            <span>Age Group: {currentUser.ageGroup}</span>
          </div>

          <div className="flex items-center space-x-2 mt-2 text-xs text-amber-300 font-medium">
            <Award className="w-4 h-4" />
            <span>Preferred Deck: {currentUser.readingPreferences?.preferredDeck || 'Rider-Waite Classic'}</span>
          </div>
        </div>

        {/* Email Isolation Badge */}
        <div className="bg-black/60 border border-violet-500/30 rounded-xl p-3.5 flex items-start space-x-3 max-w-sm">
          <div className="p-2 bg-violet-500/20 rounded-lg text-violet-300 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-white flex items-center space-x-1.5">
              <span>Isolated User Vault</span>
              <Lock className="w-3 h-3 text-amber-400" />
            </div>
            <p className="text-[11px] text-white/50 mt-0.5 leading-snug">
              Readings and synthesis reports are strictly isolated to <span className="text-violet-300 font-mono">{currentUser.email}</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Reading History & Synthesized Reports strictly for this email */}
        <div className="lg:col-span-8 bg-[#0B0B12] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
          
          {/* Header & Category Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-violet-400" />
              <h3 className="font-bold text-base text-white">Personal Reading History</h3>
            </div>

            {/* Sub-Tabs: Synthesized Reports vs Palm Scans vs Tarot Readings */}
            <div className="flex items-center space-x-1 bg-black/60 border border-white/10 p-1 rounded-xl text-xs">
              <button
                onClick={() => setHistoryTab('synthesis')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                  historyTab === 'synthesis'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Reports ({userReports.length})</span>
              </button>

              <button
                onClick={() => setHistoryTab('palm')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                  historyTab === 'palm'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Palm Scans ({userPalmScans.length})</span>
              </button>

              <button
                onClick={() => setHistoryTab('tarot')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                  historyTab === 'tarot'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Tarot Cards ({userTarotSessions.length})</span>
              </button>
            </div>
          </div>

          {/* Search bar inside user history */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search within ${currentUser.email}'s ${historyTab === 'synthesis' ? 'reports' : historyTab === 'palm' ? 'palm scans' : 'tarot sessions'}...`}
              className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* TAB 1: SYNTHESIZED REPORTS */}
          {historyTab === 'synthesis' && (
            <div className="space-y-3">
              {filteredReports.length > 0 ? (
                filteredReports.map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => onOpenReport(rep)}
                    className="p-4 bg-black/50 border border-white/10 hover:border-violet-500/80 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="p-3 bg-violet-950/80 border border-violet-800/60 rounded-xl text-violet-300 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors flex items-center space-x-2">
                          <span>{rep.personality.archetype}</span>
                        </div>
                        <p className="text-xs text-white/60 line-clamp-1 mt-0.5 max-w-md">
                          {rep.synthesizedGuidance.executiveSummary}
                        </p>
                        <div className="text-[11px] text-white/40 flex items-center space-x-2.5 mt-1.5">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-white/40" />
                            <span>{rep.createdAt}</span>
                          </span>
                          <span>•</span>
                          <span className="text-amber-400 font-semibold">
                            Confidence Score: {rep.weightedScore.overallScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {onTalkToExpert && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTalkToExpert(rep);
                          }}
                          className="p-2 text-white/40 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="Share with an astrologer"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReportToDelete(rep);
                        }}
                        className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete this report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center space-x-1 text-xs font-semibold text-violet-400 pl-2">
                        <span>View</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-black/40 border border-white/10 rounded-xl space-y-3">
                  <Compass className="w-8 h-8 text-violet-400 mx-auto" />
                  <h4 className="font-bold text-sm text-white">
                    No Synthesized Reports for <span className="text-violet-300">{currentUser.email}</span>
                  </h4>
                  <p className="text-xs text-white/50 max-w-md mx-auto">
                    Synthesized reports combine your palm crease vectors and tarot spreads. Scan your palm or perform a tarot reading to generate your first report for this email.
                  </p>
                  {onStartReading && (
                    <div className="flex items-center justify-center space-x-3 pt-2">
                      <button
                        onClick={() => onStartReading('palm')}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md flex items-center space-x-1.5"
                      >
                        <ScanLine className="w-3.5 h-3.5" />
                        <span>Start Palm Scan</span>
                      </button>
                      <button
                        onClick={() => onStartReading('tarot')}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md flex items-center space-x-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Draw Tarot Cards</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PALM SCAN HISTORY */}
          {historyTab === 'palm' && (
            <div className="space-y-3">
              {filteredPalmScans.length > 0 ? (
                filteredPalmScans.map((scan, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-black/50 border border-white/10 rounded-xl space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg">
                          <ScanLine className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">
                            {scan.handType} Hand Scan
                          </div>
                          <div className="text-[11px] text-white/40">
                            Confidence: {Math.round((scan.detectionConfidence || 0.9) * 100)}% • Traced: {scan.scannedAt || 'Recent'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-amber-300">
                          {scan.landmarksCount || 21} Points
                        </span>
                        <button
                          onClick={(e) => handleDeletePalmScan(e, idx)}
                          className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete palm scan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <div className="p-2 bg-white/5 rounded-lg text-[11px]">
                        <div className="text-white/40 text-[10px]">Life Line</div>
                        <div className="font-semibold text-white mt-0.5">{scan.lifeLine?.length} ({scan.lifeLine?.quality})</div>
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg text-[11px]">
                        <div className="text-white/40 text-[10px]">Head Line</div>
                        <div className="font-semibold text-white mt-0.5">{scan.headLine?.length} ({scan.headLine?.quality})</div>
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg text-[11px]">
                        <div className="text-white/40 text-[10px]">Heart Line</div>
                        <div className="font-semibold text-white mt-0.5">{scan.heartLine?.length} ({scan.heartLine?.quality})</div>
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg text-[11px]">
                        <div className="text-white/40 text-[10px]">Fate Line</div>
                        <div className="font-semibold text-white mt-0.5">{scan.fateLine?.length} ({scan.fateLine?.quality})</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-black/40 border border-white/10 rounded-xl space-y-3">
                  <ScanLine className="w-8 h-8 text-amber-400 mx-auto" />
                  <h4 className="font-bold text-sm text-white">
                    No Palm Scans Saved for {currentUser.email}
                  </h4>
                  <p className="text-xs text-white/50 max-w-md mx-auto">
                    Use your webcam or upload a palm photo to capture line vectors and register your palm traits.
                  </p>
                  {onStartReading && (
                    <button
                      onClick={() => onStartReading('palm')}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md inline-flex items-center space-x-1.5"
                    >
                      <ScanLine className="w-3.5 h-3.5" />
                      <span>Capture Palm Now</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TAROT READINGS HISTORY */}
          {historyTab === 'tarot' && (
            <div className="space-y-3">
              {filteredTarotSessions.length > 0 ? (
                filteredTarotSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 bg-black/50 border border-white/10 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-purple-500/20 text-purple-300 rounded-lg">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">{session.spreadTitle}</div>
                          <div className="text-[11px] text-white/40">
                            {session.createdAt} • Inquiry: "{session.question || 'General Guidance'}"
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-[10px] text-purple-300 font-semibold">
                          {session.drawnCards.length} Cards
                        </span>
                        <button
                          onClick={(e) => handleDeleteTarotSession(e, session.id)}
                          className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete tarot reading"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Drawn Cards Mini Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {session.drawnCards.map((c, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[11px] text-white/80">
                          <span className="text-violet-400 font-semibold">{c.positionName}:</span> {c.card.name} {c.isReversed ? '(Rev)' : ''}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-white/70 bg-black/60 p-3 rounded-lg border border-white/5 line-clamp-2">
                      {session.aiInterpretation}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-black/40 border border-white/10 rounded-xl space-y-3">
                  <Layers className="w-8 h-8 text-purple-400 mx-auto animate-pulse" />
                  <h4 className="font-bold text-sm text-white">
                    No Tarot Readings Saved for {currentUser.email}
                  </h4>
                  <p className="text-xs text-white/50 max-w-md mx-auto">
                    Draw tarot cards using our interactive shuffle deck to receive personalized card meanings and spreads.
                  </p>
                  {onStartReading && (
                    <button
                      onClick={() => onStartReading('tarot')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md inline-flex items-center space-x-1.5"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Draw Tarot Spread</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Spiritual Goals & Email Preferences */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Spiritual Goals Manager */}
          <div className="bg-[#0B0B12] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Spiritual Goal Tracker</h3>
              </div>
              <span className="text-[10px] font-mono text-white/40">{goals.length} Goals</span>
            </div>

            <div className="space-y-2 text-xs">
              {goals.map((g, idx) => (
                <div key={idx} className="p-2.5 bg-black/50 rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-white/90">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{g}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Goal Input */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                placeholder="Add new goal..."
                className="flex-1 px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={handleAddGoal}
                className="px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Account & Astrological Info Card */}
          <div className="bg-[#0B0B12] border border-white/10 rounded-2xl p-6 shadow-xl space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm border-b border-white/10 pb-2">
              Account Astrological Profile
            </h4>
            <div className="space-y-2 text-white/70">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/40">Zodiac Sign:</span>
                <span className="font-semibold text-white">{currentUser.zodiacSign || 'Not Set'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/40">Birth Date:</span>
                <span className="text-white">{currentUser.birthDate || 'Not Set'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/40">Birth Place:</span>
                <span className="text-white">{currentUser.birthPlace || 'Not Set'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/40">Registered Email:</span>
                <span className="font-mono text-violet-300">{currentUser.email}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* In-App Delete Confirmation Modal */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0D0D15] border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Delete Reading Report?</h4>
                <p className="text-xs text-white/60">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 bg-black/60 rounded-xl border border-white/10 text-xs space-y-1">
              <div className="font-semibold text-violet-300">{reportToDelete.personality?.archetype}</div>
              <div className="text-white/50 text-[11px]">Created on {reportToDelete.createdAt} • Confidence: {reportToDelete.weightedScore?.overallScore}%</div>
            </div>

            <p className="text-xs text-white/70">
              Are you sure you want to permanently remove this report from <span className="font-mono text-violet-300">{currentUser.email}</span>'s history?
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setReportToDelete(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteReport}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-900/30 flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
