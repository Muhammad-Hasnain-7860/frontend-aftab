import { useState } from "react";

function AudioPlayer({ src, autoPlay = false, preload = "none", className = "" }) {
  const [buffering, setBuffering] = useState(autoPlay);
  const [error, setError] = useState(false);

  const handleLoadStart = () => {
    setBuffering(true);
    setError(false);
  };

  const handleCanPlay = () => setBuffering(false);
  const handleWaiting = () => setBuffering(true);
  const handlePlaying = () => setBuffering(false);

  const handleError = () => {
    setBuffering(false);
    setError(true);
  };

  return (
    <div className={`min-w-0 ${className}`}>
      <audio
        className="block h-10 w-full max-w-full"
        controls
        autoPlay={autoPlay}
        preload={preload}
        src={src}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onError={handleError}
      />
      {buffering && (
        <p
          role="status"
          className="mt-2 flex items-center gap-2 text-xs text-slate-500"
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4 animate-spin text-emerald-700"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3Z"
            />
          </svg>
          Loading audio...
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          Audio could not be loaded. Please try again.
        </p>
      )}
    </div>
  );
}

export default AudioPlayer;
