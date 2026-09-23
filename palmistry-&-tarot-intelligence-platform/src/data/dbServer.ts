import fs from 'fs';
import path from 'path';
import { UserProfile, SynthesisReport, SystemNotification, PalmFeatures, TarotReadingSession } from '../types';
import { UserCredentialRecord, INITIAL_USER_CREDENTIALS } from './userCredentials';
import { INITIAL_USERS, INITIAL_NOTIFICATIONS, INITIAL_REPORTS } from './mockDatabase';

export interface UserDataStoreRecord {
  email: string;
  userId: string;
  reports: SynthesisReport[];
  palmScans: PalmFeatures[];
  tarotSessions: TarotReadingSession[];
  notifications: SystemNotification[];
  spiritualGoals: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  version: string;
  lastSyncedAt: string;
  users: UserProfile[];
  credentials: UserCredentialRecord[];
  userDataStore: Record<string, UserDataStoreRecord>;
  reports: SynthesisReport[];
  notifications: SystemNotification[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

// In-memory cache synced with disk
let cachedDb: DatabaseSchema | null = null;

export function initDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      cachedDb = {
        version: parsed.version || '2.0.0',
        lastSyncedAt: new Date().toISOString(),
        users: Array.isArray(parsed.users) && parsed.users.length > 0 ? parsed.users : [...INITIAL_USERS],
        credentials: Array.isArray(parsed.credentials) && parsed.credentials.length > 0 ? parsed.credentials : [...INITIAL_USER_CREDENTIALS],
        userDataStore: parsed.userDataStore || {},
        reports: Array.isArray(parsed.reports) ? parsed.reports : [...INITIAL_REPORTS],
        notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [...INITIAL_NOTIFICATIONS]
      };
    } else {
      cachedDb = {
        version: '2.0.0',
        lastSyncedAt: new Date().toISOString(),
        users: [...INITIAL_USERS],
        credentials: [...INITIAL_USER_CREDENTIALS],
        userDataStore: {},
        reports: [...INITIAL_REPORTS],
        notifications: [...INITIAL_NOTIFICATIONS]
      };
      flushDatabase();
    }
  } catch (err) {
    console.error('[DatabaseManager] Error reading database.json, initializing defaults:', err);
    cachedDb = {
      version: '2.0.0',
      lastSyncedAt: new Date().toISOString(),
      users: [...INITIAL_USERS],
      credentials: [...INITIAL_USER_CREDENTIALS],
      userDataStore: {},
      reports: [...INITIAL_REPORTS],
      notifications: [...INITIAL_NOTIFICATIONS]
    };
    flushDatabase();
  }
  return cachedDb;
}

export function flushDatabase(): void {
  if (!cachedDb) return;
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    cachedDb.lastSyncedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(cachedDb, null, 2), 'utf8');
  } catch (err) {
    console.error('[DatabaseManager] Error writing database.json to disk:', err);
  }
}

export function getDatabase(): DatabaseSchema {
  if (!cachedDb) {
    return initDatabase();
  }
  return cachedDb;
}

// -------------------------------------------------------------
// USER PROFILES
// -------------------------------------------------------------
export function getAllUsers(): UserProfile[] {
  return getDatabase().users;
}

export function findUserByEmail(email: string): UserProfile | undefined {
  const cleanEmail = (email || '').trim().toLowerCase();
  return getDatabase().users.find(u => u.email.toLowerCase() === cleanEmail);
}

export function upsertUser(user: UserProfile): UserProfile {
  const db = getDatabase();
  const cleanEmail = user.email.trim().toLowerCase();
  const updatedUser: UserProfile = {
    ...user,
    email: cleanEmail
  };

  const idx = db.users.findIndex(u => u.email.toLowerCase() === cleanEmail || u.id === user.id);
  if (idx >= 0) {
    db.users[idx] = { ...db.users[idx], ...updatedUser };
  } else {
    db.users.unshift(updatedUser);
  }
  flushDatabase();
  return db.users[idx >= 0 ? idx : 0];
}

// -------------------------------------------------------------
// CREDENTIALS VAULT
// -------------------------------------------------------------
export function getAllCredentials(): UserCredentialRecord[] {
  return getDatabase().credentials;
}

export function upsertCredential(credential: UserCredentialRecord): UserCredentialRecord {
  const db = getDatabase();
  const cleanEmail = credential.email.trim().toLowerCase();
  const record: UserCredentialRecord = {
    ...credential,
    email: cleanEmail,
    lastLoginAt: new Date().toISOString()
  };

  const idx = db.credentials.findIndex(c => c.email.toLowerCase() === cleanEmail || c.userId === credential.userId);
  if (idx >= 0) {
    db.credentials[idx] = { ...db.credentials[idx], ...record };
  } else {
    db.credentials.unshift(record);
  }
  flushDatabase();
  return record;
}

// -------------------------------------------------------------
// USER DATA STORE (Per-User Scans, Tarot, Reports)
// -------------------------------------------------------------
export function getUserDataRecord(email: string): UserDataStoreRecord {
  const db = getDatabase();
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!db.userDataStore[cleanEmail]) {
    const user = findUserByEmail(cleanEmail);
    db.userDataStore[cleanEmail] = {
      email: cleanEmail,
      userId: user?.id || `usr_${Date.now()}`,
      reports: [],
      palmScans: [],
      tarotSessions: [],
      notifications: [],
      spiritualGoals: user?.spiritualGoals || ['Spiritual Growth', 'Clarity'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    flushDatabase();
  }
  return db.userDataStore[cleanEmail];
}

export function saveUserDataRecord(email: string, updates: Partial<UserDataStoreRecord>): UserDataStoreRecord {
  const record = getUserDataRecord(email);
  const updated: UserDataStoreRecord = {
    ...record,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  getDatabase().userDataStore[record.email] = updated;
  flushDatabase();
  return updated;
}
