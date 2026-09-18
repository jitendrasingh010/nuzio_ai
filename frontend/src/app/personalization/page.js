'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { getUserPreferences, saveUserPreferences } from '../../services/userService';
import Navbar from '../../components/Navbar';
import {
  Check,
  Volume2,
  Briefcase,
  Globe,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const LANGUAGES = [
  { id: 'English', label: 'English', desc: 'Global coverage in English' },
  { id: 'Hindi', label: 'Hindi', desc: 'हिंदी में प्रमुख समाचार और बुलेटिन' },
];

const PROFESSIONS = [
  { id: 'Technology', label: 'Technology', desc: 'Engineering, software, cloud' },
  { id: 'Finance', label: 'Finance', desc: 'Banking, investments, crypto' },
  { id: 'Healthcare', label: 'Healthcare', desc: 'Biotech, medicine, pharma' },
  { id: 'Business', label: 'Business', desc: 'Corporate, strategy, management' },
  { id: 'Education', label: 'Education', desc: 'Research, academia, pedagogy' },
  { id: 'Marketing', label: 'Marketing', desc: 'Growth, branding, digital media' },
];

const INTERESTS = [
  'AI & Technology',
  'Startups',
  'Financial Markets',
  'Business',
  'Science',
  'Sports',
  'Global News',
];

const VOICES = [
  { id: 'Aria', name: 'Aria', lang: 'English', desc: 'Natural, expressive English voice' },
  { id: 'Kai', name: 'Kai', lang: 'English', desc: 'Deep, crisp male narrator' },
  { id: 'Meera', name: 'Meera', lang: 'Hindi', desc: 'प्राकृतिक और स्पष्ट हिंदी आवाज' },
];

export default function PersonalizationPage() {
  const router = useRouter();
  const { user, logout, updateStoredUser } = useAuth();

  const [language, setLanguage] = useState('English');
  const [profession, setProfession] = useState('Technology');
  const [selectedInterests, setSelectedInterests] = useState(['AI & Technology', 'Startups']);
  const [voice, setVoice] = useState('Aria');

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch current preferences if user already has them
  useEffect(() => {
    const fetchCurrentPreferences = async () => {
      try {
        const res = await getUserPreferences();
        if (res.success && res.data) {
          const { language: lang, profession: prof, interests: ints, voice: v } = res.data;
          if (lang) setLanguage(lang);
          if (prof) setProfession(prof);
          if (Array.isArray(ints) && ints.length > 0) setSelectedInterests(ints);
          if (v) setVoice(v);
        }
      } catch (err) {
        console.warn('Could not fetch existing preferences:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchCurrentPreferences();
  }, []);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleLanguageChange = (langId) => {
    setLanguage(langId);
    // Suggest appropriate default voice if changing language
    if (langId === 'Hindi' && voice !== 'Meera') {
      setVoice('Meera');
    } else if (langId === 'English' && voice === 'Meera') {
      setVoice('Aria');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedInterests.length === 0) {
      setError('Please select at least one interest area.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        language,
        profession,
        interests: selectedInterests,
        voice,
      };

      const res = await saveUserPreferences(payload);
      if (res.success) {
        updateStoredUser({ language, profession, voice, interests: selectedInterests });
        router.push('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#1E2024]/20 border-t-[#1E2024] rounded-full animate-spin" />
          <p className="text-xs text-[#6B7280]">Loading your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      <Navbar user={user} onLogout={logout} onUpdateUser={updateStoredUser} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F3EFEA] text-[#E86A33] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customize Your Experience</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18191B]">
            Personalize Your Audio Brief
          </h1>
          <p className="text-sm text-[#6B7280] mt-1.5 max-w-xl">
            Select your language, industry, topics of interest, and preferred AI narrator voice.
            We will tailor your briefings accordingly.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center space-x-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* SECTION 1: LANGUAGE */}
          <div className="bg-white p-6 rounded-2xl border border-[#EAE6DF] shadow-xs">
            <div className="flex items-center space-x-2.5 mb-4">
              <Globe className="w-4 h-4 text-[#E86A33]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#18191B]">
                1. Select Language
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#1E2024] bg-[#F7F5F0] ring-1 ring-[#1E2024]'
                        : 'border-[#EAE6DF] bg-white hover:border-[#D6D0C5]'
                    }`}
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-[#18191B]">{lang.label}</h3>
                      <p className="text-xs text-[#6B7280] mt-0.5">{lang.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#1E2024] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: PROFESSION */}
          <div className="bg-white p-6 rounded-2xl border border-[#EAE6DF] shadow-xs">
            <div className="flex items-center space-x-2.5 mb-4">
              <Briefcase className="w-4 h-4 text-[#E86A33]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#18191B]">
                2. Select Profession
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PROFESSIONS.map((prof) => {
                const isSelected = profession === prof.id;
                return (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => setProfession(prof.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1E2024] bg-[#F7F5F0] ring-1 ring-[#1E2024]'
                        : 'border-[#EAE6DF] bg-white hover:border-[#D6D0C5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-semibold text-[#18191B]">
                        {prof.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#1E2024]" />}
                    </div>
                    <p className="text-[11px] text-[#7B828F] mt-1 line-clamp-1">{prof.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: TOPICS OF INTEREST */}
          <div className="bg-white p-6 rounded-2xl border border-[#EAE6DF] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-[#E86A33]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#18191B]">
                  3. Topics of Interest
                </h2>
              </div>
              <span className="text-xs text-[#6B7280]">
                {selectedInterests.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-[#1E2024] text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-[#4B515D] border border-[#EAE6DF] hover:bg-[#F2EEE8]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: VOICE */}
          <div className="bg-white p-6 rounded-2xl border border-[#EAE6DF] shadow-xs">
            <div className="flex items-center space-x-2.5 mb-4">
              <Volume2 className="w-4 h-4 text-[#E86A33]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#18191B]">
                4. Select Narrator Voice
              </h2>
            </div>
            <p className="text-xs text-[#6B7280] mb-3">
              Choose from the curated voice options for your news briefs:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {VOICES.map((v) => {
                const isSelected = voice === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVoice(v.id)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#E86A33] bg-[#FFF8F5] ring-1 ring-[#E86A33]'
                        : 'border-[#EAE6DF] bg-white hover:border-[#D6D0C5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#E86A33] text-white'
                              : 'bg-[#F3EFEA] text-[#1E2024]'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-bold text-[#18191B]">{v.name}</span>
                      </div>
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#EFEAE2] text-[#6B7280]">
                        {v.lang}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-1">{v.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-[#1E2024] hover:bg-[#2C2F36] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {saving ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Preferences...</span>
                </div>
              ) : (
                <>
                  <span>Save Preferences & Open News Brief</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
