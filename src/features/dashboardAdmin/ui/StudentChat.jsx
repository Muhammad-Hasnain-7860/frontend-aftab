import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import AudioMessage from "./AudioMessage";
import { axiosInstance } from "../../../app/api/axiosInstance";
import { updateUser } from "../../auth/state/auth.slice";
function StudentChat() {
  const { sessionId } = useParams();

  const socketRef = useRef(null);
  const audioInputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [messagesLoading, setMessagesLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!sessionId) return;

    let socket;

    const connectSocket = async () => {
      try {
        setMessagesLoading(true);
        setMessagesError("");

        // Interceptor 401 par refresh handle karega
        const response = await axiosInstance.get("/auth/me");

        const currentUser = response.data.data.user;

        console.log(currentUser)
        dispatch(updateUser(currentUser));

        if (!accessToken || !currentUser) {
          setMessagesLoading(false);
          return;
        }

        socket = io("https://aftab-backend.vercel.app", {
          extraHeaders: {
            authorization: accessToken,
          },
        });

        socketRef.current = socket;

        // Fetch Messages
        const handleConnect = () => {
          socket.emit(
            "fetch_messages",
            JSON.stringify({
              sessionId,
              studentId: currentUser.id,
            }),
            (response) => {
              if (response?.success) {
                setMessages(response.data || []);
                setMessagesError("");
              } else {
                setMessagesError(
                  response?.message || "Failed to load messages",
                );
              }

              setMessagesLoading(false);
            },
          );
        };

        // Receive Admin Messages
        const handleReceiveMessage = (message) => {
          const messageSessionId = String(message.lectureSessionId);
          const receiverId = message.receiverId
            ? String(message.receiverId)
            : null;

          const isCurrentSession = messageSessionId === String(sessionId);

          const isAdminMessage = receiverId === String(currentUser.id);

          if (isCurrentSession && isAdminMessage) {
            setMessages((prev) => {
              const alreadyExists = prev.some(
                (item) => String(item._id) === String(message._id),
              );

              if (alreadyExists) return prev;

              return [...prev, message];
            });
          }
        };

        socket.on("connect", handleConnect);
        socket.on("receive_message", handleReceiveMessage);

        if (socket.connected) {
          handleConnect();
        }
      } catch (error) {
        setMessagesError(
          error?.response?.data?.msg || "Authentication failed",
        );
        setMessagesLoading(false);
      }
    };

    connectSocket();

    return () => {
      socket?.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, sessionId]);
  // Send Text Message
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    const socket = socketRef.current;

    if (!socket?.connected) {
      setMessagesError("Socket is not connected");
      return;
    }

    setSending(true);
    setMessagesError("");

    socket.emit(
      "send_message",
      JSON.stringify({
        sessionId,
        content: text,
      }),
      (response) => {
        if (response?.success) {
          setMessages((prev) => [...prev, response.data]);
          setText("");
        } else {
          setMessagesError(response?.message || "Message sending failed");
        }

        setSending(false);
      },
    );
  };

  // Send Audio
  const handleSendAudio = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      setMessagesError("Please select an audio file");
      e.target.value = "";
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      setMessagesError("Audio must be under 30 MB");
      e.target.value = "";
      return;
    }

    const socket = socketRef.current;

    if (!socket?.connected) {
      setMessagesError("Socket is not connected");
      e.target.value = "";
      return;
    }

    try {
      setSending(true);
      setMessagesError("");

      const audio = await file.arrayBuffer();

      socket.emit(
        "send_audio",
        {
          sessionId,
          mimeType: file.type,
          audio,
        },
        (response) => {
          if (response?.success) {
            console.log(response)
            setMessages((prev) => [...prev, response.data]);
          } else {
            setMessagesError(response?.message || "Audio sending failed");
          }

          setSending(false);
          e.target.value = "";
        },
      );
    } catch (error) {
      setMessagesError("Audio sending failed");
      setSending(false);
      e.target.value = "";
    }
  };
  

  return (
    <div className="h-[calc(100vh-100px)] bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800">Session Chat</h3>
        <p className="text-xs text-slate-500">Session: {sessionId}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 bg-slate-50">
        {messagesLoading ? (
          <div className="h-full flex items-center justify-center text-slate-500">
            Loading messages...
          </div>
        ) : messagesError && messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-red-500">
            {messagesError}
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            No messages yet
          </div>
        ) : (
          messages.map((message) => {
            const isOwn =
              String(message.senderId?._id || message.senderId) ===
              String(user.id);

            return (
              <div
                key={message?._id}
                className={`flex mb-4 ${
                  isOwn ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-3 shadow-sm ${
                    isOwn
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-800 border border-slate-200"
                  }`}
                >
                  <p className="text-xs font-semibold mb-1 opacity-75">
                    {isOwn ? "You" : "Admin"}
                  </p>

                  {message.typeContent === "audio" ? (
                    <AudioMessage audioKey={message.content} />
                  ) : (
                    <p className="text-sm break-words">{message.content}</p>
                  )}

                  <p className="text-[10px] text-right mt-2 opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {messagesError && messages.length > 0 && (
        <p className="px-4 py-2 text-sm text-red-500">{messagesError}</p>
      )}

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-slate-200 flex items-center gap-3"
      >
        <input
          type="file"
          accept="audio/*"
          ref={audioInputRef}
          onChange={handleSendAudio}
          className="hidden"
        />

        <button
          type="button"
          disabled={sending}
          onClick={() => audioInputRef.current?.click()}
          className="p-3 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
          title="Send audio"
        >
          🎤
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default StudentChat;
