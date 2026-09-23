import { UserProfile } from '../types';
import { UserDataStoreRecord } from './userDatabase';

/**
 * Auto Storage Manager Module
 * 
 * Manages automated real-time persistence, historical backups, data synchronization,
 * and JSON import/export utilities for all records in the `/src/database` system.
 */

export interface DatabaseSnapshot {
  timestamp: string;
  version: string;
  accounts: UserProfile[];
  userDataMap: Record<string, UserDataStoreRecord>;
  checksum: string;
}

export interface StorageStats {
  lastAutoSavedAt: string;
  totalAccountsCount: number;
  totalUserDataRecordsCount: number;
  totalReportsCount: number;
  totalScansCount: number;
  storageSizeBytes: number;
  backupSnapshotsCount: number;
  syncStatus: 'synced' | 'saving' | 'idle' | 'error';
}

const BACKUPS_STORAGE_KEY = 'celestial_db_auto_backups_v1';
const MAX_SNAPSHOT_BACKUPS = 5;

type DatabaseListener = (stats: StorageStats) => void;
const listeners: Set<DatabaseListener> = new Set();

let currentStatus: 'synced' | 'saving' | 'idle' | 'error' = 'synced';
let lastSavedTimestamp = new Date().toISOString();

/**
 * Calculate simple string checksum for integrity checks
 */
const calculateChecksum = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'chk_' + Math.abs(hash).toString(16);
};

/**
 * Get current storage metrics across all database tables
 */
export const getDatabaseStorageStats = (): StorageStats => {
  let accountsCount = 0;
  let dataRecordsCount = 0;
  let reportsCount = 0;
  let scansCount = 0;
  let storageSizeBytes = 0;

  try {
    const rawAccounts = localStorage.getItem('celestial_user_accounts_db');
    if (rawAccounts) {
      storageSizeBytes += rawAccounts.length * 2;
      const parsed = JSON.parse(rawAccounts);
      if (Array.isArray(parsed)) accountsCount = parsed.length;
    }

    const rawUserData = localStorage.getItem('celestial_user_data_db');
    if (rawUserData) {
      storageSizeBytes += rawUserData.length * 2;
      const parsed = JSON.parse(rawUserData) as Record<string, UserDataStoreRecord>;
      const keys = Object.keys(parsed);
      dataRecordsCount = keys.length;

      keys.forEach(key => {
        const rec = parsed[key];
        if (rec) {
          reportsCount += rec.reports?.length || 0;
          scansCount += (rec.palmScans?.length || 0) + (rec.tarotSessions?.length || 0);
        }
      });
    }

    const rawBackups = localStorage.getItem(BACKUPS_STORAGE_KEY);
    if (rawBackups) {
      storageSizeBytes += rawBackups.length * 2;
    }
  } catch (err) {
    console.error('[AutoStorageManager] Error estimating storage stats:', err);
  }

  const snapshots = getBackupSnapshots();

  return {
    lastAutoSavedAt: lastSavedTimestamp,
    totalAccountsCount: accountsCount,
    totalUserDataRecordsCount: dataRecordsCount,
    totalReportsCount: reportsCount,
    totalScansCount: scansCount,
    storageSizeBytes: storageSizeBytes,
    backupSnapshotsCount: snapshots.length,
    syncStatus: currentStatus
  };
};

/**
 * Subscribe UI components to real-time auto-storage updates
 */
export const subscribeToStorageUpdates = (listener: DatabaseListener): () => void => {
  listeners.add(listener);
  // Emit current state immediately
  listener(getDatabaseStorageStats());
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  const stats = getDatabaseStorageStats();
  listeners.forEach(fn => fn(stats));
};

/**
 * Get stored auto-backup snapshots
 */
export const getBackupSnapshots = (): DatabaseSnapshot[] => {
  try {
    const raw = localStorage.getItem(BACKUPS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('[AutoStorageManager] Error loading backup snapshots:', err);
  }
  return [];
};

/**
 * Trigger an automatic storage snapshot and update sync metadata
 */
export const autoStoreTriggerSync = (
  accountsData?: UserProfile[],
  userDataMap?: Record<string, UserDataStoreRecord>
): void => {
  currentStatus = 'saving';
  lastSavedTimestamp = new Date().toISOString();
  notifyListeners();

  try {
    // If not provided directly, read latest from storage
    const accounts = accountsData || (() => {
      const raw = localStorage.getItem('celestial_user_accounts_db');
      return raw ? JSON.parse(raw) : [];
    })();

    const dataMap = userDataMap || (() => {
      const raw = localStorage.getItem('celestial_user_data_db');
      return raw ? JSON.parse(raw) : {};
    })();

    const payloadString = JSON.stringify({ accounts, dataMap });
    const snapshot: DatabaseSnapshot = {
      timestamp: lastSavedTimestamp,
      version: '1.0.0',
      accounts,
      userDataMap: dataMap,
      checksum: calculateChecksum(payloadString)
    };

    // Maintain max rolling backup snapshots
    const existingSnapshots = getBackupSnapshots();
    const updatedSnapshots = [snapshot, ...existingSnapshots].slice(0, MAX_SNAPSHOT_BACKUPS);

    localStorage.setItem(BACKUPS_STORAGE_KEY, JSON.stringify(updatedSnapshots));
    currentStatus = 'synced';
  } catch (err) {
    console.error('[AutoStorageManager] Auto-storage sync failed:', err);
    currentStatus = 'error';
  }

  notifyListeners();
};

/**
 * Export full database bundle as downloadable JSON string
 */
export const exportFullDatabaseJSON = (): string => {
  const accountsRaw = localStorage.getItem('celestial_user_accounts_db');
  const userDataRaw = localStorage.getItem('celestial_user_data_db');

  const fullDump = {
    exportDate: new Date().toISOString(),
    appVersion: '1.0.0',
    databaseName: 'Celestial_Astra_DB',
    accounts: accountsRaw ? JSON.parse(accountsRaw) : [],
    userDataMap: userDataRaw ? JSON.parse(userDataRaw) : {},
    backups: getBackupSnapshots()
  };

  return JSON.stringify(fullDump, null, 2);
};

/**
 * Restore database from a JSON dump string
 */
export const importDatabaseFromJSON = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.accounts && Array.isArray(parsed.accounts)) {
      localStorage.setItem('celestial_user_accounts_db', JSON.stringify(parsed.accounts));
    }
    if (parsed.userDataMap && typeof parsed.userDataMap === 'object') {
      localStorage.setItem('celestial_user_data_db', JSON.stringify(parsed.userDataMap));
    }
    autoStoreTriggerSync();
    return true;
  } catch (err) {
    console.error('[AutoStorageManager] Failed to import database JSON:', err);
    return false;
  }
};
