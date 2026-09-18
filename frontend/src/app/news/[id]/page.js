'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import { useSpeechAudio } from '../../../hooks/useSpeechAudio';
import { getNewsDetail } from '../../../services/newsService';
import Navbar from '../../../components/Navbar';
import AudioPlayer from '../../../components/AudioPlayer';
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Play,
  Pause,
  AlertCircle,
  Volume2,
} from 'lucide-react';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, logout, updateStoredUser } = useAuth();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    const fetchDetail = async () => {
      if (!params?.id) return;
      setLoading(true);
      setError('');
      try {
        const res = await getNewsDetail(params.id);
        if (res.success && res.data) {
          setStory(res.data);
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [params?.id]);

  const formatFullDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePlayStory = () => {
    if (!story) return;
    if (currentStory?.id === story.id) {
      togglePlayPause();
    } else {
      playStory(story, [story], user?.voice || 'Aria');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-32">
      <Navbar user={user} onLogout={logout} onUpdateUser={updateStoredUser} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#18191B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Briefing</span>
          </Link>
        </div>

        {error && (
          <div className="bg-white p-8 rounded-3xl border border-[#EAE6DF] text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h2 className="text-base font-bold text-[#18191B]">Article Not Found</h2>
            <p className="text-xs text-[#6B7280] mt-1">{error}</p>
            <Link
              href="/"
              className="mt-4 inline-block px-4 py-2 bg-[#1E2024] text-white text-xs font-semibold rounded-xl"
            >
              Return Home
            </Link>
          </div>
        )}

        {loading && (
          <div className="bg-white p-8 rounded-3xl border border-[#EAE6DF] animate-pulse space-y-4">
            <div className="h-4 bg-[#F2EEE8] rounded-md w-1/4" />
            <div className="h-8 bg-[#EBE7DF] rounded-md w-3/4" />
            <div className="h-4 bg-[#F2EEE8] rounded-md w-1/2" />
            <div className="h-24 bg-[#F2EEE8] rounded-md w-full" />
            <div className="h-32 bg-[#F2EEE8] rounded-md w-full" />
          </div>
        )}

        {story && (
          <article className="bg-white border border-[#EAE6DF] rounded-3xl p-6 sm:p-10 shadow-xs">
            {/* Meta header */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B7280] pb-6 border-b border-[#F0ECE4]">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-md bg-[#F4EFEA] text-[#1E2024] font-semibold text-[11px] uppercase tracking-wider">
                  {story.category}
                </span>
                <span className="text-[#A2A8B4]">•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatFullDate(story.publishedAt)}</span>
                </span>
              </div>

              {/* Source button */}
              <a
                href={story.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F2EEE8] border border-[#EAE6DF] text-xs font-medium text-[#18191B] transition-colors"
              >
                <span>Source: {story.source}</span>
                <ExternalLink className="w-3 h-3 text-[#7B828F]" />
              </a>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18191B] mt-6 mb-4 leading-tight">
              {story.title}
            </h1>

            {/* Listen Bar inside Article */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DF] mb-8">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1E2024] text-[#E86A33] flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#18191B]">Listen with Web Speech AI</p>
                  <p className="text-[11px] text-[#6B7280]">
                    Voice: {user?.voice || 'Aria'} ({story.language})
                  </p>
                </div>
              </div>

              <button
                onClick={handlePlayStory}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#E86A33] hover:bg-[#D45823] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {isPlaying && currentStory?.id === story.id ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Audio</span>
                  </>
                )}
              </button>
            </div>

            {/* Summary callout */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border-l-4 border-[#E86A33] text-sm text-[#374151] font-medium leading-relaxed mb-6">
              {story.summary}
            </div>

            {/* Main Content paragraphs */}
            <div className="prose max-w-none text-[#2D3139] leading-relaxed space-y-4 text-sm sm:text-base">
              {story.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Footer Source Button */}
            <div className="mt-10 pt-6 border-t border-[#F0ECE4] flex items-center justify-between">
              <span className="text-xs text-[#6B7280]">
                Published in {story.language} by {story.source}
              </span>
              <a
                href={story.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E2024] hover:bg-[#2C2F36] text-white text-xs font-medium transition-colors"
              >
                <span>Visit {story.source}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </article>
        )}
      </main>

      {/* Floating Audio Player */}
      <AudioPlayer
        currentStory={currentStory}
        currentIndex={currentIndex}
        totalStories={playlist.length}
        isPlaying={isPlaying}
        isPaused={isPaused}
        progress={progress}
        voiceName={user?.voice || 'Aria'}
        onTogglePlayPause={togglePlayPause}
        onNext={nextStory}
        onPrev={prevStory}
        onClose={stopAudio}
      />
    </div>
  );
}
