'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Pause, ExternalLink, Clock, Volume2 } from 'lucide-react';

export default function NewsCard({ story, isCurrentStory, isPlaying, onPlay }) {
  // Format relative published time
  const formatTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const diffMin = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (diffMin < 60) return `${Math.max(1, diffMin)}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 ${
        isCurrentStory
          ? 'border-[#E86A33] shadow-md ring-1 ring-[#E86A33]/20'
          : 'border-[#EAE6DF] hover:border-[#D6D0C5] hover:shadow-sm'
      }`}
    >
      {/* Category badge and time */}
      <div className="flex items-center justify-between text-xs text-[#7B828F] mb-3">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-md bg-[#F4EFEA] text-[#1E2024] font-medium text-[11px] uppercase tracking-wider">
            {story.category}
          </span>
          <span className="text-[11px] text-[#A2A8B4]">•</span>
          <span className="flex items-center space-x-1 text-[11px]">
            <Clock className="w-3 h-3" />
            <span>{formatTime(story.publishedAt)}</span>
          </span>
        </div>

        <span className="text-[11px] font-medium text-[#4A4F58] bg-[#F7F5F0] px-2 py-0.5 rounded">
          {story.source}
        </span>
      </div>

      {/* Title */}
      <Link href={`/news/${story.id}`}>
        <h3 className="text-base sm:text-lg font-semibold text-[#18191B] tracking-tight leading-snug hover:text-[#E86A33] transition-colors mb-2 cursor-pointer">
          {story.title}
        </h3>
      </Link>

      {/* Summary */}
      <p className="text-sm text-[#525761] leading-relaxed line-clamp-2 mb-4">
        {story.summary}
      </p>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[#F2EEE8]">
        {/* Play Button */}
        <button
          onClick={() => onPlay(story)}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            isCurrentStory && isPlaying
              ? 'bg-[#E86A33] text-white shadow-xs'
              : 'bg-[#FAF8F5] text-[#1E2024] hover:bg-[#EFEAE2] border border-[#EAE6DF]'
          }`}
        >
          {isCurrentStory && isPlaying ? (
            <>
              <div className="flex items-center space-x-0.5 h-3">
                <span className="w-0.5 bg-white audio-bar-1" />
                <span className="w-0.5 bg-white audio-bar-2" />
                <span className="w-0.5 bg-white audio-bar-3" />
              </div>
              <span>Playing</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Listen</span>
            </>
          )}
        </button>

        {/* Read More Link */}
        <Link
          href={`/news/${story.id}`}
          className="text-xs font-medium text-[#7B828F] hover:text-[#18191B] transition-colors"
        >
          Read story &rarr;
        </Link>
      </div>
    </div>
  );
}
