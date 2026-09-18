'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { forgotPassword, resetPassword } from '../../services/authService';
import {
  Radio,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  // Modes: 'login' | 'register' | 'forgot' | 'reset'
  const [mode, setMode] = useState('login');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: '',
    newPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLoginOrRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'register' && !formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });
        setSuccessMsg('Account created! Taking you to personalization...');
        setTimeout(() => {
          router.push('/personalization');
        }, 600);
      } else {
        const data = await login({
          email: formData.email.trim(),
          password: formData.password,
        });
        const hasPreferences =
          data?.user?.interests && data.user.interests.length > 0;
        router.push(hasPreferences ? '/' : '/personalization');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(formData.email.trim());
      if (res.success) {
        setSuccessMsg(
          res.message +
            (res.data?.devOtp ? ` (Verification Code: ${res.data.devOtp})` : '')
        );
        if (res.data?.devOtp) {
          setFormData((prev) => ({ ...prev, otp: res.data.devOtp }));
        }
        setMode('reset');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to send password reset code'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.otp || formData.otp.trim().length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (!formData.newPassword || formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({
        email: formData.email.trim(),
        otp: formData.otp.trim(),
        newPassword: formData.newPassword,
      });

      if (res.success) {
        setSuccessMsg('Password reset successful! You can now sign in.');
        setFormData((prev) => ({
          ...prev,
          password: prev.newPassword,
          otp: '',
          newPassword: '',
        }));
        setTimeout(() => {
          setMode('login');
        }, 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to reset password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#FAF8F5]">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1E2024] text-[#E86A33] shadow-md mb-4">
            <Radio className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#18191B]">
            {mode === 'register' && 'Create your Nuzio AI account'}
            {mode === 'login' && 'Welcome back to Nuzio AI'}
            {mode === 'forgot' && 'Reset Your Password'}
            {mode === 'reset' && 'Enter Verification Code'}
          </h1>
          <p className="text-sm text-[#6B7280] mt-1.5">
            {mode === 'register' && 'Start listening to your personalized audio news brief'}
            {mode === 'login' && 'Your personalized news and audio briefings await'}
            {mode === 'forgot' && "Enter your email and we'll send a 6-digit verification code"}
            {mode === 'reset' && 'Set your new secure password with the verification code'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#EAE6DF] rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-start space-x-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200/60 text-red-700 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-5 flex items-start space-x-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* FORGOT PASSWORD FORM (STEP 1) */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    disabled={loading}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl text-sm text-[#18191B] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E86A33]/20 focus:border-[#E86A33] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#1E2024] hover:bg-[#2C2F36] text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Code...</span>
                  </div>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccessMsg('');
                }}
                className="w-full pt-2 text-xs font-semibold text-[#6B7280] hover:text-[#18191B] flex items-center justify-center space-x-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </form>
          )}

          {/* RESET PASSWORD FORM (STEP 2) */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    disabled={loading}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl text-sm text-[#18191B] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E86A33]/20 focus:border-[#E86A33] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="123456"
                    maxLength={6}
                    disabled={loading}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl text-sm font-mono tracking-widest text-[#18191B] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E86A33]/20 focus:border-[#E86A33] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl text-sm text-[#18191B] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E86A33]/20 focus:border-[#E86A33] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#1E2024] hover:bg-[#2C2F36] text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Resetting Password...</span>
                  </div>
                ) : (
                  <>
                    <span>Reset Password & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccessMsg('');
                }}
                className="w-full pt-2 text-xs font-semibold text-[#6B7280] hover:text-[#18191B] flex items-center justify-center space-x-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel & Back to Sign In</span>
              </button>
            </form>
          )}

          {/* LOGIN & REGISTER FORMS */}
          {(mode === 'login' || mode === 'register') && (
            <form onSubmit={handleLoginOrRegister} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl text-sm text-[#18191B] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E86A33]/20 focus:border-[#E86A33] transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl text-sm text-[#18191B] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E86A33]/20 focus:border-[#E86A33] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError('');
                        setSuccessMsg('');
                      }}
                      className="text-xs text-[#E86A33] hover:underline font-medium cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl text-sm text-[#18191B] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E86A33]/20 focus:border-[#E86A33] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#1E2024] hover:bg-[#2C2F36] text-white text-sm font-semibold transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{mode === 'register' ? 'Creating Account...' : 'Logging In...'}</span>
                  </div>
                ) : (
                  <>
                    <span>{mode === 'register' ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Mode Switcher */}
          {(mode === 'login' || mode === 'register') && (
            <div className="mt-6 pt-5 border-t border-[#F2EEE8] text-center">
              <p className="text-xs text-[#6B7280]">
                {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'register' ? 'login' : 'register');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="font-semibold text-[#E86A33] hover:underline cursor-pointer"
                >
                  {mode === 'register' ? 'Sign In' : 'Create test user'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
