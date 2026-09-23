import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { getAllUserAccountsDB, upsertUserAccountDB, getUserRecordByEmailDB } from '../database/userDatabase';
import { recordUserCredentialsDB, verifyUserLoginCredentialsDB } from '../database/userCredentialsDatabase';
import { KeyRound, Mail, User, X, CheckCircle2, LogIn, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, isFirstLogin?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [ssoProcessing, setSsoProcessing] = useState<'google' | 'apple' | null>(null);

  const getRegisteredUsers = (): UserProfile[] => {
    return getAllUserAccountsDB();
  };

  const formatNameFromEmail = (userEmail: string): string => {
    const parts = userEmail.split('@')[0] || 'Seeker';
    return parts
      .split(/[._-]/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  };

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const users = getRegisteredUsers();
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      // Validate credentials against the password vault if password entered
      if (password) {
        const verify = verifyUserLoginCredentialsDB(cleanEmail, password);
        if (!verify.isValid && verify.reason === 'Invalid password') {
          setErrorMessage('Invalid password. Please check your credentials and try again.');
          return;
        }
      }

      // Record / update credentials on successful login
      recordUserCredentialsDB(existing, password);

      const isFirstLogin = existing.isFirstTime || (!existing.birthDate && !existing.birthPlace);
      const loggedInUser: UserProfile = {
        ...existing,
        isLoggedIn: true
      };
      
      // Ensure database record for user-created data exists for this login email
      getUserRecordByEmailDB(cleanEmail, loggedInUser);
      upsertUserAccountDB(loggedInUser);

      localStorage.setItem('jwt_token', `jwt_${loggedInUser.id}_${Date.now()}`);
      onLoginSuccess(loggedInUser, isFirstLogin);
      onClose();
    } else {
      // Account NOT found in database -> prompt user to create new registration
      setErrorMessage(`No account found registered under "${cleanEmail}". Please fill in your name below to create a new registration.`);
      setIsRegister(true);
      if (!name) {
        setName(formatNameFromEmail(cleanEmail));
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const users = getRegisteredUsers();
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      setErrorMessage(`An account with email "${cleanEmail}" already exists. Please sign in instead.`);
      setIsRegister(false);
      return;
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name.trim() || formatNameFromEmail(cleanEmail),
      email: cleanEmail,
      role: role,
      ageGroup: '25-34',
      spiritualGoals: ['Personal Development', 'Spiritual Clarity'],
      interests: ['Tarot', 'Palmistry'],
      readingPreferences: {
        preferredDeck: 'Rider-Waite Classic',
        focusAreas: ['Career', 'Relationships'],
        dailyAlerts: true
      },
      createdAt: new Date().toISOString().split('T')[0],
      isLoggedIn: true,
      isFirstTime: true
    };

    // Store user credentials (userId and password) into the dedicated credentials database file
    recordUserCredentialsDB(newUser, password || 'SeekerPass2026!');

    // Save user to account DB and initialize user data DB for this email
    upsertUserAccountDB(newUser);
    getUserRecordByEmailDB(cleanEmail, newUser);

    localStorage.setItem('jwt_token', `jwt_${newUser.id}_${Date.now()}`);
    setSuccessMessage("Registration successful! Credentials stored. Signing you in...");
    setTimeout(() => {
      onLoginSuccess(newUser, true);
      onClose();
    }, 600);
  };

  const handleSSO = (provider: 'google' | 'apple') => {
    setSsoProcessing(provider);
    setErrorMessage(null);
    setSuccessMessage(null);

    setTimeout(() => {
      setSsoProcessing(null);
      const isGoogle = provider === 'google';
      const cleanInputEmail = email.trim().toLowerCase();
      const ssoEmail = cleanInputEmail || (isGoogle ? 'dardaharshika@gmail.com' : 'user.apple@icloud.com');
      const ssoName = isGoogle 
        ? (cleanInputEmail ? formatNameFromEmail(cleanInputEmail) : 'Darda Harshika') 
        : 'Apple Seeker';

      const users = getRegisteredUsers();
      let existing = users.find(u => u.email.toLowerCase() === ssoEmail);
      let isFirstLogin = false;

      if (!existing) {
        // First time Google / Apple login -> store in database & mark for initial astrological setup
        isFirstLogin = true;
        existing = {
          id: `usr_${provider}_${Date.now()}`,
          name: ssoName,
          email: ssoEmail,
          role: 'user',
          ageGroup: '25-34',
          spiritualGoals: ['Personal Growth', 'Clarity'],
          interests: ['Palmistry', 'Tarot'],
          readingPreferences: {
            preferredDeck: 'Rider-Waite Classic',
            focusAreas: ['Career', 'Relationships'],
            dailyAlerts: true
          },
          createdAt: new Date().toISOString().split('T')[0],
          isLoggedIn: true,
          isFirstTime: true
        };
        // Record SSO credentials
        recordUserCredentialsDB(existing, `${provider}_oauth_secure_${Date.now()}`);
        upsertUserAccountDB(existing);
        getUserRecordByEmailDB(ssoEmail, existing);
      } else {
        isFirstLogin = existing.isFirstTime === true || (!existing.birthDate && !existing.birthPlace);
        recordUserCredentialsDB(existing);
      }

      const loggedInUser: UserProfile = {
        ...existing,
        isLoggedIn: true
      };

      localStorage.setItem('jwt_token', `jwt_${provider}_${loggedInUser.id}_${Date.now()}`);
      setSuccessMessage(`Successfully connected with ${isGoogle ? 'Google Account' : 'Apple ID'} as ${loggedInUser.name}!`);

      setTimeout(() => {
        onLoginSuccess(loggedInUser, isFirstLogin);
        onClose();
      }, 500);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="relative w-full max-w-md bg-[#0A0A0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-[#E0E0E6] max-h-[calc(100vh-2rem)] flex flex-col my-auto">
        
        {/* Header Banner */}
        <div className="shrink-0 bg-gradient-to-r from-violet-950 via-[#0D0D14] to-amber-950/40 px-5 sm:px-6 py-3.5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">Palmistry & Tarot Intelligence</h3>
            <p className="text-[10px] font-mono text-violet-300 uppercase tracking-wider">
              {isRegister ? 'Create a New Account' : 'Sign In to Your Account'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* SSO Quick Buttons (Google & Apple) */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={ssoProcessing !== null}
              onClick={() => handleSSO('google')}
              className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white flex items-center justify-center space-x-2.5 transition-all hover:border-white/20 disabled:opacity-50"
            >
              {ssoProcessing === 'google' ? (
                <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.0 10.04.0 12s.46 3.8 1.27 5.42l4.01-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              disabled={ssoProcessing !== null}
              onClick={() => handleSSO('apple')}
              className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white flex items-center justify-center space-x-2.5 transition-all hover:border-white/20 disabled:opacity-50"
            >
              {ssoProcessing === 'apple' ? (
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.16-1.9-14.49-6.09-3.26-2.62-7.14-7.24-11.64-13.84-6.75-9.81-12.02-20.73-15.82-32.74-3.8-12.02-5.7-23.51-5.7-34.47 0-14.59 3.65-26.69 10.96-36.28 7.31-9.59 16.48-14.46 27.52-14.61 4.68 0 9.87 1.15 15.57 3.45 5.7 2.3 9.61 3.46 11.72 3.46 1.85 0 5.83-1.19 11.95-3.57 6.12-2.38 11.33-3.48 15.63-3.29 12.19.98 21.82 5.56 28.9 13.73-10.77 6.53-16.03 15.66-15.79 27.39.24 9.15 3.82 16.78 10.73 22.88 6.91 6.1 15.02 9.58 24.32 10.45-2.29 6.86-5.23 13.52-8.83 19.98zM119.22 31.85c0-6.97 2.48-13.68 7.43-20.13 4.95-6.45 11.23-10.58 18.84-12.39.22 1.42.33 2.72.33 3.92 0 6.86-2.58 13.63-7.75 20.31-5.17 6.68-11.45 10.7-18.85 12.06-.21-.87-.32-2.12-.32-3.77z"/>
                </svg>
              )}
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="relative flex py-0.5 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">or sign in with email</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Error / Alert Banner */}
          {errorMessage && (
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>{successMessage}</div>
            </div>
          )}

          <form onSubmit={isRegister ? handleRegister : handleSignIn} className="space-y-3">
            
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aria Vance"
                    className="w-full pl-9 pr-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Select Account Type</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="user">Spiritual Seeker (User)</option>
                  <option value="reader">Tarot Reader</option>
                  <option value="consultant">Spiritual Consultant</option>
                  <option value="admin">Platform Administrator</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold uppercase tracking-[0.15em] rounded-xl text-xs sleek-glow-violet transition-all flex items-center justify-center space-x-2 mt-1"
            >
              <LogIn className="w-4 h-4 text-amber-300" />
              <span>{isRegister ? 'Register Account' : 'Sign In'}</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center justify-center space-x-1 mx-auto"
            >
              <span>{isRegister ? 'Already have an account? Sign in here' : 'New user? Create a new account'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
