import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { axiosInstance } from "../../../app/api/axiosInstance";
import AudioMessage from "./AudioMessage";

function SessionChat() {
  const { sessionId, courseId } = useParams();
  const accessToken = useSelector((state) => state.auth.accessToken);

  const socketRef = useRef(null);
  const audioInputRef = useRef(null);

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [studentsError, setStudentsError] = useState("");
  const [messagesError, setMessagesError] = useState("");

  // Socket Connection
  useEffect(() => {
    if (!accessToken) return;

    const socket = io("https://aftab-backend.ethiodeploy.app", {
      extraHeaders: {
        authorization: accessToken,
      },
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken]);

  // Fetch Students
  useEffect(() => {
    (async () => {
      try {
        setStudentsLoading(true);
        setStudentsError("");

        const response = await axiosInstance.get(
          `/common/courseBy/${courseId}`,
        );

        setStudents(response?.data?.data || []);
      } catch (error) {
        setStudentsError(
          error?.response?.data?.msg || "Failed to load students",
        );
      } finally {
        setStudentsLoading(false);
      }
    })();
  }, [courseId]);

  // Fetch Messages
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setMessages([]);
    setMessagesError("");

    const socket = socketRef.current;

    if (!socket?.connected) {
      setMessagesError("Socket is not connected");
      return;
    }

    setMessagesLoading(true);

    socket.emit(
      "fetch_messages",
      JSON.stringify({
        sessionId,
        studentId: student._id,
      }),
      (response) => {
        if (response?.success) {
          setMessages(response.data || []);
        } else {
          setMessagesError(response?.message || "Failed to load messages");
        }

        setMessagesLoading(false);
      },
    );
  };

  // Receive Live Messages

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !selectedStudent) return;

    const studentId = String(selectedStudent._id);

    const handleReceiveMessage = (message) => {
      const messageSessionId = String(message.lectureSessionId);
      const senderId = String(message.senderId);
      const receiverId = message.receiverId ? String(message.receiverId) : null;

      const isCurrentSession = messageSessionId === String(sessionId);

      // Student ka message
      const isStudentMessage = senderId === studentId && receiverId === null;

      // Admin ka reply
      const isAdminReply =
        senderId === String(socket.userId) && receiverId === studentId;

      if (isCurrentSession && (isStudentMessage || isAdminReply)) {
        setMessages((prev) => {
          const alreadyExists = prev.some(
            (item) => String(item._id) === String(message._id),
          );

          if (alreadyExists) return prev;

          return [...prev, message];
        });
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [selectedStudent, sessionId]);

  // Send Text Message
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!text.trim() || !selectedStudent) return;

    const socket = socketRef.current;

    if (!socket?.connected) {
      setMessagesError("Socket is not connected");
      return;
    }

    setSending(true);
    setMessagesError("");

    console.log(selectedStudent)

    socket.emit(
      "reply_message",
      JSON.stringify({
        studentId: selectedStudent._id,
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

  const handleSendAudio = async (e) => {
    const file = e.target.files?.[0];

    if (!file || !selectedStudent) return;

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
        "reply_audio",
        {
          sessionId,
          studentId: selectedStudent._id,
          mimeType: file.type,
          audio,
        },
        (response) => {
            console.log(response)
          if (response?.success) {
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
    <div className="h-[calc(100vh-82px)] sm:h-[calc(100vh-100px)] bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col sm:flex-row">
      <div
        className={`w-full ${
          selectedStudent ? "hidden sm:flex" : "flex"
        } sm:w-80 border-b sm:border-b-0 sm:border-r border-slate-200 flex-col`}
      >
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Students</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Session: {sessionId}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {studentsLoading ? (
            <p className="p-5 text-center text-slate-500">Loading students...</p>
          ) : studentsError ? (
            <p className="p-5 text-center text-red-500">{studentsError}</p>
          ) : students.length === 0 ? (
            <p className="p-5 text-center text-slate-400">No students found</p>
          ) : (
            students.map((student) => (
              <button
                key={student._id}
                onClick={() => handleStudentClick(student)}
                className={`w-full flex items-center gap-3 p-3 sm:p-4 text-left border-b border-slate-100 hover:bg-slate-50 ${
                  selectedStudent?._id === student._id ? "bg-blue-50" : ""
                }`}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm sm:text-base">
                  {student.displayName?.charAt(0)?.toUpperCase() || "S"}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-800 text-sm sm:text-base">
                    {student.displayName}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                    {student.email}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat */}
      <div
        className={`${
          selectedStudent ? "flex" : "hidden"
        } sm:flex flex-1 flex-col min-w-0`}
      >
        {selectedStudent ? (
          <>
            {/* Chat Header */}
            <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="sm:hidden inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700"
                aria-label="Back to students"
              >
                ←
              </button>

              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm sm:text-base">
                {selectedStudent.displayName?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
                  {selectedStudent.displayName}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">Student</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-50">
              {messagesLoading ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm sm:text-base">
                  Loading messages...
                </div>
              ) : messagesError && messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-red-500 text-sm sm:text-base">
                  {messagesError}
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm sm:text-base">
                  No messages yet
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = Boolean(message.receiverId);

                  return (
                    <div
                      key={message._id}
                      className={`flex mb-4 ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm ${
                          isOwn
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-800 border border-slate-200"
                        }`}
                      >
                        <p className="text-[10px] sm:text-xs font-semibold mb-1 opacity-75">
                          {isOwn ? "You (Admin)" : selectedStudent.displayName}
                        </p>

                        {message.typeContent === "audio" ? (
                          <AudioMessage audioKey={message.content} />
                        ) : (
                          <p className="text-xs sm:text-sm break-words">
                            {message.content}
                          </p>
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
              className="p-3 sm:p-4 border-t border-slate-200 flex flex-col gap-2.5 sm:flex-row sm:items-center"
            >
              <input
                type="file"
                accept="audio/*"
                ref={audioInputRef}
                onChange={handleSendAudio}
                className="hidden"
              />

              <div className="flex items-center gap-2 sm:gap-3 w-full">
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => audioInputRef.current?.click()}
                  className="p-2.5 sm:p-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 shrink-0"
                  title="Send audio"
                >
                  <span className="text-lg">🎤</span>
                </button>

                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 outline-none focus:border-blue-500 text-sm sm:text-base"
                />

                <button
                  type="submit"
                  disabled={sending || !text.trim()}
                  className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shrink-0 text-sm sm:text-base"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center text-slate-400">
            Select a student to open conversation
          </div>
        )}
      </div>
    </div>
  );
}

export default SessionChat;
