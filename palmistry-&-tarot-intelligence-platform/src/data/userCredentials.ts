/**
 * Initial User Credentials Repository
 * 
 * Default seed list storing user ID, email, and authentication credentials.
 * Automatically synchronizes whenever a new user registers or signs up.
 */

export interface UserCredentialRecord {
  userId: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'reader' | 'consultant' | 'admin';
  createdAt: string;
  lastLoginAt: string;
}

export const INITIAL_USER_CREDENTIALS: UserCredentialRecord[] = [
  {
    userId: 'usr_1',
    email: 'user@palmistry.ai',
    password: 'Password123!',
    name: 'Aria Vance',
    role: 'user',
    createdAt: '2026-08-01T08:00:00.000Z',
    lastLoginAt: '2026-08-17T09:30:00.000Z'
  },
  {
    userId: 'usr_2',
    email: 'reader@palmistry.ai',
    password: 'ReaderSecret2026!',
    name: 'Elara Thorne',
    role: 'reader',
    createdAt: '2026-08-01T08:00:00.000Z',
    lastLoginAt: '2026-08-16T14:20:00.000Z'
  },
  {
    userId: 'usr_3',
    email: 'consultant@palmistry.ai',
    password: 'ConsultantPass2026!',
    name: 'Dr. Seraphina Moon',
    role: 'consultant',
    createdAt: '2026-08-01T08:00:00.000Z',
    lastLoginAt: '2026-08-17T04:15:00.000Z'
  },
  {
    userId: 'usr_4',
    email: 'admin@palmistry.ai',
    password: 'AdminMasterKey2026!',
    name: 'Master Orion',
    role: 'admin',
    createdAt: '2026-08-01T08:00:00.000Z',
    lastLoginAt: '2026-08-17T05:00:00.000Z'
  },
  {
    userId: 'usr_current',
    email: 'dardaharshika@gmail.com',
    password: 'UserSecure2026!',
    name: 'Harshika Darda',
    role: 'user',
    createdAt: '2026-08-17T05:00:00.000Z',
    lastLoginAt: '2026-08-17T05:04:00.000Z'
  }
];
