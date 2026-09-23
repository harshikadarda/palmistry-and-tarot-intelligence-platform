import React from 'react';
import { UserProfile, AppTab } from '../types';
import { 
  Layers, 
  Compass, 
  LayoutDashboard, 
  Bell, 
  ShieldAlert, 
  User,
  LogIn,
  Video
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  isLoggedIn: boolean;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  trialsRemaining?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  isLoggedIn,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenProfile,
  unreadNotificationsCount,
  onOpenNotifications,
  trialsRemaining = 2
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0F]/90 backdrop-blur-md border-b border-white/10 text-[#E0E0E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-300 font-mono">
                Palmistry & Tarot Intelligence Platform
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium uppercase tracking-[0.2em]">
            <button
              onClick={() => setActiveTab('home')}
              className={`pb-1 transition-all flex items-center space-x-1.5 ${
                activeTab === 'home'
                  ? 'text-white border-b-2 border-violet-500 font-bold'
                  : 'text-white/60 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('palm')}
              className={`pb-1 transition-all flex items-center space-x-1.5 ${
                activeTab === 'palm'
                  ? 'text-white border-b-2 border-violet-500 font-bold'
                  : 'text-white/60 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <span>Palmistry</span>
            </button>

            <button
              onClick={() => setActiveTab('tarot')}
              className={`pb-1 transition-all flex items-center space-x-1.5 ${
                activeTab === 'tarot'
                  ? 'text-white border-b-2 border-violet-500 font-bold'
                  : 'text-white/60 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              <span>Tarot Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('synthesis')}
              className={`pb-1 transition-all flex items-center space-x-1.5 ${
                activeTab === 'synthesis'
                  ? 'text-white border-b-2 border-violet-500 font-bold'
                  : 'text-white/60 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Synthesis</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-1 transition-all flex items-center space-x-1.5 ${
                activeTab === 'dashboard'
                  ? 'text-white border-b-2 border-violet-500 font-bold'
                  : 'text-white/60 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('experts')}
              className={`pb-1 transition-all flex items-center space-x-1.5 relative ${
                activeTab === 'experts'
                  ? 'text-white border-b-2 border-violet-500 font-bold'
                  : 'text-white/60 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span>Experts</span>
            </button>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`pb-1 transition-all flex items-center space-x-1.5 ${
                  activeTab === 'admin'
                    ? 'text-amber-300 border-b-2 border-amber-500 font-bold'
                    : 'text-amber-400/60 hover:text-amber-300 border-b-2 border-transparent'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* User Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors border border-white/10"
              title="Notifications & Insights"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Login / Profile Button */}
            {isLoggedIn ? (
              <button
                onClick={onOpenProfile}
                title="Click to view & edit astrological details"
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/40 transition-all text-xs group"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-amber-400 p-0.5 flex items-center justify-center shrink-0">
                  <div className="w-full h-full bg-[#050507] rounded-full flex items-center justify-center text-amber-300 font-bold text-[11px] uppercase">
                    {currentUser.name ? currentUser.name.slice(0, 1) : 'U'}
                  </div>
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                    {currentUser.name}
                  </div>
                  {currentUser.zodiacSign ? (
                    <div className="text-[9px] font-mono text-amber-400/90 leading-none">
                      {currentUser.zodiacSign}
                    </div>
                  ) : (
                    <div className="text-[9px] font-mono text-white/40 leading-none">
                      + Add Birth Info
                    </div>
                  )}
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl sleek-glow-violet transition-all flex items-center space-x-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>User Login</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
