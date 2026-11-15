import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function AudioUpload() {
  const socketRef = useRef(null);
  const [sessionId, setSessionId] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Connecting...");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZWUxNzBkNGZmOGRkMTc3ZDUwNTk3NSIsInJvbGUiOiJzdHVkZW50Iiwic2Vzc2lvbklkIjoiNmFmMDhkNWJmODhhNjEyNjViN2VkMGI5IiwiaWF0IjoxNzk0MTQ5NzIzLCJleHAiOjE3OTQyMzYxMjN9.y1D_oR56qTVJfTYrsrxFU29OAVdOEX0BJSTcpHN0pt8";

    const socket = io("http://localhost:3000", {
      extraHeaders: { authorization: token },
    });

    socket.on("connect", () => setStatus("Connected"));
    socket.on("connect_error", (err) => setStatus("Error: " + err.message));

    socketRef.current = socket;

    return () => socket.disconnect();
  }, []);

  const handleSend = async () => {
    if (!sessionId.trim() || !file) {
      alert("Session ID aur audio file dono do");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Audio 5 MB se kam honi chahiye");
      return;
    }

    setSending(true);
    setStatus("Sending...");

    console.log(socketRef.current)

    const arrayBuffer = await file.arrayBuffer();
    console.log(arrayBuffer)

    socketRef.current.emit(
      "send_audio",
      {
        sessionId: sessionId.trim(),
        audio: new Uint8Array(arrayBuffer),
        mimeType: file.type,
      },
      (res) => {
        setStatus(res.message);
        setSending(false);
      }
    );
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-lg font-sans">
      <h3 className="text-xl font-semibold text-gray-800 mb-5">Audio Upload</h3>

      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-sm font-medium text-gray-600">Session ID</label>
        <input
          type="text"
          placeholder="Session ID"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="px-3 py-2.5 border border-gray-300 rounded-lg text-[15px] outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-sm font-medium text-gray-600">Audio file</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:font-medium hover:file:bg-blue-100 cursor-pointer"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={sending}
        className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {sending ? "Sending..." : "Send Audio"}
      </button>

      <p className="mt-4 py-2.5 px-3 rounded-lg bg-gray-100 text-gray-700 text-sm text-center">
        {status}
      </p>
    </div>
  );
}