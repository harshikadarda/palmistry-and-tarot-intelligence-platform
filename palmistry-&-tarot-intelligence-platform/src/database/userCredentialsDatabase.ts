import { UserCredentialRecord, INITIAL_USER_CREDENTIALS } from '../data/userCredentials';
import { UserProfile } from '../types';

export type { UserCredentialRecord };

const CREDENTIALS_STORAGE_KEY = 'celestial_user_credentials_vault';

/**
 * Retrieves all stored user ID and password records from the credentials vault.
 */
export const getAllUserCredentialsDB = (): UserCredentialRecord[] => {
  try {
    const raw = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[UserCredentialsDB] Error reading credentials database:', err);
  }

  // Seed default credentials if storage is empty
  saveAllUserCredentialsDB(INITIAL_USER_CREDENTIALS);
  return INITIAL_USER_CREDENTIALS;
};

/**
 * Saves all user credentials back to persistent storage.
 */
export const saveAllUserCredentialsDB = (records: UserCredentialRecord[]): void => {
  try {
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(records, null, 2));
  } catch (err) {
    console.error('[UserCredentialsDB] Error saving credentials database:', err);
  }
};

/**
 * Finds a credential record by email (case-insensitive).
 */
export const getCredentialByEmailDB = (email: string): UserCredentialRecord | undefined => {
  const cleanEmail = email.trim().toLowerCase();
  const all = getAllUserCredentialsDB();
  return all.find(c => c.email.toLowerCase() === cleanEmail);
};

/**
 * Finds a credential record by User ID.
 */
export const getCredentialByUserIdDB = (userId: string): UserCredentialRecord | undefined => {
  const all = getAllUserCredentialsDB();
  return all.find(c => c.userId === userId);
};

/**
 * Registers or updates a user's ID and password credentials in the file/store.
 * Automatically called every time a new user is added or signs up.
 */
export const recordUserCredentialsDB = (
  user: UserProfile | { id: string; email: string; name: string; role?: any },
  password?: string
): UserCredentialRecord => {
  const cleanEmail = user.email.trim().toLowerCase();
  const all = getAllUserCredentialsDB();
  const now = new Date().toISOString();

  const existingIndex = all.findIndex(
    c => c.email.toLowerCase() === cleanEmail || c.userId === user.id
  );

  const fallbackPassword = password && password.trim() ? password.trim() : 'SeekerPass2026!';

  let record: UserCredentialRecord;

  if (existingIndex >= 0) {
    // Update existing record
    record = {
      ...all[existingIndex],
      userId: user.id || all[existingIndex].userId,
      email: cleanEmail,
      name: user.name || all[existingIndex].name,
      role: user.role || all[existingIndex].role,
      password: password && password.trim() ? password.trim() : all[existingIndex].password,
      lastLoginAt: now
    };
    all[existingIndex] = record;
  } else {
    // Add new user credential entry
    record = {
      userId: user.id || `usr_${Date.now()}`,
      email: cleanEmail,
      name: user.name || cleanEmail.split('@')[0],
      role: (user.role as any) || 'user',
      password: fallbackPassword,
      createdAt: now,
      lastLoginAt: now
    };
    all.unshift(record);
  }

  saveAllUserCredentialsDB(all);

  // Asynchronously notify backend server to synchronize credentials table
  try {
    fetch('/api/auth/sync-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: record })
    }).catch(() => {
      // Background sync fallback
    });
  } catch (e) {
    // Ignore network sync error in offline mode
  }

  return record;
};

/**
 * Validates whether entered email and password match stored credentials.
 */
export const verifyUserLoginCredentialsDB = (
  email: string,
  enteredPassword?: string
): { isValid: boolean; credential?: UserCredentialRecord; reason?: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const cred = getCredentialByEmailDB(cleanEmail);

  if (!cred) {
    return { isValid: false, reason: 'User not found in credentials vault' };
  }

  if (!enteredPassword || !enteredPassword.trim()) {
    // If no password provided, consider valid if record exists
    return { isValid: true, credential: cred };
  }

  if (cred.password === enteredPassword.trim()) {
    // Update lastLoginAt
    recordUserCredentialsDB({ id: cred.userId, email: cred.email, name: cred.name, role: cred.role }, cred.password);
    return { isValid: true, credential: cred };
  }

  return { isValid: false, reason: 'Invalid password' };
};

/**
 * Downloads the credentials file formatted as formatted JSON for backup or admin auditing.
 */
export const downloadCredentialsFile = (): void => {
  const credentials = getAllUserCredentialsDB();
  const jsonContent = JSON.stringify(credentials, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `user_credentials_vault_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
