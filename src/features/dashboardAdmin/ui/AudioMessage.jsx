
import { useState } from "react";
import { axiosInstance } from "../../../app/api/axiosInstance";
import AudioPlayer from "../../lecture/ui/AudioPlayer";

const AudioMessage = ({ audioKey }) => {
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const playAudio = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axiosInstance.get("/audio/audio-url", {
        params: { key: audioKey },
      });

      setAudioUrl(data.url);
    } catch (error) {
      setError(
        error.response?.data?.message || "Audio could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-w-0 max-w-[260px]">
      {!audioUrl ? (
        <button
          type="button"
          onClick={playAudio}
          disabled={loading}
          className="inline-flex items-center gap-2 disabled:cursor-wait disabled:opacity-70"
        >
          {loading && (
            <svg
              aria-hidden="true"
              className="h-4 w-4 animate-spin"
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
          )}
          {loading ? "Loading..." : "Play Audio"}
        </button>
      ) : (
        <AudioPlayer
          src={audioUrl}
          autoPlay
          preload="auto"
          className="w-full"
        />
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default AudioMessage;
