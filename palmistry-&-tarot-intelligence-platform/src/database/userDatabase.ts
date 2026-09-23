import { UserProfile, SynthesisReport, PalmFeatures, TarotReadingSession, SystemNotification } from '../types';
import { INITIAL_USERS, INITIAL_REPORTS, INITIAL_NOTIFICATIONS } from '../data/mockDatabase';
import { autoStoreTriggerSync } from './autoStorageManager';
import { recordUserCredentialsDB } from './userCredentialsDatabase';

/**
 * Celestial Database Storage Layer
 * 
 * Central database management for:
 * 1. User Accounts & Login Credentials DB (`celestial_user_accounts_db`)
 * 2. User-specific Created Data DB (`celestial_user_data_db`), strictly keyed by login email
 */

export interface UserAccountCredentials {
  email: string;
  passwordHash?: string;
  userProfile: UserProfile;
  lastLoginAt: string;
}

export interface UserDataStoreRecord {
  email: string; // Primary Unique Login Email Key
  userId: string;
  reports: SynthesisReport[];
  palmScans: PalmFeatures[];
  tarotSessions: TarotReadingSession[];
  notifications: SystemNotification[];
  spiritualGoals: string[];
  createdAt: string;
  updatedAt: string;
}

const ACCOUNTS_DB_KEY = 'celestial_user_accounts_db';
const USER_DATA_DB_KEY = 'celestial_user_data_db';

// --- 1. LOGIN & ACCOUNTS DATABASE API ---

/**
 * Fetch all registered user accounts from the database
 */
export const getAllUserAccountsDB = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[UserDatabase] Error reading accounts database:', err);
  }
  // Initialize DB with seed users if empty
  saveAllUserAccountsDB(INITIAL_USERS);
  return INITIAL_USERS;
};

/**
 * Persist the entire user accounts table
 */
export const saveAllUserAccountsDB = (users: UserProfile[]): void => {
  try {
    localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(users));
    autoStoreTriggerSync(users, undefined);
  } catch (err) {
    console.error('[UserDatabase] Error saving accounts database:', err);
  }
};

/**
 * Find a specific user by login email
 */
export const findUserByEmailDB = (email: string): UserProfile | undefined => {
  const cleanEmail = email.trim().toLowerCase();
  const accounts = getAllUserAccountsDB();
  return accounts.find(u => u.email.toLowerCase() === cleanEmail);
};

/**
 * Upsert (Create or Update) a user account in the login database
 */
export const upsertUserAccountDB = (user: UserProfile): UserProfile => {
  const cleanEmail = user.email.trim().toLowerCase();
  const accounts = getAllUserAccountsDB();
  const index = accounts.findIndex(u => u.email.toLowerCase() === cleanEmail || u.id === user.id);

  const updatedUser: UserProfile = {
    ...user,
    email: cleanEmail
  };

  if (index >= 0) {
    accounts[index] = updatedUser;
  } else {
    accounts.push(updatedUser);
  }

  saveAllUserAccountsDB(accounts);
  // Synchronously update the credentials vault with the user ID and auth record
  recordUserCredentialsDB(updatedUser);

  // Sync with persistent backend database file (data/database.json)
  try {
    fetch('/api/users/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    }).catch(() => {});
  } catch {}

  return updatedUser;
};

// Initial background sync with backend database
try {
  if (typeof window !== 'undefined') {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.users) && data.users.length > 0) {
          const current = getAllUserAccountsDB();
          const merged = [...data.users];
          current.forEach(u => {
            if (!merged.find(m => m.email.toLowerCase() === u.email.toLowerCase())) {
              merged.push(u);
            }
          });
          localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(merged));
        }
      })
      .catch(() => {});
  }
} catch {}

// --- 2. USER CREATED DATA DATABASE API (KEYED BY LOGIN EMAIL) ---

type UserDataMap = Record<string, UserDataStoreRecord>;

/**
 * Load the complete user activity database map
 */
const getUserDataMapDB = (): UserDataMap => {
  try {
    const raw = localStorage.getItem(USER_DATA_DB_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[UserDatabase] Error reading user data map database:', err);
  }

  // Seed default data for aria (user@palmistry.ai)
  const defaultMap: UserDataMap = {
    'user@palmistry.ai': {
      email: 'user@palmistry.ai',
      userId: 'usr_1',
      reports: INITIAL_REPORTS,
      palmScans: [],
      tarotSessions: [],
      notifications: INITIAL_NOTIFICATIONS,
      spiritualGoals: INITIAL_USERS[0].spiritualGoals,
      createdAt: '2026-01-15',
      updatedAt: new Date().toISOString()
    }
  };

  saveUserDataMapDB(defaultMap);
  return defaultMap;
};

/**
 * Save the entire user activity database map
 */
const saveUserDataMapDB = (map: UserDataMap): void => {
  try {
    localStorage.setItem(USER_DATA_DB_KEY, JSON.stringify(map));
    autoStoreTriggerSync(undefined, map);
  } catch (err) {
    console.error('[UserDatabase] Error persisting user data map database:', err);
  }
};

/**
 * Retrieve user's dedicated database record by their login email.
 * Guarantees that every email gets its own isolated database container.
 */
export const getUserRecordByEmailDB = (email: string, userFallback?: UserProfile): UserDataStoreRecord => {
  const cleanEmail = email.trim().toLowerCase();
  const map = getUserDataMapDB();

  if (map[cleanEmail]) {
    return map[cleanEmail];
  }

  // Create fresh database record for newly logged-in email
  const newRecord: UserDataStoreRecord = {
    email: cleanEmail,
    userId: userFallback?.id || `usr_${Date.now()}`,
    reports: [],
    palmScans: [],
    tarotSessions: [],
    notifications: [],
    spiritualGoals: userFallback?.spiritualGoals || ['Explore Palmistry Insights', 'Discover Tarot Wisdom'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  map[cleanEmail] = newRecord;
  saveUserDataMapDB(map);
  return newRecord;
};

/**
 * Save a new Synthesis Report generated during app usage to the login user's database
 */
export const saveReportForUserDB = (email: string, report: SynthesisReport): void => {
  const cleanEmail = email.trim().toLowerCase();
  const map = getUserDataMapDB();
  const userRecord = map[cleanEmail] || getUserRecordByEmailDB(cleanEmail);

  const reportWithEmail: SynthesisReport = {
    ...report,
    userEmail: cleanEmail
  };

  // Add report ensuring no duplicates
  const existingReports = userRecord.reports.filter(r => r.id !== report.id);
  userRecord.reports = [reportWithEmail, ...existingReports];
  userRecord.updatedAt = new Date().toISOString();

  map[cleanEmail] = userRecord;
  saveUserDataMapDB(map);

  try {
    fetch('/api/users/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, report: reportWithEmail })
    }).catch(() => {});
  } catch {}
};

/**
 * Save a Palm Scan captured during app usage under user's login email
 */
export const savePalmScanForUserDB = (email: string, scan: PalmFeatures): void => {
  const cleanEmail = email.trim().toLowerCase();
  const map = getUserDataMapDB();
  const userRecord = map[cleanEmail] || getUserRecordByEmailDB(cleanEmail);

  const scanWithEmail: PalmFeatures = {
    ...scan,
    userEmail: cleanEmail,
    scannedAt: scan.scannedAt || new Date().toISOString().split('T')[0]
  };

  userRecord.palmScans = [scanWithEmail, ...userRecord.palmScans];
  userRecord.updatedAt = new Date().toISOString();

  map[cleanEmail] = userRecord;
  saveUserDataMapDB(map);

  try {
    fetch('/api/users/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, palmScan: scanWithEmail })
    }).catch(() => {});
  } catch {}
};

/**
 * Save a Tarot Session drawn during app usage under user's login email
 */
export const saveTarotSessionForUserDB = (email: string, session: TarotReadingSession): void => {
  const cleanEmail = email.trim().toLowerCase();
  const map = getUserDataMapDB();
  const userRecord = map[cleanEmail] || getUserRecordByEmailDB(cleanEmail);

  const sessionWithEmail: TarotReadingSession = {
    ...session,
    userEmail: cleanEmail
  };

  const existingSessions = userRecord.tarotSessions.filter(s => s.id !== session.id);
  userRecord.tarotSessions = [sessionWithEmail, ...existingSessions];
  userRecord.updatedAt = new Date().toISOString();

  map[cleanEmail] = userRecord;
  saveUserDataMapDB(map);

  try {
    fetch('/api/users/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, tarotSession: sessionWithEmail })
    }).catch(() => {});
  } catch {}
};

/**
 * Update user's spiritual goals in their login database record
 */
export const saveSpiritualGoalsForUserDB = (email: string, goals: string[]): void => {
  const cleanEmail = email.trim().toLowerCase();
  const map = getUserDataMapDB();
  const userRecord = map[cleanEmail] || getUserRecordByEmailDB(cleanEmail);

  userRecord.spiritualGoals = goals;
  userRecord.updatedAt = new Date().toISOString();

  map[cleanEmail] = userRecord;
  saveUserDataMapDB(map);

  try {
    fetch('/api/users/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, spiritualGoals: goals })
    }).catch(() => {});
  } catch {}
};

/**
 * Get all reports stored for a specific login email
 */
export const getReportsForUserDB = (email: string): SynthesisReport[] => {
  const cleanEmail = email.trim().toLowerCase();
  const record = getUserRecordByEmailDB(cleanEmail);
  return record.reports || [];
};

/**
 * Get all palm scans stored for a specific login email
 */
export const getPalmScansForUserDB = (email: string): PalmFeatures[] => {
  const cleanEmail = email.trim().toLowerCase();
  const record = getUserRecordByEmailDB(cleanEmail);
  return record.palmScans || [];
};

/**
 * Get all tarot sessions stored for a specific login email
 */
export const getTarotSessionsForUserDB = (email: string): TarotReadingSession[] => {
  const cleanEmail = email.trim().toLowerCase();
  const record = getUserRecordByEmailDB(cleanEmail);
  return record.tarotSessions || [];
};

/**
 * Delete a report strictly from that user's email records
 */
export const deleteReportForUserDB = (email: string, reportId: string): void => {
  const cleanEmail = email.trim().toLowerCase();
  const map = getUserDataMapDB();
  const userRecord = map[cleanEmail] || getUserRecordByEmailDB(cleanEmail);

  userRecord.reports = userRecord.reports.filter(r => r.id !== reportId);
  userRecord.updatedAt = new Date().toISOString();

  map[cleanEmail] = userRecord;
  saveUserDataMapDB(map);
};

/**
 * Delete a palm scan strictly from that user's email records
 */
export const deletePalmScanForUserDB = (email: string, scanIndex: number): void => {
  const cleanEmail = email.trim().toLowerCase();
  const map = getUserDataMapDB();
  const userRecord = map[cleanEmail] || getUserRecordByEmailDB(cleanEmail);

  userRecord.palmScans = userRecord.palmScans.filter((_, idx) => idx !== scanIndex);
  userRecord.updatedAt = new Date().toISOString();

  map[cleanEmail] = userRecord;
  saveUserDataMapDB(map);
};

/**
 * Delete a tarot reading session strictly from that user's email records
 */
export const deleteTarotSessionForUserDB = (email: string, sessionId: string): void => {
  const cleanEmail = email.trim().toLowerCase();
  const map = getUserDataMapDB();
  const userRecord = map[cleanEmail] || getUserRecordByEmailDB(cleanEmail);

  userRecord.tarotSessions = userRecord.tarotSessions.filter(s => s.id !== sessionId);
  userRecord.updatedAt = new Date().toISOString();

  map[cleanEmail] = userRecord;
  saveUserDataMapDB(map);
};

/**
 * Get notifications stored for a specific login email
 */
export const getNotificationsForUserDB = (email: string): SystemNotification[] => {
  const cleanEmail = email.trim().toLowerCase();
  const record = getUserRecordByEmailDB(cleanEmail);
  return record.notifications || [];
};

/**
 * Mark a notification as read for a specific user
 */
export const markNotificationReadDB = (email: string, notifId: string): SystemNotification[] => {
  const cleanEmail = email.trim().toLowerCase();
  const map = getUserDataMapDB();
  const userRecord = map[cleanEmail] || getUserRecordByEmailDB(cleanEmail);

  userRecord.notifications = userRecord.notifications.map(n => 
    n.id === notifId ? { ...n, read: true } : n
  );
  userRecord.updatedAt = new Date().toISOString();

  map[cleanEmail] = userRecord;
  saveUserDataMapDB(map);
  return userRecord.notifications;
};
