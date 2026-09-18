'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useSpeechAudio } from '../hooks/useSpeechAudio';
import { getPersonalizedNews } from '../services/newsService';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import CategoryFilter from '../components/CategoryFilter';
import AudioPlayer from '../components/AudioPlayer';
import {
  Play,
  Pause,
  Sparkles,
  Sliders,
  RefreshCw,
  Radio,
  Volume2,
} from 'lucide-react';

export default function PersonalizedNewsPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, updateStoredUser } = useAuth();

  const [news, setNews] = useState([]);
  const [briefing, setBriefing] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loadingNews, setLoadingNews] = useState(true);
  const [error, setError] = useState('');

  // Audio Hook
  const {
    playlist,
    currentIndex,
    currentStory,
    isPlaying,
    isPaused,
    progress,
    activeVoiceName,
    playStory,
    togglePlayPause,
    nextStory,
    prevStory,
    stopAudio,
  } = useSpeechAudio(user?.voice || 'Aria', user?.language || 'English');

  const fetchNews = async () => {
    setLoadingNews(true);
    setError('');
    try {
      const res = await getPersonalizedNews();
      if (res.success && res.data) {
        setNews(res.data.news || []);
        setBriefing(res.data.briefing || null);
        setPreferences(res.data.preferences || null);
      }
    } catch (err) {
      console.error('Failed to load personalized news:', err);
      setError('Could not load personalized news. Please ensure backend is running.');
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNews();
    }
  }, [user]);

  // Distinct categories available in current news list
  const availableCategories = useMemo(() => {
    const cats = ['All'];
    news.forEach((item) => {
      if (item.category && !cats.includes(item.category)) {
        cats.push(item.category);
      }
    });
    return cats;
  }, [news]);

  // Filtered news items based on category pill
  const filteredNews = useMemo(() => {
    if (selectedCategory === 'All') return news;
    return news.filter((item) => item.category === selectedCategory);
  }, [news, selectedCategory]);

  // Handle Play Full Brief
  const handlePlayFullBrief = () => {
    if (filteredNews.length === 0) return;
    const targetVoice = preferences?.voice || user?.voice || 'Aria';
    if (currentStory && isPlaying) {
      togglePlayPause();
    } else {
      playStory(filteredNews[0], filteredNews, targetVoice);
    }
  };

  // Handle Play Single Story from card
  const handlePlaySingleStory = (story) => {
    const targetVoice = preferences?.voice || user?.voice || 'Aria';
    if (currentStory?.id === story.id) {
      togglePlayPause();
    } else {
      playStory(story, filteredNews, targetVoice);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#1E2024]/20 border-t-[#1E2024] rounded-full animate-spin" />
          <p className="text-xs text-[#6B7280]">Initializing session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-32">
      <Navbar user={user} onLogout={logout} onUpdateUser={updateStoredUser} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {/* TOP BRIEFING CARD (Figma Aesthetic) */}
        <section aria-label="Personalized briefing banner" className="bg-gradient-to-b from-white to-[#FDFBF7] border border-[#EAE6DF] rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#FAF0E6] text-[#E86A33] text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Personalized Brief</span>
                </span>
                <span className="text-xs text-[#8C929D]">
                  {preferences?.language || 'English'} • {preferences?.voice || 'Aria'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18191B]">
                {briefing?.greeting || `Hello, ${user?.name || 'Reader'}`}
              </h1>

              <p className="text-sm text-[#5B616E] leading-relaxed">
                {briefing?.summary ||
                  'Here are the latest curated updates matching your industry focus and selected interests.'}
              </p>
            </div>

            {/* Play Brief CTA Button */}
            <div className="shrink-0 flex items-center gap-2 sm:self-center">
              <button
                onClick={handlePlayFullBrief}
                disabled={filteredNews.length === 0}
                className="flex items-center space-x-2.5 px-5 py-3 rounded-2xl bg-[#1E2024] hover:bg-[#2F3238] text-white text-sm font-semibold shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current text-[#E86A33]" />
                    <span>Pause Brief</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-[#E86A33]" />
                    <span>Listen to Brief</span>
                  </>
                )}
              </button>

              <button
                onClick={fetchNews}
                title="Refresh news"
                className="p-3 rounded-2xl border border-[#EAE6DF] bg-white hover:bg-[#F7F5F0] text-[#6B7280] transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loadingNews ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* User Preferences Chips */}
          <div className="mt-5 pt-4 border-t border-[#F0ECE4] flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#8C929D] font-medium">Curated for:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#F4EFEA] text-[#1E2024] font-medium">
              {preferences?.profession || 'Technology'}
            </span>
            {preferences?.interests?.map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EAE6DF] text-[#555A64]"
              >
                {interest}
              </span>
            ))}
            <Link
              href="/personalization"
              className="ml-auto text-xs font-semibold text-[#E86A33] hover:underline flex items-center space-x-1"
            >
              <Sliders className="w-3 h-3" />
              <span>Edit Preferences</span>
            </Link>
          </div>
        </section>

        {/* CATEGORY FILTERS */}
        <div className="mb-6">
          <CategoryFilter
            categories={availableCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6 text-center">
            {error}
          </div>
        )}

        {/* LOADING STATE */}
        {loadingNews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-5 border border-[#EAE6DF] animate-pulse space-y-3"
              >
                <div className="h-4 bg-[#F2EEE8] rounded-md w-1/3" />
                <div className="h-6 bg-[#EBE7DF] rounded-md w-4/5" />
                <div className="h-12 bg-[#F2EEE8] rounded-md w-full" />
                <div className="h-8 bg-[#F2EEE8] rounded-md w-1/4 mt-4" />
              </div>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#EAE6DF]">
            <Radio className="w-10 h-10 text-[#C4BCB0] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#18191B]">No news stories found</h3>
            <p className="text-sm text-[#6B7280] max-w-md mx-auto mt-1">
              Try selecting another category or customize your preferences to broaden your topics.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-[#1E2024] text-white rounded-xl"
            >
              View All Stories
            </button>
          </div>
        ) : (
          /* NEWS FEED CARDS */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNews.map((story) => (
              <NewsCard
                key={story.id}
                story={story}
                isCurrentStory={currentStory?.id === story.id}
                isPlaying={isPlaying}
                onPlay={handlePlaySingleStory}
              />
            ))}
          </div>
        )}
      </main>

      {/* FLOATING AUDIO PLAYER (Web Speech API) */}
      <AudioPlayer
        currentStory={currentStory}
        currentIndex={currentIndex}
        totalStories={playlist.length || filteredNews.length}
        isPlaying={isPlaying}
        isPaused={isPaused}
        progress={progress}
        voiceName={preferences?.voice || user?.voice || 'Aria'}
        onTogglePlayPause={togglePlayPause}
        onNext={nextStory}
        onPrev={prevStory}
        onClose={stopAudio}
      />
    </div>
  );
}