import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, PalmFeatures, TarotReadingSession, SystemNotification, SynthesisReport, AppTab, ConsultIntent } from './types';
import { INITIAL_USERS } from './data/mockDatabase';
import {
  getReportsForUserDB,
  saveReportForUserDB,
  deleteReportForUserDB,
  savePalmScanForUserDB,
  saveTarotSessionForUserDB,
  upsertUserAccountDB,
  getNotificationsForUserDB,
  markNotificationReadDB,
  getUserRecordByEmailDB,
  findUserByEmailDB,
  getAllUserAccountsDB
} from './database/userDatabase';
import { generateDynamicSynthesisReport } from './utils/synthesisGenerator';
import { Navbar } from './components/Navbar';
import { FrontPageLanding } from './components/FrontPageLanding';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { PalmScanner } from './components/PalmScanner';
import { TarotStudio } from './components/TarotStudio';
import { UnifiedReadingView } from './components/UnifiedReadingView';
import { UserDashboard } from './components/Dashboards/UserDashboard';
import { ReaderDashboard } from './components/Dashboards/ReaderDashboard';
import { ConsultantDashboard } from './components/Dashboards/ConsultantDashboard';
import { AdminDashboard } from './components/Dashboards/AdminDashboard';
import { NotificationCenter } from './components/NotificationCenter';
import { LiveExpertsStudio } from './components/LiveExpertsStudio';
import { getOrCreateTrialAccount } from './database/consultDatabase';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedEmail = localStorage.getItem('celestial_last_active_email');
      if (savedEmail) {
        const found = findUserByEmailDB(savedEmail);
        if (found) return found;
      }
      const accounts = getAllUserAccountsDB();
      if (accounts && accounts.length > 0) {
        return accounts[0];
      }
    } catch { }
    return INITIAL_USERS[0];
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const savedEmail = localStorage.getItem('celestial_last_active_email');
      const token = localStorage.getItem('jwt_token');
      return !!(savedEmail || token);
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<AppTab>('home');

  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(() => {
    try {
      const savedEmail = localStorage.getItem('celestial_last_active_email');
      const token = localStorage.getItem('jwt_token');
      return !(savedEmail || token);
    } catch {
      return true;
    }
  });

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<SystemNotification[]>(() =>
    getNotificationsForUserDB(currentUser?.email || INITIAL_USERS[0].email)
  );

  const [currentPalm, setCurrentPalm] = useState<PalmFeatures | null>(null);
  const [currentTarot, setCurrentTarot] = useState<TarotReadingSession | null>(null);
  const [savedReports, setSavedReports] = useState<SynthesisReport[]>(() =>
    getReportsForUserDB(currentUser?.email || INITIAL_USERS[0].email)
  );
  const [selectedReport, setSelectedReport] = useState<SynthesisReport | null>(null);
  const [consultIntent, setConsultIntent] = useState<ConsultIntent | null>(null);
  const [trialTick, setTrialTick] = useState(0);

  // Synchronize state when user changes or logs in
  useEffect(() => {
    if (currentUser && currentUser.email) {
      setSavedReports(getReportsForUserDB(currentUser.email));
      setNotifications(getNotificationsForUserDB(currentUser.email));
    }
  }, [currentUser]);

  const handlePalmAnalyzed = (features: PalmFeatures) => {
    setCurrentPalm(features);
    savePalmScanForUserDB(currentUser.email, features);

    const newReport = generateDynamicSynthesisReport({
      palmData: features,
      tarotData: currentTarot,
      userProfile: currentUser,
      seedTimestamp: Date.now()
    });

    saveReportForUserDB(currentUser.email, newReport);
    setSavedReports(getReportsForUserDB(currentUser.email));
    setSelectedReport(newReport);
  };

  const handleTarotAnalyzed = (session: TarotReadingSession) => {
    setCurrentTarot(session);
    saveTarotSessionForUserDB(currentUser.email, session);

    const newReport = generateDynamicSynthesisReport({
      palmData: currentPalm,
      tarotData: session,
      userProfile: currentUser,
      seedTimestamp: Date.now()
    });

    saveReportForUserDB(currentUser.email, newReport);
    setSavedReports(getReportsForUserDB(currentUser.email));
    setSelectedReport(newReport);
  };

  const handleLoginSuccess = (usr: UserProfile, isFirstLogin?: boolean) => {
    setCurrentUser(usr);
    setIsLoggedIn(true);
    setIsAuthOpen(false);
    setActiveTab('home');

    localStorage.setItem('celestial_last_active_email', usr.email);

    // Ensure database record exists for logged in user email
    getUserRecordByEmailDB(usr.email, usr);
    setSavedReports(getReportsForUserDB(usr.email));
    setNotifications(getNotificationsForUserDB(usr.email));
    setCurrentPalm(null);
    setCurrentTarot(null);

    if (isFirstLogin) {
      setTimeout(() => {
        setIsProfileOpen(true);
      }, 300);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('celestial_last_active_email');
    setIsAuthOpen(true);
    setCurrentPalm(null);
    setCurrentTarot(null);
    setSelectedReport(null);
  };

  const handleTabSelect = (tab: AppTab) => {
    if (!isLoggedIn && tab !== 'home') {
      setIsAuthOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const openExperts = (intent?: ConsultIntent) => {
    setConsultIntent(intent || null);
    handleTabSelect('experts');
  };

  const trialRemaining = getOrCreateTrialAccount(currentUser.email).trialRemaining;

  const handleDeleteReport = (reportId: string) => {
    if (currentUser?.email) {
      deleteReportForUserDB(currentUser.email, reportId);
      setSavedReports(getReportsForUserDB(currentUser.email));
    }
    if (selectedReport?.id === reportId) {
      setSelectedReport(null);
    }
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    const cleanedProfile: UserProfile = {
      ...updated,
      isFirstTime: false
    };
    setCurrentUser(cleanedProfile);
    localStorage.setItem('celestial_last_active_email', cleanedProfile.email);

    // Persist complete credentials and user account in userDatabase
    upsertUserAccountDB(cleanedProfile);
  };

  const handleMarkRead = (id: string) => {
    const updated = markNotificationReadDB(currentUser.email, id);
    setNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#050507] text-[#E0E0E6] font-sans selection:bg-violet-600 selection:text-white flex flex-col">

      {/* Top Header Navigation */}
      <Navbar
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        activeTab={activeTab}
        setActiveTab={handleTabSelect}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setIsNotifOpen(true)}
        trialsRemaining={trialRemaining}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'home' && (
              <FrontPageLanding
                currentUser={currentUser}
                onNavigate={(tab) => handleTabSelect(tab)}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            )}

            {activeTab === 'palm' && (
              <PalmScanner
                onPalmAnalyzed={handlePalmAnalyzed}
                userAgeGroup={currentUser.ageGroup}
                userGoals={currentUser.spiritualGoals}
                trialsLeft={trialRemaining}
                onTalkToExpert={(artifactLabel) =>
                  openExperts({
                    specialty: 'palm',
                    artifact: currentPalm
                      ? { type: 'palm_scan', id: `palm_${currentPalm.scannedAt || Date.now()}`, label: artifactLabel }
                      : undefined
                  })
                }
              />
            )}

            {activeTab === 'tarot' && (
              <TarotStudio
                onTarotAnalyzed={handleTarotAnalyzed}
                userContext={currentUser.spiritualGoals?.join(', ')}
                trialsLeft={trialRemaining}
                onTalkToExpert={(session) =>
                  openExperts({
                    specialty: 'tarot',
                    artifact: session
                      ? { type: 'tarot_session', id: session.id, label: session.spreadTitle }
                      : undefined
                  })
                }
              />
            )}

            {activeTab === 'synthesis' && (
              <UnifiedReadingView
                currentPalm={currentPalm}
                currentTarot={currentTarot}
                currentUser={currentUser}
                selectedReport={selectedReport}
                onNavigateToPalm={() => setActiveTab('palm')}
                onNavigateToTarot={() => setActiveTab('tarot')}
                trialsLeft={trialRemaining}
                onTalkToExpert={() =>
                  openExperts({
                    specialty: 'all',
                    artifact: selectedReport
                      ? { type: 'synthesis_report', id: selectedReport.id, label: selectedReport.personality.archetype }
                      : undefined
                  })
                }
              />
            )}

            {activeTab === 'dashboard' && (
              <>
                {currentUser.role === 'user' && (
                  <UserDashboard
                    currentUser={currentUser}
                    savedReports={savedReports}
                    onOpenReport={(rep) => {
                      setSelectedReport(rep);
                      setActiveTab('synthesis');
                    }}
                    onStartReading={(tab) => setActiveTab(tab)}
                    onDeleteReport={handleDeleteReport}
                    onTalkToExpert={(rep) =>
                      openExperts({
                        specialty: 'all',
                        artifact: { type: 'synthesis_report', id: rep.id, label: rep.personality.archetype }
                      })
                    }
                  />
                )}
                {currentUser.role === 'reader' && (
                  <ReaderDashboard currentUser={currentUser} />
                )}
                {currentUser.role === 'consultant' && (
                  <ConsultantDashboard currentUser={currentUser} />
                )}
                {currentUser.role === 'admin' && (
                  <AdminDashboard currentUser={currentUser} />
                )}
              </>
            )}

            {activeTab === 'experts' && (
              <LiveExpertsStudio
                key={trialTick}
                currentUser={currentUser}
                intent={consultIntent}
                currentPalm={currentPalm}
                currentTarot={currentTarot}
                onTrialChanged={() => setTrialTick(n => n + 1)}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard currentUser={currentUser} />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* User Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* User Profile & Astrological Details Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
      />

      {/* Notifications Drawer */}
      <NotificationCenter
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
      />

    </div>
  );
}
