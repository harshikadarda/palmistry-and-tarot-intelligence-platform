import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  User, 
  Calendar, 
  Compass, 
  Globe, 
  MapPin, 
  Clock, 
  X, 
  CheckCircle2, 
  LogOut,
  Mail,
  ShieldCheck
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
}

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 
  'Leo', 'Virgo', 'Libra', 'Scorpio', 
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  onLogout
}) => {
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [birthDate, setBirthDate] = useState(currentUser.birthDate || '');
  const [zodiacSign, setZodiacSign] = useState(currentUser.zodiacSign || '');
  const [country, setCountry] = useState(currentUser.country || '');
  const [birthPlace, setBirthPlace] = useState(currentUser.birthPlace || '');
  const [birthTime, setBirthTime] = useState(currentUser.birthTime || '');
  const [gender, setGender] = useState(currentUser.gender || 'Prefer not to say');
  const [preferredDeck, setPreferredDeck] = useState(currentUser.readingPreferences?.preferredDeck || 'Rider-Waite Classic');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  React.useEffect(() => {
    setName(currentUser.name || '');
    setEmail(currentUser.email || '');
    setBirthDate(currentUser.birthDate || '');
    setZodiacSign(currentUser.zodiacSign || '');
    setCountry(currentUser.country || '');
    setBirthPlace(currentUser.birthPlace || '');
    setBirthTime(currentUser.birthTime || '');
    setGender(currentUser.gender || 'Prefer not to say');
    setPreferredDeck(currentUser.readingPreferences?.preferredDeck || 'Rider-Waite Classic');
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name,
      email,
      birthDate,
      zodiacSign,
      country,
      birthPlace,
      birthTime,
      gender,
      readingPreferences: {
        ...currentUser.readingPreferences,
        preferredDeck
      }
    };

    onUpdateProfile(updated);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0A0A0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-[#E0E0E6] flex flex-col max-h-[90vh]">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-violet-950 via-[#0D0D14] to-amber-950/40 px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-wide">Seeker Profile & Astrological Data</h3>
              <p className="text-[11px] font-mono text-violet-300/80 uppercase tracking-wider">
                Personal details for precision readings
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {(currentUser.isFirstTime || (!currentUser.birthDate && !currentUser.birthPlace)) && !isSavedSuccess && (
            <div className="p-3 bg-violet-950/80 border border-violet-500/50 rounded-xl text-violet-200 flex items-start space-x-2.5">
              <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-snug text-xs">
                <span className="font-bold text-white block mb-0.5">Welcome, {currentUser.name}!</span>
                Please enter your astrological & birth details below. Once saved, your profile will be stored securely in the database so you won't need to re-enter them on future logins.
              </div>
            </div>
          )}

          {isSavedSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 flex items-center space-x-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-xs">Profile & Astrological details saved successfully!</span>
            </div>
          )}

          {/* Basic User Details */}
          <div className="space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-violet-400 font-bold flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Identity & Account</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-white/70 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/40" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full pl-8 pr-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full pl-8 pr-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 my-2"></div>

          {/* Required Astrological Details */}
          <div className="space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Astrological & Birth Details</span>
            </div>

            {/* Birth Date & Zodiac */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-white/70 mb-1">Birth Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/40" />
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1">Zodiac Sign (If Known)</label>
                <div className="relative">
                  <Compass className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/40" />
                  <select
                    value={zodiacSign}
                    onChange={(e) => setZodiacSign(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
                  >
                    <option value="">Select Zodiac Sign...</option>
                    {ZODIAC_SIGNS.map((sign) => (
                      <option key={sign} value={sign}>{sign}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Birth Time & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-white/70 mb-1">Exact Birth Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/40" />
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1">Gender / Energy Alignment</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Country & Birth Place */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-white/70 mb-1">Country of Birth</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/40" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United States, India, UK"
                    className="w-full pl-8 pr-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1">Birth City / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/40" />
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="e.g. Los Angeles, London, Mumbai"
                    className="w-full pl-8 pr-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 my-2"></div>

          {/* Reading Preferences */}
          <div>
            <label className="block text-[11px] text-white/70 mb-1">Preferred Tarot Deck</label>
            <select
              value={preferredDeck}
              onChange={(e) => setPreferredDeck(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
            >
              <option value="Rider-Waite Classic">Rider-Waite Classic (Default)</option>
              <option value="Golden Thread Tarot">Golden Thread Minimalist</option>
              <option value="Thoth Esoteric Tarot">Thoth Esoteric Deck</option>
              <option value="Celestial Modern Deck">Celestial Modern Deck</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold uppercase tracking-wider rounded-xl text-xs sleek-glow-violet transition-all flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Save Details</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
