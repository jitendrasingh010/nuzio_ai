'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sliders, LogOut, Radio, X, User } from 'lucide-react';
import ProfileModal from './ProfileModal';

export default function Navbar({ user, onLogout, onUpdateUser }) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  if (pathname === '/login') {
    return null;
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE6DF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#1E2024] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Radio className="w-5 h-5 text-[#E86A33]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-semibold text-lg tracking-tight text-[#18191B]">Nuzio</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-[#F0ECE1] text-[#E86A33] font-medium">AI</span>
              </div>
              <p className="text-[10px] text-[#8C929D] -mt-1 tracking-wider uppercase">Audio Brief</p>
            </div>
          </Link>

          {/* Navigation & User actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <Link
              href="/"
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors font-medium ${
                pathname === '/'
                  ? 'bg-white text-[#18191B] shadow-xs border border-[#E5E0D8]'
                  : 'text-[#6B7280] hover:text-[#18191B]'
              }`}
            >
              News Feed
            </Link>

            <Link
              href="/personalization"
              className={`flex items-center space-x-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors font-medium ${
                pathname === '/personalization'
                  ? 'bg-white text-[#18191B] shadow-xs border border-[#E5E0D8]'
                  : 'text-[#6B7280] hover:text-[#18191B]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preferences</span>
            </Link>

            {user && (
              <div className="flex items-center pl-2 border-l border-[#E5E0D8] space-x-2">
                {/* Profile Avatar Button */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  title="View Profile"
                  className="flex items-center space-x-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-[#F3EFEA] transition-colors text-left cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#1E2024] text-white flex items-center justify-center text-xs font-bold shadow-xs group-hover:scale-105 transition-transform">
                    {getInitials(user.name)}
                  </div>
                  <div className="hidden md:flex flex-col">
                    <span className="text-xs font-semibold text-[#18191B] leading-tight">{user.name}</span>
                    <span className="text-[10px] text-[#8C929D]">
                      {user.language || 'English'} • {user.voice || 'Aria'}
                    </span>
                  </div>
                </button>

                {/* Direct Logout Icon Button */}
                <button
                  onClick={() => setShowLogoutModal(true)}
                  title="Log out"
                  className="p-2 text-[#8C929D] hover:text-[#D43823] hover:bg-[#F3EFEA] rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CUSTOM PROFILE MODAL (with Overview, Edit Profile & Reset Password tabs) */}
      <ProfileModal
        user={user}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onOpenLogout={() => setShowLogoutModal(true)}
        onUpdateUser={onUpdateUser}
      />

      {/* CUSTOM LOGOUT ALERT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18191B]/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            {/* Header with Icon and Close Button */}
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                <LogOut className="w-5 h-5" />
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-1.5 text-[#9CA3AF] hover:text-[#18191B] hover:bg-[#F5F2EC] rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#18191B]">
                Log Out of Nuzio AI?
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                Are you sure you want to sign out? Your saved language, profession, and voice preferences will remain securely stored.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4B515D] bg-[#FAF8F5] hover:bg-[#EFEAE2] border border-[#EAE6DF] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-xs transition-colors cursor-pointer"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
