'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechAudio = (defaultVoiceName = 'Aria', defaultLanguage = 'English') => {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeVoiceName, setActiveVoiceName] = useState(defaultVoiceName);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isClosed, setIsClosed] = useState(false);

  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const progressTimerRef = useRef(null);
  const estimatedDurationRef = useRef(10);
  const elapsedSecondsRef = useRef(0);

  // Initialize SpeechSynthesis and load voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const voices = synthRef.current.getVoices();
        setAvailableVoices(voices);
      };

      loadVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  // Map selected voice name (Aria, Kai, Meera) to browser speech synthesis voice
  const findMatchingVoice = useCallback(
    (voiceChoice, storyLanguage) => {
      if (!availableVoices || availableVoices.length === 0) return null;

      const isHindi = storyLanguage === 'Hindi' || voiceChoice === 'Meera';

      if (isHindi) {
        // Find Hindi voice
        const hindiVoice = availableVoices.find(
          (v) =>
            v.lang.toLowerCase().includes('hi') ||
            v.name.toLowerCase().includes('hindi') ||
            v.name.toLowerCase().includes('meera') ||
            v.name.toLowerCase().includes('kalpana')
        );
        if (hindiVoice) return hindiVoice;
      }

      // English Voice Selection
      if (voiceChoice === 'Kai') {
        // Kai - English Male
        const maleVoice = availableVoices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('male') ||
              v.name.toLowerCase().includes('david') ||
              v.name.toLowerCase().includes('daniel') ||
              v.name.toLowerCase().includes('george'))
        );
        if (maleVoice) return maleVoice;
      }

      // Aria - English Female (or default English)
      const femaleVoice = availableVoices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('samantha') ||
            v.name.toLowerCase().includes('victoria') ||
            v.name.toLowerCase().includes('karen'))
      );
      if (femaleVoice) return femaleVoice;

      // Fallback: any voice in target language or first available
      return (
        availableVoices.find((v) =>
          isHindi ? v.lang.startsWith('hi') : v.lang.startsWith('en')
        ) || availableVoices[0]
      );
    },
    [availableVoices]
  );

  const startProgressTracking = (text) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    elapsedSecondsRef.current = 0;
    setProgress(0);

    const words = text.split(/\s+/).length;
    const estSeconds = Math.max(5, Math.ceil(words / 2.3));
    estimatedDurationRef.current = estSeconds;

    progressTimerRef.current = setInterval(() => {
      elapsedSecondsRef.current += 0.25;
      const pct = Math.min(95, Math.round((elapsedSecondsRef.current / estSeconds) * 100));
      setProgress(pct);
    }, 250);
  };

  const stopProgressTracking = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const playStoryAtIndex = useCallback(
    (index, storiesList = playlist, overrideVoice = activeVoiceName) => {
      if (!synthRef.current || !storiesList || storiesList.length === 0) return;
      if (index < 0 || index >= storiesList.length) return;

      synthRef.current.cancel();
      stopProgressTracking();
      setIsClosed(false);

      const story = storiesList[index];
      const lang = story.language || defaultLanguage;

      const scriptToSpeak = `${story.title}. ${story.summary} Published by ${story.source}.`;

      const utterance = new SpeechSynthesisUtterance(scriptToSpeak);
      const matchedVoice = findMatchingVoice(overrideVoice, lang);

      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = lang === 'Hindi' ? 'hi-IN' : 'en-US';
      }

      utterance.rate = 1.0;
      utterance.pitch = overrideVoice === 'Kai' ? 0.95 : 1.05;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        startProgressTracking(scriptToSpeak);
      };

      utterance.onpause = () => {
        setIsPaused(true);
        setIsPlaying(false);
      };

      utterance.onresume = () => {
        setIsPaused(false);
        setIsPlaying(true);
      };

      utterance.onend = () => {
        stopProgressTracking();
        setProgress(100);

        if (index + 1 < storiesList.length) {
          setTimeout(() => {
            setCurrentIndex(index + 1);
            playStoryAtIndex(index + 1, storiesList, overrideVoice);
          }, 800);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
        }
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        stopProgressTracking();
        setIsPlaying(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      setCurrentIndex(index);
      synthRef.current.speak(utterance);
    },
    [playlist, activeVoiceName, defaultLanguage, findMatchingVoice]
  );

  const playStory = (story, customPlaylist = null, voice = activeVoiceName) => {
    setIsClosed(false);
    let list = playlist;
    let idx = 0;

    if (customPlaylist && customPlaylist.length > 0) {
      setPlaylist(customPlaylist);
      list = customPlaylist;
      idx = customPlaylist.findIndex((s) => s.id === story.id);
      if (idx === -1) idx = 0;
    } else if (story) {
      idx = playlist.findIndex((s) => s.id === story.id);
      if (idx === -1) {
        list = [story, ...playlist];
        setPlaylist(list);
        idx = 0;
      }
    }

    if (voice) {
      setActiveVoiceName(voice);
    }

    playStoryAtIndex(idx, list, voice || activeVoiceName);
  };

  const togglePlayPause = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    } else if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      progressTimerRef.current = setInterval(() => {
        elapsedSecondsRef.current += 0.25;
        const pct = Math.min(
          95,
          Math.round((elapsedSecondsRef.current / estimatedDurationRef.current) * 100)
        );
        setProgress(pct);
      }, 250);
    } else if (playlist.length > 0) {
      setIsClosed(false);
      playStoryAtIndex(currentIndex, playlist, activeVoiceName);
    }
  };

  const nextStory = () => {
    if (currentIndex + 1 < playlist.length) {
      playStoryAtIndex(currentIndex + 1, playlist, activeVoiceName);
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      playStoryAtIndex(currentIndex - 1, playlist, activeVoiceName);
    }
  };

  const stopAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    stopProgressTracking();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setPlaylist([]);
    setCurrentIndex(0);
    setIsClosed(true);
  };

  const currentStory = (!isClosed && playlist[currentIndex]) || null;

  return {
    playlist,
    currentIndex,
    currentStory,
    isPlaying,
    isPaused,
    progress,
    activeVoiceName,
    setActiveVoiceName,
    playStory,
    togglePlayPause,
    nextStory,
    prevStory,
    stopAudio,
    closePlayer: stopAudio,
    hasStories: !isClosed && playlist.length > 0,
  };
};
