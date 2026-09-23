import React, { useState, useEffect } from 'react';
import { 
  getDatabaseStorageStats, 
  subscribeToStorageUpdates, 
  StorageStats, 
  exportFullDatabaseJSON, 
  importDatabaseFromJSON,
  autoStoreTriggerSync,
  getBackupSnapshots
} from '../database/autoStorageManager';
import { Database, HardDrive, Download, Upload, RefreshCw, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export const AutoStorageWidget: React.FC = () => {
  const [stats, setStats] = useState<StorageStats>(getDatabaseStorageStats());
  const [isExporting, setIsExporting] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToStorageUpdates((updatedStats) => {
      setStats(updatedStats);
    });
    return () => unsubscribe();
  }, []);

  const handleManualSync = () => {
    autoStoreTriggerSync();
    triggerToast('Database storage synced & backup snapshot created!');
  };

  const handleExportJSON = () => {
    setIsExporting(true);
    try {
      const jsonStr = exportFullDatabaseJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `celestial_database_export_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerToast('Database exported successfully!');
    } catch (err) {
      console.error('Export error:', err);
      triggerToast('Failed to export database JSON');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDatabaseFromJSON(content);
        if (success) {
          triggerToast('Database imported & restored successfully!');
        } else {
          triggerToast('Invalid database JSON file format');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const triggerToast = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const snapshots = getBackupSnapshots();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-950 border border-indigo-800/60 rounded-lg text-indigo-400">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <span>Auto Storage Manager</span>
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Auto-Save</span>
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Auto-persists database folder records in real time</p>
          </div>
        </div>

        <button
          onClick={handleManualSync}
          className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5"
          title="Force immediate database backup sync"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${stats.syncStatus === 'saving' ? 'animate-spin' : ''}`} />
          <span>Sync Now</span>
        </button>
      </div>

      {/* Notification Toast */}
      {showNotification && (
        <div className="p-2.5 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs rounded-lg flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
          <div className="text-slate-400 text-[11px]">Database Usage</div>
          <div className="font-bold text-indigo-300 text-sm">{formatBytes(stats.storageSizeBytes)}</div>
          <div className="text-[10px] text-slate-500 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Local Storage Enclave</span>
          </div>
        </div>

        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
          <div className="text-slate-400 text-[11px]">Auto-Save Snapshots</div>
          <div className="font-bold text-purple-300 text-sm">{stats.backupSnapshotsCount} Backups</div>
          <div className="text-[10px] text-slate-500 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{snapshots.length > 0 ? new Date(snapshots[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
          </div>
        </div>
      </div>

      {/* Account & Record Metrics */}
      <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center space-x-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Registered Accounts DB</span>
          </span>
          <span className="font-semibold text-white">{stats.totalAccountsCount} accounts</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center space-x-1.5">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>User Activity Records DB</span>
          </span>
          <span className="font-semibold text-white">{stats.totalUserDataRecordsCount} users</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center space-x-1.5">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Total Synthesis Reports DB</span>
          </span>
          <span className="font-semibold text-white">{stats.totalReportsCount} reports</span>
        </div>
      </div>

      {/* Actions: Export / Import Database */}
      <div className="flex items-center space-x-2 pt-1">
        <button
          onClick={handleExportJSON}
          disabled={isExporting}
          className="flex-1 px-3 py-2 bg-indigo-900/60 hover:bg-indigo-700/80 border border-indigo-700/60 text-indigo-200 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Database</span>
        </button>

        <label className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm">
          <Upload className="w-3.5 h-3.5" />
          <span>Import Database</span>
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
