import React from 'react';

const formatTime = (s) => {
  if (isNaN(s)) return '0:00';
  const minutes = Math.floor(s / 60);
  const seconds = Math.floor(s % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const VideoPlayer = ({
  src,
  poster,
  title,
  onEnded,
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
}) => {
  const videoRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const pendingAutoPlayRef = React.useRef(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  const handleToggleByClick = () => togglePlay();

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrent(v.currentTime);
  };

  const tryAutoPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (pendingAutoPlayRef.current) {
      v.play()
        .then(() => {
          setIsPlaying(true);
          pendingAutoPlayRef.current = false;
        })
        .catch(() => {
          // Browser blocked autoplay; keep button as play
          setIsPlaying(false);
        });
    }
  };

  const handleLoaded = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || 0);
    setCurrent(0);
    setIsPlaying(!v.paused && !v.ended);
    tryAutoPlay();
  };

  const handleCanPlay = () => {
    tryAutoPlay();
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const t = Number(e.target.value);
    v.currentTime = t;
    setCurrent(t);
  };

  const handleVolume = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const vol = Number(e.target.value);
    v.volume = vol;
    setVolume(vol);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen().catch(() => {});
    }
  };

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onEndedLocal = () => {
      setIsPlaying(false);
      onEnded && onEnded();
    };
    const onPlayLocal = () => setIsPlaying(true);
    const onPauseLocal = () => setIsPlaying(false);
    const onPlayingLocal = () => setIsPlaying(true);

    v.addEventListener('ended', onEndedLocal);
    v.addEventListener('play', onPlayLocal);
    v.addEventListener('pause', onPauseLocal);
    v.addEventListener('playing', onPlayingLocal);

    return () => {
      v.removeEventListener('ended', onEndedLocal);
      v.removeEventListener('play', onPlayLocal);
      v.removeEventListener('pause', onPauseLocal);
      v.removeEventListener('playing', onPlayingLocal);
    };
  }, [onEnded]);

  React.useEffect(() => {
    const onFsChange = () => {
      const container = containerRef.current;
      setIsFullscreen(document.fullscreenElement === container);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // On source change, reset UI and mark that we want to autoplay when ready
  React.useEffect(() => {
    setIsPlaying(false);
    pendingAutoPlayRef.current = true;
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`${
        isFullscreen
          ? 'fixed inset-0 z-[9999] bg-black rounded-none border-0'
          : 'relative bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200'
      }`}
    >
      {/* Video */}
      <video
        key={src}
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        className={`${
          isFullscreen
            ? 'w-screen h-screen object-contain bg-black'
            : 'w-full h-[58vh] md:h-[70vh] object-contain bg-black'
        }`}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoaded}
        onCanPlay={handleCanPlay}
        onClick={handleToggleByClick}
      />

      {/* Top gradient and title */}
      <div className='pointer-events-none absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-black/70 via-black/20 to-transparent'>
        {title && (
          <h2 className='text-white text-xl md:text-2xl font-semibold max-w-[80%] drop-shadow'>
            {title}
          </h2>
        )}
      </div>

      {/* Center play/pause */}
      <button
        type='button'
        aria-label='toggle play'
        onClick={togglePlay}
        className='absolute inset-0 m-auto w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white border border-white/40'
        style={{
          display: 'flex',
          pointerEvents: 'auto',
          transform: 'translateY(0)',
        }}
      >
        {isPlaying ? (
          <svg width='22' height='22' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M6 5h4v14H6zM14 5h4v14h-4z' />
          </svg>
        ) : (
          <svg width='22' height='22' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M8 5v14l11-7z' />
          </svg>
        )}
      </button>

      {/* Bottom Controls */}
      <div className='absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent'>
        <div className='flex items-center gap-4'>
          {/* Prev */}
          <button
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              canPrev
                ? 'bg-white/15 hover:bg-white/25 text-white'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
            onClick={canPrev ? onPrev : undefined}
            aria-label='Previous'
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M10 12l8 6V6l-8 6zM6 6h2v12H6z' />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            className='w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center'
            onClick={togglePlay}
          >
            {isPlaying ? (
              <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M6 5h4v14H6zM14 5h4v14h-4z' />
              </svg>
            ) : (
              <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M8 5v14l11-7z' />
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              canNext
                ? 'bg-white/15 hover:bg-white/25 text-white'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
            onClick={canNext ? onNext : undefined}
            aria-label='Next'
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M14 12L6 6v12l8-6zm2-6h2v12h-2z' />
            </svg>
          </button>

          <span className='text-xs text-white/80 w-14'>
            {formatTime(current)}
          </span>
          <input
            type='range'
            min={0}
            max={duration || 0}
            step='0.1'
            value={current}
            onChange={handleSeek}
            className='flex-1 accent-white'
          />
          <span className='text-xs text-white/80 w-14 text-right'>
            {formatTime(duration)}
          </span>

          <div className='hidden md:flex items-center gap-2 pl-2'>
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='white'
              className='opacity-80'
            >
              <path d='M3 10v4h4l5 5V5L7 10H3z' />
            </svg>
            <input
              type='range'
              min='0'
              max='1'
              step='0.05'
              value={volume}
              onChange={handleVolume}
              className='w-24 accent-white'
            />
          </div>

          <button
            className='ml-2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center'
            onClick={toggleFullscreen}
            aria-label='Toggle Fullscreen'
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M7 14H5v5h5v-2H7v-3zm12 3h-3v2h5v-5h-2v3zM7 7h3V5H5v5h2V7zm12 3h2V5h-5v2h3v3z' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
