import React from 'react';
import { SystemNotification } from '../types';
import { Bell, Check, X, AlertCircle, Volume2 } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onMarkRead: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 to-slate-900 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Spiritual Notifications</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-xl border transition-all ${
                notif.read
                  ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                  : 'bg-purple-950/40 border-purple-800 text-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="font-bold text-slate-100">{notif.title}</div>
                {!notif.read && (
                  <button
                    onClick={() => onMarkRead(notif.id)}
                    className="text-[10px] text-amber-400 hover:underline flex items-center space-x-0.5 shrink-0"
                  >
                    <Check className="w-3 h-3" />
                    <span>Read</span>
                  </button>
                )}
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
              <div className="text-[10px] text-slate-500 mt-2 font-mono">{notif.createdAt}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
