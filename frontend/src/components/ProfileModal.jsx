'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Globe,
  Briefcase,
  Volume2,
  Sparkles,
  Sliders,
  LogOut,
  X,
  ShieldCheck,
  KeyRound,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { updateUserProfile, changeUserPassword } from '../services/userService';

export default function ProfileModal({
  user,
  isOpen,
  onClose,
  onOpenLogout,
  onUpdateUser,
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'edit' | 'security'

  // Edit profile form state
  const [editName, setEditName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Reset password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
    }
    setProfileMsg({ type: '', text: '' });
    setPasswordMsg({ type: '', text: '' });
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const interestsList =
    Array.isArray(user.interests) && user.interests.length > 0
      ? user.interests
      : ['AI & Technology', 'Startups'];

  // Handle Edit Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });

    if (!editName.trim()) {
      setProfileMsg({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }

    setSavingProfile(true);
    try {
      const res = await updateUserProfile({ name: editName.trim() });
      if (res.success && res.data) {
        if (onUpdateUser) {
          onUpdateUser({ name: res.data.name });
        }
        setProfileMsg({ type: 'success', text: 'Profile name updated successfully!' });
      }
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to update profile.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Reset / Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (!passwordData.currentPassword) {
      setPasswordMsg({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setPasswordMsg({
        type: 'error',
        text: 'New password must be at least 6 characters long.',
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({
        type: 'error',
        text: 'New passwords do not match.',
      });
      return;
    }

    setChangingPassword(true);
    try {
      const res = await changeUserPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.success) {
        setPasswordMsg({
          type: 'success',
          text: 'Password updated successfully!',
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to change password.',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18191B]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE6DF] shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#8C929D] uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-[#E86A33]" />
            <span>Account Center</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9CA3AF] hover:text-[#18191B] hover:bg-[#F5F2EC] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-[#FAF8F5] border border-[#EAE6DF] rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-[#18191B] shadow-xs'
                : 'text-[#6B7280] hover:text-[#18191B]'
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              activeTab === 'edit'
                ? 'bg-white text-[#18191B] shadow-xs'
                : 'text-[#6B7280] hover:text-[#18191B]'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              activeTab === 'security'
                ? 'bg-white text-[#18191B] shadow-xs'
                : 'text-[#6B7280] hover:text-[#18191B]'
            }`}
          >
            <KeyRound className="w-3 h-3" />
            <span>Password</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* User Identity Card */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1E2024] text-white flex items-center justify-center text-lg font-bold shadow-md ring-2 ring-[#E86A33]/20">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-[#18191B] truncate">
                    {user.name}
                  </h3>
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Active</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-[#6B7280] mt-0.5 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-[#9CA3AF]" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>

            {/* Personalization Summary */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#374151] uppercase tracking-wider">
                Personalization Settings
              </h4>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF]">
                  <Globe className="w-4 h-4 text-[#E86A33] mx-auto mb-1" />
                  <span className="block text-[10px] text-[#8C929D] uppercase font-medium">
                    Language
                  </span>
                  <span className="text-xs font-bold text-[#18191B] mt-0.5 truncate block">
                    {user.language || 'English'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF]">
                  <Briefcase className="w-4 h-4 text-[#E86A33] mx-auto mb-1" />
                  <span className="block text-[10px] text-[#8C929D] uppercase font-medium">
                    Industry
                  </span>
                  <span className="text-xs font-bold text-[#18191B] mt-0.5 truncate block">
                    {user.profession || 'Technology'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF]">
                  <Volume2 className="w-4 h-4 text-[#E86A33] mx-auto mb-1" />
                  <span className="block text-[10px] text-[#8C929D] uppercase font-medium">
                    Narrator
                  </span>
                  <span className="text-xs font-bold text-[#18191B] mt-0.5 truncate block">
                    {user.voice || 'Aria'}
                  </span>
                </div>
              </div>

              {/* Interests */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF]">
                <div className="flex items-center space-x-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#E86A33]" />
                  <span className="text-xs font-semibold text-[#18191B]">
                    Active Topics of Interest
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {interestsList.map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#E5E0D8] text-[11px] font-medium text-[#4B515D]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#F0ECE4]">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenLogout) onOpenLogout();
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              <Link
                href="/personalization"
                onClick={onClose}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1E2024] hover:bg-[#2C2F36] shadow-xs transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Edit Preferences</span>
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: EDIT PROFILE */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {profileMsg.text && (
              <div
                className={`flex items-start space-x-2 p-3 rounded-xl text-xs ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {profileMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={savingProfile}
                  placeholder="Your Name"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl text-sm text-[#18191B] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E86A33]/20 focus:border-[#E86A33] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative opacity-70">
                <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F3EFEA] border border-[#EAE6DF] rounded-xl text-sm text-[#6B7280] cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-[#8C929D] mt-1">
                Email is linked to your account authentication.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#1E2024] hover:bg-[#2C2F36] text-white text-xs font-semibold transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {savingProfile ? (
                  <span>Saving...</span>
                ) : (
                  <span>Save Profile Changes</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: RESET / CHANGE PASSWORD */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordMsg.text && (
              <div
                className={`flex items-start space-x-2 p-3 rounded-xl text-xs ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {passwordMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  disabled={changingPassword}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl text-sm text-[#18191B] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E86A33]/20 focus:border-[#E86A33] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  disabled={changingPassword}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl text-sm text-[#18191B] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E86A33]/20 focus:border-[#E86A33] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  disabled={changingPassword}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl text-sm text-[#18191B] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E86A33]/20 focus:border-[#E86A33] transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#1E2024] hover:bg-[#2C2F36] text-white text-xs font-semibold transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {changingPassword ? (
                  <span>Updating Password...</span>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
