import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../../types';
import { INITIAL_USERS, INITIAL_ANALYTICS } from '../../data/mockDatabase';
import { getAllUserAccountsDB } from '../../database/userDatabase';
import { 
  getAllUserCredentialsDB, 
  downloadCredentialsFile, 
  UserCredentialRecord 
} from '../../database/userCredentialsDatabase';
import { 
  ShieldAlert, 
  Users, 
  Activity, 
  Server, 
  BarChart3, 
  UserCheck, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Download,
  Search,
  KeyRound,
  Eye,
  EyeOff,
  FileCode,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: UserProfile;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [userList, setUserList] = useState<UserProfile[]>(() => getAllUserAccountsDB());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [credentialsList, setCredentialsList] = useState<UserCredentialRecord[]>(() => getAllUserCredentialsDB());
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'users' | 'credentials'>('credentials');

  const refreshData = () => {
    setUserList(getAllUserAccountsDB());
    setCredentialsList(getAllUserCredentialsDB());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUserList(userList.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const filteredUsers = userList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCredentials = credentialsList.filter(c => 
    c.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-amber-800/60 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-amber-300 tracking-wider flex items-center space-x-2">
            <span>System Command Center</span>
            <span>•</span>
            <span className="text-emerald-400 font-normal">Security & Credentials Vault Active</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Platform Administration</h2>
          <p className="text-xs text-slate-300 mt-1">
            Manage user accounts, inspect the synced User ID & Password Vault file, and track reading analytics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={downloadCredentialsFile}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2"
            title="Download credentials JSON file"
          >
            <Download className="w-4 h-4" />
            <span>Export user_credentials.json</span>
          </button>

          <div className="p-3 bg-amber-900/40 border border-amber-700/60 rounded-xl text-xs text-center shrink-0">
            <div className="text-xl font-bold text-emerald-400">99.98%</div>
            <div className="text-[10px] text-amber-200">System Uptime</div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Registered Users</div>
          <div className="text-2xl font-black text-amber-400 font-mono">{credentialsList.length}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">Credentials Vault Synced</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Platform Readings</div>
          <div className="text-2xl font-black text-white font-mono">{INITIAL_ANALYTICS.totalReadingsCount.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">↑ +1,240 this week</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-semibold">API Latency</div>
          <div className="text-2xl font-black text-indigo-400 font-mono">{INITIAL_ANALYTICS.avgResponseTimeMs} ms</div>
          <div className="text-[10px] text-emerald-400 font-semibold">Fast Response</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-semibold">Satisfaction Score</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{INITIAL_ANALYTICS.avgSatisfactionScore} / 5.0</div>
          <div className="text-[10px] text-slate-400">Validated Reviews</div>
        </div>

      </div>

      {/* Navigation Switcher: User Accounts vs User ID & Password Vault */}
      <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('credentials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'credentials'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>User ID & Password Vault ({credentialsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'users'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Profile Management ({userList.length})</span>
        </button>
      </div>

      {/* TAB 1: User ID & Password Vault File View */}
      {activeTab === 'credentials' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">
                  User ID & Password Database File (`user_credentials.json`)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Stores User ID, Email, Role, and Authentication Password. Updates automatically on every new user registration.
              </p>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user ID, email, name..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={refreshData}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors shrink-0"
                title="Refresh Vault Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">User ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Login Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Password</th>
                  <th className="py-2.5 px-3">Created Date</th>
                  <th className="py-2.5 px-3">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredCredentials.map((cred) => {
                  const isVisible = showPasswords[cred.userId];
                  return (
                    <tr key={cred.userId} className="hover:bg-slate-850/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-amber-300">
                        {cred.userId}
                      </td>
                      <td className="py-3 px-3 text-slate-200 font-sans font-medium">
                        {cred.name}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {cred.email}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded border text-[10px] font-bold uppercase bg-slate-800 border-slate-700 text-amber-300">
                          {cred.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs ${isVisible ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                            {isVisible ? cred.password : '••••••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(cred.userId)}
                            className="text-slate-400 hover:text-white p-1"
                            title={isVisible ? 'Hide password' : 'Show password'}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {cred.createdAt?.split('T')[0] || '2026-08-01'}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {cred.lastLoginAt?.split('T')[0] || 'Recent'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Storage Connected: Updates in real-time on every sign up & login</span>
            </span>
            <button
              onClick={downloadCredentialsFile}
              className="text-amber-400 hover:underline flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Raw JSON File</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: User Role Management (RBAC) */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base text-white">User Management & Role Permissions (RBAC)</h3>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user or email..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Current Role</th>
                  <th className="py-2.5 px-3">Modify Role</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white flex items-center space-x-2">
                      <img src={usr.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'} alt="" className="w-7 h-7 rounded-lg object-cover" />
                      <span>{usr.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{usr.email}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded border text-[10px] font-bold uppercase bg-slate-800 border-slate-700 text-amber-300">
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={usr.role}
                        onChange={(e) => handleRoleChange(usr.id, e.target.value as UserRole)}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="user">User (Seeker)</option>
                        <option value="reader">Tarot Reader</option>
                        <option value="consultant">Spiritual Consultant</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-medium">Active</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
