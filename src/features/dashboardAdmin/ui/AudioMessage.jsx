
import { useState } from "react";
import { axiosInstance } from "../../../app/api/axiosInstance";

const AudioMessage = ({ audioKey }) => {
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const playAudio = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get("/audio/audio-url", {
        params: { key: audioKey },
      });

      setAudioUrl(data.url);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!audioUrl ? (
        <button onClick={playAudio} disabled={loading}>
          {loading ? "Loading..." : "Play Audio"}
        </button>
      ) : (
        <audio controls autoPlay src={audioUrl} />
      )}
    </div>
  );
};

export default AudioMessage;
