import React from 'react';
import { UserProfile } from '../../types';
import { Award, Compass, TrendingUp, Users, CheckCircle2, MessageSquare } from 'lucide-react';

interface ConsultantDashboardProps {
  currentUser: UserProfile;
}

export const ConsultantDashboard: React.FC<ConsultantDashboardProps> = ({ currentUser }) => {
  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Consultant Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-800/60 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="text-xs uppercase font-bold text-emerald-300 tracking-wider">Spiritual Consultant Portal</div>
          <h2 className="text-2xl font-bold text-white">Dr. Seraphina Moon</h2>
          <p className="text-xs text-slate-300 mt-1">
            Holistic life path coaching, guidance effectiveness monitoring, and synthesized case notes.
          </p>
        </div>

        <div className="p-3 bg-emerald-900/40 border border-emerald-700/60 rounded-xl text-xs text-center shrink-0">
          <div className="text-xl font-bold text-emerald-400">96.8%</div>
          <div className="text-[10px] text-emerald-200">Guidance Effectiveness</div>
        </div>
      </div>

      {/* Seeker Trend Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 uppercase font-semibold">Primary Seeker Interest</div>
          <div className="text-lg font-bold text-white">Career Purpose (38%)</div>
          <p className="text-[11px] text-slate-400">Vocational alignment is the #1 inquiry.</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 uppercase font-semibold">Active Consultations</div>
          <div className="text-2xl font-black text-indigo-400 font-mono">142</div>
          <p className="text-[11px] text-slate-400">Ongoing 1-on-1 coaching trajectories.</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 uppercase font-semibold">Insight Satisfaction</div>
          <div className="text-2xl font-black text-amber-400 font-mono">4.91 / 5.0</div>
          <p className="text-[11px] text-slate-400">Verified seeker feedback score.</p>
        </div>
      </div>

      {/* Case Notes & Spiritual Recommendations */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          <span>Recent Consultant Case Notes</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Client: Aria Vance (Fire Palm + Magician)</span>
              <span className="text-slate-500 text-[10px]">Aug 02, 2026</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Recommended incorporating 10 minutes of morning breathwork to ground her high creative Fire energy. Advised focusing on single vocational shift.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
