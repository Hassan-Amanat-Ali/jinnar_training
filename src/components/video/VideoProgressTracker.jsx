import React, { useEffect, useCallback, useRef } from "react";
import { LectureProgressService } from "../../services";

/**
 * VideoProgressTracker - Production-grade video progress tracking
 *
 * This component automatically tracks:
 * - Video watch time and current position
 * - Completion status (90% threshold)
 * - Resume positions for later viewing
 * - Real-time progress updates to database
 */
const VideoProgressTracker = ({
  userId,
  courseId,
  lectureId,
  videoRef,
  videoDuration,
  onProgressUpdate,
  children,
}) => {
  const progressIntervalRef = useRef(null);
  const lastSavedPositionRef = useRef(0);
  const hasInitializedRef = useRef(false);

  // Configuration
  const PROGRESS_UPDATE_INTERVAL = 5000; // Save progress every 5 seconds
  const COMPLETION_THRESHOLD = 0.9; // 90% watched = completed
  const MIN_SAVE_INTERVAL = 3; // Minimum 3 seconds between saves

  /**
   * Get video element reference
   */
  const getVideoElement = useCallback(() => {
    if (videoRef?.current) {
      return videoRef.current;
    }

    // Fallback: find video element in DOM
    const videoElements = document.querySelectorAll("video");
    return videoElements.length > 0 ? videoElements[0] : null;
  }, [videoRef]);

  /**
   * Save progress to database
   */
  const saveProgress = useCallback(
    async (currentTime, duration, force = false) => {
      if (!userId || !courseId || !lectureId) return;

      const video = getVideoElement();
      if (!video) return;

      // Don't save too frequently unless forced
      if (
        !force &&
        Math.abs(currentTime - lastSavedPositionRef.current) < MIN_SAVE_INTERVAL
      ) {
        return;
      }

      try {
        await LectureProgressService.updateVideoProgress(
          userId,
          courseId,
          lectureId,
          currentTime,
          duration
        );

        lastSavedPositionRef.current = currentTime;

        // Notify parent component of progress update
        const completionPercentage =
          duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
        onProgressUpdate?.({
          currentPosition: currentTime,
          duration,
          completionPercentage,
          completed: completionPercentage >= COMPLETION_THRESHOLD * 100,
        });

        console.log(
          `Progress saved: ${Math.round(completionPercentage)}% (${Math.round(
            currentTime
          )}s/${Math.round(duration)}s)`
        );
      } catch (error) {
        console.error("Error saving video progress:", error);
      }
    },
    [userId, courseId, lectureId, onProgressUpdate, getVideoElement]
  );

  /**
   * Handle video timeupdate event
   */
  const handleTimeUpdate = useCallback(() => {
    const video = getVideoElement();
    if (!video) return;

    const currentTime = video.currentTime;
    const duration = video.duration || videoDuration;

    if (duration && currentTime) {
      // Check if video is completed (reached 90% or ended)
      const completionPercentage = currentTime / duration;
      if (completionPercentage >= COMPLETION_THRESHOLD) {
        saveProgress(currentTime, duration, true); // Force save on completion
      }
    }
  }, [getVideoElement, videoDuration, saveProgress]);

  /**
   * Handle video pause event
   */
  const handlePause = useCallback(() => {
    const video = getVideoElement();
    if (!video) return;

    const currentTime = video.currentTime;
    const duration = video.duration || videoDuration;

    if (duration && currentTime) {
      saveProgress(currentTime, duration, true); // Force save on pause
    }
  }, [getVideoElement, videoDuration, saveProgress]);

  /**
   * Handle video ended event
   */
  const handleEnded = useCallback(() => {
    const video = getVideoElement();
    if (!video) return;

    const duration = video.duration || videoDuration;
    if (duration) {
      // Mark as completed when video ends
      saveProgress(duration, duration, true);
    }
  }, [getVideoElement, videoDuration, saveProgress]);

  /**
   * Initialize video with saved progress
   */
  const initializeVideoProgress = useCallback(async () => {
    if (!userId || !courseId || !lectureId || hasInitializedRef.current) {
      return;
    }

    const video = getVideoElement();
    if (!video) return;

    try {
      // Get saved progress for resume functionality
      const savedPosition = await LectureProgressService.getResumePosition(
        userId,
        courseId,
        lectureId
      );

      if (savedPosition > 5) {
        // Only resume if more than 5 seconds watched
        video.currentTime = savedPosition;
        console.log(`Resumed video at ${Math.round(savedPosition)}s`);
      }

      hasInitializedRef.current = true;
    } catch (error) {
      console.error("Error initializing video progress:", error);
    }
  }, [userId, courseId, lectureId, getVideoElement]);

  /**
   * Start progress tracking interval
   */
  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      const video = getVideoElement();
      if (!video) return;

      const currentTime = video.currentTime;
      const duration = video.duration || videoDuration;

      if (duration && currentTime && !video.paused) {
        saveProgress(currentTime, duration);
      }
    }, PROGRESS_UPDATE_INTERVAL);
  }, [getVideoElement, videoDuration, saveProgress]);

  /**
   * Stop progress tracking interval
   */
  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  /**
   * Set up video event listeners
   */
  useEffect(() => {
    const video = getVideoElement();
    if (!video) return;

    // Event listeners
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("play", startProgressTracking);
    video.addEventListener("pause", stopProgressTracking);
    video.addEventListener("loadedmetadata", initializeVideoProgress);

    // Start tracking if video is already playing
    if (!video.paused) {
      startProgressTracking();
    }

    // Initialize progress on mount
    if (video.readyState >= 1) {
      // HAVE_METADATA
      initializeVideoProgress();
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("play", startProgressTracking);
      video.removeEventListener("pause", stopProgressTracking);
      video.removeEventListener("loadedmetadata", initializeVideoProgress);
      stopProgressTracking();
    };
  }, [
    getVideoElement,
    handleTimeUpdate,
    handlePause,
    handleEnded,
    startProgressTracking,
    stopProgressTracking,
    initializeVideoProgress,
  ]);

  /**
   * Save progress when component unmounts (page change, etc.)
   */
  useEffect(() => {
    const video = getVideoElement();

    return () => {
      if (video) {
        const currentTime = video.currentTime;
        const duration = video.duration || videoDuration;

        if (duration && currentTime) {
          // Force save on unmount (don't wait for promise)
          saveProgress(currentTime, duration, true);
        }
      }
      stopProgressTracking();
    };
  }, [getVideoElement, videoDuration, saveProgress, stopProgressTracking]);

  /**
   * Reset hasInitialized when lectureId changes
   */
  useEffect(() => {
    hasInitializedRef.current = false;
  }, [lectureId]);

  // This component doesn't render anything visual
  return children || null;
};

export default VideoProgressTracker;
