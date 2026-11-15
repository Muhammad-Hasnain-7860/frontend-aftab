import { useState } from "react";
import { axiosInstance } from "./app/api/axiosInstance";

export default function Audio({ audioKey }) {
  const [audioSrc, setAudioSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAudio = async () => {
    setLoading(true);
    setError("");

    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZWUxNzBkNGZmOGRkMTc3ZDUwNTk3NSIsInJvbGUiOiJzdHVkZW50Iiwic2Vzc2lvbklkIjoiNmFmMDhkNWJmODhhNjEyNjViN2VkMGI5IiwiaWF0IjoxNzk0MTQ5NzIzLCJleHAiOjE3OTQyMzYxMjN9.y1D_oR56qTVJfTYrsrxFU29OAVdOEX0BJSTcpHN0pt8";

      const res = await axiosInstance.get(
        `/audio/audio-url?key=${encodeURIComponent(audioKey)}`,
        {
          headers: { authorization: token },
        },
      );

      console.log(res.data.url);

      setAudioSrc(res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Audio load nahi ho saki");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow max-w-md">
      {!audioSrc && (
        <button
          onClick={loadAudio}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Play Audio"}
        </button>
      )}

      {audioSrc && (
        <audio controls autoPlay src={audioSrc} className="w-full" />
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
