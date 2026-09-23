import React from 'react';
import { Video, ShieldCheck, ArrowRight, Radio } from 'lucide-react';

interface ExpertCtaBannerProps {
  trialsLeft: number;
  onTalkToExpert: () => void;
  contextLabel: string;
  astrologerTeaser?: string;
}

export const ExpertCtaBanner: React.FC<ExpertCtaBannerProps> = ({
  trialsLeft,
  onTalkToExpert,
  contextLabel,
  astrologerTeaser
}) => {
  const trialCopy = '100% Free Video Consultations · Zero Fee Access';

  return (
    <div className="relative overflow-hidden p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-[#0A0A0F] to-violet-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
      <div className="space-y-1.5 max-w-xl">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            Human Verification Layer
          </span>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Astrologers Online Now
          </span>
        </div>

        <h4 className="text-sm font-bold text-white leading-tight">
          Want deeper clarity on this {contextLabel}? Talk to a Master Astrologer live in video.
        </h4>

        {astrologerTeaser && (
          <p className="text-xs text-violet-200/80 italic">
            "{astrologerTeaser}"
          </p>
        )}

        <div className="text-[11px] font-mono text-amber-300 font-semibold">
          {trialCopy}
        </div>
      </div>

      <button
        type="button"
        onClick={onTalkToExpert}
        className="px-5 py-3 bg-gradient-to-r from-amber-500 via-violet-600 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-lg shadow-violet-900/40 transition-all transform hover:scale-[1.02]"
      >
        <Video className="w-4 h-4" />
        <span>{trialsLeft > 0 ? 'Claim Free Session' : 'Consult Astrologer'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
