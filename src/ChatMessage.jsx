import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Audio from "./Audio";

export default function ChatMessages() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZWUxNzBkNGZmOGRkMTc3ZDUwNTk3NSIsInJvbGUiOiJzdHVkZW50Iiwic2Vzc2lvbklkIjoiNmFmMDhkNWJmODhhNjEyNjViN2VkMGI5IiwiaWF0IjoxNzk0MTQ5NzIzLCJleHAiOjE3OTQyMzYxMjN9.y1D_oR56qTVJfTYrsrxFU29OAVdOEX0BJSTcpHN0pt8";

   const socket = io("http://localhost:3000", {
      extraHeaders: { authorization: token },
    });

    socket.on("connect", () => {
      socket.emit(
        "fetch_messages",
        JSON.stringify({ sessionId : "6aecbf9d329cc44c440a4f72" }),
        (res) => {
            console.log(res)
          if (!res.success) {
            setError(res.message);
            return;
          }
          setMessages(res.data);
        }
      );
    });

    socket.on("connect_error", (err) => {
        console.log(err)
        setError(err.message)
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 space-y-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {messages.map((m) => (
        <div key={m._id} className="p-3 bg-gray-100 rounded-lg">
          {m.typeContent === "audio" ? (
            <Audio audioKey={m.content} />
          ) : (
            <p className="text-gray-800">{m.content}</p>
          )}
        </div>
      ))}
    </div>
  );
}