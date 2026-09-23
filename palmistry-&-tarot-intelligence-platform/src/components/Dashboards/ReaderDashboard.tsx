import React from 'react';
import { UserProfile } from '../../types';
import { INITIAL_ANALYTICS } from '../../data/mockDatabase';
import { BookOpen, Layers, Users, CheckCircle2, Calendar, Star, MessageSquare } from 'lucide-react';

interface ReaderDashboardProps {
  currentUser: UserProfile;
}

export const ReaderDashboard: React.FC<ReaderDashboardProps> = ({ currentUser }) => {
  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Reader Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 border border-purple-800/60 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="text-xs uppercase font-bold text-purple-300 tracking-wider">Tarot Practitioner Hub</div>
          <h2 className="text-2xl font-bold text-white">Welcome, Madame Celeste</h2>
          <p className="text-xs text-slate-300 mt-1">
            Track active tarot reading queues, card spread analytics, and seeker consultation feedback.
          </p>
        </div>

        <div className="p-3 bg-purple-900/40 border border-purple-700/60 rounded-xl text-xs text-center shrink-0">
          <div className="text-xl font-bold text-amber-400">4.92 / 5.0</div>
          <div className="text-[10px] text-purple-200">Reader Rating</div>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Readings</div>
          <div className="text-2xl font-black text-white mt-1 font-mono">6,390</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ +14% this month</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase">Top Spread</div>
          <div className="text-lg font-bold text-amber-300 mt-1">Three Card Spread</div>
          <div className="text-[10px] text-slate-400 mt-1">3,210 Sessions</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase">Completion Rate</div>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">98.4%</div>
          <div className="text-[10px] text-slate-400 mt-1">Optimal Completion</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase">Active Clients</div>
          <div className="text-2xl font-black text-purple-400 mt-1 font-mono">1,240</div>
          <div className="text-[10px] text-slate-400 mt-1">Repeat Seeker Base</div>
        </div>
      </div>

      {/* Spreads Usage Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-purple-400" />
          <span>Most Popular Tarot Spreads Requested</span>
        </h3>

        <div className="space-y-3 text-xs">
          {INITIAL_ANALYTICS.topSpreads.map((spread, i) => (
            <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-200">{spread.name}</span>
              <span className="px-3 py-1 bg-purple-950 text-purple-300 rounded-full border border-purple-800 font-mono">
                {spread.count} Readings
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
