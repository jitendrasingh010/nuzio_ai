'use client';

import React from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Volume2,
} from 'lucide-react';

export default function AudioPlayer({
  currentStory,
  currentIndex,
  totalStories,
  isPlaying,
  isPaused,
  progress,
  voiceName,
  onTogglePlayPause,
  onNext,
  onPrev,
  onClose,
}) {
  if (!currentStory) return null;

  return (
    <aside aria-label="Audio brief player" className="fixed bottom-4 left-0 right-0 z-50 px-4 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto bg-[#1C1E22] text-white rounded-2xl shadow-2xl border border-white/10 p-3.5 sm:p-4 backdrop-blur-xl">
        {/* Top bar: Voice and Story Count */}
        <div className="flex items-center justify-between text-[11px] text-[#A6ADB8] pb-2 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/10 text-white font-medium">
              <Volume2 className="w-3 h-3 text-[#E86A33]" />
              <span>Voice: {voiceName}</span>
            </span>
            <span className="text-white/40">•</span>
            <span className="text-[#D1D5DB] font-medium">
              Story {currentIndex + 1} of {totalStories}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {isPlaying && (
              <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Speaking</span>
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onClose) {
                  onClose();
                }
              }}
              title="Close Player"
              aria-label="Close audio player"
              className="p-1.5 hover:bg-white/20 active:scale-95 rounded-lg transition-colors text-[#A6ADB8] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Middle: Title & Controls */}
        <div className="flex items-center justify-between pt-2.5 gap-3">
          {/* Story info */}
          <div className="min-w-0 flex-1">
            <Link
              href={`/news/${currentStory.id}`}
              className="hover:underline"
            >
              <h4 className="text-sm font-semibold text-white truncate">
                {currentStory.title}
              </h4>
            </Link>
            <p className="text-xs text-[#9CA3AF] truncate mt-0.5">
              {currentStory.source} • {currentStory.category}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={onPrev}
              disabled={currentIndex === 0}
              title="Previous Story"
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              type="button"
              onClick={onTogglePlayPause}
              title={isPlaying ? 'Pause' : 'Play'}
              className="w-10 h-10 rounded-full bg-[#E86A33] hover:bg-[#D45823] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={currentIndex >= totalStories - 1}
              title="Next Story"
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Bottom: Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#E86A33] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
